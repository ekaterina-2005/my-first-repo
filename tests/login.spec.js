// Импортируем 'test' и 'expect' из библиотеки Playwright
const { test, expect } = require("@playwright/test");

// Описываем наш набор тестов
// Используем getByTestId(), поскольку data-test настроен как testIdAttribute в playwright.config
test.describe("Авторизация на Sauce Demo", () => {
  // Создаем тест-кейс
  test("Пользователь должен успешно войти в систему", async ({ page }) => {
    // 1. Переходим на страницу
    await page.goto("https://www.saucedemo.com/");

    // 2. Вводим логин
    // Используем локатор Playwright
    await page.getByPlaceholder("Username").fill("standard_user");

    // 3. Вводим пароль
    // Используем локатор Playwright
    await page.getByPlaceholder("Password").fill("secret_sauce");

    // 4. Нажимаем кнопку входа
    // Используем локатор Playwright
    await page.getByTestId("login-button").click();

    // 5. Проверяем, что URL изменился и содержит нужную часть
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  // Создаем тест-кейс
  test("Заблокированный пользователь не должен успешно войти в систему", async ({
    page,
  }) => {
    // 1. Переходим на страницу
    await page.goto("https://www.saucedemo.com/");

    // 2. Вводим логин
    // Используем локатор Playwright
    await page.getByPlaceholder("Username").fill("locked_out_user");

    // 3. Вводим пароль
    // Используем локатор Playwright
    await page.getByPlaceholder("Password").fill("secret_sauce");

    // 4. Нажимаем кнопку входа
    // Используем локатор Playwright
    await page.getByTestId("login-button").click();

    // 5. Проверяем, что на странице появилось сообщение об ошибке
    // Используем локатор Playwright
    await expect(page.getByTestId("error")).toHaveText(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  });
});
