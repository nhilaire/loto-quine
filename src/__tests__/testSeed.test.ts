import { parseSeedLink, setPendingSeed, takePendingSeed } from '../app/testSeed';

describe('seed deep link (testing aid)', () => {
  it.each([
    ['lotoquine://seed/42', 42],
    ['lotoquine://seed/0', 0],
    ['lotoquine://seed/4294967295/', 4294967295],
  ])('parses %s', (url, seed) => {
    expect(parseSeedLink(url)).toBe(seed);
  });

  it.each([null, '', 'lotoquine://seed/', 'lotoquine://seed/abc', 'lotoquine://seed/4294967296', 'https://seed/42', 'lotoquine://other/42'])(
    'ignores %p',
    (url) => {
      expect(parseSeedLink(url)).toBeNull();
    },
  );

  it('is used once by the next new game', () => {
    setPendingSeed(42);
    expect(takePendingSeed()).toBe(42);
    expect(takePendingSeed()).toBeNull();
  });
});
