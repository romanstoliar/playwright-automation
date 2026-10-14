import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class AeCartPage extends BasePage {
  readonly firstRow = this.page.locator('#cart_info_table tbody tr').first();
  readonly rows = this.page.locator('#cart_info_table tbody tr');
  readonly emptyMessage = this.page.getByText('Cart is empty!');

  constructor(page: Page) {
    super(page);
  }

  async removeFirstItem(): Promise<void> {
    await this.page.locator('.cart_quantity_delete').first().click();
  }
}
