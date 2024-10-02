import assert from 'assert';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { promisify } from 'node:util';

// https://neo.gsfc.nasa.gov/view.php?datasetId=AURA_UVI_CLIM_M
// Jan to Dec
const months = [
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582428&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582429&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582430&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582431&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582432&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582433&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582426&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582436&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582434&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582427&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582437&cs=rgb&format=CSV&width=360&height=180',
  'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1582435&cs=rgb&format=CSV&width=360&height=180',
]

const width = 360;
const height = 180;
const COMPRESSION_LEVEL = 5; // default quality is 11, which is too slow

const download = async (url: string) => {
  const response = await fetch(url)
  const text = await response.text()
  return text
}

const toGrid = (text: string) => {
  const grid = text.split('\n').filter(Boolean)
    .map(row => row.split(',').filter(Boolean).map(Number));
  assert(grid.length === height, 'Invalid height')
  assert(grid.every(row => row.length === width), 'Invalid width')
  return grid;
}

const encode = (grid: number[][]) => {
  const buffer = Buffer.alloc(width * height * 2)

  const cells = grid.flat()
  for (let i = 0; i < cells.length; i++) {
    // Storing float with 2 decimal places as uint16
    buffer.writeUInt16BE(Math.round(cells[i] * 100), i * 2)
  }

  return buffer
}

const load = (month: number) => {
  return fs.readFileSync(`./data-${month}.bin`)
}

const lookup = (grid: Buffer, lat: number, lon: number) => {
  const index = Math.floor((90 - lat) * width + (180 - lon));
  const cell = grid.readUInt16BE(index * 2) / 100
  return cell;
}


const compress = promisify(zlib.brotliCompress);
const decompress = promisify(zlib.brotliDecompress);

const main = async () => {
  // const grid = load(0);
  // const [lat, lon] = [-33.86785, 151.20732];

  for (let i = 0; i < months.length; i++) {
    const month = months[i]
    const text = await download(month)
    const grid = toGrid(text);

    const buffer = encode(grid);
    const zipped = await compress(buffer, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: COMPRESSION_LEVEL,
      },
    });

    // fs.writeFileSync(`resources/data-${i}.bin`, buffer);
    fs.writeFileSync(`resources/data-${i}.bin.br`, zipped);
  }
}

main()
  .catch(console.error)
