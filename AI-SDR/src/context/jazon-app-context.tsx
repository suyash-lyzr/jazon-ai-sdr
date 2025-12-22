"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { Lead, mockLeads } from "@/lib/mock-data"

export type CompanyProfile = {
  companyName: string
  website: string
  productDescription: string
  targetCustomers: string
  primaryUseCase: string
  valueProps: string
}

export type AgentInstructions = {
  tone: "formal" | "consultative"
  allowedChannels: {
    email: boolean
    linkedin: boolean
    voice: boolean
  }
  voiceEscalationRules: string
  qualificationStrictness: "low" | "medium" | "high"
  excludedIndustries: string
}

export type JazonAppContextValue = {
  leads: Lead[]
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>
  companyProfile: CompanyProfile
  setCompanyProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>
  agentInstructions: AgentInstructions
  setAgentInstructions: React.Dispatch<React.SetStateAction<AgentInstructions>>
}

const defaultCompanyProfile: CompanyProfile = {
  companyName: "LYZR",
  website: "https://lyzr.ai",
  productDescription: "LYZR is an AI agent platform that enables businesses to build, deploy, and manage production-ready AI agents without coding. Our platform provides a complete infrastructure for creating intelligent agents that can handle complex workflows, integrate with existing systems, and scale automatically.",
  targetCustomers: "Enterprise companies, mid-market businesses, and startups looking to automate workflows, enhance customer support, streamline operations, and build AI-powered applications. Ideal for companies in SaaS, fintech, healthcare, e-commerce, and professional services.",
  primaryUseCase: "Building and deploying AI agents for customer support, sales automation, data processing, workflow automation, and intelligent document handling. Companies use LYZR to create AI assistants, chatbots, and automated systems that integrate with their existing tech stack.",
  valueProps: "• No-code AI agent builder - Create production-ready agents without engineering resources\n• Enterprise-grade infrastructure - Built-in security, compliance, and scalability\n• Seamless integrations - Connect with CRM, databases, APIs, and business tools\n• Rapid deployment - Go from concept to production in days, not months\n• Cost-effective automation - Reduce operational costs while improving efficiency\n• Customizable and extensible - Tailor agents to specific business needs",
}

const defaultAgentInstructions: AgentInstructions = {
  tone: "consultative",
  allowedChannels: {
    email: true,
    linkedin: true,
    voice: true,
  },
  voiceEscalationRules:
    "Escalate to voice when ICP score >= 80 and there are 2+ positive engagements across email or LinkedIn.",
  qualificationStrictness: "medium",
  excludedIndustries: "None",
}

const JazonAppContext = createContext<JazonAppContextValue | undefined>(undefined)

export function JazonAppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(
    defaultCompanyProfile,
  )
  const [agentInstructions, setAgentInstructions] =
    useState<AgentInstructions>(defaultAgentInstructions)

  return (
    <JazonAppContext.Provider
      value={{
        leads,
        setLeads,
        companyProfile,
        setCompanyProfile,
        agentInstructions,
        setAgentInstructions,
      }}
    >
      {children}
    </JazonAppContext.Provider>
  )
}

export function useJazonApp() {
  const ctx = useContext(JazonAppContext)
  if (!ctx) {
    throw new Error("useJazonApp must be used within a JazonAppProvider")
  }
  return ctx
}
