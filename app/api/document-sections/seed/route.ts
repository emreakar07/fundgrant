import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { documentSectionsData } from '@/lib/document-sections-data'

export async function GET() {
  try {
    console.log('Seeding document sections in MongoDB...')
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    // First check if we already have document sections
    const existingCount = await db.collection('document-sections').countDocuments()
    console.log(`Found ${existingCount} existing document sections`)
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already contains ${existingCount} document sections. No seeding needed.`,
        count: existingCount
      }, { status: 200 })
    }
    
    // Convert the mock data to a format suitable for MongoDB
    const sectionsToInsert = documentSectionsData.map(({ id, ...rest }) => {
      return {
        ...rest,
        // Use the same timestamps for both fields at first
        createdAt: rest.createdAt || new Date().toISOString(),
        updatedAt: rest.updatedAt || new Date().toISOString()
      }
    })
    
    // Insert the document sections
    const result = await db.collection('document-sections').insertMany(sectionsToInsert)
    
    console.log(`Successfully seeded ${result.insertedCount} document sections`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} document sections`,
      count: result.insertedCount,
      ids: Object.values(result.insertedIds).map(id => id.toString())
    }, { status: 201 })
  } catch (error) {
    console.error('Error seeding document sections:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 