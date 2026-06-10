import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {
  constructor(page) {
    super(page);

    this.pageTitle = page.getByTestId("title");
    this.cartIcon = page.getByTestId("shopping-cart-link");
    this.productList = page.getByTestId("inventory-list");
    this.addToCartButtons = page.locator('[data-test^="add-to-cart-"]');
  }

  async addItemToCart(itemName) {
    // await this.page.getByTestId(`add-to-cart-${itemName}`).click();

    await this.page
      .locator(
        `//div[@data-test="inventory-item-name" and text()="${itemName}"]/ancestor::div[@data-test="inventory-item"]//button[text()="Add to cart"]`,
      )
      .click();
  }

  async getAvailableProductCount() {
    return this.addToCartButtons.count();
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async getPageTitle() {
    return this.pageTitle.textContent();
  }
}
