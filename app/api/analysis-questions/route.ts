import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    console.log('Starting to fetch analysis questions from MongoDB...')
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    // Directly use fundgrant database instead of default db
    const db = client.db('fundgrant')
    console.log('Using database:', db.databaseName)
    
    // First check if the collection exists
    const collections = await db.listCollections().toArray()
    const collectionExists = collections.some(c => c.name === 'analysis-questions')
    console.log(`Collection 'analysis-questions' exists: ${collectionExists}`)
    
    if (!collectionExists) {
      console.log('Creating analysis-questions collection...')
      await db.createCollection('analysis-questions')
      console.log('Collection analysis-questions created')
      return NextResponse.json([], { status: 200 })
    }
    
    // Get all analysis questions from the analysis-questions collection
    console.log('Querying analysis-questions collection...')
    
    // First count documents to verify
    const count = await db.collection('analysis-questions').countDocuments()
    console.log(`Total document count in analysis-questions: ${count}`)
    
    // Get a sample document to check structure
    if (count > 0) {
      const sample = await db.collection('analysis-questions').findOne({})
      console.log('Sample document structure:', JSON.stringify(sample ? Object.keys(sample) : null))
    }
    
    const questions = await db.collection('analysis-questions').find({}).toArray()
    console.log(`Found ${questions.length} analysis questions in MongoDB`)
    
    // Transform ObjectId to string for each question
    const formattedQuestions = questions.map(question => {
      // Extract the _id
      const { _id, ...rest } = question
      
      // Return the formatted question
      return {
        ...rest,
        id: _id.toString()
      }
    })
    
    console.log(`Retrieved and formatted ${formattedQuestions.length} analysis questions`)
    
    return NextResponse.json(formattedQuestions, { status: 200 })
  } catch (error) {
    console.error('Error fetching analysis questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis questions' },
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
    const questionData = await request.json()
    
    // Make sure we have required fields
    if (!questionData.question) {
      return NextResponse.json(
        { error: 'Question text is required' },
        { status: 400 }
      )
    }
    
    // Remove id if present and prepare new question
    const { id, _id, ...newQuestion } = questionData
    
    // Set default values if not provided
    newQuestion.answer = newQuestion.answer || ""
    newQuestion.category = newQuestion.category || "General"
    newQuestion.projectId = newQuestion.projectId || null
    newQuestion.companyId = newQuestion.companyId || null
    newQuestion.isRequired = newQuestion.isRequired !== undefined ? newQuestion.isRequired : true
    newQuestion.createdAt = new Date().toISOString()
    newQuestion.updatedAt = new Date().toISOString()
    
    console.log('Creating new analysis question:', newQuestion.question)
    
    // Insert the new question
    const result = await db.collection('analysis-questions').insertOne(newQuestion)
    
    if (!result.insertedId) {
      throw new Error('Failed to insert analysis question')
    }
    
    // Return the new question with the generated ID
    const createdQuestion = {
      ...newQuestion,
      id: result.insertedId.toString()
    }
    
    console.log(`Analysis question created with ID: ${createdQuestion.id}`)
    
    return NextResponse.json(createdQuestion, { status: 201 })
  } catch (error) {
    console.error('Error creating analysis question:', error)
    return NextResponse.json(
      { error: 'Failed to create analysis question' },
      { status: 500 }
    )
  }
} 