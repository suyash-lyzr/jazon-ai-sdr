# Jazon AI SDR - Quick Start Guide

This guide will help you get the Jazon AI SDR platform up and running in minutes.

## Prerequisites

- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Terminal**: Command line access

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd "/Users/suyashmankar/Desktop/LYZR/Jazon - AI SDR/AI-SDR-APP/AI-SDR"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- Tailwind CSS v4
- Radix UI components
- TypeScript

### 3. Run Development Server

```bash
npm run dev
```

### 4. Open in Browser

Navigate to: **http://localhost:3000**

The application should now be running!

## Application Structure

### Main Navigation (Left Sidebar)

1. **Dashboard** - Business impact overview with KPI cards and AI decision feed
2. **Leads** - Complete lead database with detail drawers
3. **Research & ICP** - Company analysis and ICP scoring
4. **Outreach Engine** - Multi-channel strategy and message tracking
5. **Conversations** - Unified communication timeline
6. **Qualification** - BANT framework with confidence scoring
7. **Meetings & Handoffs** - AE-ready handoff packages
8. **CRM Sync** - Integration transparency and audit logs
9. **Learning Loop** - AI improvement insights
10. **Settings** - Governance and configuration

### Key Features to Explore

#### Dashboard
- View overall KPIs (leads processed, qualification rate, meetings booked)
- Explore the "Decision Feed" showing AI transparency
- Check quality metrics like ICP accuracy

#### Leads Page
- **Click any lead** to open the detail drawer
- View full activity timeline
- See AI recommendations with explanations
- Check ICP scores and triggers

#### Research & ICP
- Examine detailed company and persona analysis
- Review ICP score breakdown with weighted factors
- See detected buying triggers

#### Qualification
- Explore BANT criteria with confidence scores
- Understand "Known vs Unknown" indicators
- Read AI reasoning for recommendations

#### Meetings & Handoffs
- **Click "View Handoff Pack"** to see complete AE briefing
- Review qualification notes and objections
- Check suggested talk tracks

### Sample Data Available

The app includes realistic mock data for:

- **Sarah Chen** (Accenture) - High ICP score, voice escalation
- **Marcus Johnson** (Deloitte) - Active engagement
- **Lisa Park** (NTT Data) - Meeting scheduled
- **David Kumar** (AirAsia) - Research stage
- **Jennifer Wu** (Enterprise Software Corp) - Disqualified

## Production Build

### Build for Production

```bash
npm run build
```

### Run Production Server

```bash
npm start
```

The production build will be optimized and ready for deployment.

## Deployment Options

This Next.js application can be deployed to:

- **Vercel** (Recommended - one-click deployment)
- **Netlify**
- **AWS** (Amplify, EC2, ECS)
- **Google Cloud** (Cloud Run, App Engine)
- **Azure** (App Service)
- **Docker** (self-hosted)

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy with default settings
4. Done!

## Customization

### Updating Mock Data

Edit `/src/lib/mock-data.ts` to customize:
- Lead information
- Company data
- ICP scores
- Conversation histories
- Meeting details

### Changing Colors

The app uses the Lyzr Design System. Colors are defined in:
- `/src/app/globals.css` - CSS variables
- Tailwind automatically uses these variables

### Modifying Navigation

Edit `/src/components/jazon-sidebar.tsx` to:
- Add/remove navigation items
- Change page order
- Update icons

## Common Issues

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or run on different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Check TypeScript errors
npm run build

# Run linter
npm run lint
```

## Enterprise Demo Tips

### For CIO Audience
- Focus on **CRM Sync** and **Settings/Admin** pages
- Emphasize audit logs and governance
- Show compliance features

### For Head of Sales
- Start with **Dashboard** for business impact
- Dive into **Qualification** to show BANT rigor
- Highlight **Meetings & Handoffs** for AE enablement

### For RevOps Leaders
- Showcase **Learning Loop** for continuous improvement
- Review **Research & ICP** for scoring transparency
- Demonstrate **Outreach Engine** for strategy control

## Key Differentiators to Highlight

1. **Explainability** - Every AI decision has clear reasoning
2. **Voice as Escalation** - Not voice-first, but strategic voice use
3. **Early Disqualification** - Saves AE time on poor-fit leads
4. **Enterprise Governance** - Audit trails, compliance, RBAC
5. **Continuous Learning** - AI improves based on outcomes

## Support

For questions or issues:
- Review this guide
- Check README.md for detailed documentation
- Examine mock data structure in `/src/lib/mock-data.ts`

## Next Steps

1. Explore each page in the navigation
2. Click through lead details and handoff packages
3. Review the decision feed on the dashboard
4. Customize mock data for your demo scenario
5. Build for production when ready

---

**Ready to impress enterprise clients!**

