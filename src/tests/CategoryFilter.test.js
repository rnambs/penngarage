/**
 *  @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import { act } from 'react-dom/test-utils';

describe('ui tests for CategoryFilter component', () => {
    test('renders CategoryFilter component', async () => {
        render(<BrowserRouter><CategoryFilter show={true} handleClose={() => { }} filters={{}} setFilters={() => { }} /></BrowserRouter>);
        expect(screen.getAllByText(/Apply Filters/)[0]).toBeInTheDocument();
    });

    test('renders sort by updated value', async () => {
        render(<BrowserRouter><CategoryFilter show={true} handleClose={() => { }} filters={{}} setFilters={() => { }} /></BrowserRouter>);
        const radioBtnElem = screen.getByTestId(/recent-radio-btn/)
        expect(radioBtnElem.checked).toBe(false)
        await act(async () => {
            await userEvent.click(radioBtnElem)
        })
        expect(radioBtnElem.checked).toBe(true)
    });

    test('renders price updated value 0-25', async () => {
        render(<BrowserRouter><CategoryFilter show={true} handleClose={() => { }} filters={{}} setFilters={() => { }} /></BrowserRouter>);
        const radioBtnElem = screen.getByTestId(/0-25-radio-btn/)
        expect(radioBtnElem.checked).toBe(false)
        await act(async () => {
            await userEvent.click(radioBtnElem)
        })
        expect(radioBtnElem.checked).toBe(true)
    });

    test('renders price updated value 25-50', async () => {
        render(<BrowserRouter><CategoryFilter show={true} handleClose={() => { }} filters={{}} setFilters={() => { }} /></BrowserRouter>);
        const radioBtnElem = screen.getByTestId(/25-50-radio-btn/)
        expect(radioBtnElem.checked).toBe(false)
        await act(async () => {
            await userEvent.click(radioBtnElem)
        })
        expect(radioBtnElem.checked).toBe(true)
    });

    test('renders price updated value 50-100', async () => {
        render(<BrowserRouter><CategoryFilter show={true} handleClose={() => { }} filters={{}} setFilters={() => { }} /></BrowserRouter>);
        const radioBtnElem = screen.getByTestId(/50-100-radio-btn/)
        expect(radioBtnElem.checked).toBe(false)
        await act(async () => {
            await userEvent.click(radioBtnElem)
        })
        expect(radioBtnElem.checked).toBe(true)
    });

    test('renders price updated value 100-200', async () => {
        render(<BrowserRouter><CategoryFilter show={true} handleClose={() => { }} filters={{}} setFilters={() => { }} /></BrowserRouter>);
        const radioBtnElem = screen.getByTestId(/100-200-radio-btn/)
        expect(radioBtnElem.checked).toBe(false)
        await act(async () => {
            await userEvent.click(radioBtnElem)
        })
        expect(radioBtnElem.checked).toBe(true)
    });

    test('renders price updated value 200+', async () => {
        render(<BrowserRouter><CategoryFilter show={true} handleClose={() => { }} filters={{}} setFilters={() => { }} /></BrowserRouter>);
        const radioBtnElem = screen.getByTestId(/200+-radio-btn/)
        expect(radioBtnElem.checked).toBe(false)
        await act(async () => {
            await userEvent.click(radioBtnElem)
        })
        expect(radioBtnElem.checked).toBe(true)
    });

    test('renders category updated value', async () => {
        render(<BrowserRouter><CategoryFilter show={true} handleClose={() => { }} filters={{}} setFilters={() => { }} /></BrowserRouter>);
        const radioBtnElem = screen.getByTestId(/bedroom-radio-btn/)
        expect(radioBtnElem.checked).toBe(false)
        await act(async () => {
            await userEvent.click(radioBtnElem)
        })
        expect(radioBtnElem.checked).toBe(true)
    });
});
