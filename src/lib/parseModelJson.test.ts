import { describe, expect, it } from 'vitest';
import { parseModelJson } from './parseModelJson';

describe('parseModelJson', () => {
  it('parses fenced and wrapped JSON', () => {
    expect(parseModelJson('```json\n{"items":[]}\n```')).toEqual({ items: [] });
    expect(parseModelJson('Here is the result:\n{"items":[]}')).toEqual({ items: [] });
  });

  it('turns an ellipsis item placeholder into an empty array', () => {
    expect(parseModelJson('{"items":...,"budgetContradiction":null}')).toEqual({
      items: [],
      budgetContradiction: null
    });
  });

  it('still rejects unrelated malformed JSON', () => {
    expect(() => parseModelJson('{"items": [}')).toThrow();
  });
});
