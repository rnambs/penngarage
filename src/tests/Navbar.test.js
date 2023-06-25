/**
 *  @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { BrowserRouter } from 'react-router-dom';

describe('ui tests for Navbar component', () => {
  test('renders Navbar logo', () => {
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText(/Penn Garage/)).toBeInTheDocument();
  });

  test('renders Navbar Shop link', () => {
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText(/Shop/)).toBeInTheDocument();
  });

  test('renders Navbar My Garage link', () => {
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText(/My Garage/)).toBeInTheDocument();
  });

  test('renders Navbar My Profile link', () => {
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText(/My Profile/)).toBeInTheDocument();
  });

  test('renders Navbar Messages link', () => {
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText(/Messages/)).toBeInTheDocument();
  });
});
