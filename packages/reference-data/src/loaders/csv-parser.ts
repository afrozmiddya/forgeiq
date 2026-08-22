import fs from 'fs';
import { parse } from 'csv-parse';

export async function parseCsvFile(filePath: string): Promise<any[]> {
  const results: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}
