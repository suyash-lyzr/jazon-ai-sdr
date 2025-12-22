# Outreach Copy View & Edit Feature

## Overview
Added a "View AI-Generated Copy" button to each channel step in the Outreach Campaign page, allowing users to view and edit the AI-generated email, LinkedIn, and voice call scripts.

## Changes Made

### 1. New State Variables
**File**: `AI-SDR/src/app/outreach/page.tsx`

Added state management for the copy dialog:
```typescript
const [copyDialogOpen, setCopyDialogOpen] = useState(false);
const [selectedStepCopy, setSelectedStepCopy] = useState<any>(null);
const [editingCopy, setEditingCopy] = useState(false);
const [editedCopyData, setEditedCopyData] = useState<any>(null);
```

### 2. "View AI-Generated Copy" Button
Added to each channel step in the strategy section:

**Location**: After the channel goal description (around line 1161)

**Features**:
- Displays for all channels (Email, LinkedIn, Voice)
- Disabled if no copy data is available
- Finds the matching copy draft based on step number
- Opens a dialog showing the AI-generated copy

### 3. Copy View/Edit Dialog
A comprehensive dialog component that:

#### Display Mode
- **Email**: Shows subject line options and email body
- **LinkedIn**: Shows LinkedIn message
- **Voice**: Shows numbered talking points/script
- **All**: Shows personalization signals used and strategy alignment

#### Edit Mode
- Textareas for editing all copy fields
- Subject lines (one per line)
- Email/LinkedIn body text
- Voice talking points (separated by blank lines)

#### Save Functionality
- Saves edits via `/api/leads/[id]/outreach/override` endpoint
- Updates the specific draft in the `drafts` array
- Refetches outreach data to show updated copy
- Provides user feedback via status messages

## UI Components Used

### Dialog Structure
```tsx
<Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      {/* Icon + Title */}
    </DialogHeader>
    
    {/* Copy content (view or edit mode) */}
    
    <DialogFooter>
      {/* Close/Edit or Cancel/Save buttons */}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Channel-Specific Layouts

#### Email Copy
- **Subject Options**: List of subject lines in separate cards (view) or textarea (edit)
- **Body**: Formatted text in styled container (view) or textarea (edit)

#### LinkedIn Copy
- **Message**: Formatted text in styled container (view) or textarea (edit)

#### Voice Copy
- **Talking Points**: Numbered list with circular badges (view) or textarea (edit)
- Edit mode: Points separated by double newlines

### Additional Information
- **Personalization Signals**: Displayed as badge pills
- **Strategy Alignment**: Shown in a highlighted info box

## User Flow

1. **View Copy**:
   - User clicks "View AI-Generated Copy" button on a channel step
   - Dialog opens showing the AI-generated content for that step
   - User can see subject lines, body/message, talking points
   - Personalization signals and strategy alignment are displayed

2. **Edit Copy**:
   - User clicks "Edit Copy" button in the dialog
   - All fields become editable textareas
   - User modifies the content as needed
   - User clicks "Save Changes"
   - Backend saves the override
   - Dialog closes and data refreshes

3. **Cancel Editing**:
   - User clicks "Cancel" while editing
   - Changes are discarded
   - Original AI-generated copy is restored
   - User returns to view mode

## API Integration

### Endpoint Used
`PATCH /api/leads/[id]/outreach/override`

### Request Body
```json
{
  "scope": "outreach_copy",
  "entity_id": "copyRunId",
  "updates": {
    "drafts": [...] // Updated drafts array with edited draft
  },
  "path_prefix": "copy_output",
  "reason": "Manual UI edit via Copy Dialog"
}
```

### Response Handling
- Success: Refetches outreach data and closes dialog
- Error: Displays error message in status note

## Data Structure

### Copy Draft Object
```typescript
{
  step: number,
  channel: "Email" | "LinkedIn" | "Voice",
  
  // Email-specific
  subject_options?: string[],
  body?: string,
  
  // Voice-specific
  talking_points?: string[],
  
  // Common
  personalization_used?: string[],
  strategy_alignment?: string
}
```

## Styling & UX

### Visual Hierarchy
- Large dialog (max-w-4xl) for comfortable reading/editing
- Scrollable content area (max-h-[80vh])
- Clear separation between view and edit modes

### Colors & Badges
- Muted backgrounds for content areas
- Primary color for info boxes (strategy alignment)
- Secondary badges for personalization signals
- Numbered badges for voice talking points

### Responsive Design
- Dialog adapts to screen size
- Textareas expand with content
- Maintains readability on all screen sizes

## Testing Checklist

- [ ] Generate outreach for a lead
- [ ] Click "View AI-Generated Copy" on Email step
- [ ] Verify email subject lines and body display correctly
- [ ] Click "Edit Copy" and modify content
- [ ] Click "Save Changes" and verify data persists
- [ ] Repeat for LinkedIn step
- [ ] Repeat for Voice step (check numbered talking points)
- [ ] Verify personalization signals display correctly
- [ ] Test "Cancel" button reverts changes
- [ ] Test dialog closing without saving
- [ ] Verify status messages appear correctly
- [ ] Check console for any errors

## Future Enhancements

1. **Real-time Preview**: Show how the email/message will look when sent
2. **Template Variables**: Highlight and manage personalization tokens
3. **Version History**: Track all edits and allow reverting to previous versions
4. **A/B Testing**: Create multiple variants of copy for testing
5. **AI Re-generation**: Button to regenerate copy with new parameters
6. **Copy Quality Score**: AI-powered assessment of copy quality
7. **Compliance Check**: Automated check for compliance rules
8. **Send Test**: Send a test email/message to verify formatting

## Known Limitations

1. Copy edits are stored as overrides, not in the original copy run
2. No version history or change tracking yet
3. Cannot regenerate individual drafts (must regenerate entire outreach)
4. No validation for required fields or format
5. Personalization tokens are not dynamically replaced in preview

## Troubleshooting

### Copy button is disabled
- Check if `outreachData?.copy?.drafts` exists
- Verify the copy agent ran successfully
- Check console for API errors

### Copy doesn't display
- Check if the step number matches between strategy and copy
- Verify `draft.step === channel.step`
- Inspect `outreachData.copy.drafts` in browser DevTools

### Edits don't save
- Check Network tab for `/api/leads/[id]/outreach/override` response
- Verify the copy run ID is available in `outreachData.copy._id`
- Check backend logs for parsing errors
- Ensure the override API endpoint is working correctly

### Dialog doesn't close after saving
- Check if the save promise is resolving correctly
- Verify `setCopyDialogOpen(false)` is being called
- Check console for JavaScript errors

