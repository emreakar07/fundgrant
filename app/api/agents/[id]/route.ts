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

// GET - Fetch a specific agent by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db()
    
    console.log(`Fetching agent with ID: ${id}...`)
    
    const agent = await db.collection('agents').findOne({
      _id: new ObjectId(id)
    })
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }
    
    // Format the agent
    const formattedAgent = {
      ...agent,
      id: agent._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedAgent, { status: 200 })
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}

// PUT - Update an agent
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    const updateData = await request.json()
    
    // Remove id from update data if present
    const { id: agentId, _id, ...agentToUpdate } = updateData
    
    console.log(`Updating agent with ID: ${id}...`)
    
    // Update the updatedAt timestamp
    agentToUpdate.updatedAt = new Date().toISOString()
    
    const result = await db.collection('agents').updateOne(
      { _id: new ObjectId(id) },
      { $set: agentToUpdate }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }
    
    // Get the updated agent
    const updatedAgent = await db.collection('agents').findOne({
      _id: new ObjectId(id)
    })
    
    const formattedAgent = {
      ...updatedAgent,
      id: updatedAgent?._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedAgent, { status: 200 })
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Deleting agent with ID: ${id}...`)
    
    const result = await db.collection('agents').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: 'Agent deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    )
  }
} 