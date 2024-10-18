import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount).toHaveProperty('getBalance');
    expect(bankAccount.getBalance()).toEqual(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 100;
    const withdrawAmount = 200;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount).toHaveProperty('withdraw');
    expect(() => bankAccount.withdraw(withdrawAmount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 100;
    const transferAmount = 200;
    const fromBankAccount = getBankAccount(initialBalance);
    const toBankAccount = getBankAccount(initialBalance);

    expect(fromBankAccount).toBeInstanceOf(BankAccount);
    expect(toBankAccount).toBeInstanceOf(BankAccount);
    expect(fromBankAccount).toHaveProperty('transfer');
    expect(() =>
      fromBankAccount.transfer(transferAmount, toBankAccount),
    ).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 0;
    const transferAmount = 10;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount).toHaveProperty('transfer');
    expect(() => bankAccount.transfer(transferAmount, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const initialBalance = 33;
    const depositAmount = 100500;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount).toHaveProperty('deposit');
    expect(bankAccount).toHaveProperty('getBalance');
    expect(bankAccount.deposit(depositAmount).getBalance()).toEqual(
      initialBalance + depositAmount,
    );
  });

  test('should withdraw money', () => {
    const initialBalance = 100500;
    const withdrawAmount = 333;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount).toHaveProperty('withdraw');
    expect(bankAccount).toHaveProperty('getBalance');
    expect(bankAccount.withdraw(withdrawAmount).getBalance()).toEqual(
      initialBalance - withdrawAmount,
    );
  });

  test('should transfer money', () => {
    const initialBalance = 100;
    const transferAmount = 50;
    const fromBankAccount = getBankAccount(initialBalance);
    const toBankAccount = getBankAccount(initialBalance);

    expect(fromBankAccount).toBeInstanceOf(BankAccount);
    expect(toBankAccount).toBeInstanceOf(BankAccount);
    expect(fromBankAccount).toHaveProperty('transfer');
    expect(fromBankAccount).toHaveProperty('getBalance');
    expect(toBankAccount).toHaveProperty('getBalance');

    fromBankAccount.transfer(transferAmount, toBankAccount);

    expect(fromBankAccount.getBalance()).toEqual(
      initialBalance - transferAmount,
    );
    expect(toBankAccount.getBalance()).toEqual(initialBalance + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 100;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount).toHaveProperty('fetchBalance');
    expect(bankAccount.fetchBalance()).resolves.toBeDefined();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 100;
    const newBalance = 1000;
    const bankAccount = getBankAccount(initialBalance);
    bankAccount.fetchBalance = () => Promise.resolve(newBalance);

    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount).toHaveProperty('synchronizeBalance');
    expect(bankAccount).toHaveProperty('getBalance');

    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toEqual(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 100;
    const bankAccount = getBankAccount(initialBalance);
    bankAccount.fetchBalance = () => Promise.resolve(null);

    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount).toHaveProperty('synchronizeBalance');
    expect(async () => bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
