/**
 *  @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import ForgotPage from '../pages/ForgotPage';
import { BrowserRouter } from 'react-router-dom';

describe('ui tests for ForgotPage component', () => {
  test('renders ForgotPage0', async () => {
      render(<BrowserRouter><ForgotPage /></BrowserRouter>);
      const buttonElement = screen.getByText(/Enter user information/);
      expect(buttonElement).toBeInTheDocument();
  });

  test('add text to First Name box', async () => {
      render(<BrowserRouter><ForgotPage /></BrowserRouter>);
      let idElement = screen.getByPlaceholderText(/enter first name here/);
      await act(async () => {
          await userEvent.type(idElement, "Soyoon")
      })
      expect(idElement.value).toBe("Soyoon");
  });

  test('add text to Last Name box', async () => {
    render(<BrowserRouter><ForgotPage /></BrowserRouter>);
    let idElement = screen.getByPlaceholderText(/enter last name here/);
    await act(async () => {
        await userEvent.type(idElement, "Park")
    })
    expect(idElement.value).toBe("Park");
});

test('add text to email box', async () => {
  render(<BrowserRouter><ForgotPage /></BrowserRouter>);
  let idElement = screen.getByPlaceholderText(/enter email here/);
  await act(async () => {
      await userEvent.type(idElement, "soyoon@website.com")
  })
  expect(idElement.value).toBe("soyoon@website.com");
});

test('Incorrect user info displays error message', async () => {
  render(<BrowserRouter><ForgotPage /></BrowserRouter>);
   let firstElement = screen.getByPlaceholderText(/enter first name here/);
  let lastElement = screen.getByPlaceholderText(/enter last name here/);
  let emailElement = screen.getByPlaceholderText(/enter email here/);
  await act(async () => {
    await userEvent.type(firstElement, "yo")
    await userEvent.type(lastElement, "yo")
    await userEvent.type(emailElement, "yo")
  })
  await act(async () => {
            await userEvent.click(screen.getByText(/Submit/));
        })

  await waitFor(() => {
    const textElement = screen.queryByText(/Incorrect/);
    expect(textElement).toBeInTheDocument();
})
});

test('Correct user info renders security question screen', async () => {
  render(<BrowserRouter><ForgotPage /></BrowserRouter>);
   let firstElement = screen.getByPlaceholderText(/enter first name here/);
  let lastElement = screen.getByPlaceholderText(/enter last name here/);
  let emailElement = screen.getByPlaceholderText(/enter email here/);
  await act(async () => {
    await userEvent.type(firstElement, "Soyoon")
    await userEvent.type(lastElement, "Park")
    await userEvent.type(emailElement, "soyoon@website.com")
  })
  await act(async () => {
            await userEvent.click(screen.getByText(/Submit/));
        })

  await waitFor(() => {
    const textElement = screen.queryByText(/Security/);
    expect(textElement).toBeInTheDocument();
})
});

// test('Correct user info renders security question screen', async () => {
//   render(<BrowserRouter><ForgotPage /></BrowserRouter>);
//    let firstElement = screen.getByPlaceholderText(/enter first name here/);
//   let lastElement = screen.getByPlaceholderText(/enter last name here/);
//   let emailElement = screen.getByPlaceholderText(/enter email here/);
//   await act(async () => {
//     await userEvent.type(firstElement, "Soyoon")
//     await userEvent.type(lastElement, "Park")
//     await userEvent.type(emailElement, "soyoon@website.com")
//   })
//   await act(async () => {
//             await userEvent.click(screen.getByText(/Submit/));
//         })

//   await waitFor(() => {

//     let ansElement = screen.getByPlaceholderText(/type in answer here/);

//     act(async () => {
//       userEvent.type(ansElement, "purple");
//     })

//     act(async () => {
//       userEvent.click(screen.getByText(/Submit/));
//     })    
// })

// await waitFor(() => {
//   const textElement = screen.queryByText(/mary/);
//     expect(textElement).toBeInTheDocument();
// })
// });

});