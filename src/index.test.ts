import { it, expect, describe } from 'vitest';
import init from '.'

it('works as expected', async () => {
  const lookup = await init();
  const [lat, lon] = [-33.86785, 151.20732];
  const results: number[] = [];
  const date = new Date(`2025-01-15`)

  for (let i = 0; i < 12; i++) {
    date.setMonth(i);
    results.push(lookup(date, lat, lon));
  }

  expect(results).toEqual([
    13.74,
    12.42,
    9.54,
    6.15,
    3.64,
    2.64,
    2.89,
    4.27,
    6.71,
    9.29,
    11.42,
    13.05,
  ]);
});
