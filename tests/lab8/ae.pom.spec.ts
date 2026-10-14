import { test, expect } from '@playwright/test';
import { AeHomePage } from '../../pages/aeHomePage';
import { AeProductsPage } from '../../pages/aeProductsPage';
import { AeCartPage } from '../../pages/aeCartPage';

test.describe('Automation Exercise: тести кошика з використанням POM', () => {
  let homePage: AeHomePage;
  let productsPage: AeProductsPage;
  let cartPage: AeCartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new AeHomePage(page);
    productsPage = new AeProductsPage(page);
    cartPage = new AeCartPage(page);
  });

  test('кошик: пошук Blue Top, додавання та видалення (рефакторинг lz7)', async ({ page }) => {
    await homePage.open();
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(homePage.productsLink).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();

    await homePage.openProducts();
    await expect(page).toHaveURL(/\/products/);
    await expect(productsPage.allProductsHeading).toBeVisible();
    await expect(productsPage.productCards.first()).toBeVisible();

    await productsPage.search('Blue Top');
    await expect(productsPage.searchedHeading).toBeVisible();
    await expect(productsPage.card('Blue Top')).toBeVisible();
    await expect(productsPage.card('Blue Top').locator('.productinfo h2')).toHaveText('Rs. 500');

    await productsPage.addToCart('Blue Top');
    await expect(productsPage.addedMessage).toBeVisible();

    await productsPage.openCart();
    await expect(page).toHaveURL(/\/view_cart/);
    await expect(cartPage.firstRow.locator('.cart_description')).toContainText('Blue Top');
    await expect(cartPage.firstRow.locator('.cart_quantity')).toHaveText('1');
    await expect(cartPage.firstRow.locator('.cart_total')).toContainText('Rs. 500');

    await cartPage.removeFirstItem();
    await expect(cartPage.emptyMessage).toBeVisible();
    await expect(cartPage.rows).toHaveCount(0);
  });

  test('розширення: пошук за словом Dress повертає кілька товарів', async () => {
    await homePage.open();
    await homePage.openProducts();
    await productsPage.search('Dress');
    await expect(productsPage.searchedHeading).toBeVisible();
    expect(await productsPage.productCards.count()).toBeGreaterThan(1);
  });
});
