import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage";
import { CheckoutDataFactory } from "../data/CheckoutDataFactory";

test("E2E сценарий. Покупка самого дорогого товара", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const checkoutCompletePage = new CheckoutCompletePage(page);

  // 1. Открываем страницу логина
  await loginPage.open();
  await expect(page).toHaveURL("https://www.saucedemo.com");
  // Сообщение об ошибке должно быть скрыто
  await expect(loginPage.errorContainer).toBeHidden();

  // 2. Логинимся, используя валидные данные
  await loginPage.login("standard_user", "secret_sauce");

  // 3. Проверяем, что открылась страница с товарами
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  expect(await inventoryPage.getPageTitle()).toBe("Products");
  // На странице должно быть доступно 6 товаров
  expect(await inventoryPage.getAvailableProductCount()).toBe(6);
  // Корзина должна быть пустой до начала покупки
  expect(await inventoryPage.getCartCount()).toBe(0);

  // 4. Сортируем по цене и добавляем в корзину самый дорогой товар на странице
  await inventoryPage.sortByPriceHighToLow();
  const expensiveItemName = await inventoryPage.getFirstItemName();
  await inventoryPage.addItemToCart(expensiveItemName);
  // После добавления товара счетчик корзины должен увеличиться до 1
  expect(await inventoryPage.getCartCount()).toBe(1);
  // Кнопка "Add to cart" добавленного товара должна измениться, на странице должно быть доступно 5 товаров
  expect(await inventoryPage.getAvailableProductCount()).toBe(5);

  // 5. Переходим в корзину
  await inventoryPage.openCart();
  // Кнопки должны быть видны
  await expect(cartPage.continueShoppingButton).toBeVisible();
  await expect(cartPage.checkoutButton).toBeVisible();

  // 6. Проверяем, что в корзине находится именно тот товар
  expect(await cartPage.getItemNames()).toContain(expensiveItemName);

  // 7. Начинаем оформление заказа
  await cartPage.goToCheckout();
  // Сообщение об ошибке должно быть скрыто
  await expect(checkoutStepOnePage.errorContainer).toBeHidden();

  // 8. Заполняем информацию о пользователе и продолжаем оформление заказа
  const customer = CheckoutDataFactory.createValidCustomer();
  await checkoutStepOnePage.fillUserInfo(
    customer.firstName,
    customer.lastName,
    customer.postalCode,
  );
  // В заказе должен находится именно тот товар
  expect(await checkoutStepTwoPage.getItemNames()).toContain(expensiveItemName);
  // Проверяем итоговую стоимость
  const total = await checkoutStepTwoPage.getTotalPrice();
  expect(total).toBe(53.99);

  // 9. Завершаем покупку
  await checkoutStepTwoPage.finishCheckout();

  // 10. Проверяем, что заказ успешно оформлен
  expect(await checkoutCompletePage.getCompletionMessage()).toBe(
    "Thank you for your order!",
  );

  // 11. Возвращаемся на главную страницу
  await expect(checkoutCompletePage.backHomeButton).toBeVisible();
  await checkoutCompletePage.backToHome();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});
