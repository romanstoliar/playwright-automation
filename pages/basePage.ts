import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // Спільна взаємодія: блокування реклами та автоматична відмова від cookie-банера (automationexercise.com)
  async dismissAdsAndConsent(): Promise<void> {
    await this.page.route(
      /googlesyndication|doubleclick|googleadservices|adservice\.google|pagead|adsbygoogle|fundingchoices|googletagmanager/,
      (route) => route.abort(),
    );
    await this.page.addLocatorHandler(this.page.locator('.fc-consent-root'), async () => {
      await this.page.locator('.fc-cta-do-not-consent').click();
    });
  }
}
