import { test, expect } from '@playwright/test';
import { ElmirHomePage } from '../../pages/elmirHomePage';
import { ElmirSearchResultsPage } from '../../pages/elmirSearchResultsPage';
import { ElmirProductPage } from '../../pages/elmirProductPage';

const PRODUCT = 'Монітор 24" Vinga 24S110-11B';

test.describe('Elmir.ua: тести з використанням POM', () => {
  let homePage: ElmirHomePage;
  let resultsPage: ElmirSearchResultsPage;
  let productPage: ElmirProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new ElmirHomePage(page);
    resultsPage = new ElmirSearchResultsPage(page);
    productPage = new ElmirProductPage(page);
  });

  test('пошук товару та перевірка картки (рефакторинг codegen-тесту)', async ({ page }) => {
    await homePage.open();
    await expect(page).toHaveURL(/elmir\.ua/);

    await homePage.search('Vinga 24S110-11B');
    await expect(page).toHaveURL(/q=Vinga/);
    await expect(resultsPage.productLink(PRODUCT)).toBeVisible();

    await resultsPage.openProduct(PRODUCT);
    await expect(page).toHaveURL(/vinga-24s110-11b\.html/);
    await expect(productPage.title).toContainText('Vinga 24S110-11B');
    await expect(productPage.price).toContainText('грн');
    await expect(productPage.status).toContainText('в наявності');
  });

  test('пряме відкриття сторінки товару: назва, ціна — число', async () => {
    await productPage.open('https://elmir.ua/ua/monitors/monitor-24-vinga-24s110-11b.html');
    expect(await productPage.getProductName()).toContain('Vinga 24S110-11B');
    const price = (await productPage.getProductPrice()) ?? '';
    expect(Number(price.replace(/\D/g, ''))).toBeGreaterThan(0);
    expect(await productPage.getPageTitle()).toContain('Vinga 24S110-11B');
  });
});
