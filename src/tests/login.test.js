import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  verifyLogin,
  verifyId,
  registerUser,
  verifyForgot,
  resetPassword,
} from "../api/login";
import { JSON_SERVER_URL } from "../utils/utils";

const mockAxios = new MockAdapter(axios);

describe("api tests for verifyLogin", () => {
  mockAxios
    .onGet(`${JSON_SERVER_URL}/login?username=mary&password=hi`)
    .reply(200, {
      id: 0,
      username: "mary",
      firstName: "Soyoon",
      lastName: "Park",
      email: "soyoon@website.com",
      password: "hi",
      phone: "01012345678",
      question: "What is my favorite color?",
      answer: "purple",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    });
  mockAxios
    .onGet(`${JSON_SERVER_URL}/login?username=mary&password=ho`)
    .reply(404);
  mockAxios
    .onGet(`${JSON_SERVER_URL}/login?username=jason&password=hi`)
    .reply(404);

  test("response status code is correct for valid id & pw pair", async () => {
    const response = await verifyLogin("mary", "hi");
    expect(response.status).toBe(200);
  });

  test("response data is correct for valid id & pw pair", async () => {
    const response = await verifyLogin("mary", "hi");
    expect(response.data).toStrictEqual({
      id: 0,
      username: "mary",
      firstName: "Soyoon",
      lastName: "Park",
      email: "soyoon@website.com",
      password: "hi",
      phone: "01012345678",
      question: "What is my favorite color?",
      answer: "purple",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    });
  });

  test("throw error for invalid pw", async () => {
    const response = await verifyLogin("mary", "ho");
    expect(response.status).toBe(404);
  });

  test("throw error for invalid id", async () => {
    const response = await verifyLogin("jason", "hi");
    expect(response.status).toBe(404);
  });
});

describe("api tests for verifyId", () => {
  mockAxios
    .onGet(`${JSON_SERVER_URL}/login/new-user?username=mary`)
    .reply(200, {
      id: 0,
      username: "mary",
      firstName: "Soyoon",
      lastName: "Park",
      email: "soyoon@website.com",
      password: "hi",
      phone: "01012345678",
      question: "What is my favorite color?",
      answer: "purple",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    });
  mockAxios
    .onGet(`${JSON_SERVER_URL}/login/new-user?username=jason`)
    .reply(404);

  test("response status code is correct for existing username", async () => {
    const response = await verifyId("mary");
    expect(response.status).toBe(200);
  });

  test("response data is correct for existing username", async () => {
    const response = await verifyId("mary");
    expect(response.data).toStrictEqual({
      id: 0,
      username: "mary",
      firstName: "Soyoon",
      lastName: "Park",
      email: "soyoon@website.com",
      password: "hi",
      phone: "01012345678",
      question: "What is my favorite color?",
      answer: "purple",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    });
  });

  test("throw error for nonexsisting username", async () => {
    const response = await verifyId("jason");
    expect(response.status).toBe(404);
  });
});

describe("api tests for registerUser", () => {
  mockAxios
    .onPost(`${JSON_SERVER_URL}/login/new-user`, {
      username: "wow",
      password: "wow",
      firstName: "wow",
      lastName: "wow",
      email: "wow",
      question: "wow",
      answer: "wow",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    })
    .reply(201);

  test("response status code is correct for successful registration", async () => {
    const response = await registerUser(
      "wow",
      "wow",
      "wow",
      "wow",
      "wow",
      "wow",
      "wow"
    );
    expect(response.status).toBe(201);
  });
});

describe("api tests for verifyForgot", () => {
  mockAxios
    .onGet(
      `${JSON_SERVER_URL}/login/forgot?firstName=Soyoon&lastName=Park&email=soyoon@website.com`
    )
    .reply(200, {
      id: 0,
      username: "mary",
      firstName: "Soyoon",
      lastName: "Park",
      email: "soyoon@website.com",
      password: "hi",
      phone: "01012345678",
      question: "What is my favorite color?",
      answer: "purple",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    });
  mockAxios
    .onGet(
      `${JSON_SERVER_URL}/login/forgot?firstName=wee&lastName=wee&email=wee`
    )
    .reply(404);

  test("response status code is correct for valid user info", async () => {
    const response = await verifyForgot("Soyoon", "Park", "soyoon@website.com");
    expect(response.status).toBe(200);
  });

  test("response data is correct for valid user info", async () => {
    const response = await verifyForgot("Soyoon", "Park", "soyoon@website.com");
    expect(response.data).toStrictEqual({
      id: 0,
      username: "mary",
      firstName: "Soyoon",
      lastName: "Park",
      email: "soyoon@website.com",
      password: "hi",
      phone: "01012345678",
      question: "What is my favorite color?",
      answer: "purple",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    });
  });

  test("throw error for invalid user info", async () => {
    const response = await verifyForgot("wee", "wee", "wee");
    expect(response.status).toBe(404);
  });
});

describe("api tests for resetPassword", () => {
  mockAxios
    .onPut(`${JSON_SERVER_URL}/login/forgot/0`, {
      username: "mary",
      firstName: "Soyoon",
      lastName: "Park",
      email: "soyoon@website.com",
      password: "hey",
      phone: "01012345678",
      question: "What is my favorite color?",
      answer: "purple",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    })
    .reply(200);

  test("response status code is correct for successful reset password", async () => {
    const response = await resetPassword("hey", {
      id: 0,
      username: "mary",
      firstName: "Soyoon",
      lastName: "Park",
      email: "soyoon@website.com",
      password: "hi",
      phone: "01012345678",
      question: "What is my favorite color?",
      answer: "purple",
      header: {
        garagePhotoURL: "",
        garageDesc: "",
        moveoutDate: "",
        pickupLoc: "",
        avgRating: 0
      }
    });
    expect(response.status).toBe(200);
  });
});
