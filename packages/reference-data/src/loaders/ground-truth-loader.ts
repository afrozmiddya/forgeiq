import { parseCsvFile } from './csv-parser';

export async function loadInputDataset(filePath: string) {
  console.log(`Loading dataset from ${filePath}`);
  const rows = await parseCsvFile(filePath);
  
  // Return early if no rows
  if (rows.length === 0) {
    return { success: false, message: 'No rows found in file.' };
  }

  console.log(`Successfully parsed ${rows.length} rows.`);
  
  // Here we would typically insert into db.sourceProducts, but since
  // we don't have the actual DB instantiated yet, we'll return the parsed data.
  // In a real execution, we would iterate and use Drizzle ORM to insert.
  
  return { success: true, count: rows.length, data: rows };
}
