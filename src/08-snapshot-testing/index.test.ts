import { generateLinkedList } from './index';

const values = ['head', 'first', 'second', 'tail'];
const standartLinkedListFromValues = {
  next: {
    next: {
      next: { next: { next: null, value: null }, value: 'tail' },
      value: 'second',
    },
    value: 'first',
  },
  value: 'head',
};

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const linkedList = generateLinkedList(values);

    expect(linkedList.value).toStrictEqual(values[0]);
    expect(linkedList.next?.value).toStrictEqual(values[1]);
    expect(linkedList.next?.next?.value).toStrictEqual(values[2]);
    expect(linkedList.next?.next?.next?.value).toStrictEqual(values[3]);
    expect(linkedList.next?.next?.next?.next?.value).toBeNull();
    expect(linkedList.next?.next?.next?.next?.next?.value).toBeUndefined();
    expect(linkedList).toStrictEqual(standartLinkedListFromValues);
    expect(linkedList).toStrictEqual(standartLinkedListFromValues);
  });

  test('should generate linked list from values 2', () => {
    const linkedList = generateLinkedList(values);
    expect(linkedList).toMatchSnapshot();
  });
});
