import { test, expect } from '@playwright/test';

// Лабораторна робота 7, завдання 1.
// Сценарій у стилі Playwright Codegen: інтернет-магазин комп'ютерної техніки Elmir.ua
// (brain.com.ua не підходить: Cloudflare блокує автоматизовані запуски перевіркою "Підтвердьте, що ви людина").
// 1.1 Відкрити сайт і перевірити URL.
// 1.2 Знайти товар і перевірити, що товар з потрібною назвою знайдено.
// 1.3 Відкрити сторінку товару, перевірити, що ціна відображається і товар є в наявності.
test('codegen: пошук товару на elmir.ua', async ({ page }) => {
  await page.goto('https://elmir.ua/ua/');
  await expect(page).toHaveURL(/elmir\.ua/);

  await page.locator('#q').fill('Vinga 24S110-11B');
  await page.locator('#q').press('Enter');
  await expect(page).toHaveURL(/q=Vinga/);
  await expect(page.getByRole('link', { name: 'Монітор 24" Vinga 24S110-11B' }).first()).toBeVisible();

  await page.getByRole('link', { name: 'Монітор 24" Vinga 24S110-11B' }).first().click();
  await expect(page).toHaveURL(/vinga-24s110-11b\.html/);
  await expect(page.locator('#page-title')).toContainText('Vinga 24S110-11B');
  await expect(page.locator('.pprice').first()).toContainText('грн');
  await expect(page.locator('.pstatus').first()).toContainText('в наявності');
});
