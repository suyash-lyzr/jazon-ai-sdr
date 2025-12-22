# Outreach Campaign Page Fixes

## Problem Identified
The Outreach Strategy Agent and Outreach Copy Agent were returning JSON wrapped in markdown code fences:
```
```json
{
  "strategy_status": "READY",
  ...
}
```
```

The parsing logic wasn't stripping these markdown fences before attempting to parse the JSON, causing the data to fail parsing and not display on the UI.

## Changes Made

### 1. Updated Agent Response Parsing
**File**: `AI-SDR/src/app/api/leads/[id]/outreach/generate/route.ts`

**Strategy Agent Parsing** (lines ~125-143):
- Added logic to strip markdown code fences (` ```json\n ... \n``` `)
- Properly handle both string and object responses
- Added error logging with stack traces

**Copy Agent Parsing** (lines ~268-286):
- Same markdown fence stripping logic
- Consistent error handling

### 2. Added File Saving for Debugging
Both agent responses are now saved to JSON files in the `output/` directory:
- `outreach-strategy-agent-response-{leadId}-{timestamp}.json`
- `outreach-copy-agent-response-{leadId}-{timestamp}.json`

Each file contains:
- Lead information (ID, name, company)
- Timestamp
- Raw agent response
- Parsed data
- Input data sent to the agent

### 3. Added Console Logging
Added detailed logging to see the parsed output structure:
- `📊 Parsed Strategy Output:` - Shows the full parsed strategy object
- `📊 Parsed Copy Output:` - Shows the full parsed copy object

## Expected Data Structure

### Strategy Output
```json
{
  "strategy_status": "READY",
  "plan_summary": "...",
  "recommended_channel_sequence": [
    {
      "step": 1,
      "channel": "Email",
      "goal": "...",
      "reasoning": "...",
      "recommended_delay_hours": 48,
      "send_window": "Business hours only",
      "personalization_signals": [...],
      "gating_conditions": [...]
    },
    ...
  ],
  "voice_readiness": {...},
  "confidence_level": "High"
}
```

### Copy Output
```json
{
  "status": "DRAFT_READY",
  "drafts": [
    {
      "step": 1,
      "channel": "Email",
      "subject_options": [...],
      "body": "...",
      "personalization_used": [...],
      "strategy_alignment": "..."
    },
    ...
  ],
  "confidence_level": "Medium"
}
```

## Frontend Display

The Outreach Campaign page (`src/app/outreach/page.tsx`) correctly accesses:

### Strategy Data
- `outreachData.strategy.plan_summary`
- `outreachData.strategy.recommended_channel_sequence[]` - array of channel steps
- `outreachData.strategy.voice_readiness`
- `outreachData.strategy.confidence_level`

### Copy Data
- `outreachData.copy.drafts[]` - array of copy drafts for each step
- Each draft includes `channel`, `subject_options`, `body`, `talking_points`, etc.

### Campaign Data
- `outreachData.campaign.status`
- `outreachData.campaign.current_step_number`
- `outreachData.campaign.next_planned_action`

## Testing Steps

1. **Regenerate Outreach**:
   - Go to the Outreach Campaign page
   - Select a lead
   - Click "Generate Outreach" (or "Regenerate Outreach" if already generated)

2. **Check Console Logs**:
   - Open browser DevTools (F12)
   - Check the Network tab for `/api/leads/[id]/outreach/generate` response
   - Check the Console tab for any errors

3. **Check Terminal Logs**:
   - Look for `📊 Parsed Strategy Output:` and `📊 Parsed Copy Output:`
   - Verify the JSON structure matches expected format
   - Check for `💾 Strategy response saved to:` messages

4. **Check Output Files**:
   - Navigate to `AI-SDR/output/` directory
   - Open the latest `outreach-strategy-agent-response-*.json` file
   - Verify `parsedStrategyData` is a proper JSON object (not a string with code fences)

5. **Check UI Display**:
   - Verify "AI-Generated Outreach Strategy" section shows all channel steps
   - Each step should display: channel icon, goal, reasoning, delay, signals
   - Verify "AI-Generated Outreach Copy" section shows all copy drafts
   - Each draft should display: channel, subject options (email), body/talking points

## Troubleshooting

### If strategy/copy still doesn't show:

1. **Check the database**:
   ```javascript
   // In MongoDB shell or Compass
   db.outreachstrategyruns.find({ lead_id: ObjectId("YOUR_LEAD_ID") })
   db.outreachcopyruns.find({ lead_id: ObjectId("YOUR_LEAD_ID") })
   ```

2. **Check API response**:
   - Navigate to `/api/leads/[id]/outreach` in browser
   - Verify `data.strategy` and `data.copy` are populated

3. **Check agent instructions**:
   - Ensure agents are configured to return valid JSON
   - Check if agents have the correct output schema

4. **Re-save with corrected parsing**:
   - Delete existing strategy/copy runs from database
   - Regenerate outreach with the updated parsing logic

## Next Steps

After verifying the fixes work:
1. Test with multiple leads
2. Verify edit functionality works correctly
3. Test the full outreach workflow end-to-end
4. Consider adding validation for agent responses
5. Add user-friendly error messages if parsing fails

