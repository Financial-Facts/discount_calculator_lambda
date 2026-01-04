# Discount Calculator Lambda

An AWS Lambda function that automates fetching financial data for publicly traded companies and calculates intrinsic valuations used by the Financial Facts UI (https://financial-facts.net/).

This repository contains the Lambda implementation, analysis and valuation logic, and persistence glue to store results in Supabase (PostgreSQL).

**Primary responsibilities**
- Fetch financial statements (Income Statement, Balance Sheet, Cash Flow) from FinancialModelingPrep (FMP) using SEC CIK identifiers.
- Compute the 10-year average annual growth rates for the core metrics (the "Big 5").
- Produce intrinsic valuations using three models: Sticker Price, Discounted Cash Flow (DCF), and Benchmark Ratio Price.
- Persist calculated discounts (undervalued equities) to Supabase for the frontend to consume.

## Table of Contents
- **Architecture Overview**
- **Technical Layers**
  - Data Ingestion Layer
  - Analysis Layer (The "Big 5")
  - Valuation Layer
  - Persistence Layer
- **Installation & Setup**
- **Environment Variables**
- **Lambda Triggers / API**
- **Financial Logic & Rule #1**
- **Development & Testing**
- **Disclaimer**
- **Relevant Files**

## Architecture Overview

High level flow:

FMP (FinancialModelingPrep) -> Lambda (Calculation) -> Supabase (Postgres) -> Frontend (https://financial-facts.net/)

1. A message (company CIK or batch of CIKs) is delivered to an SQS queue. Messages are produced by AWS S3 update events when new filings are stored.
2. Lambda (this repo) is subscribed to the SQS queue and receives a message for processing.
3. Lambda uses the FMP API to fetch historical financial statements and market data mapped by CIK.
4. The Analysis layer calculates the Big 5 growth rates (10-year averages) and supporting metrics.
5. The Valuation layer runs Sticker Price, DCF, and Benchmark Ratio Price models and computes a suggested intrinsic value and discount metrics.
6. Calculated discounts and metadata are persisted to Supabase. The frontend queries Supabase to power UI lists and detail pages.

## Technical Layers

**Data Ingestion Layer**
- Source: FinancialModelingPrep (FMP) API.
- Input key: SEC CIK (Canonical identifier used to map to FMP tickers where necessary).
- Data fetched: Income Statement, Balance Sheet, Cash Flow, market prices.
- Location in repo: `src/financial-modeling-prep/` and related helpers.

**Analysis Layer (The "Big 5")**
Calculates 10-year average annual growth rates for these metrics:
- **Return on Invested Capital (ROIC)**
- **Revenue Growth**
- **Earnings Per Share (EPS) Growth**
- **Equity (Book Value) Growth**
- **Operating Cash Flow Growth**

Implementation notes:
- The code computes annual growth rates for each metric then derives the 10-year geometric average (CAGR-like approach). Missing years or insufficient history trigger the repository's `InsufficientDataException` flow.

**Valuation Layer**
- **Sticker Price (Rule #1)**: Projects future EPS using historical growth assumptions, applies a terminal P/E, and discounts back to present value to calculate a conservative fair price.
- **Discounted Cash Flow (DCF)**: Uses levered free cash flow projections available to equity, applies a discount rate (WACC or a required return), and computes present value of future cash flows plus terminal value.
- **Benchmark Ratio Price**: Compares the company's P/S or other selected ratios to industry averages to derive a relative valuation.

Files implementing valuation logic are under `src/calculator/functions/` and `src/calculator/` services.

**Persistence Layer**
- Calculated results and discount records are synchronized to Supabase (Postgres). The primary persistence concept in this project is a `discounts` record representing undervaluation metadata which the frontend consumes.
- Persistence helpers and Supabase-specific code are in `src/discount/supabase-discount/`.

## Installation & Setup

Requirements
- Node.js (18+ recommended)
- NPM or Yarn
- An FMP API key
- A Supabase project with the proper schema and a service key

Local setup (example)

```bash
git clone <repo-url>
cd discount_calculator_lambda
npm install
```

Set environment variables (recommended: use an `.env` file locally or Secrets Manager in production):

```bash
export FMP_API_KEY="your_fmp_api_key"
export SUPABASE_URL="https://<project>.supabase.co"
export SUPABASE_KEY="your-supabase-service-key"
```

If you run the Lambda locally or in a container, ensure these env vars are injected into the runtime environment.

## Environment Variables
- `FMP_API_KEY`: API key for FinancialModelingPrep.
- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_KEY`: Supabase service role or admin key used by the Lambda to insert/update discount records.
- Optional: `LOG_LEVEL`, `PROCESSING_BATCH_SIZE`, `DEFAULT_DISCOUNT_THRESHOLD` may exist depending on runtime config; search `src/` for additional env keys.

## Lambda Triggers / API

Trigger options supported by this architecture:
- **SQS** (recommended): Messages containing a company CIK or a list of CIKs are placed on an SQS queue. The Lambda is subscribed to the queue and processes messages one at a time or in batches.
- **EventBridge (cron)**: EventBridge can schedule a periodic job which sends messages to the SQS queue (for full or partial rescans).
- **API Gateway / Admin API**: An authenticated endpoint can push a message to the queue to trigger immediate processing for a single company or batch.

Processing flow for SQS messages:
1. The Lambda receives the SQS message from the queue.
2. It fetches financials from FMP for the mapped ticker(s).
3. Runs analysis and valuation.
4. Writes/updates `discounts` records to Supabase.
5. On success, the message is deleted from SQS; on failure, the message is either retried or moved to a dead-letter queue according to queue settings.

## Financial Logic & "Rule #1"

The project uses a conservative screening philosophy inspired by the "Rule #1" investing mindset.

Rule #1 screening summary:
- The engine calculates the 10-year average annual growth rate for each Big 5 metric.
- A company qualifies for further consideration if it achieves a growth rate of 10% or greater across the Big 5 metrics (ROIC, Revenue, EPS, Book Value, Operating Cash Flow).
- This threshold is configurable; the repository enforces it in the qualification utilities (see `src/discount/discount-manager/qualification.utils.ts`).

Model brief formulas (high level):
- Sticker Price: Future EPS = EPS_current * (1 + growth) ^ n; Sticker = PV(Future EPS * terminal_PE) using conservative discounting.
- DCF: Project Free Cash Flows for N years using historical growth, discount at required return, add terminal value (Gordon Growth or exit multiple), discount to present.
- Benchmark Ratio Price: Market Value = IndustryAvg_PS * CompanyRevenue, adjusted for margins and moats.

These implementations are intentionally conservative and include safeguards against missing or anomalous data.

## Development & Testing

Local invocation (lightweight)
- You can run the TypeScript lambda handler locally with a small script or Node runner after setting env vars. The repository's `index.ts` / `main.ts` are the Lambda entry points.

Packaging and deploying to AWS Lambda
- Manual ZIP: `npm run build && zip -r deployment.zip .` then upload the zip to Lambda.

Security and keys
- Do not commit `SUPABASE_KEY` or `FMP_API_KEY` to source control. Use Secrets Manager, Parameter Store, or environment secrets in your CI/CD.

## Relevant Files
- Entry points: `index.ts`, `main.ts`
- Bootstrap / initialization: `src/bootstrap.ts`
- Discount manager: `src/discount/discount-service.typings.ts`, `src/discount/ffs-discount/discount.service.ts`, `src/discount/supabase-discount/`
- Calculator functions: `src/calculator/functions/*` (StickerPrice, DCF, BenchmarkRatioPrice, WACC, etc.)
- FinancialModelingPrep helpers: `src/financial-modeling-prep/`
- Exceptions: `src/utils/exceptions/`

## Troubleshooting & Observability
- Retries: Configure SQS retry and DLQ settings to handle transient FMP outages.
- Data quality: Exceptional or missing historical financials will surface `InsufficientDataException` or `DisqualifyingDataException`. These are handled by `src/utils/exceptions`.

## Disclaimer
The information produced by this service is for educational and informational purposes only and does not constitute investment advice. Financial analysis and valuation are inherently uncertain and rely on assumptions and historical data which may not predict future results. The Financial Facts website and its affiliated services make no warranties as to the accuracy, completeness, or timeliness of any information and are not responsible for any investment decisions you make. Investing involves risk, including the potential loss of principal. Always consult a qualified financial advisor before making investment decisions.
