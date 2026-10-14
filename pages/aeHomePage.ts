import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class AeHomePage extends BasePage {
  readonly productsLink = this.page.locator('a[href="/products"]').first();
  readonly cartLink = this.page.locator('a[href="/view_cart"]').first();

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.dismissAdsAndConsent();
    await this.navigate('https://www.automationexercise.com/');
  }

  async openProducts(): Promise<void> {
    await this.productsLink.click();
  }
}
