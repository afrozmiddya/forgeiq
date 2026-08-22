import crypto from 'crypto';
import { normalizePartNumber } from './part-number';

/**
 * Generates a deterministic UUID based on unique attributes like manufacturer and part number.
 */
export function generateDeterministicId(manufacturerName: string, partNumber: string): string {
  const normMfr = normalizePartNumber(manufacturerName);
  const normPart = normalizePartNumber(partNumber);
  
  if (!normMfr && !normPart) {
    throw new Error('Cannot generate UUID without identifying information.');
  }

  const payload = `${normMfr}||${normPart}`;
  
  // Create sha256 hash
  const hash = crypto.createHash('sha256').update(payload).digest('hex');
  
  // Format as UUIDv4-like string
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16), // Force UUIDv4 format version 4
    '8' + hash.substring(17, 20), // Force UUIDv4 variant
    hash.substring(20, 32)
  ].join('-');
}
