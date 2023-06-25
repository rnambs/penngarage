import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { JSON_SERVER_URL } from '../utils/utils';
import { fetchUserContact } from '../api/myprofile';

const mockAxios = new MockAdapter(axios);

describe('API mock testing', () => {
  const dummyUser = {
    email: "owin@gmail.com",
    phone: "123-345-5678",
    firstName: "Oprah",
    lastName: "Winfrey",
    status: 200,
    profilePicture: ''
  }

  mockAxios.onGet(`${JSON_SERVER_URL}/users/1`).reply(200, dummyUser);

  test('when API call is successful', async () => {
    const response = await fetchUserContact(1);
    expect(response).toStrictEqual(dummyUser);
  })
});

