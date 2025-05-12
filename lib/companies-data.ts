export interface Company {
  id: string
  name: string
  logo?: string
  sector: string
  industry: string
  size: "Small" | "Medium" | "Large"
  projectCount: number
  primaryContact: {
    name: string
    email: string
    phone?: string
  }
  location: string
  address?: string
  taxNumber?: string
  yearFounded?: number
  companyType?: string
  email?: string
  phone?: string
  website?: string
  naceCode?: string
  exportsStatus?: boolean
  hsCodes?: string[]
  revenue?: number
  numberOfEmployees?: number
  totalAssets?: number
  capitalStructure?: {
    domestic: number
    foreign: number
  }
  financialRating?: string
  esgRating?: string
  carbonFootprint?: boolean
  sustainabilityInitiatives?: string
  sustainabilityReport?: boolean
  socialImpact?: boolean
  fundingTarget?: "Single" | "Multiple"
  timeline?: "Short-Term" | "Mid-Term" | "Long-Term"
  prioritySupportTypes?: string[]
  capabilities?: Record<string, boolean>
  attachments?: {
    id: string
    name: string
    type: string
    size: number
    url: string
    uploadDate: string
  }[]
  employees?: {
    total: number
    whiteCollar: number
    blueCollar: number
  }
  investmentPlan?: boolean
  investmentSubject?: string
}

export const companiesData: Company[] = [
  {
    id: "comp-1",
    name: "EcoTech Solutions",
    logo: "/abstract-geometric-shapes.png",
    sector: "Clean Energy",
    industry: "Renewable Energy",
    size: "Medium",
    projectCount: 3,
    primaryContact: {
      name: "Maria Rodriguez",
      email: "maria@ecotech.com",
    },
    location: "Berlin, Germany",
    taxNumber: "DE123456789",
    yearFounded: 2015,
    companyType: "GmbH",
    email: "info@ecotech.com",
    phone: "+49 30 1234567",
    website: "www.ecotech.com",
    naceCode: "35110",
    exportsStatus: true,
    hsCodes: ["8501", "8502"],
    revenue: 2500000,
    totalAssets: 1800000,
    capitalStructure: {
      domestic: 70,
      foreign: 30,
    },
    employees: {
      total: 45,
      whiteCollar: 30,
      blueCollar: 15,
    },
    investmentPlan: true,
    investmentSubject: "Expansion of solar panel production line",
    capabilities: {
      "R&D Department": true,
      Exports: true,
    },
    carbonFootprint: true,
    sustainabilityReport: true,
    socialImpact: true,
    fundingTarget: "Multiple",
    timeline: "Mid-Term",
    prioritySupportTypes: ["Grants", "Loans", "Tax Incentives"],
    attachments: [],
  },
  {
    id: "comp-2",
    name: "MediCorp Innovations",
    logo: "/abstract-geometric-shapes.png",
    sector: "Healthcare",
    industry: "Biotechnology",
    size: "Large",
    projectCount: 5,
    primaryContact: {
      name: "Hans Schmidt",
      email: "hans.schmidt@medicorp.com",
    },
    location: "Munich, Germany",
    taxNumber: "DE987654321",
    yearFounded: 2008,
    companyType: "AG",
    email: "contact@medicorp.com",
    phone: "+49 89 9876543",
    website: "www.medicorp.com",
    naceCode: "21100",
    exportsStatus: true,
    hsCodes: ["3002", "9018"],
    revenue: 15000000,
    totalAssets: 12000000,
    capitalStructure: {
      domestic: 55,
      foreign: 45,
    },
    employees: {
      total: 250,
      whiteCollar: 180,
      blueCollar: 70,
    },
    investmentPlan: true,
    investmentSubject: "Development of new cancer treatment",
    capabilities: {
      "R&D Department": true,
      "Clinical Trials": true,
      Patents: true,
    },
    carbonFootprint: false,
    sustainabilityReport: true,
    socialImpact: true,
    fundingTarget: "Single",
    timeline: "Long-Term",
    prioritySupportTypes: ["Grants", "Tax Incentives"],
    attachments: [],
  },
]
