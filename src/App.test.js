import { render, screen ,fireEvent} from '@testing-library/react';
import App from './App';

const {} = require('./App')

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


test('renders button', ()=> {
  render(<App />);
  var linkElement = screen.getByText(/Select/i)
  expect(linkElement).toBeInTheDocument();
})

test('click bitcoin address button', () => {
  render(<App />);
  fireEvent.click(screen.getByText(/select/i))
  fireEvent.click(screen.getByText(/generate bitcoin address/i))
  var linkElement = screen.getByText(/Mnemonic/i)
  expect(linkElement).toBeInTheDocument();
})

test('click bitcoin address button', () => {
  render(<App />);
  fireEvent.click(screen.getByText(/select/i))
  fireEvent.click(screen.getByText(/generate multisig address/i))
  var linkElement = screen.getByText(/Provide public keys separated by enter./i)
  expect(linkElement).toBeInTheDocument();
})
