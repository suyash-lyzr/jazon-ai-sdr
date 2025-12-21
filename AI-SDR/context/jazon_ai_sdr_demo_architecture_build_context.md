# Jazon AI SDR – Demo Architecture & Build Context

This document captures **all context, decisions, and architecture** discussed so far for building a **working, enterprise-demo–ready version of Jazon AI SDR**.  
This file is meant to be given directly to **Cursor** so it has full product + technical context.

---

## 1. Product Goal (Demo-Focused)

Build a **reliable, deterministic, enterprise-grade demo** of Jazon AI SDR that can be shown live to clients.

Key goals:

- Demo must **always work**
- No partial or broken states
- Deterministic outputs
- Clear explainability
- Agents behave like **microservices**, not chatbots

Important: **Demo reliability > architectural purity**.

---

## 2. Core Product Principles

- Jazon is the **system of record for leads**, not CRM-first
- CRMs, Apollo, etc. are **inputs**, not decision engines
- AI evaluates every lead
- AI outputs are **explainable, structured, auditable**

Strict separation of concerns:

- Research ≠ ICP Scoring ≠ Strategy ≠ Copy ≠ Execution

---

## 3. Key Architecture Decision (Critical)

### ❌ What we are NOT doing (for demo)

- No LLM-based manager / orchestrator agent
- No agent-to-agent chaining
- No hidden context passing via prompts

### ✅ What we ARE doing

- **Backend-controlled orchestration**
- Agents are **self-sufficient, API-driven services**
- Explicit structured JSON passed between agents via API calls
- Backend code decides execution order

Agents behave like **pure functions**:

```
Input JSON → Agent → Output JSON
```

---

## 4. Demo Scope (Current Phase)

We are intentionally starting with **only 2 agents**:

1. Research & Enrichment Agent
2. ICP Scoring Agent

If this pipeline works reliably, we will later add:

- Outreach Strategy Agent
- Outreach Copy Agent

---

## 5. End-to-End Demo Flow

### Step 1: CSV Upload

- User uploads a CSV file with leads
- CSV columns:
  - name
  - title
  - company
  - email (optional)

Example lead:

- Pradeep Nahata, VP Sales – Digital Solutions, Accenture

### Step 2: Store in Database

- Each row becomes a **Lead document** in MongoDB
- Initial status: `uploaded`
- No AI runs yet

### Step 3: “Refresh / Run AI” Action

When user clicks refresh for a lead:

1. Backend fetches lead from DB
2. Backend calls **Research & Enrichment Agent**
3. Research output is stored in DB
4. Backend calls **ICP Scoring Agent** with research output
5. ICP output is stored in DB
6. Lead status updated to `icp_scored`

No AI is triggered automatically on page load.

---

## 6. Database Design (MongoDB)

### Database

- Name: `jazon_ai_sdr`

### Core Collection

- `leads`

### Lead Document Structure

```ts
Lead {
  lead_input: {
    name: string
    title: string
    company: string
    email?: string
  }

  research: {
    CompanyProfile
    PersonaProfile
    DetectedSignals
    ResearchMeta
  }

  icp: {
    icp_score
    fit_tier
    score_breakdown
    strengths
    risks
    gaps
    confidence_level
    scoring_meta
  }

  status: "uploaded" | "researched" | "icp_scored"

  createdAt
  updatedAt
}
```

Each agent **only writes to its own section**.

---

## 7. Backend Responsibilities

Backend replaces the manager agent.

Responsibilities:

- Parse CSV
- Create Lead records
- Orchestrate agent calls sequentially
- Persist outputs after each step
- Expose clean APIs to frontend

Backend flow example:

```ts
research = callResearchAgent(lead.lead_input);
save(research);

icp = callICPAgent(research);
save(icp);
```

---

## 8. Research & Enrichment Agent (Finalized)

### Role

- Stateless research microservice
- Performs:
  - Company research
  - Persona research
  - Signal detection

### Important Rules

- Never scores ICP
- Never recommends actions
- Never writes outreach copy
- Never changes schema

### Output

- Uses **Lyzr Structured Output JSON**
- `strict: true`
- Fixed schema (no dynamic properties)
- Always returns full schema
- Empty strings / arrays allowed, missing fields NOT allowed

This agent is **schema-validated** and demo-safe.

---

## 9. ICP Scoring Agent (Finalized)

### Role

- Deterministic scoring service
- Evaluates fit against Ideal Customer Profile

### Inputs

- Structured Research output
- ICP definition (from knowledge base or config)

### Outputs

- ICP score (0–100)
- Fit tier (Tier 1 / Tier 2 / Tier 3 / Disqualified)
- Score breakdown
- Strengths, risks, gaps
- Confidence level

### Rules

- No research
- No outreach
- No recommendations
- Always return structured JSON

---

## 10. Structured Output Strategy (Lyzr Studio)

- Structured Output JSON is enabled for both agents
- `strict: true`
- `additionalProperties: false`
- Fixed schemas only

This ensures:

- No malformed outputs
- Safe frontend parsing
- Enterprise credibility

---

## 11. Frontend Behavior

### Leads Page

Displays:

- Name, title, company
- ICP score
- Fit tier
- Status badge

No AI runs here.

### Research & ICP Page

Reads from DB:

- Research output
- ICP breakdown
- Risks and gaps

Buttons like:

- “Re-run Research & ICP” simply re-trigger backend API

---

## 12. MongoDB Connection

- MongoDB is used as the single source of truth
- Connection handled via Mongoose
- Environment variable:

```
MONGODB_URI=mongodb://mongo:7c5efd20db7c49223928@139.59.66.172:27017/jazon_ai_sdr
```

---

## 13. Why This Architecture Works for Enterprise Demos

- Deterministic behavior
- No hidden AI decisions
- Fully explainable pipeline
- Each agent is independently auditable
- Backend orchestration mirrors real production systems

This makes the demo **trustworthy** to:

- VP Sales
- RevOps
- CIO / CTO

---

## 14. Next Planned Steps (Not Yet Built)

- Outreach Strategy Agent
- Outreach Copy Agent
- Execution layer (email / LinkedIn)
- Guardrails and approval workflows

These will be added **only after** Research → ICP is rock solid.

---

## 15. Summary

This document defines:

- Product intent
- Demo scope
- Agent boundaries
- Backend orchestration model
- Database design
- Frontend behavior

Cursor should treat this as the **source of truth** when generating or modifying code for Jazon AI SDR.
