import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    console.log('Starting to fetch documents from MongoDB...')
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    const db = client.db("fundgrant")
    console.log('Using database:', db.databaseName)
    
    // Get all documents from the referenceDocuments collection
    console.log('Querying referenceDocuments collection...')
    const documents = await db.collection('referenceDocuments').find({}).toArray()
    console.log(`Found ${documents.length} documents in MongoDB`)
    
    // Transform ObjectId to string for each document
    const formattedDocuments = documents.map(doc => {
      // Extract the _id
      const { _id, ...rest } = doc
      
      // Return the formatted document
      return {
        ...rest,
        id: _id.toString()
      }
    })
    
    console.log(`Retrieved and formatted ${formattedDocuments.length} documents from referenceDocuments collection`)
    
    return NextResponse.json(formattedDocuments, { status: 200 })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    // Parse the request body
    const documentData = await request.json()
    
    // Make sure we have at least a title
    if (!documentData.title) {
      return NextResponse.json(
        { error: 'Document title is required' },
        { status: 400 }
      )
    }
    
    // Remove id if present and add creation dates
    const { id, _id, ...newDocument } = documentData
    
    const now = new Date().toISOString()
    newDocument.uploadDate = newDocument.uploadDate || now
    newDocument.lastModified = newDocument.lastModified || now
    newDocument.status = newDocument.status || 'active'
    
    console.log('Creating new document:', newDocument.title)
    
    // Insert the new document
    const result = await db.collection('referenceDocuments').insertOne(newDocument)
    
    if (!result.insertedId) {
      throw new Error('Failed to insert document')
    }
    
    // Return the new document with the generated ID
    const createdDocument = {
      ...newDocument,
      id: result.insertedId.toString()
    }
    
    console.log(`Document created with ID: ${createdDocument.id}`)
    
    return NextResponse.json(createdDocument, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
} 