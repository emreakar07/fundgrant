export interface Company {
  id: string
  name: string
  sector: string
  size: string
  financials: {
    revenue: number
    employees: number
    yearFounded: number
  }
}

export interface Project {
  id: string
  name: string
  sector: string
  fundingAmount: number
  deadline: string
  companyId?: string
  eligibilityCriteria: string[]
  coveredExpenses: string[]
  evaluationCriteria: {
    name: string
    weight: number
  }[]
}

export interface Agent {
  id: string
  name: string
  tone: string
  specialization: string
  description: string
  isRecommended: boolean
}

export interface Section {
  id: string
  title: string
  description: string
  content: string
  wordCount: number
  status: "not_started" | "draft" | "completed"
  required: boolean
  hasWarning: boolean
}

export interface Analysis {
  question: string
  answer: string
}

export interface ReferenceDocument {
  id: string
  title: string
  description: string
  type: string
  isPreviousApplication: boolean
}

// Mock data for the application
export const mockData = {
  company: {
    id: "comp-1",
    name: "EcoTech Solutions",
    sector: "Clean Energy",
    size: "SME (45 employees)",
    financials: {
      revenue: 2500000,
      employees: 45,
      yearFounded: 2015,
    },
  } as Company,

  project: {
    id: "proj-1",
    name: "EU Green Innovation Fund",
    sector: "Sustainability",
    fundingAmount: 750000,
    deadline: "2025-06-15",
    companyId: "comp-1",
    eligibilityCriteria: [
      "European-based SME",
      "Operating for at least 3 years",
      "Innovative solution with environmental impact",
      "Minimum 20% co-financing",
      "Compliance with EU environmental regulations",
    ],
    coveredExpenses: [
      "Research & Development costs",
      "Equipment and materials",
      "Personnel costs (up to 40% of total)",
      "External expertise and services",
      "Travel and accommodation (up to 10% of total)",
    ],
    evaluationCriteria: [
      { name: "Innovation Level", weight: 30 },
      { name: "Environmental Impact", weight: 25 },
      { name: "Economic Viability", weight: 20 },
      { name: "Implementation Plan", weight: 15 },
      { name: "Team Expertise", weight: 10 },
    ],
  } as Project,

  agents: [
    {
      id: "agent-1",
      name: "Technical Expert",
      tone: "Precise & Technical",
      specialization: "Clean Energy & Engineering",
      description:
        "Writes with technical accuracy and precision, ideal for technical sections and methodology descriptions.",
      isRecommended: true,
    },
    {
      id: "agent-2",
      name: "EU Policy Specialist",
      tone: "Formal",
      specialization: "EU Funding & Policy",
      description:
        "Specializes in EU policy language and funding requirements, ensuring compliance with EU expectations.",
      isRecommended: false,
    },
    {
      id: "agent-3",
      name: "Impact Storyteller",
      tone: "Persuasive",
      specialization: "Social & Environmental Impact",
      description: "Creates compelling narratives about project impact and benefits, ideal for executive summaries.",
      isRecommended: false,
    },
    {
      id: "agent-4",
      name: "Financial Analyst",
      tone: "Analytical",
      specialization: "Budgets & Financial Planning",
      description: "Excels at presenting financial data and economic justifications in a clear, convincing manner.",
      isRecommended: false,
    },
    {
      id: "agent-5",
      name: "Implementation Planner",
      tone: "Structured",
      specialization: "Project Management",
      description: "Focuses on clear, realistic implementation plans with well-defined milestones and risk management.",
      isRecommended: false,
    },
  ] as Agent[],

  sections: [
    {
      id: "section-1",
      title: "Executive Summary",
      description: "Brief overview of the project, its objectives, and expected outcomes",
      content:
        "Our company, EcoTech Solutions, is applying for the EU Green Innovation Fund to develop and scale our revolutionary solar energy storage solution. We believe this technology will significantly reduce carbon emissions while making renewable energy more accessible and reliable for European businesses and households. The requested funding of €750,000 will enable us to finalize our prototype, conduct field testing, and prepare for market entry within 18 months.",
      wordCount: 250,
      status: "completed",
      required: true,
      hasWarning: false,
    },
    {
      id: "section-2",
      title: "Problem Statement",
      description: "Clear definition of the problem being addressed",
      content:
        "The intermittent nature of renewable energy sources like solar and wind creates significant challenges for grid stability and reliable energy supply. Current energy storage solutions are either prohibitively expensive, environmentally harmful, or lack sufficient capacity for commercial applications. This technological gap is a major barrier to widespread renewable energy adoption across Europe, hindering progress toward the EU's 2030 climate targets.",
      wordCount: 180,
      status: "completed",
      required: true,
      hasWarning: false,
    },
    {
      id: "section-3",
      title: "Proposed Solution",
      description: "Detailed description of the innovative solution",
      content:
        "EcoTech's EcoStore system uses a novel combination of advanced materials and thermal storage technology to create a cost-effective, scalable energy storage solution with minimal environmental impact. Unlike conventional batteries, our system uses abundant, non-toxic materials and can be manufactured using existing industrial processes, significantly reducing production costs and environmental footprint.",
      wordCount: 320,
      status: "draft",
      required: true,
      hasWarning: true,
    },
    {
      id: "section-4",
      title: "Innovation Aspects",
      description: "Explanation of what makes the solution innovative",
      content: "",
      wordCount: 0,
      status: "not_started",
      required: true,
      hasWarning: false,
    },
    {
      id: "section-5",
      title: "Environmental Impact",
      description: "Assessment of the environmental benefits",
      content: "",
      wordCount: 0,
      status: "not_started",
      required: true,
      hasWarning: false,
    },
    {
      id: "section-6",
      title: "Market Analysis",
      description: "Overview of the target market and competition",
      content: "",
      wordCount: 0,
      status: "not_started",
      required: true,
      hasWarning: false,
    },
    {
      id: "section-7",
      title: "Implementation Plan",
      description: "Detailed plan for project implementation",
      content: "",
      wordCount: 0,
      status: "not_started",
      required: true,
      hasWarning: false,
    },
    {
      id: "section-8",
      title: "Budget & Financial Plan",
      description: "Detailed budget breakdown and financial projections",
      content: "",
      wordCount: 0,
      status: "not_started",
      required: true,
      hasWarning: false,
    },
    {
      id: "section-9",
      title: "Team & Expertise",
      description: "Information about the team and their qualifications",
      content: "",
      wordCount: 0,
      status: "not_started",
      required: false,
      hasWarning: false,
    },
  ] as Section[],

  analysis: [
    {
      question: "What specific environmental problem does your solution address?",
      answer:
        "Our solution addresses the critical issue of energy storage for renewable sources, particularly solar and wind. The intermittent nature of these energy sources creates significant challenges for grid stability. By providing efficient, cost-effective storage, we enable higher renewable energy penetration, directly reducing reliance on fossil fuels and cutting CO2 emissions by an estimated 45,000 tons annually per installation.",
    },
    {
      question: "How does your solution align with EU Green Deal objectives?",
      answer:
        "Our EcoStore technology directly supports multiple EU Green Deal objectives: (1) Climate neutrality by enabling higher renewable energy adoption, (2) Clean energy transition by solving the storage challenge, (3) Circular economy through our use of recyclable materials and modular design, and (4) Zero pollution via our non-toxic components and manufacturing processes.",
    },
    {
      question: "What is your competitive advantage compared to existing solutions?",
      answer:
        "EcoStore offers three key advantages over competitors: (1) Cost efficiency - 40% lower levelized cost of storage compared to lithium-ion batteries, (2) Environmental performance - 85% lower carbon footprint in manufacturing and zero toxic materials, and (3) Scalability - modular design allows for deployment in various settings from residential to utility-scale with minimal customization.",
    },
    {
      question: "How will you ensure market adoption of your solution?",
      answer:
        "Our go-to-market strategy includes: (1) Initial pilot partnerships with 3 utility companies (LOIs already secured), (2) Focus on commercial/industrial customers seeking to reduce peak demand charges, (3) Leveraging existing relationships with renewable energy installers, and (4) A service-based business model option (Storage-as-a-Service) to reduce upfront customer costs.",
    },
    {
      question: "What are the main technical risks and how will you mitigate them?",
      answer:
        "Key technical risks include: (1) Thermal efficiency degradation over time - mitigated through our proprietary insulation system and ongoing R&D, (2) Integration with various renewable sources - addressed by our flexible input management system, and (3) Regulatory compliance across EU markets - managed through our dedicated regulatory affairs team with experience in energy storage certification.",
    },
  ] as Analysis[],

  referenceDocuments: [
    {
      id: "doc-1",
      title: "Technical Specifications - EcoStore v2",
      description: "Detailed technical specifications of our energy storage solution",
      type: "Technical Document",
      isPreviousApplication: false,
    },
    {
      id: "doc-2",
      title: "Market Research Report - EU Energy Storage 2024",
      description: "Comprehensive analysis of the European energy storage market",
      type: "Research Report",
      isPreviousApplication: false,
    },
    {
      id: "doc-3",
      title: "Successful Horizon Europe Application - BioTech Inc.",
      description: "Example of a successful application in a related field",
      type: "Application Example",
      isPreviousApplication: true,
    },
    {
      id: "doc-4",
      title: "Environmental Impact Assessment - EcoStore",
      description: "Detailed assessment of the environmental benefits of our solution",
      type: "Technical Document",
      isPreviousApplication: false,
    },
    {
      id: "doc-5",
      title: "Previous Grant Application - Climate Innovation Fund",
      description: "Our successful application to a smaller innovation fund",
      type: "Application Example",
      isPreviousApplication: true,
    },
  ] as ReferenceDocument[],
}
