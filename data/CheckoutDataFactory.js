import { faker } from "@faker-js/faker";

export class CheckoutDataFactory {
  static createValidCustomer() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode(),
    };
  }

  static createEmptyCustomer() {
    return {
      firstName: "",
      lastName: "",
      postalCode: "",
    };
  }
}
