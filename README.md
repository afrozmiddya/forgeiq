# ForgeIQ

**ForgeIQ** is an autonomous product-enrichment platform designed to transform incomplete product catalogue data into a canonical, normalized, and validated state. This MVP was developed as part of a Hackathon challenge to automate Data Engineering processes.

## Features

- **Strict 252-Column Data Contract**: Output strictly aligns with the required 252-column schema layout (Phase 4).
- **Deterministic Product Identity**: Normalizes MFR part numbers and generates deterministic SHA256 UUIDs (Phase 6).
- **Fuzzy Brand Resolution**: Maps raw strings like "De walt" to canonical manufacturers like "DEWALT" using Levenshtein distance (Phase 8).
- **Taxonomy Classification**: Heuristically classifies raw data into functional product categories (Phase 9).
- **Deterministic Rules Engine**: Validates extracted features against strict LOV and UOM lists (Phase 10).
- **LLM Orchestration**: Extracts normalized schema properties from unstructured text (Phase 11).
- **Scraping Fallbacks**: Recovers missing data by autonomously fetching specification sheets (Phase 12).
- **Worker Pipeline**: Orchestrates the above modules into a highly concurrent chunked processing pipeline (Phase 7, 13).
- **Progress Tracking & UI**: Real-time HTTP polling and a human-in-the-loop review interface built with React & Tailwind (Phase 14-16).
- **Final Export**: Transforms enriched objects back to the strict 252-column CSV schema (Phase 17).

## Architecture

This project is a **TypeScript Monorepo** organized loosely around TurboRepo/Yarn workspace principles (though managed natively with `npm`).

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for a detailed technical breakdown.

### Packages (Domain Logic)
- `@forgeiq/schemas`: Drizzle ORM schemas and the 252-column payload definitions.
- `@forgeiq/identity`: UUID generation and Fuzzy brand mapping.
- `@forgeiq/rules`: Deterministic validation engine.
- `@forgeiq/ai`: LLM integration and Taxonomy classification.
- `@forgeiq/scraper`: Fallback headless browser mock.

### Apps (Services)
- `api`: Express server for HTTP file uploads and status polling.
- `worker`: Background daemon coordinating the data enrichment pipeline.
- `web`: React / Vite Frontend with Tailwind CSS.

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd forgeiq

# Install dependencies for all workspaces
npm install
```

### Running Locally

You will need to run the three main applications concurrently:

```bash
# Terminal 1: Run the API (Port 4000)
cd apps/api
npm run dev

# Terminal 2: Run the Worker daemon
cd apps/worker
npm run dev

# Terminal 3: Run the Web UI (Port 5173)
cd apps/web
npm run dev
```

Then visit `http://localhost:5173` in your browser.

## Hackathon Completion Status

This project successfully implemented all 18 Phases outlined in the ForgeIQ specifications.
See [docs/IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md) for the detailed step-by-step progress tracking.
