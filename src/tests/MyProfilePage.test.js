/**
 *  @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import MyProfilePage from '../pages/MyProfilePage';
import { BrowserRouter } from 'react-router-dom';

describe("testing for profile page", () => {
  // test("test upload", async () => {
  //   render(<BrowserRouter><MyProfilePage setUserId={() => { }} setLoggedIn={() => { }} userId={2} /></BrowserRouter>);

  //   await act(async () => {
  //     await userEvent.click(screen.getByText(/Change/));
  //   })

  //   await waitFor(() => {
  //     const resultPromptElement = screen.getByText(/Choose File/);
  //     expect(resultPromptElement).toBeInTheDocument();
  //   })
  // });

  test("test myprofile page renders", async () => {
    render(<BrowserRouter><MyProfilePage setUserId={() => { }} setLoggedIn={() => { }} userId={2} /></BrowserRouter>);

    await act(async () => {
      await userEvent.click(screen.getByText(/Change/));
    })

    await act(async () => {
      await userEvent.click(screen.getByText(/Save/));
    })

    await waitFor(() => {
      const resultPromptElement = screen.queryByText(/Save/);
      expect(resultPromptElement).toBeNull();
    })
  });
})
