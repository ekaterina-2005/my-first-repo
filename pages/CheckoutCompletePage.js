import { BasePage } from "./BasePage";

export class CheckoutCompletePage extends BasePage {
  constructor(page) {
    super(page);

    this.completionHeader = page.getByTestId("complete-header");
    this.backHomeButton = page.getByTestId("back-to-products");
  }

  async getCompletionMessage() {
    return this.completionHeader.textContent();
  }

  async backToHome() {
    await this.backHomeButton.click();
  }
}
