import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class ElmirProductPage extends BasePage {
  readonly title = this.page.locator('#page-title');
  readonly price = this.page.locator('.pprice').first();
  readonly status = this.page.locator('.pstatus').first();

  constructor(page: Page) {
    super(page);
  }

  async open(productUrl: string): Promise<void> {
    await this.navigate(productUrl);
  }

  async getProductPrice(): Promise<string | null> {
    return await this.price.textContent();
  }

  async getProductName(): Promise<string | null> {
    return await this.title.textContent();
  }
}
