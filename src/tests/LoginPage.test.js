/**
 *  @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import LoginPage from '../pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';

describe('ui tests for LoginPage component', () => {
  test('renders LoginPage', async () => {
      render(<BrowserRouter><LoginPage setUserId={()=>{ }} setLoggedIn={()=>{ }}/></BrowserRouter>);
      const buttonElement = screen.getByText(/Login/);
      expect(buttonElement).toBeInTheDocument();
  });

  test('add text to ID box', async () => {
      render(<BrowserRouter><LoginPage setUserId={()=>{ }} setLoggedIn={()=>{ }} /></BrowserRouter>);
      let idElement = screen.getByPlaceholderText(/enter id here/);
      await act(async () => {
          await userEvent.type(idElement, "mary")
      })
      expect(idElement.value).toBe("mary");
  });

  test('add text to Password box', async () => {
    render(<BrowserRouter><LoginPage setUserId={()=>{ }} setLoggedIn={()=>{ }}/></BrowserRouter>);
    let pwElement = screen.getByPlaceholderText(/enter pw here/);
    await act(async () => {
        await userEvent.type(pwElement, "hi")
    })
    expect(pwElement.value).toBe("hi");
});

// test('Correct id&pw pair login button renders homepage', async () => {
//   render(<BrowserRouter><LoginPage /></BrowserRouter>);
//   let idElement = screen.getByPlaceholderText(/enter id here/);
//   let pwElement = screen.getByPlaceholderText(/enter pw here/);
//   await act(async () => {
//     await userEvent.type(idElement, "mary")
// })
// await act(async () => {
//   await userEvent.type(pwElement, "hi")
// })

//   await act(async () => {
//             await userEvent.click(screen.getByText(/Login/));
//         })

//         await waitFor(() => {
//           //const textElement = screen.queryByText(/This is the Home Page/);
//           //expect(textElement).toBeInTheDocument();

//           // const buttonElement = screen.queryByText(/Create account/);
//           // expect(buttonElement).toBeNull();

//           const textElement = screen.queryByText(/incorrect/);
//           expect(textElement).toBeNull();
//         })
// });

test('Incorrect id&pw pair login button displays error message', async () => {
  render(<BrowserRouter><LoginPage setUserId={()=>{ }} setLoggedIn={()=>{ }} /></BrowserRouter>);
   let idElement = screen.getByPlaceholderText(/enter id here/);
  let pwElement = screen.getByPlaceholderText(/enter pw here/);
  await act(async () => {
    await userEvent.type(idElement, "yo")
    await userEvent.type(pwElement, "yo")
  })
  await act(async () => {
            await userEvent.click(screen.getByText(/Login/));
        })

  await waitFor(() => {
    const textElement = screen.queryByText(/incorrect/);
    expect(textElement).toBeInTheDocument();
})
});

// test('renders SearchPage', async () => {
//   render(<App />);
//   await act(async () => {
//       await userEvent.click(screen.getByText(/Shop/));
//   })
//   const linkElement = screen.getByPlaceholderText(/Search/);
//   expect(linkElement).toBeInTheDocument();
// });

});
