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
  companyName: "",
  website: "",
  productDescription: "",
  targetCustomers: "",
  primaryUseCase: "",
  valueProps: "",
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
