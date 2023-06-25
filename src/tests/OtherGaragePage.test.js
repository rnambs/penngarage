/**
 *  @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import GaragePage from '../pages/GaragePage';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import OtherGaragePage from '../pages/OtherGaragePage';

describe('ui tests for OtherGaragePage component', () => {
    test('renders OtherGaragePage', async () => {
        render(<BrowserRouter><OtherGaragePage userId={1} /></BrowserRouter>);
        await waitFor(() => {
            const textElement = screen.getByText(/Pick-up location:/);
            expect(textElement).toBeInTheDocument();
        })
    });

    test('renders add review popup', async () => {
        render(<MemoryRouter initialEntries={['/garage/6']}>
            <Routes>
                <Route path='/garage/:userId' element={<OtherGaragePage userId={1} />} />
            </Routes>
        </MemoryRouter>);
        await waitFor(() => {
            const textElement = screen.getByText(/Add Review/);
            expect(textElement).toBeInTheDocument();
        })

        await act(async () => {
            await userEvent.click(screen.getByText(/Add Review/));
        });

        expect(screen.getByText(/Add a review/))

        await act(async () => {
            await userEvent.click(screen.getByText(/Confirm Changes/));
            await userEvent.click(screen.getByText(/Back/));
        });

        const nullElem = screen.queryByText(/Add a review/);

        expect(nullElem).toBeNull();

    });
});
