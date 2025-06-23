import { App } from './app';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<App />', () => {
  it('should render', () => {
    render(<App />);

    expect(screen.getByRole('paragraph')).toHaveTextContent('hello, app!');
  });
});
