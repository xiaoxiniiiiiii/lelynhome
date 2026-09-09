import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const boards = [
  ['furniture-board.png', 'furniture'],
  ['soft-board.png', 'soft'],
  ['decor-board.png', 'decor'],
];

await fs.mkdir(path.join(root, 'public', 'products'), { recursive: true });
for (const [file, prefix] of boards) {
  const source = path.join(root, 'generated-source', file);
  const meta = await sharp(source).metadata();
  const cellWidth = Math.floor(meta.width / 5);
  const cellHeight = Math.floor(meta.height / 2);
  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      const index = row * 5 + column + 1;
      if (prefix === 'decor' && index === 7) continue;
      await sharp(source)
        .extract({ left: column * cellWidth, top: row * cellHeight, width: cellWidth, height: cellHeight })
        .resize(900, 900, { fit: 'cover' })
        .webp({ quality: 88 })
        .toFile(path.join(root, 'public', 'products', `${prefix}-${String(index).padStart(2, '0')}.webp`));
    }
  }
}
await sharp(path.join(root, 'generated-source', 'decor-replacement.png'))
  .resize(900, 900, { fit: 'cover' })
  .webp({ quality: 88 })
  .toFile(path.join(root, 'public', 'products', 'decor-07.webp'));
console.log('Created 30 distinct WebP product images.');
