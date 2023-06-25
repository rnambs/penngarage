/**
 *  @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

test('renders Penn Garage title', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  expect(screen.getByText(/Penn Garage/)).toBeInTheDocument();
});
