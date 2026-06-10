export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;

    this.orderSummary = page.getByTestId("checkout-summary-container");
    this.cartList = page.getByTestId("cart-list");
    this.totalPrice = page.getByTestId("total-label");
    this.cancelButton = page.getByTestId("cancel");
    this.finishButton = page.getByTestId("finish");
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async getTotalPrice() {
    return this.totalPrice.textContent();
  }

  async getItemNames() {
    return this.cartList.getByTestId("inventory-item-name").allTextContents();
  }
}
