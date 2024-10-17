import path from 'path';
import fs from 'fs';
import * as fsPromises from 'fs/promises';

import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('path');
jest.mock('fs');
jest.mock('fs/promises');

const SECOND_IN_MS = 1000;
const mockedCb = jest.fn();

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    mockedCb.mockClear();
  });

  test('should set timeout with provided callback and timeout', () => {
    expect(jest.getTimerCount()).toEqual(0);
    doStuffByTimeout(mockedCb, SECOND_IN_MS);
    expect(jest.getTimerCount()).toEqual(1);

    expect(mockedCb).not.toBeCalled();
    jest.runAllTimers();
    expect(mockedCb).toBeCalled();
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(mockedCb, SECOND_IN_MS);

    expect(mockedCb).not.toBeCalled();
    jest.advanceTimersByTime(SECOND_IN_MS);
    expect(mockedCb).toBeCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    mockedCb.mockClear();
  });

  test('should set interval with provided callback and timeout', () => {
    doStuffByInterval(mockedCb, SECOND_IN_MS);

    expect(mockedCb).not.toBeCalled();
    jest.advanceTimersByTime(SECOND_IN_MS);
    expect(mockedCb).toBeCalled();
  });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(mockedCb, SECOND_IN_MS);

    expect(mockedCb).not.toBeCalled();

    jest.advanceTimersByTime(SECOND_IN_MS);
    expect(mockedCb).toBeCalled();

    jest.advanceTimersByTime(SECOND_IN_MS);
    expect(mockedCb).toBeCalledTimes(2);

    jest.advanceTimersByTime(SECOND_IN_MS);
    expect(mockedCb).toBeCalledTimes(3);

    jest.advanceTimersByTime(SECOND_IN_MS);
    expect(mockedCb).toBeCalledTimes(4);

    jest.advanceTimersByTime(SECOND_IN_MS);
    expect(mockedCb).toBeCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'testPathToFile';

    expect(path.join).not.toBeCalled();

    await readFileAsynchronously(pathToFile);

    expect(path.join).toBeCalled();
    expect(path.join).toBeCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    expect(fs.existsSync).not.toBeCalled();

    const result = await readFileAsynchronously('');

    expect(fs.existsSync).toBeCalled();
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const mockedFileContent = 'Mocked file content';

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(mockedFileContent);

    expect(fsPromises.readFile).not.toBeCalled();
    expect(fs.existsSync).not.toBeCalled();

    const result = await readFileAsynchronously('');

    expect(fs.existsSync).toBeCalled();
    expect(fsPromises.readFile).toBeCalled();
    expect(result).toBe(mockedFileContent);
  });
});
