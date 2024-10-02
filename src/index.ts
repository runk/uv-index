import fs from 'node:fs/promises';
import zlib from 'node:zlib';
import { promisify } from 'node:util';
import assert from 'node:assert'

const decompress = promisify(zlib.brotliDecompress);

const WIDTH = 360;
const HEIGHT = 180;
const CELL_SIZE = 2;

export default async () => {
  const deflated = await fs.readFile('resources/data.br');
  const data = await decompress(deflated);
  assert.equal(data.length, WIDTH * HEIGHT * 12 * CELL_SIZE);

  const lookup = (date: Date, lat: number, lon: number): number => {
    const monthOffset = date.getMonth() * (WIDTH * HEIGHT);
    const cellOffset = Math.floor((90 - lat) * WIDTH + (180 - lon));
    const offset = (monthOffset + cellOffset) * CELL_SIZE;

    return data.readUInt16BE(offset) / 100
  }

  return lookup;
}


// const lookup = (grid: Buffer, lat: number, lon: number) => {
//   const index = Math.floor((90 - lat) * width + (180 - lon));
//   const cell = grid.readUInt16BE(index * 2) / 100
//   return cell;
// }
