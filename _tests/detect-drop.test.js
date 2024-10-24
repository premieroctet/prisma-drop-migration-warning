import { detectDropPrisma } from '../lib/utils';

const prismaWarningExample1 =
  'You are about to drop the column `price` on the `item` table. All the data in the column will be lost.';

const prismaWarningExample2 =
  'You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.';

describe('detectDropPrisma', () => {
  it('should return true if a warning is present', () => {
    const fileContent =
      'ALTER TABLE users DROP COLUMN email; ' + prismaWarningExample1;
    expect(detectDropPrisma(fileContent)).toBe(true);
  });

  it('should return true if a warning is present', () => {
    const fileContent = 'DROP TABLE users; ' + prismaWarningExample2;
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
