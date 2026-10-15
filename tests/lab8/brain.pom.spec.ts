import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Cookie після ручного проходження перевірки Cloudflare (скрипт brain-auth.js), файл поза git-репозиторієм.
const STATE = path.join(__dirname, '..', '..', '..', 'brain-state.json');
test.use({ storageState: fs.existsSync(STATE) ? STATE : undefined });
import { BrainHomePage } from '../../pages/brainHomePage';
import { BrainSearchResultsPage } from '../../pages/brainSearchResultsPage';
import { BrainProductPage } from '../../pages/brainProductPage';

// brain.com.ua захищений Cloudflare: у CI ці тести пропускаються.
// Тести для brain.com.ua запускаються лише за змінної BRAIN=1: Cloudflare показує автоматизованому
// браузеру перевірку "Ви людина?" (див. звіт), тому за замовчуванням вони пропускаються.
test.skip(!process.env.BRAIN, 'brain.com.ua: перевірка Cloudflare, запуск лише з BRAIN=1');

const PRODUCT = /Монітор Lenovo LOQ 24-10/;

test.describe('Brain.com.ua: тести з використанням POM', () => {
  let homePage: BrainHomePage;
  let resultsPage: BrainSearchResultsPage;
  let productPage: BrainProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new BrainHomePage(page);
    resultsPage = new BrainSearchResultsPage(page);
    productPage = new BrainProductPage(page);
  });

  test('пошук товару та перевірка картки (рефакторинг codegen-тесту)', async ({ page }) => {
    await homePage.open();
    await expect(page).toHaveURL(/brain\.com\.ua/);

    await homePage.search('монітор Lenovo LOQ 24-10');
    await expect(page).toHaveURL(/Search=/);
    await expect(resultsPage.productLink(PRODUCT)).toBeVisible();

    await resultsPage.openProduct(PRODUCT);
    await expect(page).toHaveURL(/Monitor_Lenovo_LOQ_24-10/);
    await expect(productPage.title).toContainText('Lenovo LOQ 24-10');
    await expect(productPage.price).toContainText('₴');
    await expect(productPage.availability).toBeVisible();
  });

  test('пряме відкриття сторінки товару: назва, ціна — число', async () => {
    await productPage.open('https://brain.com.ua/ukr/Monitor_Lenovo_LOQ_24-10_68F1GACBUA-p1346238.html');
    expect(await productPage.getProductName()).toContain('Lenovo LOQ 24-10');
    const price = (await productPage.getProductPrice()) ?? '';
    expect(Number(price.replace(/\D/g, ''))).toBeGreaterThan(0);
    expect(await productPage.getPageTitle()).toContain('Lenovo LOQ 24-10');
  });
});
