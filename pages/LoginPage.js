export class LoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = page.getByTestId("username");
    this.passwordInput = page.getByTestId("password");
    this.loginButton = page.getByTestId("login-button");
    this.errorContainer = page.getByTestId("error");
  }

  async open() {
    await this.page.goto("https://www.saucedemo.com");
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
