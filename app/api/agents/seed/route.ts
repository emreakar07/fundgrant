import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { mockData } from '@/lib/data'

export async function GET() {
  try {
    console.log('Seeding agents in MongoDB...')
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    // First check if we already have agents
    const existingCount = await db.collection('agents').countDocuments()
    console.log(`Found ${existingCount} existing agents`)
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already contains ${existingCount} agents. No seeding needed.`,
        count: existingCount
      }, { status: 200 })
    }
    
    // Convert the mock data to a format suitable for MongoDB
    const agentsToInsert = mockData.agents.map(({ id, ...rest }) => {
      return {
        ...rest,
        // Add timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
    
    // Insert the agents
    const result = await db.collection('agents').insertMany(agentsToInsert)
    
    console.log(`Successfully seeded ${result.insertedCount} agents`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} agents`,
      count: result.insertedCount,
      ids: Object.values(result.insertedIds).map(id => id.toString())
    }, { status: 201 })
  } catch (error) {
    console.error('Error seeding agents:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 