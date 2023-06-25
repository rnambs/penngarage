/**
 *  @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import searchItem from '../api/search';
import { JSON_SERVER_URL, SEARCH_PAGE_ITEMS_PER_PAGE } from '../utils/utils';

const mockAxios = new MockAdapter(axios);

describe('api tests for searchItem', () => {
  const dummyItemPosting = {
    id: 9,
    sellerId: 6,
    seller: "Lil Baby",
    title: "Green Couch",
    description: "Green like the dough I row in.",
    image: "https://cdn.apartmenttherapy.info/image/upload/v1631549881/gen-workflow/product-database/forest-green-three-seater-pebble-sofa-castlery.jpg",
    priceType: "fixed",
    price: 888,
    postedOn: "2021-03-01",
    availableUntil: "2025-04-01",
    category: "other"
  }

  mockAxios.onGet(`${JSON_SERVER_URL}/posts/search?searchQuery=couch&page=1&limit=${SEARCH_PAGE_ITEMS_PER_PAGE}&sortBy=urgent&priceRangeLow=0&priceRangeHigh=99999&category=.*`)
    .reply(200, [dummyItemPosting]);
  mockAxios.onGet(`${JSON_SERVER_URL}/posts/search?searchQuery=couch&page=1&limit=${SEARCH_PAGE_ITEMS_PER_PAGE}&sortBy=coolest&priceRangeLow=0&priceRangeHigh=99999&category=.*`)
    .reply(400);
  mockAxios.onGet(`${JSON_SERVER_URL}/posts/search?searchQuery=&page=1&limit=${SEARCH_PAGE_ITEMS_PER_PAGE}&sortBy=urgent&priceRangeLow=0&priceRangeHigh=99999&category=.*`)
    .reply(400);
  mockAxios.onGet(`${JSON_SERVER_URL}/posts/search?searchQuery=cool couch&page=1&limit=${SEARCH_PAGE_ITEMS_PER_PAGE}&sortBy=urgent&priceRangeLow=0&priceRangeHigh=99999&category=.*`)
    .reply(404);

  test('response status code is correct for posts successfully retrieved', async () => {
    const response = await searchItem("couch", 1, SEARCH_PAGE_ITEMS_PER_PAGE);
    expect(response.status).toBe(200);
  })

  test('response data is correct for posts successfully retrieved', async () => {
    const response = await searchItem("couch", 1, SEARCH_PAGE_ITEMS_PER_PAGE);
    expect(response.data[0]).toStrictEqual(dummyItemPosting);
  });

  test('response status code is correct for posts successfully retrieved even without page or limit', async () => {
    const response = await searchItem('couch');
    expect(response.status).toBe(200);
  });

  test('throw error for invalid search parameters', async () => {
    const response = await searchItem('couch', 1, SEARCH_PAGE_ITEMS_PER_PAGE, 'coolest');
    expect(response.status).toBe(400);
  });

  test('throw error for no search query', async () => {
    const response = await searchItem();
    expect(response.status).toBe(400);
  });

  test('throw error for no posts matching search query', async () => {
    const response = await searchItem('cool couch', 1, SEARCH_PAGE_ITEMS_PER_PAGE);
    expect(response.status).toBe(404);
  });

});
