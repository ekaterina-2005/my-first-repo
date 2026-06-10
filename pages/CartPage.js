export class CartPage {
  constructor(page) {
    this.page = page;

    this.cartList = page.getByTestId("cart-list");
    this.checkoutButton = page.getByTestId("checkout");
    this.continueShoppingButton = page.getByTestId("continue-shopping");
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getItemNames() {
    return this.cartList.getByTestId("inventory-item-name").allTextContents();
  }
}
