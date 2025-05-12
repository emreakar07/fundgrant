import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    console.log('Starting to fetch agents from MongoDB...')
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    // Directly use fundgrant database instead of default db
    const db = client.db('fundgrant')
    console.log('Using database:', db.databaseName)
    
    // First check if the collection exists
    const collections = await db.listCollections().toArray()
    const collectionExists = collections.some(c => c.name === 'agents')
    console.log(`Collection 'agents' exists: ${collectionExists}`)
    
    if (!collectionExists) {
      console.log('Creating agents collection...')
      await db.createCollection('agents')
      console.log('Collection agents created')
      return NextResponse.json([], { status: 200 })
    }
    
    // Get all agents from the agents collection
    console.log('Querying agents collection...')
    
    // First count documents to verify
    const count = await db.collection('agents').countDocuments()
    console.log(`Total document count in agents: ${count}`)
    
    // Get a sample document to check structure
    if (count > 0) {
      const sample = await db.collection('agents').findOne({})
      console.log('Sample document structure:', JSON.stringify(sample ? Object.keys(sample) : null))
    }
    
    const agents = await db.collection('agents').find({}).toArray()
    console.log(`Found ${agents.length} agents in MongoDB`)
    
    // Transform ObjectId to string for each agent
    const formattedAgents = agents.map(agent => {
      // Extract the _id
      const { _id, ...rest } = agent
      
      // Return the formatted agent
      return {
        ...rest,
        id: _id.toString()
      }
    })
    
    console.log(`Retrieved and formatted ${formattedAgents.length} agents from agents collection`)
    
    return NextResponse.json(formattedAgents, { status: 200 })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
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
    const agentData = await request.json()
    
    // Make sure we have required fields
    if (!agentData.name || !agentData.tone || !agentData.specialization) {
      return NextResponse.json(
        { error: 'Name, tone, and specialization are required' },
        { status: 400 }
      )
    }
    
    // Remove id if present and add metadata
    const { id, _id, ...newAgent } = agentData
    
    // Set default values if not provided
    newAgent.isRecommended = newAgent.isRecommended || false
    newAgent.createdAt = new Date().toISOString()
    newAgent.updatedAt = new Date().toISOString()
    
    console.log('Creating new agent:', newAgent.name)
    
    // Insert the new agent
    const result = await db.collection('agents').insertOne(newAgent)
    
    if (!result.insertedId) {
      throw new Error('Failed to insert agent')
    }
    
    // Return the new agent with the generated ID
    const createdAgent = {
      ...newAgent,
      id: result.insertedId.toString()
    }
    
    console.log(`Agent created with ID: ${createdAgent.id}`)
    
    return NextResponse.json(createdAgent, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
} 