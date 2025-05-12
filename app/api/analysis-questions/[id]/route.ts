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

// GET - Fetch a specific analysis question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid analysis question ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Fetching analysis question with ID: ${id}...`)
    
    const question = await db.collection('analysis-questions').findOne({
      _id: new ObjectId(id)
    })
    
    if (!question) {
      return NextResponse.json(
        { error: 'Analysis question not found' },
        { status: 404 }
      )
    }
    
    // Format the question
    const formattedQuestion = {
      ...question,
      id: question._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedQuestion, { status: 200 })
  } catch (error) {
    console.error('Error fetching analysis question:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis question' },
      { status: 500 }
    )
  }
}

// PUT - Update an analysis question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid analysis question ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    const updateData = await request.json()
    
    // Remove id from update data if present
    const { id: questionId, _id, ...questionToUpdate } = updateData
    
    console.log(`Updating analysis question with ID: ${id}...`)
    
    // Update the updatedAt timestamp
    questionToUpdate.updatedAt = new Date().toISOString()
    
    const result = await db.collection('analysis-questions').updateOne(
      { _id: new ObjectId(id) },
      { $set: questionToUpdate }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Analysis question not found' },
        { status: 404 }
      )
    }
    
    // Get the updated question
    const updatedQuestion = await db.collection('analysis-questions').findOne({
      _id: new ObjectId(id)
    })
    
    const formattedQuestion = {
      ...updatedQuestion,
      id: updatedQuestion?._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedQuestion, { status: 200 })
  } catch (error) {
    console.error('Error updating analysis question:', error)
    return NextResponse.json(
      { error: 'Failed to update analysis question' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an analysis question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid analysis question ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Deleting analysis question with ID: ${id}...`)
    
    const result = await db.collection('analysis-questions').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Analysis question not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: 'Analysis question deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting analysis question:', error)
    return NextResponse.json(
      { error: 'Failed to delete analysis question' },
      { status: 500 }
    )
  }
} 