import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('API: Attempting to connect to MongoDB...')
    const client = await clientPromise
    console.log('API: Connected to MongoDB successfully')
    
    const db = client.db('fundgrant')
    console.log('API: Accessing database fundgrant')
    
    console.log('API: Querying funding-projects collection')
    const fundingProjects = await db
      .collection('funding-projects')
      .find({})
      .toArray()
    
    console.log(`API: Found ${fundingProjects.length} funding projects`)
    return NextResponse.json(fundingProjects)
  } catch (error) {
    console.error('Error fetching funding projects:', error)
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to fetch funding projects',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 