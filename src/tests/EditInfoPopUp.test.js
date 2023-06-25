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

describe('ui tests for EditInfoPopUp component', () => {
  test('button click renders popup', async () => {
      render(<BrowserRouter><MyProfilePage setUserId={()=>{ }} setLoggedIn={()=>{ }} userId={2}/></BrowserRouter>);
      let buttonElement = screen.getByText(/Edit/);
      await act(async () => {
        await userEvent.click(buttonElement);
    })

    await waitFor(() => {
      const textElement = screen.queryByText(/Edit User Information/);
      expect(textElement).toBeInTheDocument();
  })
  });

  test('add text to Password box', async () => {
      render(<BrowserRouter><MyProfilePage setUserId={()=>{ }} setLoggedIn={()=>{ }} userId={2}/></BrowserRouter>);
      await act(async () => {
        await userEvent.click(screen.getByText(/Edit/));
      })

    let pwElement;

    await waitFor(()=>{
      pwElement = screen.getByPlaceholderText(/enter new password here/);
    })
      
      await act(async () => {
          await userEvent.type(pwElement, "hi")
      })
      expect(pwElement.value).toBe("hi");
  });

  test('add text to Password again box', async () => {
    render(<BrowserRouter><MyProfilePage setUserId={()=>{ }} setLoggedIn={()=>{ }} userId={2}/></BrowserRouter>);
    await act(async () => {
      await userEvent.click(screen.getByText(/Edit/));
  })
  let pwElement;

  await waitFor(()=>{
    pwElement = screen.getByPlaceholderText(/enter new password again here/);
  })
  
    await act(async () => {
      await userEvent.type(pwElement, "hi")
    })
    expect(pwElement.value).toBe("hi");
});

test('Unmatching passwords confirm button displays error message', async () => {
  render(<BrowserRouter><MyProfilePage setUserId={()=>{ }} setLoggedIn={()=>{ }} userId={2}/></BrowserRouter>);
  await act(async () => {
    await userEvent.click(screen.getByText(/Edit/));
})
  let pwElement, pw2Element;

  await waitFor(() => {
    pwElement = screen.getByPlaceholderText(/enter new password here/);
    pw2Element = screen.getByPlaceholderText(/enter new password again here/);
  });

  await act(async () => {
    await userEvent.type(pwElement, "h")
    await userEvent.type(pw2Element, "i")
  })

  let buttonElement = screen.getByText(/Confirm Changes/);

  await act(async () => {
            await userEvent.click(buttonElement);
        })

  await waitFor(() => {
    const textElement = screen.queryByText(/two passwords must match/);
    expect(textElement).toBeInTheDocument();
})
});
});