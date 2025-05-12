export interface Analysis {
  id: string
  company: {
    name: string
    sector: string
    logo?: string
  }
  project: {
    name: string
    fundingAmount: number
    fundingId?: string
  }
  date: string
  completionDate?: string
  status: string
  questions: QuestionResponse[] | number  // Can be an array of questions or a number (for backward compatibility)
  completedQuestions: number
  createdAt?: string
  lastUpdated?: string
}

export interface QuestionResponse {
  questionId: string
  question: string
  answer: string
  category?: string
}

export const analysesData: Analysis[] = [
  {
    id: "analysis-1",
    company: {
      name: "EcoTech Solutions",
      sector: "Clean Energy",
    },
    project: {
      name: "EU Green Innovation Fund",
      fundingAmount: 750000,
    },
    date: "2025-01-15",
    completionDate: "2025-01-20",
    status: "Completed",
    questions: 24,
    completedQuestions: 24,
  },
  {
    id: "analysis-2",
    company: {
      name: "MediNova Research",
      sector: "Healthcare",
    },
    project: {
      name: "Horizon Europe Research Grant",
      fundingAmount: 1250000,
    },
    date: "2025-02-03",
    status: "In Progress",
    questions: 32,
    completedQuestions: 18,
  },
  {
    id: "analysis-3",
    company: {
      name: "DigitalMind AI",
      sector: "Technology",
    },
    project: {
      name: "Digital Europe Programme",
      fundingAmount: 500000,
    },
    date: "2025-01-28",
    status: "Pending",
    questions: 28,
    completedQuestions: 0,
  },
  {
    id: "analysis-4",
    company: {
      name: "GreenGrow Agriculture",
      sector: "Agriculture",
    },
    project: {
      name: "SME Growth Initiative",
      fundingAmount: 350000,
    },
    date: "2024-12-10",
    completionDate: "2024-12-18",
    status: "Completed",
    questions: 20,
    completedQuestions: 20,
  },
  {
    id: "analysis-5",
    company: {
      name: "Urban Mobility Solutions",
      sector: "Transportation",
    },
    project: {
      name: "Creative Europe Media",
      fundingAmount: 420000,
    },
    date: "2025-01-05",
    status: "Needs Review",
    questions: 26,
    completedQuestions: 26,
  },
  {
    id: "analysis-6",
    company: {
      name: "NanoMaterials Ltd",
      sector: "Manufacturing",
    },
    project: {
      name: "EU Green Innovation Fund",
      fundingAmount: 680000,
    },
    date: "2025-02-12",
    status: "In Progress",
    questions: 30,
    completedQuestions: 12,
  },
  {
    id: "analysis-7",
    company: {
      name: "OceanClean Technologies",
      sector: "Environmental",
    },
    project: {
      name: "Blue Economy Initiative",
      fundingAmount: 520000,
    },
    date: "2024-11-20",
    completionDate: "2024-11-30",
    status: "Completed",
    questions: 22,
    completedQuestions: 22,
  },
  {
    id: "analysis-8",
    company: {
      name: "QuantumCompute",
      sector: "Technology",
    },
    project: {
      name: "Horizon Europe Research Grant",
      fundingAmount: 1800000,
    },
    date: "2025-01-18",
    status: "In Progress",
    questions: 36,
    completedQuestions: 24,
  },
  {
    id: "analysis-9",
    company: {
      name: "BioHarvest",
      sector: "Agriculture",
    },
    project: {
      name: "Agricultural Innovation Fund",
      fundingAmount: 450000,
    },
    date: "2025-02-05",
    status: "Pending",
    questions: 28,
    completedQuestions: 0,
  },
  {
    id: "analysis-10",
    company: {
      name: "SolarPeak Energy",
      sector: "Clean Energy",
    },
    project: {
      name: "Renewable Energy Grant",
      fundingAmount: 620000,
    },
    date: "2024-12-15",
    completionDate: "2024-12-28",
    status: "Completed",
    questions: 26,
    completedQuestions: 26,
  },
  {
    id: "analysis-11",
    company: {
      name: "SmartCity Solutions",
      sector: "Urban Development",
    },
    project: {
      name: "Urban Innovation Initiative",
      fundingAmount: 580000,
    },
    date: "2025-01-22",
    status: "Needs Review",
    questions: 30,
    completedQuestions: 30,
  },
  {
    id: "analysis-12",
    company: {
      name: "CircularPackaging",
      sector: "Manufacturing",
    },
    project: {
      name: "Circular Economy Fund",
      fundingAmount: 390000,
    },
    date: "2025-02-08",
    status: "In Progress",
    questions: 24,
    completedQuestions: 10,
  },
  {
    id: "analysis-13",
    company: {
      name: "EcoTech Solutions",
      sector: "Clean Energy",
    },
    project: {
      name: "SME Growth Initiative",
      fundingAmount: 320000,
    },
    date: "2024-11-05",
    completionDate: "2024-11-15",
    status: "Completed",
    questions: 22,
    completedQuestions: 22,
  },
  {
    id: "analysis-14",
    company: {
      name: "MediNova Research",
      sector: "Healthcare",
    },
    project: {
      name: "Health Innovation Programme",
      fundingAmount: 980000,
    },
    date: "2025-01-10",
    status: "In Progress",
    questions: 34,
    completedQuestions: 20,
  },
  {
    id: "analysis-15",
    company: {
      name: "DigitalMind AI",
      sector: "Technology",
    },
    project: {
      name: "AI Development Grant",
      fundingAmount: 720000,
    },
    date: "2025-02-01",
    status: "Pending",
    questions: 28,
    completedQuestions: 0,
  },
]
