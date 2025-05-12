import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    console.log('Starting to fetch document sections from MongoDB...')
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    // Directly use fundgrant database instead of default db
    const db = client.db('fundgrant')
    console.log('Using database:', db.databaseName)
    
    // First check if the collection exists
    const collections = await db.listCollections().toArray()
    const collectionExists = collections.some(c => c.name === 'document-sections')
    console.log(`Collection 'document-sections' exists: ${collectionExists}`)
    
    if (!collectionExists) {
      console.log('Creating document-sections collection...')
      await db.createCollection('document-sections')
      console.log('Collection document-sections created')
      return NextResponse.json([], { status: 200 })
    }
    
    // Get all document sections from the document-sections collection
    console.log('Querying document-sections collection...')
    
    // First count documents to verify
    const count = await db.collection('document-sections').countDocuments()
    console.log(`Total document count in document-sections: ${count}`)
    
    // Get a sample document to check structure
    if (count > 0) {
      const sample = await db.collection('document-sections').findOne({})
      console.log('Sample document structure:', JSON.stringify(sample ? Object.keys(sample) : null))
    }
    
    const sections = await db.collection('document-sections').find({}).toArray()
    console.log(`Found ${sections.length} document sections in MongoDB`)
    
    // Transform ObjectId to string for each section
    const formattedSections = sections.map(section => {
      // Extract the _id
      const { _id, ...rest } = section
      
      // Return the formatted section
      return {
        ...rest,
        id: _id.toString()
      }
    })
    
    console.log(`Retrieved and formatted ${formattedSections.length} document sections from document-sections collection`)
    
    return NextResponse.json(formattedSections, { status: 200 })
  } catch (error) {
    console.error('Error fetching document sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document sections' },
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
    const sectionData = await request.json()
    
    // Make sure we have required fields
    if (!sectionData.title || !sectionData.category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      )
    }
    
    // Remove id if present and add creation/update dates
    const { id, _id, ...newSection } = sectionData
    
    const now = new Date().toISOString()
    newSection.createdAt = newSection.createdAt || now
    newSection.updatedAt = now
    
    // Set default values if not provided
    newSection.isRequired = newSection.isRequired ?? false
    newSection.associatedProjects = newSection.associatedProjects || []
    
    // If order is not provided, place it at the end
    if (!newSection.order) {
      const lastSection = await db.collection('document-sections')
        .find({})
        .sort({ order: -1 })
        .limit(1)
        .toArray()
      
      newSection.order = lastSection.length > 0 ? lastSection[0].order + 1 : 1
    }
    
    console.log('Creating new document section:', newSection.title)
    
    // Insert the new section
    const result = await db.collection('document-sections').insertOne(newSection)
    
    if (!result.insertedId) {
      throw new Error('Failed to insert document section')
    }
    
    // Return the new section with the generated ID
    const createdSection = {
      ...newSection,
      id: result.insertedId.toString()
    }
    
    console.log(`Document section created with ID: ${createdSection.id}`)
    
    return NextResponse.json(createdSection, { status: 201 })
  } catch (error) {
    console.error('Error creating document section:', error)
    return NextResponse.json(
      { error: 'Failed to create document section' },
      { status: 500 }
    )
  }
} 