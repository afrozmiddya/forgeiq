import { pgTable, uuid, text, integer, timestamp, boolean, jsonb, numeric, unique } from 'drizzle-orm/pg-core';

export const datasets = pgTable('datasets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  sourceFilename: text('source_filename').notNull(),
  fileType: text('file_type').notNull(),
  rowCount: integer('row_count'),
  schemaHash: text('schema_hash'),
  status: text('status'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const sourceProducts = pgTable('source_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  datasetId: uuid('dataset_id').references(() => datasets.id).notNull(),
  sourceRowNumber: integer('source_row_number').notNull(),
  rawJson: jsonb('raw_json').notNull(),
  rawHash: text('raw_hash').notNull(),
  placeholderFlags: jsonb('placeholder_flags'),
  duplicateGroupId: uuid('duplicate_group_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique('uq_source_products_dataset_id_row').on(t.datasetId, t.sourceRowNumber)]);

export const manufacturers = pgTable('manufacturers', {
  id: uuid('id').defaultRandom().primaryKey(),
  manufacturerCode: text('manufacturer_code').unique(),
  manufacturerName: text('manufacturer_name'),
  normalizedName: text('normalized_name'),
  sourceVersion: text('source_version'),
  active: boolean('active').default(true),
});

export const brands = pgTable('brands', {
  id: uuid('id').defaultRandom().primaryKey(),
  brandCode: text('brand_code').unique(),
  brandName: text('brand_name'),
  manufacturerId: uuid('manufacturer_id').references(() => manufacturers.id),
  normalizedName: text('normalized_name'),
  sourceVersion: text('source_version'),
  active: boolean('active').default(true),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceProductId: uuid('source_product_id').references(() => sourceProducts.id),
  manufacturerId: uuid('manufacturer_id').references(() => manufacturers.id),
  brandId: uuid('brand_id').references(() => brands.id),
  mpn: text('mpn'),
  alternateMpn: text('alternate_mpn'),
  productType: text('product_type'),
  status: text('status'),
  overallConfidence: numeric('overall_confidence', { precision: 5, scale: 4 }),
  reviewRequired: boolean('review_required').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const classifications = pgTable('classifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  department: text('department'),
  class: text('class'),
  fine: text('fine'),
  classpath: text('classpath'),
  confidence: numeric('confidence', { precision: 5, scale: 4 }),
  source: text('source'),
  validationStatus: text('validation_status'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const taxonomyValues = pgTable('taxonomy_values', {
  id: uuid('id').defaultRandom().primaryKey(),
  department: text('department'),
  class: text('class'),
  fine: text('fine'),
  classpath: text('classpath'),
  sourceVersion: text('source_version'),
  active: boolean('active').default(true),
});

export const lovValues = pgTable('lov_values', {
  id: uuid('id').defaultRandom().primaryKey(),
  classpath: text('classpath'),
  leafNode: text('leaf_node'),
  attributeLabel: text('attribute_label'),
  attributeValue: text('attribute_value'),
  normalizedLabel: text('normalized_label'),
  normalizedValue: text('normalized_value'),
  filtering: boolean('filtering'),
  guidelines: text('guidelines'),
  remarks: text('remarks'),
  sourceVersion: text('source_version'),
  active: boolean('active').default(true),
});

export const productAttributes = pgTable('product_attributes', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  attributeSlot: integer('attribute_slot'), // 1-50
  attributeLabel: text('attribute_label').notNull(),
  rawValue: text('raw_value'),
  normalizedValue: text('normalized_value'),
  uom: text('uom'),
  normalizedUom: text('normalized_uom'),
  lovValueId: uuid('lov_value_id').references(() => lovValues.id),
  confidence: numeric('confidence', { precision: 5, scale: 4 }),
  validationStatus: text('validation_status'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [unique('uq_product_attrs_product_id_slot').on(t.productId, t.attributeSlot)]);

export const uomValues = pgTable('uom_values', {
  id: uuid('id').defaultRandom().primaryKey(),
  measurementType: text('measurement_type'),
  approvedAbbreviation: text('approved_abbreviation'),
  captureForm: text('capture_form'),
  example: text('example'),
  sourceVersion: text('source_version'),
  active: boolean('active').default(true),
});

export const sources = pgTable('sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  url: text('url'),
  domain: text('domain'),
  sourceType: text('source_type'),
  manufacturerMatch: boolean('manufacturer_match'),
  sourcePolicyStatus: text('source_policy_status'),
  retrievedAt: timestamp('retrieved_at', { withTimezone: true }),
  contentHash: text('content_hash'),
  httpStatus: integer('http_status'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const evidence = pgTable('evidence', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  sourceId: uuid('source_id').references(() => sources.id),
  attributeId: uuid('attribute_id').references(() => productAttributes.id),
  claim: text('claim'),
  evidenceText: text('evidence_text'),
  locationJson: jsonb('location_json'),
  supportType: text('support_type'),
  evidenceConfidence: numeric('evidence_confidence', { precision: 5, scale: 4 }),
  extractorVersion: text('extractor_version'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const aiRuns = pgTable('ai_runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  taskType: text('task_type'),
  provider: text('provider'),
  model: text('model'),
  promptVersion: text('prompt_version'),
  schemaVersion: text('schema_version'),
  ruleVersion: text('rule_version'),
  referenceVersion: text('reference_version'),
  inputHash: text('input_hash'),
  outputJson: jsonb('output_json'),
  latencyMs: integer('latency_ms'),
  tokenUsageJson: jsonb('token_usage_json'),
  status: text('status'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const validationResults = pgTable('validation_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  fieldName: text('field_name'),
  ruleId: text('rule_id'),
  severity: text('severity'),
  status: text('status'),
  actualValue: text('actual_value'),
  expectedValue: text('expected_value'),
  message: text('message'),
  evidenceIds: jsonb('evidence_ids'),
  ruleVersion: text('rule_version'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const confidenceScores = pgTable('confidence_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  attributeId: uuid('attribute_id').references(() => productAttributes.id),
  identityScore: numeric('identity_score', { precision: 5, scale: 4 }),
  sourceScore: numeric('source_score', { precision: 5, scale: 4 }),
  evidenceScore: numeric('evidence_score', { precision: 5, scale: 4 }),
  extractionScore: numeric('extraction_score', { precision: 5, scale: 4 }),
  lovScore: numeric('lov_score', { precision: 5, scale: 4 }),
  uomScore: numeric('uom_score', { precision: 5, scale: 4 }),
  consistencyScore: numeric('consistency_score', { precision: 5, scale: 4 }),
  finalScore: numeric('final_score', { precision: 5, scale: 4 }),
  calibrationVersion: text('calibration_version'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const reviewItems = pgTable('review_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  fieldName: text('field_name'),
  aiValue: text('ai_value'),
  finalValue: text('final_value'),
  reason: text('reason'),
  confidence: numeric('confidence', { precision: 5, scale: 4 }),
  status: text('status'),
  reviewer: text('reviewer'),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const contentOutputs = pgTable('content_outputs', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  invoiceDesc: text('invoice_desc'),
  mobileDesc: text('mobile_desc'),
  shortDesc: text('short_desc'),
  longDesc: text('long_desc'),
  retailDesc: text('retail_desc'),
  marketingDescription: text('marketing_description'),
  featureBullets: jsonb('feature_bullets'),
  contentVersion: text('content_version'),
  validationStatus: text('validation_status'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const processingJobs = pgTable('processing_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  datasetId: uuid('dataset_id').references(() => datasets.id),
  jobType: text('job_type'),
  status: text('status'),
  totalRows: integer('total_rows'),
  processedRows: integer('processed_rows'),
  failedRows: integer('failed_rows'),
  reviewRows: integer('review_rows'),
  progressPct: numeric('progress_pct', { precision: 5, scale: 2 }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  errorJson: jsonb('error_json'),
});

export const evaluationRuns = pgTable('evaluation_runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  datasetId: uuid('dataset_id').references(() => datasets.id),
  groundTruthVersion: text('ground_truth_version'),
  schemaVersion: text('schema_version'),
  pipelineVersion: text('pipeline_version'),
  totalProducts: integer('total_products'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const evaluationFieldResults = pgTable('evaluation_field_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  evaluationRunId: uuid('evaluation_run_id').references(() => evaluationRuns.id),
  productId: uuid('product_id').references(() => products.id),
  fieldName: text('field_name'),
  expectedValue: text('expected_value'),
  predictedValue: text('predicted_value'),
  exactMatch: boolean('exact_match'),
  normalizedMatch: boolean('normalized_match'),
  errorType: text('error_type'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const evaluationSummary = pgTable('evaluation_summary', {
  id: uuid('id').defaultRandom().primaryKey(),
  evaluationRunId: uuid('evaluation_run_id').references(() => evaluationRuns.id),
  metricName: text('metric_name'),
  metricValue: numeric('metric_value'),
  denominator: integer('denominator'),
  methodologyVersion: text('methodology_version'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const referenceVersions = pgTable('reference_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceType: text('reference_type'),
  filename: text('filename'),
  fileHash: text('file_hash'),
  versionLabel: text('version_label'),
  loadedAt: timestamp('loaded_at', { withTimezone: true }),
  active: boolean('active').default(true),
});

export const exportsTable = pgTable('exports', {
  id: uuid('id').defaultRandom().primaryKey(),
  datasetId: uuid('dataset_id').references(() => datasets.id),
  jobId: uuid('job_id').references(() => processingJobs.id),
  schemaVersion: text('schema_version'),
  rowCount: integer('row_count'),
  filePath: text('file_path'),
  fileHash: text('file_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
