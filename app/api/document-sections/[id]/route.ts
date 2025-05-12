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

// GET - Fetch a specific document section by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid document section ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Fetching document section with ID: ${id}...`)
    
    const section = await db.collection('document-sections').findOne({
      _id: new ObjectId(id)
    })
    
    if (!section) {
      return NextResponse.json(
        { error: 'Document section not found' },
        { status: 404 }
      )
    }
    
    // Format the document section
    const formattedSection = {
      ...section,
      id: section._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedSection, { status: 200 })
  } catch (error) {
    console.error('Error fetching document section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document section' },
      { status: 500 }
    )
  }
}

// PUT - Update a document section
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid document section ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db()
    
    const updateData = await request.json()
    
    // Remove id from update data if present
    const { id: sectionId, _id, ...sectionToUpdate } = updateData
    
    console.log(`Updating document section with ID: ${id}...`)
    
    // Update the updatedAt timestamp
    sectionToUpdate.updatedAt = new Date().toISOString()
    
    const result = await db.collection('document-sections').updateOne(
      { _id: new ObjectId(id) },
      { $set: sectionToUpdate }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Document section not found' },
        { status: 404 }
      )
    }
    
    // Get the updated document section
    const updatedSection = await db.collection('document-sections').findOne({
      _id: new ObjectId(id)
    })
    
    const formattedSection = {
      ...updatedSection,
      id: updatedSection?._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedSection, { status: 200 })
  } catch (error) {
    console.error('Error updating document section:', error)
    return NextResponse.json(
      { error: 'Failed to update document section' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a document section
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid document section ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Deleting document section with ID: ${id}...`)
    
    const result = await db.collection('document-sections').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Document section not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: 'Document section deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting document section:', error)
    return NextResponse.json(
      { error: 'Failed to delete document section' },
      { status: 500 }
    )
  }
} 