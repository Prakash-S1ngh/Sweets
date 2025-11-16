import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import SweetContext from './Context/SweetContext';

test('renders login toggle when not logged in', () => {
  const contextValue = {
    loggedIn: false,
    // provide minimal stubs used by Header/Layout
    cart: { items: [] },
    isAdmin: false,
    logoutUser: jest.fn(),
  };

  render(
    <SweetContext.Provider value={contextValue}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </SweetContext.Provider>
  );

  // The default route shows Login/Registration toggles when not logged in
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
