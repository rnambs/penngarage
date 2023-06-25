/**
 *  @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';

describe('ui tests for SearchPage component', () => {
  test('renders SearchPage', async () => {
    render(<BrowserRouter><SearchPage userId={12} /></BrowserRouter>);
    expect(screen.getByPlaceholderText(/Search/)).toBeInTheDocument();
  });

  test('add text to search box', async () => {
    render(<BrowserRouter><SearchPage userId={12} /></BrowserRouter>);
    const searchElement = screen.getByPlaceholderText(/Search/);
    await act(async () => {
      await userEvent.type(searchElement, 'couch');
    });
    expect(searchElement.value).toBe('couch');
  });

  test('submit search query for couch (more than one)', async () => {
    render(<BrowserRouter><SearchPage userId={12} /></BrowserRouter>);
    const searchElement = screen.getByPlaceholderText(/Search/);
    await act(async () => {
      await userEvent.type(searchElement, 'couch');
      await userEvent.click(screen.getByTitle(/Search Button/));
    });
    await waitFor(() => {
      const resultPromptElement = screen.getByText(/Showing items/);
      expect(resultPromptElement).toBeInTheDocument();
    });
  });

  test('submit search query for red couch (only one)', async () => {
    render(<BrowserRouter><SearchPage userId={12} /></BrowserRouter>);
    const searchElement = screen.getByPlaceholderText(/Search/);
    await act(async () => {
      await userEvent.type(searchElement, 'red couch');
      await userEvent.click(screen.getByTitle(/Search Button/));
    });
    await waitFor(() => {
      const resultPromptElement = screen.getByText(/Showing 1 result for/);
      expect(resultPromptElement).toBeInTheDocument();
    });
  });

  test('submit search query for super red couch (does not exist)', async () => {
    render(<BrowserRouter><SearchPage userId={12} /></BrowserRouter>);
    const searchElement = screen.getByPlaceholderText(/Search/);
    await act(async () => {
      await userEvent.type(searchElement, 'super red couch');
      await userEvent.click(screen.getByTitle(/Search Button/));
    });
    await waitFor(() => {
      const resultPromptElement = screen.getByText(/No results for/);
      expect(resultPromptElement).toBeInTheDocument();
    });
  });
});
