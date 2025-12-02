import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

// Uygulamadan bağımsız, basit bir test component'i
function TestComponent() {
  return <Text testID="label">Hello</Text>;
}

describe('TestComponent', () => {
  it('renders label correctly', () => {
    const { getByTestId } = render(<TestComponent />);
    const label = getByTestId('label');
    expect(label.props.children).toBe('Hello');
  });
});