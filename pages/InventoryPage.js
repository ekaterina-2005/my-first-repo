import { BasePage } from "./BasePage";
import { CartIconComponent } from "./components/CartIconComponent";

export class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartIcon = new CartIconComponent(page);

    this.pageTitle = page.getByTestId("title");
    this.productList = page.getByTestId("inventory-list");
    this.addToCartButtons = page.locator('[data-test^="add-to-cart-"]');
  }

  async addItemToCart(itemName) {
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
    await this.cartIcon.open();
  }

  async getCartCount() {
    return this.cartIcon.getItemCount();
  }

  async getPageTitle() {
    return this.pageTitle.textContent();
  }

  async sortByNameAtoZ() {
    await this.page.getByTestId("product-sort-container").selectOption("az");
  }

  async sortByNameZtoA() {
    await this.page.getByTestId("product-sort-container").selectOption("za");
  }

  async sortByPriceLowToHigh() {
    await this.page.getByTestId("product-sort-container").selectOption("lohi");
  }

  async sortByPriceHighToLow() {
    await this.page.getByTestId("product-sort-container").selectOption("hilo");
  }

  async getFirstItemName() {
    return this.page.getByTestId("inventory-item-name").first().textContent();
  }
}
