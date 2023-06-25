/**
 *  @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createNewMessage, getChatRecipients, getUserReceiverMessages } from '../api/messages';
import { JSON_SERVER_URL } from '../utils/utils';

const mockAxios = new MockAdapter(axios);

describe('api tests for createNewMessage', () => {
  mockAxios.onPost(`${JSON_SERVER_URL}/messages`, { userId: 12345, receiverId: 43210, userMessage: 'TestWorks' }).reply(201);
  mockAxios.onPost(`${JSON_SERVER_URL}/messages`, { userId: 1234567 }).reply(404); // no receiver or message

  const dummyChatLog = [
    {
      userId: 1,
      receiverId: 2,
      userMessage: "testing 123",
      id: 19
    },
    {
      userId: 2,
      receiverId: 1,
      userMessage: "testing again",
      id: 20
    },
  ];

  const dummyUser = {
    id: 2,
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
  }

  mockAxios.onGet(`${JSON_SERVER_URL}/messages?userId=1&receiverId=2&_sort=id&_order=asc`).reply(200, [dummyChatLog[0]])
  mockAxios.onGet(`${JSON_SERVER_URL}/messages?userId=2&receiverId=1&_sort=id&_order=asc`).reply(200, [dummyChatLog[1]])
  mockAxios.onGet(`${JSON_SERVER_URL}/messages?userId=1&_sort=id&_order=asc`).reply(200, [dummyChatLog[0]])
  mockAxios.onGet(`${JSON_SERVER_URL}/messages?receiverId=1&_sort=id&_order=asc`).reply(200, [dummyChatLog[1]])
  mockAxios.onGet(`${JSON_SERVER_URL}/users/2`).reply(200, dummyUser)

  test('response status code is correct for message created', async () => {
    const response = await createNewMessage(12345, 43210, 'TestWorks');
    expect(response.status).toBe(201);
  });

  test('response status code is correct for invalid message', async () => {
    const error = await createNewMessage(1234567);
    expect(error.response.status).toBe(404);
  });

  test('response status code is correct for getting user receiver messages', async () => {
    const response = await getUserReceiverMessages(1, 2);
    expect(response.status).toBe(200);
  });

  test('response data is correct for getting user receiver messages', async () => {
    const response = await getUserReceiverMessages(1, 2);
    expect(response.data).toStrictEqual(dummyChatLog);
  });

  test('response status code is correct for getting chat recipients', async () => {
    const response = await getChatRecipients(1);
    expect(response.status).toBe(200);
  });

  test('response data is correct for getting chat recipients', async () => {
    const response = await getChatRecipients(1);
    expect(response.data).toStrictEqual([dummyUser]);
  });
});
