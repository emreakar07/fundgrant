export interface Company {
  id: string
  name: string
  sector: string
  size: string
  description: string
}

export interface MatchReason {
  category: "sector" | "size" | "location" | "innovation" | "sustainability" | "financial" | "expertise"
  description: string
  strength: "strong" | "medium" | "weak"
}

export interface FundingMatch {
  id: string
  projectTitle: string
  matchScore: number
  matchReasons: MatchReason[]
  deadline: string
  fundingAmount: number
  description: string
  sector: string
}

export const companiesData: Company[] = [
  {
    id: "comp-1",
    name: "EcoTech Solutions",
    sector: "Clean Energy",
    size: "Medium",
    description: "Innovative clean energy storage solutions for renewable energy integration",
  },
  {
    id: "comp-2",
    name: "MediNova Research",
    sector: "Healthcare",
    size: "Large",
    description: "Advanced medical research focusing on innovative treatments for chronic diseases",
  },
  {
    id: "comp-3",
    name: "DigitalMind AI",
    sector: "Technology",
    size: "Small",
    description: "AI-powered solutions for business process optimization and decision support",
  },
  {
    id: "comp-4",
    name: "GreenGrow Agriculture",
    sector: "Agriculture",
    size: "Medium",
    description: "Sustainable agricultural technologies for improved crop yields and reduced environmental impact",
  },
  {
    id: "comp-5",
    name: "Urban Mobility Solutions",
    sector: "Transportation",
    size: "Small",
    description: "Smart urban transportation solutions for reduced congestion and emissions",
  },
]

export const matchesData: Record<string, FundingMatch[]> = {
  "comp-1": [
    {
      id: "match-1",
      projectTitle: "EU Green Innovation Fund",
      matchScore: 92,
      matchReasons: [
        {
          category: "sector",
          description: "Perfect alignment with clean energy focus",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Fund prioritizes innovative energy storage solutions",
          strength: "strong",
        },
        {
          category: "sustainability",
          description: "Strong environmental impact potential",
          strength: "strong",
        },
      ],
      deadline: "2025-06-15",
      fundingAmount: 750000,
      description:
        "Supporting innovative low-carbon technologies and processes in energy-intensive industries, renewable energy, energy storage, and carbon capture.",
      sector: "Sustainability",
    },
    {
      id: "match-2",
      projectTitle: "Renewable Energy Grant",
      matchScore: 87,
      matchReasons: [
        {
          category: "sector",
          description: "Direct match with renewable energy focus",
          strength: "strong",
        },
        {
          category: "size",
          description: "Medium-sized companies are preferred applicants",
          strength: "medium",
        },
        {
          category: "innovation",
          description: "Energy storage is a priority innovation area",
          strength: "strong",
        },
      ],
      deadline: "2025-10-10",
      fundingAmount: 620000,
      description:
        "Supporting innovative renewable energy projects with high replication potential, including solar, wind, hydro, geothermal, and biomass energy solutions.",
      sector: "Clean Energy",
    },
    {
      id: "match-3",
      projectTitle: "Horizon Europe Research Grant",
      matchScore: 78,
      matchReasons: [
        {
          category: "innovation",
          description: "Strong focus on innovative technologies",
          strength: "strong",
        },
        {
          category: "sustainability",
          description: "Environmental sustainability is a key criterion",
          strength: "medium",
        },
        {
          category: "expertise",
          description: "Technical expertise aligns with requirements",
          strength: "medium",
        },
      ],
      deadline: "2025-04-22",
      fundingAmount: 1250000,
      description:
        "Funding for breakthrough research and innovation projects addressing global challenges, including climate change and sustainable development.",
      sector: "Research",
    },
    {
      id: "match-4",
      projectTitle: "SME Growth Initiative",
      matchScore: 65,
      matchReasons: [
        {
          category: "size",
          description: "Medium-sized company fits eligibility criteria",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Innovation component aligns with program goals",
          strength: "medium",
        },
        {
          category: "financial",
          description: "Financial requirements are partially met",
          strength: "weak",
        },
      ],
      deadline: "2025-03-05",
      fundingAmount: 350000,
      description:
        "Supporting small and medium-sized enterprises in their growth and internationalization efforts, providing funding for business development and innovation.",
      sector: "Business",
    },
  ],
  "comp-2": [
    {
      id: "match-5",
      projectTitle: "Health Innovation Programme",
      matchScore: 94,
      matchReasons: [
        {
          category: "sector",
          description: "Perfect alignment with healthcare focus",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Strong emphasis on medical research innovation",
          strength: "strong",
        },
        {
          category: "expertise",
          description: "Company expertise matches program requirements",
          strength: "strong",
        },
      ],
      deadline: "2025-08-30",
      fundingAmount: 980000,
      description:
        "Supporting innovative solutions addressing healthcare challenges, including digital health, medical devices, therapeutics, and healthcare delivery models.",
      sector: "Healthcare",
    },
    {
      id: "match-6",
      projectTitle: "Horizon Europe Research Grant",
      matchScore: 89,
      matchReasons: [
        {
          category: "sector",
          description: "Research focus aligns with program priorities",
          strength: "strong",
        },
        {
          category: "size",
          description: "Large organizations with research capacity are preferred",
          strength: "strong",
        },
        {
          category: "expertise",
          description: "Research expertise is highly relevant",
          strength: "strong",
        },
      ],
      deadline: "2025-04-22",
      fundingAmount: 1250000,
      description:
        "Funding for breakthrough research and innovation projects addressing global challenges, including health and wellbeing.",
      sector: "Research",
    },
    {
      id: "match-7",
      projectTitle: "Digital Europe Programme",
      matchScore: 72,
      matchReasons: [
        {
          category: "innovation",
          description: "Digital health components align with program goals",
          strength: "medium",
        },
        {
          category: "size",
          description: "Large organizations can demonstrate impact",
          strength: "medium",
        },
        {
          category: "expertise",
          description: "Technical expertise is relevant but not primary focus",
          strength: "medium",
        },
      ],
      deadline: "2025-05-10",
      fundingAmount: 500000,
      description:
        "Supporting the digital transformation of Europe's economy and society, including digital health innovations.",
      sector: "Technology",
    },
  ],
  "comp-3": [
    {
      id: "match-8",
      projectTitle: "AI Development Grant",
      matchScore: 96,
      matchReasons: [
        {
          category: "sector",
          description: "Perfect alignment with AI technology focus",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "AI innovation is the core focus of the grant",
          strength: "strong",
        },
        {
          category: "expertise",
          description: "Company expertise directly matches requirements",
          strength: "strong",
        },
      ],
      deadline: "2025-06-30",
      fundingAmount: 720000,
      description:
        "Supporting the development and application of artificial intelligence solutions with positive societal impact.",
      sector: "Technology",
    },
    {
      id: "match-9",
      projectTitle: "Digital Europe Programme",
      matchScore: 91,
      matchReasons: [
        {
          category: "sector",
          description: "Digital technology focus is perfectly aligned",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "AI innovation is a priority area",
          strength: "strong",
        },
        {
          category: "size",
          description: "Small innovative companies are encouraged",
          strength: "medium",
        },
      ],
      deadline: "2025-05-10",
      fundingAmount: 500000,
      description:
        "Supporting the digital transformation of Europe's economy and society, focusing on artificial intelligence and advanced digital skills.",
      sector: "Technology",
    },
    {
      id: "match-10",
      projectTitle: "SME Growth Initiative",
      matchScore: 83,
      matchReasons: [
        {
          category: "size",
          description: "Small company fits eligibility criteria perfectly",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Innovation component is highly valued",
          strength: "strong",
        },
        {
          category: "financial",
          description: "Financial requirements are well-aligned",
          strength: "medium",
        },
      ],
      deadline: "2025-03-05",
      fundingAmount: 350000,
      description:
        "Supporting small and medium-sized enterprises in their growth and internationalization efforts, with a focus on innovative technologies.",
      sector: "Business",
    },
  ],
  "comp-4": [
    {
      id: "match-11",
      projectTitle: "Agricultural Innovation Fund",
      matchScore: 95,
      matchReasons: [
        {
          category: "sector",
          description: "Perfect alignment with agricultural focus",
          strength: "strong",
        },
        {
          category: "sustainability",
          description: "Sustainable agriculture is a key priority",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Agricultural technology innovation is highly valued",
          strength: "strong",
        },
      ],
      deadline: "2025-05-28",
      fundingAmount: 450000,
      description:
        "Supporting innovative solutions for sustainable agriculture and food production, including precision farming and climate-resilient practices.",
      sector: "Agriculture",
    },
    {
      id: "match-12",
      projectTitle: "EU Green Innovation Fund",
      matchScore: 82,
      matchReasons: [
        {
          category: "sustainability",
          description: "Environmental sustainability focus is aligned",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Agricultural innovation fits broader sustainability goals",
          strength: "medium",
        },
        {
          category: "sector",
          description: "Agriculture is a relevant but not primary sector",
          strength: "medium",
        },
      ],
      deadline: "2025-06-15",
      fundingAmount: 750000,
      description:
        "Supporting innovative low-carbon technologies and processes, including sustainable agricultural practices.",
      sector: "Sustainability",
    },
    {
      id: "match-13",
      projectTitle: "SME Growth Initiative",
      matchScore: 76,
      matchReasons: [
        {
          category: "size",
          description: "Medium-sized company fits eligibility criteria",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Innovation component aligns with program goals",
          strength: "medium",
        },
        {
          category: "financial",
          description: "Financial requirements are partially met",
          strength: "medium",
        },
      ],
      deadline: "2025-03-05",
      fundingAmount: 350000,
      description: "Supporting small and medium-sized enterprises in their growth and internationalization efforts.",
      sector: "Business",
    },
  ],
  "comp-5": [
    {
      id: "match-14",
      projectTitle: "Urban Innovation Initiative",
      matchScore: 93,
      matchReasons: [
        {
          category: "sector",
          description: "Perfect alignment with urban mobility focus",
          strength: "strong",
        },
        {
          category: "sustainability",
          description: "Environmental sustainability in urban areas is key",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Smart transportation solutions are a priority",
          strength: "strong",
        },
      ],
      deadline: "2025-07-25",
      fundingAmount: 580000,
      description:
        "Supporting innovative solutions for sustainable urban development, including smart cities and urban mobility.",
      sector: "Urban Development",
    },
    {
      id: "match-15",
      projectTitle: "EU Green Innovation Fund",
      matchScore: 85,
      matchReasons: [
        {
          category: "sustainability",
          description: "Emissions reduction focus is perfectly aligned",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Transportation innovation fits sustainability goals",
          strength: "strong",
        },
        {
          category: "sector",
          description: "Transportation is a relevant but not primary sector",
          strength: "medium",
        },
      ],
      deadline: "2025-06-15",
      fundingAmount: 750000,
      description:
        "Supporting innovative low-carbon technologies and processes, including sustainable transportation solutions.",
      sector: "Sustainability",
    },
    {
      id: "match-16",
      projectTitle: "SME Growth Initiative",
      matchScore: 79,
      matchReasons: [
        {
          category: "size",
          description: "Small company fits eligibility criteria perfectly",
          strength: "strong",
        },
        {
          category: "innovation",
          description: "Innovation component is highly valued",
          strength: "medium",
        },
        {
          category: "financial",
          description: "Financial requirements are well-aligned",
          strength: "medium",
        },
      ],
      deadline: "2025-03-05",
      fundingAmount: 350000,
      description: "Supporting small and medium-sized enterprises in their growth and internationalization efforts.",
      sector: "Business",
    },
  ],
}
