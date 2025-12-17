"use client"

import { ReactNode } from "react"
import { JazonAppProvider } from "@/context/jazon-app-context"

export function JazonAppShell({ children }: { children: ReactNode }) {
  return <JazonAppProvider>{children}</JazonAppProvider>
}

