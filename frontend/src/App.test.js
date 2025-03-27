import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock Axios
jest.mock('axios');
const mockedAxios = axios;

describe('Constituent Management App', () => {
  const constituentsData = [
    { email: 'john@example.com', name: 'John Doe', address: '123 Main St', signedUpAt: '2025-03-26' },
    { email: 'jane@example.com', name: 'Jane Smith', address: '456 Oak St', signedUpAt: '2025-03-25' },
  ];

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: constituentsData });
    mockedAxios.delete.mockResolvedValue({ data: { message: 'Constituent deleted' } });
  });

  test('renders constituents list', async () => {
    render(<App />);

    // Wait for axios response and render the constituent list
    await screen.findByText('John Doe');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('search functionality', async () => {
    render(<App />);

    await screen.findByText('John Doe');
    fireEvent.change(screen.getByPlaceholderText('Search by Name'), { target: { value: 'Jane' } });
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).toBeNull();
  });

  test('delete functionality', async () => {
    render(<App />);

    await screen.findByText('John Doe');

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(mockedAxios.delete).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('John Doe')).toBeNull();
  });
});
