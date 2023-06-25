import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
    fetchUserInfo,
    editHeaderInfo,
} from "../api/users";
import { JSON_SERVER_URL } from "../utils/utils";

const mockAxios = new MockAdapter(axios);

describe("api tests for fetchUserInfo", () => {
    mockAxios
        .onGet(`${JSON_SERVER_URL}/users/5`)
        .reply(200, {
            id: 5,
            username: "owin1234",
            firstName: "Oprah",
            lastName: "Winfrey",
            email: "owin@gmail.com",
            password: "supersecret",
            phone: "123-345-5678",
            profilePicture: "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
            header: {
                garagePhotoURL: "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
                garageDesc: "Mostly a bunch of sofas that I don't need anymore!",
                moveoutDate: "5-14-23",
                pickupLoc: "Harnwell College House",
                avgRating: 1,
            }
        });

    mockAxios
        .onGet(`${JSON_SERVER_URL}/users/100`)
        .reply(404);

    test("response data is correct for valid userid", async () => {
        const output = await fetchUserInfo(5);
        expect(output).toStrictEqual({
            firstName: "Oprah",
            lastName: "Winfrey",
            header: {
                garagePhotoURL: "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
                garageDesc: "Mostly a bunch of sofas that I don't need anymore!",
                moveoutDate: "5-14-23",
                pickupLoc: "Harnwell College House",
                avgRating: 1,
            }
        });
    });
});

describe("api tests for editHeaderInfo", () => {
    mockAxios
        .onPatch(`${JSON_SERVER_URL}/users/5`, {
            header: {
                garagePhotoURL: "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
                garageDesc: "Mostly a bunch of sofas that I don't need anymore!",
                moveoutDate: "5-14-23",
                pickupLoc: "Harnwell College House",
                avgRating: 1,
            }
        })
        .reply(201);

    test("response status code is correct for successful edit", async () => {
        const status = await editHeaderInfo(5, {
            garagePhotoURL: "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
            garageDesc: "Mostly a bunch of sofas that I don't need anymore!",
            moveoutDate: "5-14-23",
            pickupLoc: "Harnwell College House",
            avgRating: 1,
        });
        expect(status).toBe(201);
    });
});
