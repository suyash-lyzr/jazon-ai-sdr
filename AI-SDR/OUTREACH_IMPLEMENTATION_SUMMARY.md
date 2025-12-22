# Outreach Campaign Implementation Summary

## Overview
Successfully implemented a complete data-backed Outreach Campaign system with AI agent integration, normalized database schema, manual override capabilities, and an editable UI following the same patterns as the Research & ICP Analysis page.

## What Was Implemented

### 1. Data Mapping & Documentation
**File**: `OUTREACH_DATA_MAPPING.md`

Created comprehensive documentation mapping every UI field to its data source (AI, System, Manual, or Dummy), including:
- Field inventory with source classification
- Required Mongoose model schemas
- API response structure
- Override merge logic
- Generation and edit flows with sequence diagrams

### 2. Agent Instructions Updated

#### Outreach Strategy Agent
**File**: `context/agent_instructions/Outreach Strategy Agent.md`

Extended output schema to include:
- `strategy_meta`: generation metadata (timestamp, model, input references)
- `plan_summary`: one-line strategy summary for UI
- Enhanced `recommended_channel_sequence` with:
  - `goal`: short description
  - `reasoning`: why this step exists
  - `recommended_delay_hours`: timing between steps
  - `send_window`: when to send (business hours, etc.)
  - `personalization_signals`: from research
  - `content_request`: what copy agent should produce
  - `gating_conditions`: especially for Voice readiness
- `voice_readiness`: thresholds + approval requirements + rationale

**Sample Output**: `context/agent output format/Outreach Strategy Agent.json`

#### Outreach Copy Agent
**File**: `context/agent_instructions/Outreach Copy Agent.md`

Extended output schema to include:
- `copy_meta`: generation metadata + strategy_run_id linkage
- Enhanced `drafts` array with:
  - `talking_points[]` for Voice channel
  - Better structured subject/body/personalization
- Linked to strategy run for traceability

**Sample Output**: `context/agent output format/Outreach Copy Agent.json`

### 3. Database Models (5 New Collections)

#### A. OutreachCampaign
**File**: `src/models/OutreachCampaign.ts`

Tracks campaign state for each lead:
- `status`: not_started/active/paused/stopped/completed/disqualified
- `current_phase`: Research/Engagement/Qualification/Handoff
- `current_step_number`: tracks progress through strategy
- `next_planned_action`: {label, scheduled_at}
- `final_decision`: {status, reason}
- Dummy metrics: channel_mix, response_rate, avg_response_time

#### B. OutreachStrategyRun
**File**: `src/models/OutreachStrategyRun.ts`

Stores AI-generated strategy outputs:
- References: lead_id, research_run_id, icp_score_id
- `strategy_output`: full JSON from Strategy Agent
- Indexed for finding latest run per lead

#### C. OutreachCopyRun
**File**: `src/models/OutreachCopyRun.ts`

Stores AI-generated copy outputs:
- References: lead_id, strategy_run_id
- `copy_output`: full JSON from Copy Agent
- Indexed for finding latest run per lead

#### D. OutreachEvent
**File**: `src/models/OutreachEvent.ts`

Immutable audit log of all campaign activities:
- Types: lifecycle/research/outreach/engagement/decision/guardrail/outcome
- Actors: AI/System/Human
- Chronologically ordered via `sort_order`
- Optional message content (subject/body/talking_points)
- Flexible metadata for event details

#### E. OutreachGuardrails
**File**: `src/models/OutreachGuardrails.ts`

Configurable safety controls:
- `lead_id`: null for global defaults, specific for per-lead overrides
- `max_touches`, `voice_escalation_allowed`, `voice_escalation_trigger`
- `stop_conditions[]`, `compliance_rules[]`
- Static method `getForLead()` to fetch lead-specific or fall back to global

#### F. FieldOverride (Generic Override System)
**File**: `src/models/FieldOverride.ts`

Universal manual override mechanism:
- `scope`: which type of entity (company/persona/outreach_*)
- `entity_id`: ObjectId of the entity
- `path`: JSON path (e.g., "steps[2].goal", "max_touches")
- `value`: the override value
- `updated_by`, `reason`, `updatedAt`
- **Manual always wins**: API merges AI output + overrides
- Static methods for getting/setting overrides

### 4. API Routes (4 New Endpoints)

#### A. GET /api/leads/[id]/outreach
**File**: `src/app/api/leads/[id]/outreach/route.ts`

Fetches complete outreach data for a lead:
- Lead header info (name, company, ICP score)
- Campaign state (status, phase, next action, etc.)
- Strategy (latest run + merged overrides)
- Copy (latest run + merged overrides)
- Events (chronological audit log)
- Guardrails (global or lead-specific + merged overrides)

**Key Feature**: Implements override merge logic—manual edits always win over AI output.

#### B. POST /api/leads/[id]/outreach/generate
**File**: `src/app/api/leads/[id]/outreach/generate/route.ts`

Manual trigger to generate outreach strategy + copy:
1. Validates research and ICP score exist
2. Calls Outreach Strategy Agent with research/ICP data
3. Saves strategy output to `outreach_strategy_runs`
4. Calls Outreach Copy Agent with strategy + research data
5. Saves copy output to `outreach_copy_runs`
6. Creates/updates `outreach_campaigns` record
7. Seeds `outreach_events` with:
   - Strategy generated event
   - Copy generated event
   - Campaign ready event

**Handles NO_OUTREACH**: If strategy agent returns NO_OUTREACH, updates campaign accordingly and skips copy generation.

#### C. PATCH /api/leads/[id]/outreach/override
**File**: `src/app/api/leads/[id]/outreach/override/route.ts`

Saves manual field overrides:
- Accepts: scope, entity_id, path, value, updated_by, reason
- Upserts to `field_overrides` collection
- Logs manual edit as `outreach_event` with actor=Human
- Used by all edit sidebars (strategy, copy, guardrails)

#### D. POST /api/leads/[id]/outreach/control
**File**: `src/app/api/leads/[id]/outreach/control/route.ts`

Human control actions:
- Actions: pause, stop, force_voice, send_to_ae
- Updates campaign status if needed
- Logs control action as `outreach_event` with actor=Human
- Captures optional reason for audit trail

### 5. Frontend Updates

#### Updated Page: `/outreach`
**File**: `src/app/outreach/page.tsx`

Major changes:
1. **Added Database Integration**:
   - Fetches leads from `/api/leads`
   - Fetches outreach data from `/api/leads/[id]/outreach`
   - Falls back to mock data for non-DB leads

2. **Added Generate/Regenerate Button**:
   - Positioned in header next to lead selector
   - Shows "Generate" or "Regenerate" based on existing data
   - Loading state with spinner
   - Calls `/api/leads/[id]/outreach/generate`
   - Refreshes page after generation

3. **Updated Data Display**:
   - Outreach Summary strip uses real campaign data
   - Strategy card uses real strategy data with edit button
   - Progress indicator tracks real current_step_number
   - Audit log uses real events when available
   - Guardrails display real data with edit button

4. **Added Edit Sidebars** (3 sections):
   
   **Strategy Editor**:
   - Plan summary (textarea)
   - Per-step editor for all steps:
     - Goal (input)
     - Reasoning (textarea)
     - Delay hours (number)
     - Send window (input)
     - Personalization signals (array, one per line)
     - Gating conditions (array, one per line, Voice only)
   - Saves via override API
   
   **Guardrails Editor**:
   - Maximum touches (number)
   - Voice escalation allowed (checkbox)
   - Voice escalation trigger (textarea)
   - Stop conditions (array, one per line)
   - Compliance rules (array, one per line)
   - Saves via override API
   
   **Copy Editor** (placeholder for future):
   - Can be added following same pattern

5. **Human Controls Integration**:
   - Pause/Stop/Force Voice/Send to AE buttons
   - Calls real API for DB leads
   - Falls back to mock for non-DB leads
   - Logs all actions to audit trail

### 6. Key Features

#### Manual Override System
- **Manual Always Wins**: When AI re-generates, it only updates fields without overrides
- All edits saved to `field_overrides` collection
- API merges AI + overrides on every GET request
- UI can show badges: "AI-generated" vs "Manually edited" (future enhancement)

#### Audit Trail
- Immutable, append-only event log
- Every action logged: AI decisions, system events, human controls
- Two views: Executive (filtered) and Full (complete)
- Chronologically ordered with explicit sort_order
- Shows message content (subject/body/talking points) inline

#### Edit Sidebars
- Same UX pattern as Research page
- Wide sidebars (600px/800px) with proper padding
- All fields prefilled with current values
- Section-level editing (not per-field)
- Auto-refresh after save

## Data Flow

### Generation Flow
```
User clicks "Generate Outreach"
    ↓
POST /api/leads/[id]/outreach/generate
    ↓
Fetch ResearchRun + ICPScore
    ↓
Call Outreach Strategy Agent → Save to outreach_strategy_runs
    ↓
Call Outreach Copy Agent → Save to outreach_copy_runs
    ↓
Create/update outreach_campaigns
    ↓
Create outreach_events (3 events: strategy, copy, ready)
    ↓
Return success
    ↓
Frontend refreshes → GET /api/leads/[id]/outreach
    ↓
Display strategy + copy + events
```

### Edit Flow
```
User clicks "Edit" on section
    ↓
Sidebar opens with prefilled data
    ↓
User edits fields
    ↓
User clicks "Save All Changes"
    ↓
For each field:
  PATCH /api/leads/[id]/outreach/override
  (scope, entity_id, path, value)
    ↓
Backend saves to field_overrides
    ↓
Backend logs edit event (actor=Human)
    ↓
Frontend refreshes data
    ↓
UI shows updated values (manual overrides applied)
```

### Control Action Flow
```
User clicks control button (Pause/Stop/etc.)
    ↓
Confirmation dialog appears
    ↓
User confirms (optional reason)
    ↓
POST /api/leads/[id]/outreach/control
    ↓
Backend updates campaign status
    ↓
Backend creates outreach_event (actor=Human)
    ↓
Frontend refreshes data
    ↓
UI reflects new status
```

## Environment Variables Required

Add to `.env.local`:
```
OUTREACH_STRATEGY_AGENT_ID=your_strategy_agent_id
OUTREACH_COPY_AGENT_ID=your_copy_agent_id
```

## Testing Steps

1. **Setup**:
   - Ensure a lead has completed research + ICP scoring
   - Navigate to Outreach Campaign page

2. **Generate**:
   - Select a DB lead
   - Click "Generate Outreach" button
   - Wait for strategy + copy generation (may take 30-60s)
   - Verify strategy card appears with steps
   - Verify events appear in audit log

3. **Edit Strategy**:
   - Click "Edit" on strategy card
   - Modify step goals, reasoning, delays
   - Click "Save All Changes"
   - Verify sidebar closes and UI updates
   - Refresh page to confirm persistence

4. **Edit Guardrails**:
   - Click "Edit" on guardrails card
   - Modify max touches, stop conditions
   - Save changes
   - Verify updates persist

5. **Control Actions**:
   - Click "Pause Outreach"
   - Add optional reason
   - Confirm
   - Verify campaign status updates
   - Verify event appears in audit log

6. **Regenerate**:
   - Click "Regenerate Outreach"
   - Verify:
     - AI updates non-overridden fields
     - Manual overrides remain intact
     - New strategy/copy runs created
     - Events logged

## Files Created/Modified

### New Files (15)
1. `OUTREACH_DATA_MAPPING.md` - Data mapping documentation
2. `OUTREACH_IMPLEMENTATION_SUMMARY.md` - This file
3. `context/agent output format/Outreach Strategy Agent.json` - Sample output
4. `context/agent output format/Outreach Copy Agent.json` - Sample output
5. `src/models/OutreachCampaign.ts` - Campaign model
6. `src/models/OutreachStrategyRun.ts` - Strategy model
7. `src/models/OutreachCopyRun.ts` - Copy model
8. `src/models/OutreachEvent.ts` - Event model
9. `src/models/OutreachGuardrails.ts` - Guardrails model
10. `src/models/FieldOverride.ts` - Override model
11. `src/app/api/leads/[id]/outreach/route.ts` - GET endpoint
12. `src/app/api/leads/[id]/outreach/generate/route.ts` - POST generate
13. `src/app/api/leads/[id]/outreach/override/route.ts` - PATCH override
14. `src/app/api/leads/[id]/outreach/control/route.ts` - POST control
15. `MANUAL_DATA_ENTRY_FEATURE.md` - Already existed from Research page

### Modified Files (3)
1. `context/agent_instructions/Outreach Strategy Agent.md` - Updated output schema
2. `context/agent_instructions/Outreach Copy Agent.md` - Updated output schema
3. `src/app/outreach/page.tsx` - Complete rewrite for DB integration + edit UI

## Architecture Highlights

### Normalized Schema
- Separate collections for campaigns, strategy runs, copy runs, events, guardrails
- Generic override system works across all entities
- Referential integrity via ObjectId references
- Efficient querying with compound indexes

### Manual Override System
- **Core principle**: Manual always wins
- Overrides stored separately from AI output
- Merge happens at API layer on every GET
- When AI re-runs, only non-overridden fields update
- Full audit trail of all manual changes

### AI Agent Integration
- Strategy Agent decides WHAT to say, WHERE, WHEN, and WHY
- Copy Agent decides HOW it is written
- Neither agent triggers execution or tools
- Both output structured JSON matching UI needs
- Validation of prerequisites before running

### UI/UX Patterns
- Consistent with Research & ICP page design
- Section-level edit buttons (not per-field clutter)
- Wide sidebars (600px/800px) with proper spacing
- Prefilled forms (AI data editable)
- Loading states and error handling
- Dual-mode: works with DB leads or falls back to mock

## Database Collections Summary

```
leads (existing)
  ↓
outreach_campaigns (1 per lead)
  ↓
outreach_strategy_runs (multiple per lead, latest used)
  ↓
outreach_copy_runs (multiple per lead, latest used)
  ↓
outreach_events (multiple per campaign, append-only)

outreach_guardrails (global + per-lead overrides)

field_overrides (cross-entity manual edits)
```

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/leads/[id]/outreach` | Fetch all outreach data (merged with overrides) |
| POST | `/api/leads/[id]/outreach/generate` | Generate strategy + copy via AI agents |
| PATCH | `/api/leads/[id]/outreach/override` | Save manual field override |
| POST | `/api/leads/[id]/outreach/control` | Execute human control action (pause/stop/etc.) |

## Next Steps (Future Enhancements)

1. **Copy Editor Sidebar**: Add dedicated sidebar for editing email/LinkedIn/Voice copy
2. **Metrics Editor**: Allow manual editing of channel mix, response rate, avg time
3. **Visual Indicators**: Show "AI-generated" vs "Manually edited" badges on fields
4. **Execution System**: Actually send emails/LinkedIn/Voice based on strategy
5. **Event Enrichment**: Capture real engagement data (opens, clicks, replies)
6. **A/B Testing**: Support multiple strategy/copy variants
7. **Approval Workflows**: Add human approval gates for high-risk actions
8. **Scheduling**: Implement actual scheduling based on recommended_delay_hours

## Notes

- All AI-generated data is editable
- Dummy data (guardrails, metrics) is also editable and persisted
- System respects manual overrides even when AI re-runs
- Audit trail is complete and immutable
- Design follows lyzr-boilerplate guidelines
- Compatible with existing Lead/Research/ICP collections

