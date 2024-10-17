 import { simpleCalculator, Action, RawCalculatorInput } from './index';

describe('simpleCalculator tests', () => {
  let testCases: (RawCalculatorInput & { expected: number | null })[] = [];
  const actions = Object.values(Action);
  const TEST_CASES_COUNT = 100;

  for (let i = 0; i < TEST_CASES_COUNT; i++) {
    const a = Math.round(Math.random() * 100);
    const b = Math.round(Math.random() * 10);
    const action = actions[Math.floor(Math.random() * actions.length)];
    const expected = eval(`${a}${action === Action.Exponentiate ? '**': action}${b}`);

    testCases.push({ a, b, action, expected });
  }
    
  test.each(testCases)(
    'should calculate: $a $action $b = $expected', 
    ({ a, b, action, expected }) => expect(simpleCalculator({ a, b, action })).toBe(expected)
  );

  test.each`
     a       | b     | action  
     ${0}    | ${5}  | ${'**'}
     ${12}   | ${-8} | ${'!'} 
     ${132}  | ${1}  | ${'|'} 
     ${1000} | ${3}  | ${'@'} 
     ${291}  | ${77} | ${'$'} 
    `(
      'should return null for invalid action', 
      arg => expect(simpleCalculator(arg)).toBeNull()
    );

  const testCasesIncorrectInput= [
    { a: [0], b: 5, action: Action.Multiply },
    { a: '12', b: -8, action: Action.Add },
    { a: 132, b: {}, action: Action.Exponentiate },
    { a: 1000, b: () => {}, action: Action.Divide },
    { a: '291', b: '77', action: Action.Subtract },
  ];

  test.each(testCasesIncorrectInput)(
    'should return null for invalid arguments', 
    arg => expect(simpleCalculator(arg)).toBeNull()
  );
});