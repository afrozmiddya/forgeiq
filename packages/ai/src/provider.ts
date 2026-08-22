export interface AIProvider {
  extractAttributes(title: string, description: string, schema: string, lovs?: Record<string, string[]>): Promise<any>;
  classifyTaxonomy(title: string, description: string): Promise<any>;
  normalizeProduct(title: string, description: string): Promise<any>;
  analyzeEvidence(claim: string, evidenceText: string): Promise<any>;
}
