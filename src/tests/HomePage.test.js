/**
 *  @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import HomePage from '../pages/HomePage';
import { BrowserRouter } from 'react-router-dom';

describe("testing for home page", () => {
  test("initial load and testing recent in home page", async () => {
    render(<BrowserRouter><HomePage userId={16} /></BrowserRouter>);
    expect(screen.getByText(/New Items/)).toBeInTheDocument();
    expect(screen.getByText(/Urgent Items/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText(/Seller/)[0]).toBeInTheDocument();
    })

    await act(async () => {
      await userEvent.click(screen.getByTitle(/nextRecent/));
    });

    await waitFor(() => {
      expect(screen.getByTitle(/prevRecent/)).toBeInTheDocument();
    })

    await act(async () => {
      await userEvent.click(screen.getByTitle(/prevRecent/));
    });

    await act(async () => {
      await userEvent.click(screen.getByTitle(/nextUrgent/));
    });

    await waitFor(() => {
      expect(screen.getByTitle(/prevUrgent/)).toBeInTheDocument();
    })

    await act(async () => {
      await userEvent.click(screen.getByTitle(/prevUrgent/));
    });
  });
});