import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class BrainSearchResultsPage extends BasePage {
  readonly resultsCount = this.page.locator('.search-products-count').first();

  constructor(page: Page) {
    super(page);
  }

  productLink(name: RegExp): Locator {
    return this.page.getByRole('link', { name }).first();
  }

  async openProduct(name: RegExp): Promise<void> {
    await this.productLink(name).click();
  }
}
