/**
 *  @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createNewPost, fetchAllUsersPosts, updateBid, editPost, deletePost } from '../api/posts';
import { JSON_SERVER_URL } from '../utils/utils';

const mockAxios = new MockAdapter(axios);

describe('api tests for createNewPost', () => {
    const dummyPost = {
        sellerId: 12,
        seller: "David Hong",
        title: "Red Couch",
        description: "This is the first couch!",
        image: "https://adobeinteriors.com/image/cache/catalog/living-room/sofas/chateau-red-leather-sofa-4-910x1155.jpg",
        priceType: "fixed",
        price: 10,
        postedOn: "3/11/2023",
        availableUntil: "3/13/2023",
        highestBidderId: 1234,
    };

    mockAxios.onPost(`${JSON_SERVER_URL}/posts`, dummyPost).reply(201);
    mockAxios.onPost(`${JSON_SERVER_URL}/posts`, { ...dummyPost, sellerId: 13 }).reply(400);

    test('response status code is correct for post created', async () => {
        const response = await createNewPost(dummyPost);
        expect(response).toBe(201);
    });

    test('response status code is correct for bad request', async () => {
        const error = await createNewPost({ ...dummyPost, sellerId: 13 });
        expect(error.response.status).toBe(400);
    });
});

describe('api tests for fetchAllUsersPosts', () => {
    const dummyPost = {
        sellerId: 12,
        seller: "David Hong",
        title: "Red Couch",
        description: "This is the first couch!",
        image: "https://adobeinteriors.com/image/cache/catalog/living-room/sofas/chateau-red-leather-sofa-4-910x1155.jpg",
        priceType: "fixed",
        price: 10,
        postedOn: "3/11/2023",
        availableUntil: "3/13/2023",
        highestBidderId: 1234,
    };

    mockAxios.onGet(`${JSON_SERVER_URL}/posts/?sellerId=12`).reply(200, [dummyPost]);
    mockAxios.onGet(`${JSON_SERVER_URL}/posts/?sellerId=undefined`).reply(404);

    test('response data is correct for fetching all users posts', async () => {
        const response = await fetchAllUsersPosts(12);
        expect(response).toStrictEqual([dummyPost]);
    });

    test('fetching all users without userId results in error', async () => {
        const error = await fetchAllUsersPosts();
        expect(error.response.status).toBe(404);
    });
});

describe('api tests for updateBid', () => {
    const dummyPost = {
        sellerId: 12,
        seller: "David Hong",
        title: "Magenta Couch",
        description: "More purple than a rosebud!",
        image: "https://adobeinteriors.com/image/cache/catalog/living-room/sofas/chateau-red-leather-sofa-4-910x1155.jpg",
        priceType: "bid",
        price: 103,
        postedOn: "2023-02-01",
        availableUntil: "2023-04-01",
        id: 1,
        highestBidderId: 6,
        category: "furniture"
    };

    mockAxios.onPatch(`${JSON_SERVER_URL}/posts/1`).reply(200, [dummyPost]);
    mockAxios.onPatch(`${JSON_SERVER_URL}/posts/2`).reply(403);
    mockAxios.onPatch(`${JSON_SERVER_URL}/posts/undefined`).reply(404);

    test('response data is correct for updatingPost', async () => {
        const response = await updateBid(1, 103, 6);
        expect(response.data[0]).toStrictEqual(dummyPost);
    });

    test('response data is correct for updatingPost', async () => {
        const error = await updateBid(2, 103, 6);
        expect(error.response.status).toBe(403);
    });

    test('error updatingPost', async () => {
        const error = await updateBid();
        expect(error.response.status).toBe(404);
    });
});

describe('api tests for editPost', () => {
    const dummyPost = {
        sellerId: 12,
        seller: "David Hong",
        title: "Magenta Couch",
        description: "More purple than a rosebud!",
        image: "https://adobeinteriors.com/image/cache/catalog/living-room/sofas/chateau-red-leather-sofa-4-910x1155.jpg",
        priceType: "bid",
        price: 103,
        postedOn: "2023-02-01",
        availableUntil: "2023-04-01",
        id: 1,
        highestBidderId: 6,
        category: "furniture"
    };

    mockAxios.onPatch(`${JSON_SERVER_URL}/posts/1`).reply(200, [dummyPost]);
    mockAxios.onPatch(`${JSON_SERVER_URL}/posts/2`).reply(403);
    mockAxios.onPatch(`${JSON_SERVER_URL}/posts/undefined`).reply(404);

    test('response data is correct for updatingPost', async () => {
        const response = await editPost(1, dummyPost);
        expect(response).toBe(200);
    });

    test('response data is correct for updatingPost', async () => {
        const error = await editPost(2, dummyPost);
        expect(error.response.status).toBe(403);
    });

    test('error updatingPost', async () => {
        const error = await editPost(undefined, {});
        expect(error.response.status).toBe(404);
    });
});
