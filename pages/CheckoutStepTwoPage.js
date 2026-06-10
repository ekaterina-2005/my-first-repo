import { BasePage } from "./BasePage";

export class CheckoutStepTwoPage extends BasePage {
  constructor(page) {
    super(page);

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
    const totelPriceInfo = await this.totalPrice.textContent();
    return Number.parseFloat(totelPriceInfo.replace("Total: $", ""));
  }

  async getItemNames() {
    return this.cartList.getByTestId("inventory-item-name").allTextContents();
  }
}
