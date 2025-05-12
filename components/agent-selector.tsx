"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, RefreshCw, Sparkles, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Agent } from "@/lib/data"

interface AgentSelectorProps {
  agents: Agent[]
  selectedAgent: Agent
  onSelectAgent: (agent: Agent) => void
  onCompare: () => void
}

export default function AgentSelector({ agents, selectedAgent, onSelectAgent, onCompare }: AgentSelectorProps) {
  const [showAll, setShowAll] = useState(false)

  const handlePrevAgent = () => {
    const currentIndex = agents.findIndex((agent) => agent.id === selectedAgent.id)
    const prevIndex = currentIndex === 0 ? agents.length - 1 : currentIndex - 1
    onSelectAgent(agents[prevIndex])
  }

  const handleNextAgent = () => {
    const currentIndex = agents.findIndex((agent) => agent.id === selectedAgent.id)
    const nextIndex = currentIndex === agents.length - 1 ? 0 : currentIndex + 1
    onSelectAgent(agents[nextIndex])
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-b p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-muted-foreground flex items-center">
          <Sparkles className="h-4 w-4 mr-1.5 text-blue-500" />
          AI Writer Agent
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={onCompare}>
            <Scale className="h-3.5 w-3.5 mr-1.5" />
            Compare Agents
          </Button>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Hide Agents" : "Show All Agents"}
          </Button>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAgent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Card className="border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-700">
                      <img
                        src={`/abstract-geometric-shapes.png?height=100&width=100&query=${selectedAgent.name} avatar`}
                        alt={selectedAgent.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {selectedAgent.isRecommended && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-medium">
                        Recommended
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedAgent.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded text-xs">
                        {selectedAgent.tone}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                        {selectedAgent.specialization}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm max-w-md">{selectedAgent.description}</p>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handlePrevAgent}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handleNextAgent}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {showAll && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-700 ${
                agent.id === selectedAgent.id
                  ? "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/50"
                  : ""
              }`}
              onClick={() => onSelectAgent(agent)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={`/abstract-geometric-shapes.png?height=100&width=100&query=${agent.name} avatar`}
                        alt={agent.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {agent.isRecommended && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] rounded-full px-1 py-0.5 font-medium">
                        ✓
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-sm">{agent.name}</h3>
                    <div className="text-xs text-muted-foreground">{agent.tone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="mt-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 mr-1.5" />
            How are agents selected?
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About AI Writer Agents</DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-4">
            <p>
              AI Writer Agents are specialized language models trained to write in specific styles, tones, and with
              domain expertise.
            </p>
            <p>The recommended agent is automatically selected based on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The funding program requirements</li>
              <li>Your company's sector and size</li>
              <li>Previous successful applications in similar contexts</li>
              <li>The specific section you're working on</li>
            </ul>
            <p>You can switch agents at any time to compare different writing styles and approaches.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
