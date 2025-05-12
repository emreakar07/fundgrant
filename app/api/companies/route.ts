import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('API: Attempting to connect to MongoDB...')
    const client = await clientPromise
    console.log('API: Connected to MongoDB successfully')
    
    const db = client.db('fundgrant')
    console.log('API: Accessing database fundgrant')
    
    console.log('API: Querying companies collection')
    const companies = await db
      .collection('companies')
      .find({})
      .toArray()
    
    console.log(`API: Found ${companies.length} companies`)
    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch companies',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 