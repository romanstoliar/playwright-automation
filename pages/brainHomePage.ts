import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class BrainHomePage extends BasePage {
  readonly searchInput = this.page.locator('input.quick-search-input:visible').first();

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate('https://brain.com.ua/ukr/');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }
}
