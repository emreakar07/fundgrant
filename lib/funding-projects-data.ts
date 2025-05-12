export interface FundingProject {
  id: string
  title: string
  sector: string
  deadline: string
  fundingAmount: number
  description: string
  fundingDetails: {
    totalAmount: number
    minGrant: number
    maxGrant: number
    coFinancing: string
    paymentStructure: string
  }
  eligibilityCriteria: string[]
  evaluationCriteria: {
    name: string
    weight: number
    description: string
  }[]
  applicationProcess: {
    steps: {
      name: string
      description: string
      deadline: string
    }[]
    timeline: string
    submissionMethod: string
  }
  requiredDocuments: {
    name: string
    description: string
    required: boolean
  }[]
  coveredExpenses: string[]
  matchCriteria: {
    targetSectors: string[]
    companySize: string[]
    requirements: string[]
  }
  importantLinks: {
    title: string
    url: string
    description: string
  }[]
}

export const fundingProjectsData: FundingProject[] = [
  {
    id: "fp1",
    title: "Green Innovation Fund",
    sector: "Sustainability",
    deadline: "2025-06-30",
    fundingAmount: 5000000,
    description:
      "The Green Innovation Fund supports projects that develop innovative solutions to environmental challenges. We're looking for groundbreaking ideas that can make a significant impact on sustainability goals, particularly in reducing carbon emissions, improving energy efficiency, or promoting circular economy principles.",
    fundingDetails: {
      totalAmount: 5000000,
      minGrant: 50000,
      maxGrant: 500000,
      coFinancing: "20% minimum contribution required from applicants",
      paymentStructure: "40% upfront, 40% at midterm review, 20% upon completion",
    },
    eligibilityCriteria: [
      "Registered businesses or non-profit organizations",
      "Minimum 2 years of operation",
      "Project must demonstrate environmental impact",
      "Must have technical capacity to implement the project",
    ],
    evaluationCriteria: [
      {
        name: "Innovation Level",
        weight: 30,
        description: "Degree of innovation and uniqueness of the proposed solution",
      },
      {
        name: "Environmental Impact",
        weight: 25,
        description: "Potential to create significant positive environmental outcomes",
      },
      {
        name: "Feasibility",
        weight: 20,
        description: "Technical and financial viability of the project",
      },
      {
        name: "Team Capability",
        weight: 15,
        description: "Experience and skills of the project team",
      },
      {
        name: "Scalability",
        weight: 10,
        description: "Potential for scaling the solution to broader markets",
      },
    ],
    applicationProcess: {
      steps: [
        {
          name: "Expression of Interest",
          description: "Submit a brief outline of your project idea",
          deadline: "2025-03-15",
        },
        {
          name: "Full Proposal",
          description: "Detailed project plan including budget and timeline",
          deadline: "2025-04-30",
        },
        {
          name: "Panel Review",
          description: "Presentation to expert evaluation committee",
          deadline: "2025-05-30",
        },
      ],
      timeline: "Total evaluation period: 3-4 months",
      submissionMethod: "Online submission through portal",
    },
    requiredDocuments: [
      {
        name: "Technical Description",
        description: "Detailed explanation of the technology or solution",
        required: true,
      },
      {
        name: "Budget Breakdown",
        description: "Itemized budget with justification for major expenses",
        required: true,
      },
      {
        name: "Environmental Impact Assessment",
        description: "Analysis of expected environmental benefits",
        required: true,
      },
      {
        name: "Letters of Support",
        description: "From partners or stakeholders",
        required: false,
      },
    ],
    coveredExpenses: [
      "Equipment purchase",
      "Staff costs",
      "Research and development",
      "Prototyping",
      "Testing and validation",
    ],
    matchCriteria: {
      targetSectors: ["Renewable Energy", "Waste Management", "Sustainable Agriculture", "Clean Transportation"],
      companySize: ["SME", "Startup", "Mid-size Enterprise"],
      requirements: [
        "Demonstrated commitment to sustainability",
        "Previous experience in environmental projects",
        "Capacity to provide co-financing",
      ],
    },
    importantLinks: [
      {
        title: "Application Portal",
        url: "https://greenfund.example.com/apply",
        description: "Submit your application here",
      },
      {
        title: "FAQ",
        url: "https://greenfund.example.com/faq",
        description: "Frequently asked questions about the fund",
      },
      {
        title: "Webinar Registration",
        url: "https://greenfund.example.com/webinar",
        description: "Join our information session",
      },
    ],
  },
  {
    id: "fp2",
    title: "Digital Transformation Grant",
    sector: "Technology",
    deadline: "2025-08-15",
    fundingAmount: 3000000,
    description:
      "The Digital Transformation Grant aims to help businesses adopt digital technologies to improve their operations, products, or services. This funding opportunity supports projects that implement innovative digital solutions that can significantly enhance productivity, customer experience, or create new business models.",
    fundingDetails: {
      totalAmount: 3000000,
      minGrant: 25000,
      maxGrant: 250000,
      coFinancing: "30% minimum contribution required from applicants",
      paymentStructure: "50% upfront, 50% upon completion",
    },
    eligibilityCriteria: [
      "Small and medium enterprises",
      "Minimum 1 year of operation",
      "Clear digital transformation strategy",
      "Must demonstrate potential for business growth",
    ],
    evaluationCriteria: [
      {
        name: "Business Impact",
        weight: 35,
        description: "Potential to transform business operations or model",
      },
      {
        name: "Innovation",
        weight: 25,
        description: "Novelty and creativity of the digital solution",
      },
      {
        name: "Implementation Plan",
        weight: 20,
        description: "Clarity and feasibility of the implementation roadmap",
      },
      {
        name: "Team Capability",
        weight: 20,
        description: "Skills and experience to execute the project",
      },
    ],
    applicationProcess: {
      steps: [
        {
          name: "Initial Application",
          description: "Submit business details and project outline",
          deadline: "2025-06-01",
        },
        {
          name: "Detailed Proposal",
          description: "Complete project plan with technical specifications",
          deadline: "2025-07-15",
        },
        {
          name: "Final Selection",
          description: "Review by industry experts",
          deadline: "2025-08-01",
        },
      ],
      timeline: "Applications reviewed on a rolling basis",
      submissionMethod: "Email submission to grants@digitaltransform.example.com",
    },
    requiredDocuments: [
      {
        name: "Business Plan",
        description: "Current business model and future vision",
        required: true,
      },
      {
        name: "Digital Strategy",
        description: "How the project fits into overall digital strategy",
        required: true,
      },
      {
        name: "Budget Proposal",
        description: "Detailed cost breakdown",
        required: true,
      },
      {
        name: "Technology Partner Information",
        description: "Details of technology vendors or partners",
        required: false,
      },
    ],
    coveredExpenses: ["Software licenses", "Hardware", "Consulting services", "Staff training", "Implementation costs"],
    matchCriteria: {
      targetSectors: ["Retail", "Manufacturing", "Healthcare", "Professional Services", "Education"],
      companySize: ["Micro", "Small", "Medium"],
      requirements: [
        "Demonstrated need for digital transformation",
        "Commitment from senior management",
        "Capacity to maintain digital solutions after implementation",
      ],
    },
    importantLinks: [
      {
        title: "Program Guidelines",
        url: "https://digitalgrant.example.com/guidelines",
        description: "Detailed information about the grant program",
      },
      {
        title: "Case Studies",
        url: "https://digitalgrant.example.com/cases",
        description: "Success stories from previous grantees",
      },
    ],
  },
  {
    id: "fp3",
    title: "Research & Development Tax Credit",
    sector: "Innovation",
    deadline: "2025-12-31",
    fundingAmount: 10000000,
    description:
      "The R&D Tax Credit program provides tax incentives for businesses conducting qualified research activities. This program aims to encourage innovation and technological advancement across all industry sectors by offsetting research expenses.",
    fundingDetails: {
      totalAmount: 10000000,
      minGrant: 0,
      maxGrant: 1000000,
      coFinancing: "No co-financing required",
      paymentStructure: "Tax credit applied to annual tax return",
    },
    eligibilityCriteria: [
      "Must be a tax-paying entity",
      "Research activities must be conducted within the country",
      "Activities must qualify as research and development under program guidelines",
      "Must maintain detailed documentation of R&D activities and expenses",
    ],
    evaluationCriteria: [
      {
        name: "Technical Uncertainty",
        weight: 30,
        description: "Degree to which the research attempts to resolve technical challenges",
      },
      {
        name: "Process of Experimentation",
        weight: 30,
        description: "Systematic approach to evaluating alternatives",
      },
      {
        name: "Technological in Nature",
        weight: 25,
        description: "Based on physical, biological, engineering, or computer science principles",
      },
      {
        name: "Qualified Purpose",
        weight: 15,
        description: "Aimed at creating new or improved functionality, performance, reliability, or quality",
      },
    ],
    applicationProcess: {
      steps: [
        {
          name: "Pre-qualification Assessment",
          description: "Determine if your activities qualify for the credit",
          deadline: "Ongoing",
        },
        {
          name: "Documentation Compilation",
          description: "Gather all required evidence of R&D activities",
          deadline: "Before tax filing",
        },
        {
          name: "Tax Filing",
          description: "Include R&D credit claim with annual tax return",
          deadline: "2025-12-31",
        },
      ],
      timeline: "Claims processed with annual tax assessment",
      submissionMethod: "Through certified tax professional or online tax portal",
    },
    requiredDocuments: [
      {
        name: "R&D Project Documentation",
        description: "Detailed records of research activities and objectives",
        required: true,
      },
      {
        name: "Expense Records",
        description: "Documentation of all qualified research expenses",
        required: true,
      },
      {
        name: "Employee Time Tracking",
        description: "Records showing time spent on qualified activities",
        required: true,
      },
      {
        name: "Technical Reports",
        description: "Documentation of research outcomes and challenges",
        required: false,
      },
    ],
    coveredExpenses: [
      "Wages for R&D staff",
      "Supplies used in research",
      "Contract research expenses",
      "Patent development costs",
      "Prototype development",
    ],
    matchCriteria: {
      targetSectors: ["All sectors with qualifying R&D activities"],
      companySize: ["All sizes"],
      requirements: [
        "Must conduct qualifying research activities",
        "Must have taxable income or payroll tax liability",
        "Must maintain adequate documentation",
      ],
    },
    importantLinks: [
      {
        title: "Program Guidelines",
        url: "https://rdtaxcredit.example.gov/guidelines",
        description: "Official program rules and definitions",
      },
      {
        title: "Documentation Templates",
        url: "https://rdtaxcredit.example.gov/templates",
        description: "Standardized forms for tracking R&D activities",
      },
      {
        title: "Qualified Activities List",
        url: "https://rdtaxcredit.example.gov/qualified-activities",
        description: "Examples of activities that qualify for the credit",
      },
    ],
  },
]
