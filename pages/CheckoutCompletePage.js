export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;

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
