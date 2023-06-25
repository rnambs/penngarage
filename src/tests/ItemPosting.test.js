/**
 *  @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ItemPosting from '../components/ItemPosting';
import { act } from 'react-dom/test-utils';

describe('ui tests for ItemPosting component', () => {
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

    test('renders ItemPosting component', async () => {
        render(<BrowserRouter><ItemPosting item={dummyItemPosting} userId={12} /></BrowserRouter>);
        expect(screen.getByText(/Seller:/)).toBeInTheDocument();
        expect(screen.getByText(/Posted:/)).toBeInTheDocument();
        expect(screen.getByText(/Available Until:/)).toBeInTheDocument();
    });

    test('renders successfully added bookmark alert', async () => {
        render(<BrowserRouter><ItemPosting item={dummyItemPosting} userId={12} /></BrowserRouter>);
        await act(async () => {
            await userEvent.click(screen.getByTitle(/Bookmark Item Button/))
        })
        await waitFor(() => {
            expect(screen.getByText(/Successfully added bookmark/)).toBeInTheDocument();
        })
    });

    test('renders successfully showed edit and delete post options', async () => {
        render(<BrowserRouter><ItemPosting item={{ ...dummyItemPosting, sellerId: 12 }} userId={12} editable /></BrowserRouter>);
        await act(async () => {
            await userEvent.click(screen.getByTitle(/Item Options Button/))
        })
        await waitFor(() => {
            expect(screen.getByText(/Edit Post/)).toBeInTheDocument();
            expect(screen.getByText(/Delete Post/)).toBeInTheDocument();
        })
    });

    test('renders successfully bid dialog', async () => {
        render(<BrowserRouter><ItemPosting item={{ ...dummyItemPosting, priceType: 'bid' }} userId={12} /></BrowserRouter>);
        await act(async () => {
            await userEvent.click(screen.getByTitle(/Bid Item Button/))
        })
        let enterBidElem;
        await waitFor(() => {
            enterBidElem = screen.getByPlaceholderText(/Enter Bid/);
        })
        await act(async () => {
            await userEvent.type(enterBidElem, "1000")
            await userEvent.click(screen.getByTitle(/Close Bid Popup Button/));
        })
        await waitFor(() => {
            expect(screen.getByText(/888/)).toBeInTheDocument();
        })
    });

    test('renders successfully bid dialog invalid bid message', async () => {
        render(<BrowserRouter><ItemPosting item={{ ...dummyItemPosting, priceType: 'bid' }} userId={12} /></BrowserRouter>);
        await act(async () => {
            await userEvent.click(screen.getByTitle(/Bid Item Button/))
        })
        let enterBidElem;
        await waitFor(() => {
            enterBidElem = screen.getByPlaceholderText(/Enter Bid/);
        })
        await act(async () => {
            await userEvent.type(enterBidElem, "0")
            await userEvent.click(screen.getByText(/Submit Bid/))
        })
        await waitFor(() => {
            expect(screen.getByText(/INVALID BID/)).toBeInTheDocument();
        })
    });

    test('renders successfully bid dialog bid too small message', async () => {
        render(<BrowserRouter><ItemPosting item={{ ...dummyItemPosting, priceType: 'bid' }} userId={12} /></BrowserRouter>);
        await act(async () => {
            await userEvent.click(screen.getByTitle(/Bid Item Button/))
        })
        let enterBidElem;
        await waitFor(() => {
            enterBidElem = screen.getByPlaceholderText(/Enter Bid/);
        })
        await act(async () => {
            await userEvent.type(enterBidElem, "1")
            await userEvent.click(screen.getByText(/Submit Bid/))
        })
        await waitFor(() => {
            expect(screen.getByText(/YOUR BID IS NOT GREATER THAN THE CURRENT BID/)).toBeInTheDocument();
        })
    });
});
