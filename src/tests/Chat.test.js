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
import ChatPage from '../pages/Chat';
import { BrowserRouter } from 'react-router-dom';

describe('ui tests for Chat component', () => {
  test('renders Chat', async () => {
    render(<BrowserRouter><ChatPage userId={7} /></BrowserRouter>);
    const linkElement = screen.getByText(/Chats/);
    expect(linkElement).toBeInTheDocument();
  });
});
