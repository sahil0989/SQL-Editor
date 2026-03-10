/**
 * scoringService.js
 * Compares user query results against expected results and returns a score.
 */

/**
 * Normalize a value for comparison: trim strings, convert to lowercase.
 */
const normalizeValue = (val) => {
  if (val === null || val === undefined) return null;
  const str = String(val)?.trim();
  // Try numeric comparison
  const num = Number(str);
  if (!isNaN(num) && str !== '') return num;
  return str?.toLowerCase();
};

/**
 * Normalize a row array for comparison.
 */
const normalizeRow = (row) => row?.map(normalizeValue);

/**
 * Serialize a row to a string key for set comparison.
 */
const rowKey = (row) => JSON.stringify(normalizeRow(row));

/**
 * Compare user query results against expected results.
 *
 * @param {Array} userRows - Array of row objects from user query
 * @param {Array} userColumns - Array of column name strings
 * @param {Object} expectedResult - { columns: [...], rows: [[...], ...] }
 * @returns {{ isCorrect: boolean, score: number, matchType: 'exact'|'unordered'|'partial'|'none' }}
 */
export const compareResults = (userRows, userColumns, expectedResult) => {
  if (!expectedResult || !expectedResult?.columns || !expectedResult?.rows) {
    return { isCorrect: false, score: 0, matchType: 'none' };
  }

  const expCols = expectedResult?.columns?.map((c) => c?.toLowerCase()?.trim());
  const expRows = expectedResult?.rows;

  // Normalize user columns
  const normUserCols = (userColumns || [])?.map((c) => c?.toLowerCase()?.trim());

  // Check column match
  const colsMatch =
    normUserCols?.length === expCols?.length &&
    normUserCols?.every((c, i) => c === expCols?.[i]);

  if (!colsMatch) {
    return { isCorrect: false, score: 0, matchType: 'none' };
  }

  // Convert user row objects to arrays in column order
  const userRowArrays = (userRows || [])?.map((row) =>
    normUserCols?.map((col) => {
      // Find the original column key (case-insensitive)
      const origKey = Object.keys(row)?.find(
        (k) => k?.toLowerCase()?.trim() === col
      );
      return origKey !== undefined ? row?.[origKey] : null;
    })
  );

  // Check row count match
  if (userRowArrays?.length !== expRows?.length) {
    // Partial match check (>=50% rows)
    const expSet = new Set(expRows.map(rowKey));
    const matchingRows = userRowArrays?.filter((r) => expSet?.has(rowKey(r)))?.length;
    const overlapPct = expRows?.length > 0 ? matchingRows / expRows?.length : 0;

    if (overlapPct >= 0.5) {
      return { isCorrect: false, score: 50, matchType: 'partial' };
    }
    return { isCorrect: false, score: 0, matchType: 'none' };
  }

  // Exact order match
  const exactMatch = userRowArrays?.every(
    (row, i) => rowKey(row) === rowKey(expRows?.[i])
  );
  if (exactMatch) {
    return { isCorrect: true, score: 100, matchType: 'exact' };
  }

  // Unordered match (same rows, different order)
  const expSet = new Set(expRows.map(rowKey));
  const userSet = new Set(userRowArrays.map(rowKey));
  const unorderedMatch =
    expSet?.size === userSet?.size &&
    [...expSet]?.every((k) => userSet?.has(k));

  if (unorderedMatch) {
    return { isCorrect: true, score: 90, matchType: 'unordered' };
  }

  // Partial match
  const matchingRows = userRowArrays?.filter((r) => expSet?.has(rowKey(r)))?.length;
  const overlapPct = expRows?.length > 0 ? matchingRows / expRows?.length : 0;

  if (overlapPct >= 0.5) {
    return { isCorrect: false, score: 50, matchType: 'partial' };
  }

  return { isCorrect: false, score: 0, matchType: 'none' };
};

const scoringService = {
  compareResults
};

export default scoringService;