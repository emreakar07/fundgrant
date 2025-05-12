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

// GET - Fetch a specific analysis by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid analysis ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Fetching analysis with ID: ${id}...`)
    
    const analysis = await db.collection('analysis-data').findOne({
      _id: new ObjectId(id)
    })
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }
    
    // Format the analysis
    const formattedAnalysis = {
      ...analysis,
      id: analysis._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedAnalysis, { status: 200 })
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}

// PUT - Update an analysis
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid analysis ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db()
    
    const updateData = await request.json()
    console.log('Received update data:', JSON.stringify(updateData))
    
    // Remove id from update data if present
    const { id: analysisId, _id, ...analysisToUpdate } = updateData
    
    console.log(`Updating analysis with ID: ${id}...`)
    
    // Ensure that if questions is an array, it is properly handled
    if (analysisToUpdate.questions && Array.isArray(analysisToUpdate.questions)) {
      console.log(`Updating with ${analysisToUpdate.questions.length} questions`)
    } else if (analysisToUpdate.questions && typeof analysisToUpdate.questions === 'number') {
      console.log(`Updating with questions count: ${analysisToUpdate.questions}`)
    }
    
    const result = await db.collection('analysis-data').updateOne(
      { _id: new ObjectId(id) },
      { $set: analysisToUpdate }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }
    
    // Get the updated analysis
    const updatedAnalysis = await db.collection('analysis-data').findOne({
      _id: new ObjectId(id)
    })
    
    const formattedAnalysis = {
      ...updatedAnalysis,
      id: updatedAnalysis?._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedAnalysis, { status: 200 })
  } catch (error) {
    console.error('Error updating analysis:', error)
    return NextResponse.json(
      { error: 'Failed to update analysis' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an analysis
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid analysis ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Deleting analysis with ID: ${id}...`)
    
    const result = await db.collection('analysis-data').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: 'Analysis deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting analysis:', error)
    return NextResponse.json(
      { error: 'Failed to delete analysis' },
      { status: 500 }
    )
  }
} 