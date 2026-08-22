CREATE TABLE "ai_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"task_type" text,
	"provider" text,
	"model" text,
	"prompt_version" text,
	"schema_version" text,
	"rule_version" text,
	"reference_version" text,
	"input_hash" text,
	"output_json" jsonb,
	"latency_ms" integer,
	"token_usage_json" jsonb,
	"status" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_code" text,
	"brand_name" text,
	"manufacturer_id" uuid,
	"normalized_name" text,
	"source_version" text,
	"active" boolean DEFAULT true,
	CONSTRAINT "brands_brand_code_unique" UNIQUE("brand_code")
);
--> statement-breakpoint
CREATE TABLE "classifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"department" text,
	"class" text,
	"fine" text,
	"classpath" text,
	"confidence" numeric(5, 4),
	"source" text,
	"validation_status" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "confidence_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"attribute_id" uuid,
	"identity_score" numeric(5, 4),
	"source_score" numeric(5, 4),
	"evidence_score" numeric(5, 4),
	"extraction_score" numeric(5, 4),
	"lov_score" numeric(5, 4),
	"uom_score" numeric(5, 4),
	"consistency_score" numeric(5, 4),
	"final_score" numeric(5, 4),
	"calibration_version" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_outputs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"invoice_desc" text,
	"mobile_desc" text,
	"short_desc" text,
	"long_desc" text,
	"retail_desc" text,
	"marketing_description" text,
	"feature_bullets" jsonb,
	"content_version" text,
	"validation_status" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "datasets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"source_filename" text NOT NULL,
	"file_type" text NOT NULL,
	"row_count" integer,
	"schema_hash" text,
	"status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "evaluation_field_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_run_id" uuid,
	"product_id" uuid,
	"field_name" text,
	"expected_value" text,
	"predicted_value" text,
	"exact_match" boolean,
	"normalized_match" boolean,
	"error_type" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evaluation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dataset_id" uuid,
	"ground_truth_version" text,
	"schema_version" text,
	"pipeline_version" text,
	"total_products" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evaluation_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_run_id" uuid,
	"metric_name" text,
	"metric_value" numeric,
	"denominator" integer,
	"methodology_version" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"source_id" uuid,
	"attribute_id" uuid,
	"claim" text,
	"evidence_text" text,
	"location_json" jsonb,
	"support_type" text,
	"evidence_confidence" numeric(5, 4),
	"extractor_version" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dataset_id" uuid,
	"job_id" uuid,
	"schema_version" text,
	"row_count" integer,
	"file_path" text,
	"file_hash" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lov_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classpath" text,
	"leaf_node" text,
	"attribute_label" text,
	"attribute_value" text,
	"normalized_label" text,
	"normalized_value" text,
	"filtering" boolean,
	"guidelines" text,
	"remarks" text,
	"source_version" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "manufacturers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_code" text,
	"manufacturer_name" text,
	"normalized_name" text,
	"source_version" text,
	"active" boolean DEFAULT true,
	CONSTRAINT "manufacturers_manufacturer_code_unique" UNIQUE("manufacturer_code")
);
--> statement-breakpoint
CREATE TABLE "processing_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dataset_id" uuid,
	"job_type" text,
	"status" text,
	"total_rows" integer,
	"processed_rows" integer,
	"failed_rows" integer,
	"review_rows" integer,
	"progress_pct" numeric(5, 2),
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error_json" jsonb
);
--> statement-breakpoint
CREATE TABLE "product_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"attribute_slot" integer,
	"attribute_label" text NOT NULL,
	"raw_value" text,
	"normalized_value" text,
	"uom" text,
	"normalized_uom" text,
	"lov_value_id" uuid,
	"confidence" numeric(5, 4),
	"validation_status" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "uq_product_attrs_product_id_slot" UNIQUE("product_id","attribute_slot")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_product_id" uuid,
	"manufacturer_id" uuid,
	"brand_id" uuid,
	"mpn" text,
	"alternate_mpn" text,
	"product_type" text,
	"status" text,
	"overall_confidence" numeric(5, 4),
	"review_required" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reference_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_type" text,
	"filename" text,
	"file_hash" text,
	"version_label" text,
	"loaded_at" timestamp with time zone,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "review_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"field_name" text,
	"ai_value" text,
	"final_value" text,
	"reason" text,
	"confidence" numeric(5, 4),
	"status" text,
	"reviewer" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "source_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dataset_id" uuid NOT NULL,
	"source_row_number" integer NOT NULL,
	"raw_json" jsonb NOT NULL,
	"raw_hash" text NOT NULL,
	"placeholder_flags" jsonb,
	"duplicate_group_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_source_products_dataset_id_row" UNIQUE("dataset_id","source_row_number")
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"url" text,
	"domain" text,
	"source_type" text,
	"manufacturer_match" boolean,
	"source_policy_status" text,
	"retrieved_at" timestamp with time zone,
	"content_hash" text,
	"http_status" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "taxonomy_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department" text,
	"class" text,
	"fine" text,
	"classpath" text,
	"source_version" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "uom_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"measurement_type" text,
	"approved_abbreviation" text,
	"capture_form" text,
	"example" text,
	"source_version" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "validation_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"field_name" text,
	"rule_id" text,
	"severity" text,
	"status" text,
	"actual_value" text,
	"expected_value" text,
	"message" text,
	"evidence_ids" jsonb,
	"rule_version" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_runs" ADD CONSTRAINT "ai_runs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classifications" ADD CONSTRAINT "classifications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "confidence_scores" ADD CONSTRAINT "confidence_scores_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "confidence_scores" ADD CONSTRAINT "confidence_scores_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_outputs" ADD CONSTRAINT "content_outputs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_field_results" ADD CONSTRAINT "evaluation_field_results_evaluation_run_id_evaluation_runs_id_fk" FOREIGN KEY ("evaluation_run_id") REFERENCES "public"."evaluation_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_field_results" ADD CONSTRAINT "evaluation_field_results_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_runs" ADD CONSTRAINT "evaluation_runs_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_summary" ADD CONSTRAINT "evaluation_summary_evaluation_run_id_evaluation_runs_id_fk" FOREIGN KEY ("evaluation_run_id") REFERENCES "public"."evaluation_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exports" ADD CONSTRAINT "exports_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exports" ADD CONSTRAINT "exports_job_id_processing_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."processing_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processing_jobs" ADD CONSTRAINT "processing_jobs_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_lov_value_id_lov_values_id_fk" FOREIGN KEY ("lov_value_id") REFERENCES "public"."lov_values"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_source_product_id_source_products_id_fk" FOREIGN KEY ("source_product_id") REFERENCES "public"."source_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_items" ADD CONSTRAINT "review_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_products" ADD CONSTRAINT "source_products_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validation_results" ADD CONSTRAINT "validation_results_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;