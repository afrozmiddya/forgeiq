import path from 'path';
import { loadInputDataset } from './loaders/ground-truth-loader';

async function main() {
  const filePath = path.resolve(__dirname, '../../../../ForgeIQ Engineering Package/Unihack_ Sample Dataset - Input.csv');
  console.log('Testing dataset loader with path:', filePath);
  
  try {
    const result = await loadInputDataset(filePath);
    if (result.success && result.data) {
      console.log('Loaded first row:', result.data[0]);
    }
  } catch (error) {
    console.error('Error loading dataset:', error);
  }
}

main();
