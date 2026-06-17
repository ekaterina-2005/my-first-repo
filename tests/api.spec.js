import { test, expect } from "@playwright/test";

test.describe("API-тесты для Restful-booker @api", () => {
  // Настраиваем последовательное выполнение (beforeAll выполняется 1 раз; тесты не параллельны)
  test.describe.configure({ mode: "serial" });

  const baseURL = "https://restful-booker.herokuapp.com";

  // Валидные данные
  const createData = {
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: "2018-01-01",
      checkout: "2019-01-01",
    },
    additionalneeds: "Breakfast",
  };

  let createResponse;
  let createResponseBody;
  let bookingId;
  let authToken;

  // Получаем общие данные для тестов
  test.beforeAll(async ({ request }) => {
    // Ping - HealthCheck
    const serverResponse = await request.get(`${baseURL}/ping`);

    // Проверка: Статус-код ответа равен 201 Created
    console.log(`Статус-код HealthCheck: ${serverResponse.status()}`);
    expect(serverResponse.status()).toBe(201);
    console.log("Restful-booker API is up and running!");

    // Отправляем POST-запрос с валидными данными
    createResponse = await request.post(`${baseURL}/booking`, {
      data: createData,
    });

    // Проверка: Статус-код ответа равен 200 OK
    console.log(`Статус-код CreateBooking: ${createResponse.status()}`);
    expect(createResponse.status()).toBe(200);

    // Парсим ответ
    createResponseBody = await createResponse.json();
    bookingId = createResponseBody.bookingid;

    // Отправляем POST-запрос для получения токена авторизации
    const authResponse = await request.post(`${baseURL}/auth`, {
      data: {
        username: "admin",
        password: "password123",
      },
    });

    // Проверка: Статус-код ответа равен 200 OK
    console.log(`Статус-код Auth: ${authResponse.status()}`);
    expect(authResponse.status()).toBe(200);

    // Парсим ответ
    const authResponseBody = await authResponse.json();
    authToken = authResponseBody.token;

    // Проверка: Общие данные успешно получены
    expect(bookingId).toBeDefined();
    expect(authToken).toBeDefined();
    console.log(`ID созданного бронирования = ${bookingId}`);
  });

  // Booking - GetBookingIds
  test("Получение списка ID бронирований", async ({ request }) => {
    // Отправляем GET-запрос
    const response = await request.get(`${baseURL}/booking`);

    // Проверка 1: Статус-код ответа равен 200 OK
    console.log(`Статус-код GetBookingIds: ${response.status()}`);
    expect(response.status()).toBe(200);

    // Парсим ответ
    const responseBody = await response.json();
    console.log("Тело ответа GetBookingIds:", responseBody);

    // Проверка 2: Тело ответа не пустое
    expect(responseBody.length).toBeGreaterThan(0);

    // Проверка 3: В ответе есть объекты с ключом bookingid
    expect(responseBody[0]).toHaveProperty("bookingid");
  });

  // Booking - CreateBooking
  test("Создание бронирования", async () => {
    console.log("Тело ответа CreateBooking:", createResponseBody);

    // Проверка 1: Тело ответа содержит ключ bookingid
    expect(createResponseBody).toHaveProperty("bookingid");

    // Проверка 2: Тело ответа содержит отправленные данные
    expect(createResponseBody.booking).toMatchObject(createData);
  });

  // Booking - GetBooking
  test("Получение информации о бронировании", async ({ request }) => {
    // Отправляем GET-запрос
    const response = await request.get(`${baseURL}/booking/${bookingId}`);

    // Проверка 1: Статус-код ответа равен 200 OK
    console.log(`Статус-код GetBooking: ${response.status()}`);
    expect(response.status()).toBe(200);

    // Парсим ответ
    const responseBody = await response.json();
    console.log("Тело ответа GetBooking:", responseBody);

    // Проверка 2: Тело ответа содержит отправленные данные
    expect(responseBody).toMatchObject(createData);
  });

  // Booking - UpdateBooking
  test("Обновление бронирования", async ({ request }) => {
    const newData = {
      firstname: "Jim",
      lastname: "Grey",
      totalprice: 222,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Dinner",
    };

    // Отправляем PUT-запрос
    const response = await request.put(`${baseURL}/booking/${bookingId}`, {
      headers: { Cookie: `token=${authToken}` },
      data: newData,
    });

    // Проверка 1: Статус-код ответа равен 200 OK
    console.log(`Статус-код UpdateBooking: ${response.status()}`);
    expect(response.status()).toBe(200);

    // Парсим ответ
    const responseBody = await response.json();
    console.log("Тело ответа UpdateBooking:", responseBody);

    // Проверка 2: Тело ответа содержит отправленные данные
    expect(responseBody).toMatchObject(newData);
  });

  // Booking - PartialUpdateBooking
  test("Частичное обновление бронирования", async ({ request }) => {
    const newPartialData = {
      firstname: "Frank",
      depositpaid: false,
    };

    // Отправляем PATCH-запрос
    const response = await request.patch(`${baseURL}/booking/${bookingId}`, {
      headers: { Cookie: `token=${authToken}` },
      data: newPartialData,
    });

    // Проверка 1: Статус-код ответа равен 200 OK
    console.log(`Статус-код PartialUpdateBooking: ${response.status()}`);
    expect(response.status()).toBe(200);

    // Парсим ответ
    const responseBody = await response.json();
    console.log("Тело ответа PartialUpdateBooking:", responseBody);

    // Проверка 2: Тело ответа содержит отправленные данные
    expect(responseBody).toMatchObject(newPartialData);

    // Проверка 3: Обновленные ранее поля не изменились
    expect(responseBody.lastname).toBe("Grey");
    expect(responseBody.totalprice).toBe(222);
    expect(responseBody.additionalneeds).toBe("Dinner");
  });

  // Booking - DeleteBooking
  test("Удаление бронирования", async ({ request }) => {
    // Отправляем DELETE-запрос
    const response = await request.delete(`${baseURL}/booking/${bookingId}`, {
      headers: { Cookie: `token=${authToken}` },
    });

    // Проверка 1: Статус-код ответа равен 201 Created
    console.log(`Статус-код DeleteBooking: ${response.status()}`);
    expect(response.status()).toBe(201);

    // Отправляем GET-запрос на тот же id
    const badResponse = await request.get(`${baseURL}/booking/${bookingId}`);

    // Проверка 2: После удаления статус-код ответа равен 404 Not Found
    console.log(
      `Статус-код GetBooking после DeleteBooking: ${badResponse.status()}`,
    );
    expect(badResponse.status()).toBe(404);
  });
});
