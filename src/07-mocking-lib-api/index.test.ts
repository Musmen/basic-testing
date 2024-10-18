import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((func) => func),
}));

let mockedGet: unknown;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    mockedGet = jest.fn((relativePath) =>
      Promise.resolve({
        data: `Recived from ${relativePath}`,
      }),
    );

    jest
      .spyOn(axios, 'create')
      .mockReturnValue({ get: mockedGet } as unknown as AxiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    expect(axios.create).not.toBeCalled();
    await throttledGetDataFromApi('');
    expect(axios.create).toBeCalled();
    expect(axios.create).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    expect(mockedGet).not.toBeCalled();
    expect(axios.create).not.toBeCalled();

    await throttledGetDataFromApi('testPath');

    expect(axios.create).toBeCalled();
    expect(axios.create).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    expect(mockedGet).toBeCalled();
    expect(mockedGet).toBeCalledWith('testPath');
  });

  test('should return response data', async () => {
    expect(mockedGet).not.toBeCalled();
    expect(axios.create).not.toBeCalled();

    const result = await throttledGetDataFromApi('testPath');

    expect(axios.create).toBeCalled();
    expect(axios.create).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    expect(mockedGet).toBeCalled();
    expect(mockedGet).toBeCalledWith('testPath');
    expect(result).toEqual('Recived from testPath');
  });
});
