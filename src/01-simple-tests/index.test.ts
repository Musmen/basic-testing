import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  let a: number, b: number;

  beforeEach(() => {
    a = Math.round(Math.random() * 100);
    b = Math.round(Math.random() * 10);
  });

  test('should add two numbers', () => {
    const result = simpleCalculator({ a, b, action: Action.Add });
    expect(result).toEqual(a + b);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a, b, action: Action.Subtract });
    expect(result).toEqual(a - b);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a, b, action: Action.Multiply });
    expect(result).toEqual(a * b);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a, b, action: Action.Divide });
    expect(result).toEqual(a / b);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({ a, b, action: Action.Exponentiate });
    expect(result).toEqual(a ** b);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a, b, action: '~' });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({ a, b: 'abc', action: '!' });
    expect(result).toBeNull();
  });
});
