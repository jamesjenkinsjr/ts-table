import React from 'react';
import { render, screen } from '@testing-library/react';
import Table from './Table';

test('renders table title', () => {
    render(<Table />);
    const textElement = screen.getByText(/Camp Contact Table/i);
    expect(textElement).toBeInTheDocument();
});
