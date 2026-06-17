// Импортируем 'test' и 'expect' из библиотеки Playwright
import { test, expect } from "@playwright/test";

// Создаем универсальную функцию для авторизации
async function login(page, username, password) {
  // 1. Переходим на страницу
  await page.goto("https://www.saucedemo.com/");
  // 2. Вводим логин
  await page.getByPlaceholder("Username").fill(username);
  // 3. Вводим пароль
  await page.getByPlaceholder("Password").fill(password);
  // 4. Нажимаем кнопку входа
  await page.getByTestId("login-button").click();
}

// Описываем наш набор тестов
// Используем getByTestId(), поскольку data-test настроен как testIdAttribute в playwright.config
test.describe("Авторизация на Sauce Demo @ui", () => {
  // Создаем тест-кейс
  test("Пользователь должен успешно войти в систему", async ({ page }) => {
    await login(page, "standard_user", "secret_sauce");

    // 5. Проверяем, что URL изменился и содержит нужную часть
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  // Создаем тест-кейс
  test("Заблокированный пользователь не должен успешно войти в систему", async ({
    page,
  }) => {
    await login(page, "locked_out_user", "secret_sauce");

    // 5. Проверяем, что на странице появилось сообщение об ошибке
    const error = page.getByTestId("error");

    await expect(error).toBeVisible();
    await expect(error).toHaveText(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  });
});
