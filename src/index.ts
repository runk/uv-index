import fs from 'node:fs/promises';
import zlib from 'node:zlib';
import { promisify } from 'node:util';
import assert from 'node:assert';
import path from 'node:path';

const decompress = promisify(zlib.brotliDecompress);

const WIDTH = 360;
const HEIGHT = 180;
const CELL_SIZE = 2;
const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DATA_FILE = path.resolve(import.meta.dirname, '../resources/data.br');

const round = (num: number, decimalPlaces: number = 2) => {
  var p = Math.pow(10, decimalPlaces || 0);
  var n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
};

export default async () => {
  const deflated = await fs.readFile(DATA_FILE);
  const data = await decompress(deflated);
  assert.equal(data.length, WIDTH * HEIGHT * 12 * CELL_SIZE);

  const getCell = (month: number, lat: number, lon: number) => {
    const monthOffset = month * (WIDTH * HEIGHT);
    const cellOffset = Math.floor((90 - lat) * WIDTH + (180 - lon));
    const offset = (monthOffset + cellOffset) * CELL_SIZE;

    return data.readUInt16BE(offset) / 100;
  };

  /**
   * Lookup UV Index for a given date and location. Function returns
   * daily maximum UV Index which typically occurs around solar noon.
   *
   * @param date Effective date
   * @param lat Latitude (WGS 84)
   * @param lon Longitude (WGS 84)
   * @returns UV Index
   */
  const lookup = (date: Date, lat: number, lon: number): number => {
    const month = date.getMonth();
    const day = date.getDate();
    const middle = MONTH_LENGTHS[month] / 2;

    if (day < middle) {
      const monthPrev = month === 0 ? 11 : month - 1;
      const period = MONTH_LENGTHS[monthPrev] / 2 + day;
      const periodTotal = MONTH_LENGTHS[monthPrev] / 2 + middle;
      const a = getCell(monthPrev, lat, lon);
      const b = getCell(month, lat, lon);

      return round(a + (b - a) * (period / periodTotal));
    }

    if (day > middle) {
      const monthNext = month === 11 ? 0 : month + 1;
      const period = day - middle;
      const periodTotal = middle + MONTH_LENGTHS[monthNext] / 2;
      const a = getCell(month, lat, lon);
      const b = getCell(monthNext, lat, lon);
      return round(a + (b - a) * (period / periodTotal));
    }

    // middle of the month
    return round(getCell(month, lat, lon));
  };

  return lookup;
};
