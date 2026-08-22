import express from 'express';
import cors from 'cors';
import datasetRoutes from './routes/dataset';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/datasets', datasetRoutes);

import { supabase } from '@forgeiq/shared';

app.get('/api/metrics', async (req, res) => {
  try {
    const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: reviewRequired } = await supabase.from('validation_results').select('*', { count: 'exact', head: true }).eq('status', 'OPEN');
    const { count: totalEvidence } = await supabase.from('evidence').select('*', { count: 'exact', head: true });
    const { count: totalAttributes } = await supabase.from('product_attributes').select('*', { count: 'exact', head: true });
    
    const validCount = (totalAttributes || 0) - (reviewRequired || 0);
    const validationRate = totalAttributes ? (validCount / totalAttributes) * 100 : 0;
    const sourceCoverage = totalAttributes ? ((totalEvidence || 0) / totalAttributes) * 100 : 0;
    
    // Simulate enrichment rate for MVP (attributes per product)
    const expectedAttrsPerProduct = 5;
    const enrichmentRate = totalProducts ? Math.min(100, ((totalAttributes || 0) / (totalProducts * expectedAttrsPerProduct)) * 100) : 0;
    
    // Calculate Quality Score
    const avgQualityScore = Math.round((validationRate * 0.4) + (sourceCoverage * 0.4) + (enrichmentRate * 0.2));

    res.status(200).json({
      success: true,
      metrics: {
        totalProducts: totalProducts || 0,
        enrichmentRate: Math.round(enrichmentRate),
        validationRate: Math.round(validationRate),
        sourceCoverage: Math.round(sourceCoverage),
        reviewRequired: reviewRequired || 0,
        qualityScore: avgQualityScore
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
    
    // Simulate complex grouping for distribution charts since Supabase free tier might limit deep group-by
    // We will do a basic extraction of categories
    const { data: classifications } = await supabase.from('classifications').select('department');
    const categoryDistribution: Record<string, number> = {};
    if (classifications) {
      for (const row of classifications) {
        const cat = row.department || 'Unknown';
        categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
      }
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalProducts: totalProducts || 0,
        categoryDistribution,
        validationTrend: [
          { date: '2023-10-01', valid: 120, invalid: 10 },
          { date: '2023-10-02', valid: 150, invalid: 15 },
        ] // Minimal mock for trends as they require time-series data
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'forgeiq-api' });
});

app.listen(PORT, () => {
  console.log(`🚀 ForgeIQ API running on http://localhost:${PORT}`);
});
