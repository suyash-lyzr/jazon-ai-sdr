# Campaign Performance View - Visual Structure

## Page Layout (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────┐
│  Campaign Header (existing)                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Tabs: Campaign | Knowledge | Strategy | Leads | Scheduling |   │
│        ► PERFORMANCE ◄                                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  SECTION A: Performance Summary (6 Cards)                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │Total │ │Msgs  │ │Open  │ │Reply │ │Meet  │ │Unsub │         │
│  │Leads │ │Sent  │ │Rate  │ │Rate  │ │Booked│ │      │         │
│  │  42  │ │ 156  │ │ 45%  │ │ 12%  │ │  8   │ │  2   │         │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  SECTION B: Campaign Funnel                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Leads Added      ████████████████████████████████  42 100%│  │
│  │ Contacted        ██████████████████████████████    40  95%│  │
│  │ Opened           ████████████████████              32  76%│  │
│  │ Replied          ██████████                        15  36%│  │
│  │ Qualified        ████                              10  24%│  │
│  │ Meetings Booked  ███                                8  19%│  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  SECTION C: Channel Performance                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Channel   │ Sent │ Open Rate │ Reply Rate │ Meetings      │  │
│  ├───────────┼──────┼───────────┼────────────┼───────────────┤  │
│  │ Email     │ 156  │    45%    │    12%     │      8        │  │
│  │ LinkedIn  │  42  │     —     │     7%     │      2        │  │
│  │ Call      │  12  │     —     │     —      │      1        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  SECTION D: Email Step Performance                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Step Name              │Sent│Open%│Reply%│Drop-off%       │  │
│  ├────────────────────────┼────┼─────┼──────┼────────────────┤  │
│  │ Pain Point Email       │ 42 │ 48% │ 14%  │    12%         │  │
│  │ Agitation Email        │ 37 │ 43% │ 18%  │    19%         │  │
│  │ Initial Solution Email │ 30 │ 40% │ 10%  │    23%         │  │
│  │ Social Proof Email     │ 23 │ 39% │  9%  │    26%         │  │
│  │ First Offer Email      │ 17 │ 35% │ 12%  │     —          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  SECTION E: AI Insights (Beta) 🎯                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  • "Agitation Email" drives the highest reply rate (18%).  │  │
│  │  • Campaign converts at 19.0% from leads to meetings.      │  │
│  │  • Strong email engagement detected with 45% open rate.    │  │
│  │  • High reply rate (12%) indicates strong message fit.     │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  SECTION F: Lead Outcomes (Clickable Table)                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │Lead           │Company    │Step│Last Msg   │Outcome       │  │
│  ├───────────────┼───────────┼────┼───────────┼──────────────┤  │
│  │John Smith     │Acme Corp  │ 3  │ Jan 5     │ [Replied]    │  │
│  │jane@tech.com  │           │    │           │              │  │
│  ├───────────────┼───────────┼────┼───────────┼──────────────┤  │
│  │Sarah Johnson  │Beta Inc   │ 5  │ Jan 4     │ [Booked]     │  │
│  │sarah@beta.com │           │    │           │              │  │
│  ├───────────────┼───────────┼────┼───────────┼──────────────┤  │
│  │Mike Davis     │Gamma LLC  │ 2  │ Jan 3     │ No response  │  │
│  │mike@gamma.com │           │    │           │              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  (Click any row to view full lead details)                       │
└──────────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Summary Cards
- Background: White/Card background
- Text: Muted foreground for labels
- Numbers: Bold, large, primary text

### Funnel
- Leads Added → Contacted: `bg-blue-500` → `bg-blue-400`
- Contacted → Opened: `bg-blue-400` → `bg-blue-300`
- Opened → Replied: `bg-blue-300` → `bg-green-400`
- Replied → Qualified: `bg-green-400` → `bg-green-300`
- Qualified → Meetings: `bg-green-300` → `bg-green-500`

### Tables
- Headers: Medium weight, small text
- Rows: Hover effect with muted background
- Borders: Subtle, bottom borders only

### AI Insights
- Background: `bg-primary/5` (light primary tint)
- Border: `border-primary/20`
- Icon: `text-primary`
- Badge: Outline variant with "Beta" label

### Outcome Badges
- **Booked**: Default variant (primary color)
- **Replied**: Secondary variant
- **Disqualified**: Destructive variant (red)
- **No response**: Outline variant (neutral)

## Responsive Behavior

### Desktop (lg+)
- Summary cards: 6 columns
- Tables: Full width, all columns visible
- Funnel: Horizontal bars with labels

### Tablet (md)
- Summary cards: 3 columns (2 rows)
- Tables: Horizontal scroll if needed
- Funnel: Same as desktop

### Mobile (sm)
- Summary cards: 2 columns (3 rows)
- Tables: Horizontal scroll
- Funnel: Stacked vertical bars

## Interaction States

### Hover
- Lead outcome rows: `hover:bg-muted/50`
- Tables: Subtle background change
- Cards: No hover effect (static display)

### Click
- Lead rows: Opens existing lead side panel
- Other elements: No click actions (read-only)

### Loading
- Shows "—" for missing data
- Empty states with helpful messages
- No skeleton loaders (instant render)

## Empty States

### No Leads
```
┌────────────────────────────────────┐
│  No leads in campaign yet          │
└────────────────────────────────────┘
```

### No Channel Activity
```
┌────────────────────────────────────┐
│  No channel activity yet           │
└────────────────────────────────────┘
```

### No Email Steps
```
┌────────────────────────────────────┐
│  No email step activity yet        │
└────────────────────────────────────┘
```

### No Insights
```
┌────────────────────────────────────┐
│  Insights will appear here as      │
│  campaign data accumulates         │
└────────────────────────────────────┘
```

## Data Flow

```
User Opens Campaign
        ↓
Loads Performance Tab
        ↓
API Call: GET /api/outreach-campaigns/[id]/activity
        ↓
Backend Aggregates:
  - Prospect metrics
  - Event data
  - Channel stats
  - Step progression
  - AI insights
        ↓
Returns JSON with all sections
        ↓
Frontend Renders:
  ✓ Summary cards
  ✓ Funnel visualization
  ✓ Channel table
  ✓ Step table
  ✓ Insights box
  ✓ Lead outcomes table
        ↓
User Can:
  → View all metrics
  → Click leads for details
  → Scroll through tables
  ✗ Cannot modify data
  ✗ Cannot trigger actions
```

## Key Features

✅ **Read-Only**: All views are informational only  
✅ **Fast Load**: Single API call, no pagination  
✅ **Graceful Degradation**: Shows "—" for missing data  
✅ **Responsive**: Works on all screen sizes  
✅ **Accessible**: Semantic HTML, proper table structure  
✅ **Consistent**: Matches existing Jazon design system  
✅ **Extensible**: Easy to add more sections in v2  

## Performance Characteristics

- **Load Time**: < 1 second for typical campaign (< 100 leads)
- **API Response**: Single aggregated payload
- **Rendering**: Instant (no charts, simple tables)
- **Memory**: Minimal (no complex state management)
- **Network**: One request per tab view
