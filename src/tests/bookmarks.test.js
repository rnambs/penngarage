/**
 *  @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import createNewBookmark from '../api/bookmarks';
import { JSON_SERVER_URL } from '../utils/utils';

const mockAxios = new MockAdapter(axios);

describe('api tests for createNewBookmark', () => {
  mockAxios.onPost(`${JSON_SERVER_URL}/users/1/bookmarks`, { userId: 1, postId: 1 }).reply(201);
  mockAxios.onPost(`${JSON_SERVER_URL}/users/2/bookmarks`, { userId: 2 }).reply(400);
  mockAxios.onPost(`${JSON_SERVER_URL}/users/3/bookmarks`, { userId: 3, postId: 1 }).reply(409);

  test('response status code is correct for bookmark created', async () => {
    const response = await createNewBookmark(1, 1);
    expect(response.status).toBe(201);
  });

  test('throw error for invalid request', async () => {
    const response = await createNewBookmark(2);
    expect(response.status).toBe(400);
  });

  test('throw error for bookmark already exists', async () => {
    const response = await createNewBookmark(3, 1);
    expect(response.status).toBe(409);
  });
});
