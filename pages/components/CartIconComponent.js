export class CartIconComponent {
  constructor(page) {
    this.cartIcon = page.getByTestId("shopping-cart-link");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
  }

  async open() {
    await this.cartIcon.click();
  }

  async getItemCount() {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) {
      return 0;
    } else {
      return Number.parseInt(await this.cartBadge.textContent(), 10);
    }
  }
}
