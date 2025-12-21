# Database Schema Migration - Normalized Architecture

## Overview

This migration transforms the Jazon AI SDR database from a single nested `leads` collection to a fully normalized multi-collection architecture. This provides better data integrity, deduplication, and scalability.

## What Changed

### Before (Nested Schema)
```typescript
Lead {
  lead_input: { name, title, company, email }
  research: { CompanyProfile, PersonaProfile, DetectedSignals, ResearchMeta }
  icp: { icp_score, fit_tier, score_breakdown, ... }
  status: string
}
```

### After (Normalized Schema)
```typescript
// Separate collections with references
Lead { name, title, email, company_id, persona_id, status }
Company { name, domain, industry, company_size, headquarters, ... }
Persona { full_name, email, title, seniority, decision_authority, ... }
Technographic { company_id, name, category, confidence }
ResearchRun { lead_id, company_id, persona_id, research_meta }
Citation { research_run_id, source_name, url, accessed_at_utc }
DetectedSignal { lead_id, research_run_id, type, signal, strength }
ICPScore { lead_id, icp_score, fit_tier, score_breakdown, ... }
ICPFactorBreakdown { icp_score_id, category, score, factors[] }
```

## New Collections

1. **companies** - Deduplicated company profiles
2. **personas** - Deduplicated person profiles
3. **leads** - Core lead records with references
4. **technographics** - Company technology stack (many-to-many)
5. **research_runs** - Research execution metadata
6. **citations** - Research source citations
7. **detected_signals** - Buying intent signals
8. **icp_scores** - ICP scoring results
9. **icp_factor_breakdowns** - Detailed ICP factor analysis

## Benefits

1. **Deduplication**: Same company/persona shared across multiple leads
2. **Query Efficiency**: Indexed references for fast lookups
3. **Data Integrity**: Foreign key relationships via ObjectId references
4. **Scalability**: Separate collections can scale independently
5. **Flexibility**: Easy to add relationships (e.g., company hierarchies)

## Migration Steps

### 1. Backup Your Database
```bash
mongodump --uri="mongodb://mongo:7c5efd20db7c49223928@139.59.66.172:27017/jazon_ai_sdr" --out=backup-$(date +%Y%m%d)
```

### 2. Run Migration Script
The migration script will:
- Extract companies and personas from existing leads
- Create normalized records in new collections
- Update leads to reference the new IDs
- Preserve all research and ICP data

```bash
# Install dependencies if needed
npm install

# Run migration
npx ts-node scripts/migrate-to-normalized-schema.ts
```

### 3. Verify Migration
- Check MongoDB to ensure new collections are created
- Verify lead counts match before/after
- Test the application with migrated data

### 4. Clean Up (Optional)
After verifying the migration, you can remove old lead documents:
```javascript
// In MongoDB shell
db.leads.deleteMany({ _migrated: true })
```

## API Changes

### Upload Leads
Now creates/updates companies and personas before creating leads:
```typescript
POST /api/leads/upload
// Creates: Company → Persona → Lead (with references)
```

### Refresh Leads (Research & ICP)
Now saves to normalized collections:
```typescript
POST /api/leads/refresh
// Updates: Company, Persona, Technographic, ResearchRun, Citation, 
//          DetectedSignal, ICPScore, ICPFactorBreakdown
```

### Get Leads
Returns joined data from all collections:
```typescript
GET /api/leads
GET /api/leads/[id]
// Returns: Lead with populated company, persona, technographics, 
//          signals, ICP score, and factor breakdowns
```

## Model Reference

### Company Model
- **Deduplication**: By `domain` (preferred) or `name`
- **Method**: `Company.findOrCreate(companyData)`
- **Indexes**: `name`, `domain` (unique), `industry`

### Persona Model
- **Deduplication**: By `email` (preferred) or `linkedin_url` or `full_name`
- **Method**: `Persona.findOrCreate(personaData)`
- **Indexes**: `full_name`, `email` (sparse unique), `linkedin_url` (sparse unique)

### Lead Model
- **References**: `company_id`, `persona_id`
- **Status**: `"uploaded"` → `"researched"` → `"icp_scored"`
- **Indexes**: `company_id`, `persona_id`, `status`

## Frontend Updates

Both `leads/page.tsx` and `research/page.tsx` have been updated to:
- Fetch data from new API structure
- Display company and persona information correctly
- Show detected signals and ICP factor breakdowns
- Handle normalized data relationships

## Testing Checklist

- [ ] CSV upload creates companies, personas, and leads
- [ ] Multiple leads from same company share company record
- [ ] Research refresh updates normalized collections
- [ ] ICP scoring creates factor breakdowns
- [ ] Leads page displays all data correctly
- [ ] Research page shows company, persona, and ICP details
- [ ] Detected signals appear on research page
- [ ] ICP score breakdown shows factors

## Rollback Plan

If you need to rollback:
1. Restore from backup: `mongorestore backup-YYYYMMDD/`
2. Revert code to previous commit
3. Restart application

## Notes

- Old lead documents are marked with `_migrated: true` flag
- Migration script is idempotent (safe to run multiple times)
- Deduplication uses case-insensitive matching
- Empty/unknown fields use appropriate defaults ("", [], 0, "Low" confidence)

## Support

For issues or questions:
1. Check MongoDB logs for errors
2. Verify all collections were created
3. Check application logs for API errors
4. Review migration script output for failed records

