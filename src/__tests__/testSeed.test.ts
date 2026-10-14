import { parseSeedLink, setPendingStart, takePendingStart } from '../app/testSeed';

describe('seed deep link (testing aid)', () => {
  it.each([
    ['lotoquine://seed/42', { seed: 42, drawn: 0 }],
    ['lotoquine://seed/0', { seed: 0, drawn: 0 }],
    ['lotoquine://seed/4294967295/', { seed: 4294967295, drawn: 0 }],
    ['lotoquine://seed/42/drawn/88', { seed: 42, drawn: 88 }],
  ])('parses %s', (url, start) => {
    expect(parseSeedLink(url)).toEqual(start);
  });

  it.each([
    null,
    '',
    'lotoquine://seed/',
    'lotoquine://seed/abc',
    'lotoquine://seed/4294967296',
    'lotoquine://seed/42/drawn/90',
    'lotoquine://seed/42/drawn/',
    'https://seed/42',
    'lotoquine://other/42',
  ])('ignores %p', (url) => {
    expect(parseSeedLink(url)).toBeNull();
  });

  it('is used once by the next new game', () => {
    setPendingStart({ seed: 42, drawn: 0 });
    expect(takePendingStart()).toEqual({ seed: 42, drawn: 0 });
    expect(takePendingStart()).toBeNull();
  });
});
