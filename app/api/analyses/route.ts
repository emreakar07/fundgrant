import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    console.log('Starting to fetch analyses from MongoDB...')
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    // Directly use fundgrant database instead of default db
    const db = client.db('fundgrant')
    console.log('Using database:', db.databaseName)
    
    // First check if the collection exists
    const collections = await db.listCollections().toArray()
    const collectionExists = collections.some(c => c.name === 'analysis-data')
    console.log(`Collection 'analysis-data' exists: ${collectionExists}`)
    
    if (!collectionExists) {
      console.log('Creating analysis-data collection...')
      await db.createCollection('analysis-data')
      console.log('Collection analysis-data created')
      return NextResponse.json([], { status: 200 })
    }
    
    // Get all analyses from the analysis-data collection
    console.log('Querying analysis-data collection...')
    
    // First count documents to verify
    const count = await db.collection('analysis-data').countDocuments()
    console.log(`Total document count in analysis-data: ${count}`)
    
    // Get a sample document to check structure
    if (count > 0) {
      const sample = await db.collection('analysis-data').findOne({})
      console.log('Sample document structure:', JSON.stringify(sample ? Object.keys(sample) : null))
    }
    
    const analyses = await db.collection('analysis-data').find({}).toArray()
    console.log(`Found ${analyses.length} analyses in MongoDB`)
    
    // Transform ObjectId to string for each analysis
    const formattedAnalyses = analyses.map(analysis => {
      // Extract the _id
      const { _id, ...rest } = analysis
      
      // Return the formatted analysis
      return {
        ...rest,
        id: _id.toString()
      }
    })
    
    console.log(`Retrieved and formatted ${formattedAnalyses.length} analyses from analysis-data collection`)
    
    return NextResponse.json(formattedAnalyses, { status: 200 })
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    // Directly use fundgrant database instead of default db
    const db = client.db('fundgrant')
    
    // Parse the request body
    const analysisData = await request.json()
    
    // Basic validation
    if (!analysisData.company || !analysisData.project) {
      return NextResponse.json(
        { error: 'Company and project information are required' },
        { status: 400 }
      )
    }
    
    // Create company if it doesn't exist
    let companyId = null
    
    if (analysisData.company.name) {
      // Check if company exists
      const existingCompany = await db.collection('companies').findOne({ 
        name: analysisData.company.name 
      })
      
      if (existingCompany) {
        companyId = existingCompany._id
        console.log(`Found existing company with ID: ${companyId}`)
      } else {
        // Create new company
        const companyResult = await db.collection('companies').insertOne({
          name: analysisData.company.name,
          sector: analysisData.company.sector || 'Unknown',
          createdAt: new Date().toISOString()
        })
        
        companyId = companyResult.insertedId
        console.log(`Created new company with ID: ${companyId}`)
      }
    }
    
    // Create project if it doesn't exist
    let projectId = null
    
    if (analysisData.project.name && companyId) {
      // Check if project exists for this company
      const existingProject = await db.collection('funding-projects').findOne({ 
        name: analysisData.project.name,
        companyId: companyId.toString()
      })
      
      if (existingProject) {
        projectId = existingProject._id
        console.log(`Found existing project with ID: ${projectId}`)
      } else {
        // Create new project
        const projectResult = await db.collection('funding-projects').insertOne({
          name: analysisData.project.name,
          companyId: companyId.toString(),
          fundingAmount: analysisData.project.fundingAmount || 0,
          fundingId: analysisData.project.fundingId || null,
          status: 'Active',
          createdAt: new Date().toISOString()
        })
        
        projectId = projectResult.insertedId
        console.log(`Created new project with ID: ${projectId}`)
      }
    }
    
    // Process the answers into a proper format for saving
    let questionResponses = [];
    let completedCount = 0;
    
    if (analysisData.answers && analysisData.answers.length > 0) {
      questionResponses = analysisData.answers.map((answer: {
        questionId: string;
        question: string;
        answer: string;
        category?: string;
      }) => {
        // Count as completed if it has an answer
        if (answer.answer && answer.answer.trim().length > 0) {
          completedCount++;
        }
        
        return {
          questionId: answer.questionId,
          question: answer.question,
          answer: answer.answer || "",
          category: answer.category || "General"
        };
      });
    }
    
    // Prepare analysis document for analysis-data collection
    const analysis = {
      company: {
        name: analysisData.company.name,
        sector: analysisData.company.sector
      },
      project: {
        name: analysisData.project.name,
        fundingId: analysisData.project.fundingId,
        fundingAmount: analysisData.project.fundingAmount || 0
      },
      date: analysisData.date || new Date().toISOString(),
      status: analysisData.status || 'Pending',
      questions: questionResponses,                   // Store questions as array
      completedQuestions: completedCount,             // Count of answered questions
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
    
    console.log('Creating new analysis document in analysis-data collection...')
    const result = await db.collection('analysis-data').insertOne(analysis)
    
    if (!result.insertedId) {
      throw new Error('Failed to insert analysis')
    }
    
    const analysisId = result.insertedId.toString()
    console.log(`Created analysis with ID: ${analysisId}`)
    
    // Summary data is now stored directly in the analysis-data collection
    // No longer storing in separate 'analyses' collection
    
    // Return the analysis with ID
    const createdAnalysis = {
      ...analysis,
      id: analysisId
    }
    
    return NextResponse.json(createdAnalysis, { status: 201 })
  } catch (error) {
    console.error('Error creating analysis:', error)
    return NextResponse.json(
      { error: 'Failed to create analysis' },
      { status: 500 }
    )
  }
} 