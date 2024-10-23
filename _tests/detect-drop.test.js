import { detectDropPrisma } from '../lib/utils';

const prismaWarningExample =
  'You are about to drop the column `price` on the `item` table. All the data in the column will be lost.';

describe('detectDropPrisma', () => {
  it('should return true if a warning is present', () => {
    const fileContent =
      'ALTER TABLE users DROP COLUMN email; ' + prismaWarningExample;
    expect(detectDropPrisma(fileContent)).toBe(true);
  });

  it('should return false if no drop statements are found', () => {
    const fileContent = 'CREATE TABLE users (id INT);';
    expect(detectDropPrisma(fileContent)).toBe(false);
  });

  it('should return false if a column named "drop" or "table" present but not in a drop statement', () => {
    const fileContent = 'CREATE TABLE users (id INT, drop INT, table INT);';
    expect(detectDropPrisma(fileContent)).toBe(false);
  });
});
