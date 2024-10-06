import { it, expect, describe } from 'vitest';
import init from '.';

type Item = {
  date: string;
  value: number;
};

it('happy path', async () => {
  const lookup = await init();
  const [lat, lon] = [-33.86785, 151.20732];
  const results: number[] = [];
  const date = new Date(`2025-01-15`);

  for (let i = 0; i < 12; i++) {
    date.setMonth(i);
    results.push(lookup(date, lat, lon));
  }

  expect(results).toEqual([
    13.73, 12.32, 9.59, 6.15, 3.68, 2.64, 2.89, 4.25, 6.71, 9.25, 11.42, 13.02,
  ]);
});

const places = [
  { name: 'Darwin', lat: -12.4637, lon: 130.8444 },
  { name: 'Sydney', lat: -33.86785, lon: 151.20732 },
  { name: 'Kingston, Tasmania', lat: -42.9758, lon: 147.3079 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
];

describe('places 365', async () => {
  const lookup = await init();
  const start = new Date(`2025-06-15`);

  for (const { name, lat, lon } of places) {
    it(name, async () => {
      const items: Item[] = [];
      for (let i = 0; i < 365; i++) {
        const date = new Date(start.getTime() + 86400 * 1000 * i);
        items.push({
          date: date.toISOString(),
          value: lookup(date, lat, lon),
        });
      }
      expect(items).toMatchSnapshot();
    });
  }
});
