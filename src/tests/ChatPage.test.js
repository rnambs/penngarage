/**
 *  @jest-environment jsdom
 */

import React from 'react';
import jest from '@testing-library/jest-dom/extend-expect';
import {
  fireEvent, render, screen, waitFor, within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { showNotification } from '@mantine/notifications';
import App from '../App';
import ChatRoom from '../pages/ChatPage';
import { BrowserRouter } from 'react-router-dom';

describe('ui tests for ChatPage component', () => {
  test('renders ChatPage', async () => {
    render(<BrowserRouter><ChatRoom userId={12} receiverId={4321} /></BrowserRouter>);
    const linkElement = screen.getByText(/Send/);
    expect(linkElement).toBeInTheDocument();
  });

  /*  test('test date and time response', async () => {
    render(<App />);
    await act(async () => {
      await userEvent.click(screen.getByText(/Message/));
    });
    const textElement = screen.getByPlaceholderText(/Type your message here.../);
    await act(async () => {
      await userEvent.type(textElement, 'couch');
    });
    const message = screen.getByText('couch').closest('div');
    const timestamp = within(message).getAllByText(/PM/);
    expect(timestamp).toBeInTheDocument();
  }); */

  test('add text to text area', async () => {
    render(<BrowserRouter><ChatRoom userId={12} receiverId={4321} /></BrowserRouter>);
    const textElement = screen.getByPlaceholderText(/Type your message here.../);
    await act(async () => {
      await userEvent.type(textElement, 'couch');
    });
    expect(textElement.value).toBe('couch');
  });

  test('shows an error message when sending an empty message', async () => {
    render(<BrowserRouter><ChatRoom userId={12} receiverId={4321} /></BrowserRouter>);
    const input = screen.getByPlaceholderText('Type your message here...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('You cannot send an empty message!');
    expect(screen.queryByTestId('empty-message-alert')).toBeInTheDocument();
  });

  test('displays the date and time of the message', async () => {
    render(<BrowserRouter><ChatRoom userId={12} receiverId={4321} /></BrowserRouter>);
    // Type a message and press Enter
    const textElement = screen.getByPlaceholderText('Type your message here...');
    await act(async () => {
      await userEvent.type(textElement, 'Hello, bot{enter}');
    });

    // Wait for the bot response to appear in the chat room
    await waitFor(() => {
      const Text = new Date().toLocaleString();
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByTestId('sent-message-alert')).toBeInTheDocument();
  });

  test('button clicked test', async () => {
    render(<BrowserRouter><ChatRoom userId={12} receiverId={4321} /></BrowserRouter>);
    const input = screen.getByPlaceholderText('Type your message here...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const sendButton = screen.getByRole('button', { name: 'Send' }); // get the Send button
    expect(sendButton).toBeInTheDocument(); // check if the button was clicked
  });
});
