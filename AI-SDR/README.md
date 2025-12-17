# Jazon - Enterprise AI SDR Platform

A high-fidelity concept application showcasing an autonomous AI Sales Development Representative (SDR) platform designed for enterprise clients.

## Overview

Jazon is an enterprise-grade AI SDR platform that demonstrates:

- **Decision-first UX**: Every AI action is explained with transparent reasoning
- **Multi-channel orchestration**: Strategic escalation across email, LinkedIn, and voice
- **Systematic qualification**: BANT framework with confidence scoring
- **Enterprise credibility**: CRM sync, audit logs, and governance controls
- **Continuous learning**: AI improvement through data-driven insights

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **UI Framework**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI + shadcn/ui
- **Icons**: Tabler Icons + Lucide React
- **State Management**: React state (no external state libraries)

## Project Structure

```
AI-SDR/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── leads/             # Leads management
│   │   ├── research/          # Research & ICP analysis
│   │   ├── outreach/          # Outreach strategy
│   │   ├── conversations/     # Unified conversation view
│   │   ├── qualification/     # BANT qualification
│   │   ├── meetings/          # Meetings & AE handoffs
│   │   ├── crm-sync/          # CRM integration
│   │   ├── learning/          # AI learning loop
│   │   └── settings/          # Settings & admin
│   ├── components/
│   │   ├── jazon-sidebar.tsx  # Custom navigation sidebar
│   │   ├── jazon-header.tsx   # App header with workspace selector
│   │   └── ui/                # Reusable UI components
│   └── lib/
│       ├── mock-data.ts       # Comprehensive mock data
│       └── utils.ts           # Utility functions
├── public/                     # Static assets
└── package.json
```

## Key Features

### 1. Dashboard
- **KPI Overview**: Leads processed, qualification rate, meetings booked
- **Decision Feed**: Real-time AI decision transparency
- **Quality Metrics**: ICP accuracy and voice escalation success

### 2. Leads Management
- **System of Record**: Complete lead database with AI insights
- **Detail Drawers**: Deep-dive into individual leads
- **Activity Timeline**: All interactions across channels
- **AI Recommendations**: Clear next-step guidance

### 3. Research & ICP
- **Company Analysis**: Deep company intelligence
- **Persona Insights**: Decision-maker profiling
- **Trigger Detection**: Buying signals identification
- **Scoring Breakdown**: Transparent ICP calculation

### 4. Outreach Engine
- **Multi-channel Strategy**: Email → LinkedIn → Voice escalation
- **Message Personalization**: Annotated personalization elements
- **Guardrails**: Safety controls and compliance
- **Channel Analytics**: Performance by channel

### 5. Conversations
- **Unified Timeline**: All communications in one view
- **Voice Call Summaries**: AI-generated call insights
- **Objection Tracking**: Identified concerns and responses
- **Channel Breakdown**: Communication analytics

### 6. Qualification
- **BANT Framework**: Need, Timeline, Authority, Budget
- **Confidence Scoring**: Each criterion with confidence levels
- **Known vs Unknown**: Clear visibility on gaps
- **AI Reasoning**: Transparent recommendation logic

### 7. Meetings & Handoffs
- **AE Handoff Packages**: Complete briefing documents
- **Research Summaries**: Key company and persona insights
- **Objection Lists**: All concerns raised during qualification
- **Talk Tracks**: Suggested conversation approaches
- **Why Booked**: Clear explanation of meeting booking rationale

### 8. CRM Sync
- **Field Mappings**: Transparent data flow
- **Audit Trail**: All CRM writes logged
- **Permissions**: Clear read/write boundaries
- **Governance**: Enterprise compliance features

### 9. Learning Loop
- **What Worked**: Successful patterns identified
- **What Didn't Work**: Ineffective approaches corrected
- **Model Improvements**: AI algorithm updates
- **Performance Metrics**: Continuous improvement tracking

### 10. Settings & Admin
- **ICP Definition**: Customizable ideal customer profile
- **Qualification Rules**: BANT threshold configuration
- **Voice Escalation**: When to use voice qualification
- **Compliance**: Audit logs and data governance
- **Team Management**: Roles and permissions

## Design Principles

### Enterprise-First
- Calm, professional interface
- Muted color palette
- Clear hierarchy and spacing
- No flashy animations or emojis

### Explainability
- Every AI decision includes reasoning
- Transparent confidence scores
- Clear cause-and-effect relationships
- "Why Jazon did this" sections throughout

### Trust & Credibility
- Audit trails for all actions
- Known vs unknown indicators
- No black-box AI decisions
- Enterprise governance controls

### Voice as Escalation
- Voice is not the primary channel
- Strategic use for high-value qualification
- Clear triggers for voice escalation
- Transparent reasoning for voice use

## Mock Data

All functionality uses realistic mock data with:
- Simulated async delays for "AI thinking"
- Realistic company names (Accenture, Deloitte, NTT Data, AirAsia)
- Complete conversation histories
- Detailed qualification data
- Learning insights and model improvements

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

```bash
# Open in browser
http://localhost:3000
```

The application will hot-reload as you make changes to the code.

## Enterprise Demo Readiness

This application is designed to be shown to:
- **CIOs**: Focus on governance, security, and integration
- **Heads of Sales**: Emphasize qualification quality and AE handoffs
- **Revenue Operations**: Highlight learning loop and continuous improvement
- **IT Security**: Demonstrate audit trails and compliance features

## Key Differentiators

1. **Transparency**: Unlike black-box AI, every decision is explained
2. **Strategic Voice**: Voice as qualification accelerator, not cold outreach
3. **Quality over Quantity**: Early disqualification saves AE time
4. **Enterprise Governance**: Audit logs, GDPR compliance, role-based access
5. **Continuous Learning**: AI improves weekly based on outcomes

## Design System

Built on the Lyzr AI Design System featuring:
- **Typography**: Switzer font with carefully crafted scales
- **Colors**: Semantic color system with light/dark mode support
- **Components**: Consistent, accessible Radix UI components
- **Spacing**: 4px base unit for mathematical spacing
- **Shadows**: Subtle elevation system for depth

## License

Proprietary - Demonstration purposes only

## Credits

Built with the Lyzr AI Design System and modern web technologies.

