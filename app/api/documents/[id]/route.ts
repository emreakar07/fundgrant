import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Function to check if a string is a valid ObjectId
function isValidObjectId(id: string) {
  try {
    new ObjectId(id)
    return true
  } catch (error) {
    return false
  }
}

// GET - Fetch a specific document by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid document ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Fetching document with ID: ${id}...`)
    
    const document = await db.collection('referenceDocuments').findOne({
      _id: new ObjectId(id)
    })
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    // Format the document
    const formattedDocument = {
      ...document,
      id: document._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedDocument, { status: 200 })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

// PUT - Update a document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid document ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    const updateData = await request.json()
    
    // Remove id from update data if present
    const { id: documentId, _id, ...documentToUpdate } = updateData
    
    console.log(`Updating document with ID: ${id}...`)
    
    // Add lastModified timestamp
    documentToUpdate.lastModified = new Date().toISOString()
    
    const result = await db.collection('referenceDocuments').updateOne(
      { _id: new ObjectId(id) },
      { $set: documentToUpdate }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    // Get the updated document
    const updatedDocument = await db.collection('referenceDocuments').findOne({
      _id: new ObjectId(id)
    })
    
    const formattedDocument = {
      ...updatedDocument,
      id: updatedDocument?._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedDocument, { status: 200 })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid document ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db()
    
    console.log(`Deleting document with ID: ${id}...`)
    
    const result = await db.collection('referenceDocuments').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
} 