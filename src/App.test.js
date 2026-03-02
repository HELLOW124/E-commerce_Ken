import { render, screen } from '@testing-library/react';
import App from './App';

test('renders store brand', () => {
  render(<App />);
  const brand = screen.getByText(/kenmarket/i);
  expect(brand).toBeInTheDocument();
});
