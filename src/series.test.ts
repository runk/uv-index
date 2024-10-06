import { it, expect, describe } from 'vitest';
import init from '.';
import fs from 'fs/promises';

type Item = {
  date: string;
  value: number;
};

it('works as expected', async () => {
  const lookup = await init();
  const [lat, lon] = [-0.2233, -78.5141];
  const start = new Date(`2025-06-15`);

  const items: Item[] = [];
  for (let i = 0; i < 365; i++) {
    // date.setMonth(date.getMonth() + 1);
    const date = new Date(start.getTime() + 86400 * 1000 * i);
    items.push({
      date: date.toISOString(),
      value: lookup(date, lat, lon),
    });
  }

  fs.writeFile('test/series.json', JSON.stringify(items, null, 2));
});
