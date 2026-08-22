import { supabase } from '@forgeiq/shared';

export interface TaxonomyMatch {
  categoryId: string;
  categoryName: string;
  confidence: number;
  method: 'KEYWORD_HEURISTIC' | 'LLM' | 'UNCLASSIFIED';
  classpath: string;
}

export async function classifyProduct(title: string, description: string): Promise<TaxonomyMatch> {
  const combinedText = `${title} ${description}`.toLowerCase();

  const { data: taxonomy } = await supabase.from('taxonomy_values').select('*').eq('active', true);
  
  if (taxonomy && taxonomy.length > 0) {
    for (const cat of taxonomy) {
      const keyword = cat.fine?.toLowerCase() || cat.class?.toLowerCase() || '';
      if (keyword && combinedText.includes(keyword)) {
        return {
          categoryId: cat.id,
          categoryName: cat.fine || cat.class || '',
          confidence: 0.85,
          method: 'KEYWORD_HEURISTIC',
          classpath: cat.classpath || ''
        };
      }
    }
  }

  // Fallback heuristic if DB doesn't match
  if (combinedText.includes('drill') || combinedText.includes('saw') || combinedText.includes('hammer')) {
    return {
      categoryId: 'TAX-003',
      categoryName: 'POWER_TOOLS',
      confidence: 0.70,
      method: 'KEYWORD_HEURISTIC',
      classpath: 'Tools > Power Tools'
    };
  }

  return {
    categoryId: 'UNCLASSIFIED',
    categoryName: 'UNCLASSIFIED',
    confidence: 0,
    method: 'UNCLASSIFIED',
    classpath: 'Unknown'
  };
}
