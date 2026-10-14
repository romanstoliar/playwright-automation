import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class ElmirSearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productLink(name: string): Locator {
    return this.page.getByRole('link', { name }).first();
  }

  async openProduct(name: string): Promise<void> {
    await this.productLink(name).click();
  }
}
