import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const consoleLogSpy = jest.spyOn(global.console, 'log');

    mockOne();
    mockTwo();
    mockThree();
    expect(mockOne).toBeCalled();
    expect(mockTwo).toBeCalled();
    expect(mockThree).toBeCalled();

    expect(consoleLogSpy).not.toBeCalled();
    consoleLogSpy.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const consoleLogSpy = jest.spyOn(global.console, 'log');

    unmockedFunction();

    expect(consoleLogSpy).toBeCalled();
    expect(consoleLogSpy).toBeCalledTimes(1);
    expect(consoleLogSpy).toBeCalledWith('I am not mocked');
    consoleLogSpy.mockRestore();
  });
});
