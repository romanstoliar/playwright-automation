import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class AeProductsPage extends BasePage {
  readonly allProductsHeading = this.page.getByRole('heading', { name: 'All Products' });
  readonly searchedHeading = this.page.getByRole('heading', { name: 'Searched Products' });
  readonly searchInput = this.page.locator('#search_product');
  readonly searchButton = this.page.locator('#submit_search');
  readonly productCards = this.page.locator('.features_items .product-image-wrapper');
  readonly addedMessage = this.page.getByText('Your product has been added to cart.');
  readonly viewCartLink = this.page.getByRole('link', { name: 'View Cart' });

  constructor(page: Page) {
    super(page);
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  card(name: string): Locator {
    return this.page.locator('.product-image-wrapper', { hasText: name }).first();
  }

  async addToCart(name: string): Promise<void> {
    await this.page.locator('.productinfo').filter({ hasText: name }).first().hover();
    await this.page.locator('.product-overlay').filter({ hasText: name }).first().locator('.add-to-cart').click();
  }

  async openCart(): Promise<void> {
    await this.viewCartLink.click();
  }
}
