import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class BrainProductPage extends BasePage {
  readonly title = this.page.locator('h1.main-title');
  readonly price = this.page.locator('.br-pr-price.main-price-block').first();
  readonly availability = this.page.getByText('Є в наявності').first();

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
