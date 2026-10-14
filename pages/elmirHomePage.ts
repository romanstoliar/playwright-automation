import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class ElmirHomePage extends BasePage {
  readonly searchInput = this.page.locator('#q');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate('https://elmir.ua/ua/');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }
}
