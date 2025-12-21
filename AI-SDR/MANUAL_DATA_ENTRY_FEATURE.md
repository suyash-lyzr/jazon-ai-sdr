# Manual Data Entry Feature - Research & ICP Analysis Page

## Overview
Added manual data entry functionality to the Research & ICP Analysis page via an intuitive sidebar interface. Users can edit entire sections (Company or Persona) at once, with all fields prefilled with AI research data and fully editable.

## Changes Made

### 1. New API Endpoint
**File**: `src/app/api/leads/[id]/update-field/route.ts`

Created a `PATCH` endpoint that allows updating individual fields across different database collections:

- **Company fields**: industry, employee_count, annual_revenue_usd, keywords, sales_motion, headquarters, linkedin_url, website_url
- **Persona fields**: seniority, reports_to, department, location, responsibilities, pain_points, decision_authority
- **Technographic**: Can add new technologies
- **Detected Signals**: Can add new buying signals
- **Lead fields**: Direct lead properties

**Usage**:
```typescript
PATCH /api/leads/[id]/update-field
Body: {
  field: "industry",
  value: "Software",
  target: "company"
}
```

### 2. Frontend Updates
**File**: `src/app/research/page.tsx`

Added comprehensive edit functionality with sidebar UI:

#### New UI Components
- **Single "Edit" button per section** (Company Analysis, Persona Analysis)
- **Sidebar panel** that slides in from the right
- All fields in the section displayed together
- Prefilled with current AI research data
- Support for different input types:
  - Text input (single line)
  - Textarea (multi-line)
  - Number input
  - Array input (one item per line)

#### Editable Sections

**Company Analysis - Single Edit Button Opens:**
- ✏️ Industry (text)
- ✏️ Employee Count (number)
- ✏️ Annual Revenue (number)
- ✏️ Headquarters (text)
- ✏️ LinkedIn URL (text)
- ✏️ Website URL (text)
- ✏️ Tech Stack / Keywords (array)
- ✏️ Sales Motion (textarea)

**Persona Analysis - Single Edit Button Opens:**
- ✏️ Seniority (text)
- ✏️ Reports To (text)
- ✏️ Department (text)
- ✏️ Location (text)
- ✏️ Key Responsibilities (array)
- ✏️ Pain Points (array)
- ✏️ Decision Authority Rationale (textarea)
- ✏️ Decision Maker Likelihood (text)

#### State Management
- `editSidebar` state: Manages sidebar visibility and which section is being edited
- `editFormData` state: Holds all field values for the section being edited
- `isSaving` state: Loading state for save operations
- Auto-refresh after successful batch save

#### Functions
- `openEditSidebar(section)`: Opens the sidebar with all fields for the selected section prefilled
- `saveEditedSection()`: Saves all modified fields in batch to the database and refreshes lead data

## How to Use

### For Users
1. Navigate to the Research & ICP Analysis page
2. Select a lead from the dropdown
3. Click the "Edit" button in the Company Analysis or Persona Analysis card header
4. A sidebar slides in from the right with all editable fields
5. All fields are prefilled with AI research data - edit any field you want to update:
   - For arrays (like responsibilities or pain points): Enter one item per line
   - For text: Enter the value directly
   - For numbers: Enter numeric values only
   - For URLs: Enter full URLs
6. Click "Save All Changes" to persist all updates to the database
7. The page automatically refreshes with all updated data

### Benefits of Sidebar Approach
- ✅ **Single edit point** per section instead of multiple small buttons
- ✅ **See all fields at once** in an organized form
- ✅ **Batch updates** - save multiple changes together
- ✅ **Cleaner UI** - no clutter of edit icons everywhere
- ✅ **Better UX** - natural flow for editing related information
- ✅ **Context preserved** - can see the main page while editing

## Data Flow

```
User clicks "Edit" button on section
    ↓
Sidebar opens with all fields prefilled
    ↓
User edits multiple fields as needed
    ↓
User clicks "Save All Changes"
    ↓
Frontend calls PATCH /api/leads/[id]/update-field for each modified field
    ↓
Backend updates appropriate collections (Company, Persona, etc.)
    ↓
Frontend fetches updated lead data
    ↓
Sidebar closes and UI refreshes with new values
```

## Database Updates

The API intelligently handles updates across the normalized schema:

- **Simple fields**: Direct update to the target collection
- **Nested fields**: Uses dot notation (e.g., `company_size.employee_count`)
- **Arrays**: Converts newline-separated input to array format
- **References**: Maintains referential integrity between Lead, Company, and Persona
- **Batch processing**: Multiple fields can be updated in sequence

## Validation

- Required field validation at the MongoDB schema level
- Type validation (string, number, array)
- Enum validation for fields like `confidence`, `strength`, etc.
- Error handling with user-friendly messages
- Empty fields are skipped (won't overwrite with empty values)

## UI/UX Features

1. **Responsive Sidebar**: 400px on mobile, 540px on desktop
2. **Scrollable Content**: Long forms scroll within the sidebar
3. **Cancel Option**: Close sidebar without saving changes
4. **Loading State**: "Saving..." indicator during updates
5. **Field Labels**: Clear labels with placeholder examples
6. **Organized Layout**: Logical grouping of related fields

## Testing

To test the feature:
1. Import a lead via CSV
2. Run the refresh to get AI research data
3. Navigate to Research & ICP Analysis page
4. Click "Edit" on Company Analysis
5. Verify all fields are prefilled with data
6. Modify several fields
7. Click "Save All Changes"
8. Verify sidebar closes and data updates on main page
9. Refresh page to confirm persistence
10. Repeat for Persona Analysis section

## Notes

- Only works for database leads (not mock data)
- "Edit" button only appears when `selectedLeadData` is available
- Changes are immediate and persistent
- Fields with no data show empty but are still editable
- All fields are optional - can update just one or all of them
- Real-time validation happens at the schema level

