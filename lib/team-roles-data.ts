export interface TeamMember {
  id: string
  name: string
  email: string
  role: "Company Admin" | "Team Member"
  assignedCompanies: {
    id: string
    name: string
  }[]
  activeProjects: number
  avatar?: string
}

export const teamMembersData: TeamMember[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@fundgrant.com",
    role: "Company Admin",
    assignedCompanies: [
      { id: "comp-1", name: "EcoTech Solutions" },
      { id: "comp-2", name: "MediNova Research" },
      { id: "comp-3", name: "DigitalMind AI" },
    ],
    activeProjects: 5,
    avatar: "/abstract-user-icon.png",
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    email: "sarah.chen@fundgrant.com",
    role: "Company Admin",
    assignedCompanies: [
      { id: "comp-4", name: "GreenGrow Agriculture" },
      { id: "comp-5", name: "Urban Mobility Solutions" },
    ],
    activeProjects: 3,
  },
  {
    id: "user-3",
    name: "Michael Zhang",
    email: "michael.zhang@fundgrant.com",
    role: "Team Member",
    assignedCompanies: [
      { id: "comp-1", name: "EcoTech Solutions" },
      { id: "comp-8", name: "QuantumCompute" },
    ],
    activeProjects: 2,
  },
  {
    id: "user-4",
    name: "Elena Kowalski",
    email: "elena.kowalski@fundgrant.com",
    role: "Team Member",
    assignedCompanies: [{ id: "comp-5", name: "Urban Mobility Solutions" }],
    activeProjects: 1,
  },
  {
    id: "user-5",
    name: "Thomas Weber",
    email: "thomas.weber@fundgrant.com",
    role: "Team Member",
    assignedCompanies: [
      { id: "comp-2", name: "MediNova Research" },
      { id: "comp-6", name: "NanoMaterials Ltd" },
    ],
    activeProjects: 4,
  },
  {
    id: "user-6",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@fundgrant.com",
    role: "Company Admin",
    assignedCompanies: [
      { id: "comp-7", name: "OceanClean Technologies" },
      { id: "comp-10", name: "SolarPeak Energy" },
    ],
    activeProjects: 2,
  },
  {
    id: "user-7",
    name: "David Müller",
    email: "david.mueller@fundgrant.com",
    role: "Team Member",
    assignedCompanies: [
      { id: "comp-6", name: "NanoMaterials Ltd" },
      { id: "comp-9", name: "BioHarvest" },
    ],
    activeProjects: 3,
  },
  {
    id: "user-8",
    name: "Sophia Andersson",
    email: "sophia.andersson@fundgrant.com",
    role: "Team Member",
    assignedCompanies: [{ id: "comp-7", name: "OceanClean Technologies" }],
    activeProjects: 1,
  },
]
