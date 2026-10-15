import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Cookie після ручного проходження перевірки Cloudflare (скрипт brain-auth.js), файл поза git-репозиторієм.
const STATE = path.join(__dirname, '..', '..', '..', 'brain-state.json');
test.use({ storageState: fs.existsSync(STATE) ? STATE : undefined });

// Лабораторна робота 7, завдання 1.
// Сценарій у стилі Playwright Codegen: інтернет-магазин комп'ютерної техніки Brain (brain.com.ua).
// 1.1 Відкрити сайт і перевірити URL.
// 1.2 Знайти товар і перевірити, що товар з потрібною назвою знайдено.
// 1.3 Відкрити сторінку товару, перевірити, що ціна відображається і товар є в наявності.
// На сайті діє захист Cloudflare, який з GitHub-серверів може показувати перевірку "Ви людина?",
// тому в CI цей тест пропускається (локально виконується в Google Chrome).
// Тести для brain.com.ua запускаються лише за змінної BRAIN=1: Cloudflare показує автоматизованому
// браузеру перевірку "Ви людина?" (див. звіт), тому за замовчуванням вони пропускаються.
test.skip(!process.env.BRAIN, 'brain.com.ua: перевірка Cloudflare, запуск лише з BRAIN=1');

test('codegen: пошук товару на brain.com.ua', async ({ page }) => {
  await page.goto('https://brain.com.ua/ukr/');
  await expect(page).toHaveURL(/brain\.com\.ua/);

  await page.locator('input.quick-search-input:visible').first().fill('монітор Lenovo LOQ 24-10');
  await page.locator('input.quick-search-input:visible').first().press('Enter');
  await expect(page).toHaveURL(/Search=/);
  await expect(page.getByRole('link', { name: /Монітор Lenovo LOQ 24-10/ }).first()).toBeVisible();

  await page.getByRole('link', { name: /Монітор Lenovo LOQ 24-10/ }).first().click();
  await expect(page).toHaveURL(/Monitor_Lenovo_LOQ_24-10/);
  await expect(page.locator('h1.main-title')).toContainText('Lenovo LOQ 24-10');
  await expect(page.locator('.br-pr-price.main-price-block').first()).toContainText('₴');
  await expect(page.getByText('Є в наявності').first()).toBeVisible();
});
