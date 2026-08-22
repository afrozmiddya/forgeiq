# ForgeIQ Architecture

This document describes the technical architecture and the rationales behind the ForgeIQ data enrichment platform.

## 1. Monorepo Structure

The project leverages a standard JavaScript Monorepo pattern (similar to TurboRepo or Nx) but is managed using native NPM workspaces for simplicity. It strictly separates concerns between:
- **Apps**: Executable environments (Web, API, Worker).
- **Packages**: Isolated, unit-testable libraries containing pure business logic.

This isolation ensures the Worker daemon and the API can independently scale while sharing exactly the same underlying logic.

```
/forgeiq
  /apps
    /api        # Express backend
    /web        # React UI
    /worker     # Node.js background pipeline daemon
  /packages
    /ai         # LLM & Taxonomy Classification
    /identity   # Deterministic UUID & Brand Mapping
    /rules      # Validation Engine against reference LOVs
    /schemas    # Drizzle ORM schemas and 252-Column formatting
    /scraper    # Headless fallback fetching
```

## 2. Core Enrichment Pipeline

The enrichment pipeline executes strictly in the `/apps/worker` daemon and follows a deterministic cascade of operations:

1. **Identity Resolution (`@forgeiq/identity`)**
   - Resolves raw "dirty" inputs (e.g. `De walt`) against a fuzzy-matching alias registry.
   - Generates a deterministic SHA-256 UUID based on the Canonical Manufacturer and the Part Number.

2. **Taxonomy Classification (`@forgeiq/ai`)**
   - Applies heuristics to map part titles and descriptions to standardized `categories` (e.g., POWER_TOOLS, FAUCETS).

3. **Feature Extraction (`@forgeiq/ai`)**
   - An orchestration layer dynamically builds an LLM prompt requesting only the specific JSON schema corresponding to the identified Taxonomy.
   - Handles token limits via recursive truncation logic.

4. **Rules Engine (`@forgeiq/rules`)**
   - Extracted features are passed to a deterministic Validation Engine.
   - Validates that returned properties match exact Master Lists of Values (LOVs), Unit of Measure bounds (UOM), and character limit rules.

5. **Scraping Fallback (`@forgeiq/scraper`)**
   - If a record fails validation due to missing critical schema fields, the pipeline autonomously launches a simulated headless browser to search the Manufacturer's domain for specification sheets.
   - The recovered HTML/PDF text is re-fed to the LLM orchestration layer to extract the missing fields.

## 3. Technology Stack Justification

- **TypeScript**: Used universally across all modules for strict contract enforcement.
- **Drizzle ORM**: Selected over Prisma for its zero-dependency SQL-like syntax and superior TypeScript schema inference. This perfectly aligns with the strict database requirements of the hackathon.
- **Vitest**: Used instead of Jest because of native ESM compatibility, which integrates flawlessly with the Vite/React frontend pipeline.
- **React + Tailwind**: Selected for rapid UI prototyping. Tailwind provides utility-first CSS, avoiding context-switching and heavy CSS bloat during hackathon timelines.
- **Levenshtein Distance Algorithm**: A lightweight mathematical string-metric algorithm used for Brand mapping rather than relying on slow, expensive LLM calls for every single row.

## 4. Contract Enforcement

The core requirement of ForgeIQ is the delivery of a **252-column schema**. To guarantee this, all exports flow through `renderTo252Columns()` located in `@forgeiq/schemas`. This array-mapping function ensures that every property mapped by the pipeline is deterministically slotted into the correct column index required by the contract.
