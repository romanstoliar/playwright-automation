import { test, expect } from '@playwright/test';

/*
 * Лабораторна робота 7, завдання 2. Тест-дизайн.
 * Вебдодаток: https://www.automationexercise.com/ (замість недоступного Magento).
 * Сценарій: пошук товару і робота з кошиком.
 *
 * Крок 1. Відкрити головну сторінку.
 *   Очікується: заголовок вкладки містить «Automation Exercise»; логотип/меню видно;
 *   у меню є пункти Products і Cart.
 * Крок 2. Натиснути «Products» у меню.
 *   Очікується: URL містить /products; видно заголовок «All Products»; відображається список товарів.
 * Крок 3. Ввести «Blue Top» у пошук і натиснути кнопку пошуку.
 *   Очікується: видно заголовок «Searched Products»; у результатах є товар «Blue Top»;
 *   ціна товару «Rs. 500».
 * Крок 4. Натиснути «Add to cart» для товару «Blue Top».
 *   Очікується: з'являється вікно «Added!» з текстом «Your product has been added to cart.».
 * Крок 5. Натиснути «View Cart».
 *   Очікується: URL містить /view_cart; у таблиці кошика є «Blue Top», кількість 1, сума «Rs. 500».
 * Крок 6. Видалити товар із кошика (хрестик).
 *   Очікується: з'являється повідомлення «Cart is empty!», рядок товару зник.
 */
const BLOCKED = /googlesyndication|doubleclick|googleadservices|adservice\.google|pagead|adsbygoogle|fundingchoices|googletagmanager/;

test('кошик: пошук Blue Top, додавання та видалення', async ({ page }) => {
  await page.route(BLOCKED, (route) => route.abort());
  await page.addLocatorHandler(page.locator('.fc-consent-root'), async () => {
    await page.locator('.fc-cta-do-not-consent').click();
  });

  await test.step('1. Відкрити головну сторінку', async () => {
    await page.goto('https://www.automationexercise.com/');
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('a[href="/products"]').first()).toBeVisible();
    await expect(page.locator('a[href="/view_cart"]').first()).toBeVisible();
  });

  await test.step('2. Перейти до каталогу Products', async () => {
    await page.locator('a[href="/products"]').first().click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await expect(page.locator('.features_items .product-image-wrapper').first()).toBeVisible();
  });

  await test.step('3. Знайти товар Blue Top', async () => {
    await page.locator('#search_product').fill('Blue Top');
    await page.locator('#submit_search').click();
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
    const card = page.locator('.product-image-wrapper', { hasText: 'Blue Top' }).first();
    await expect(card).toBeVisible();
    await expect(card.locator('.productinfo h2')).toHaveText('Rs. 500');
  });

  await test.step('4. Додати товар у кошик', async () => {
    await page.locator('.productinfo').filter({ hasText: 'Blue Top' }).first().hover();
    await page.locator('.product-overlay').filter({ hasText: 'Blue Top' }).first().locator('.add-to-cart').click();
    await expect(page.getByText('Your product has been added to cart.')).toBeVisible();
  });

  await test.step('5. Відкрити кошик', async () => {
    await page.getByRole('link', { name: 'View Cart' }).click();
    await expect(page).toHaveURL(/\/view_cart/);
    const row = page.locator('#cart_info_table tbody tr').first();
    await expect(row.locator('.cart_description')).toContainText('Blue Top');
    await expect(row.locator('.cart_quantity')).toHaveText('1');
    await expect(row.locator('.cart_total')).toContainText('Rs. 500');
  });

  await test.step('6. Видалити товар із кошика', async () => {
    await page.locator('.cart_quantity_delete').first().click();
    await expect(page.getByText('Cart is empty!')).toBeVisible();
    await expect(page.locator('#cart_info_table tbody tr')).toHaveCount(0);
  });
});
