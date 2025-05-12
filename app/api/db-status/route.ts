import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

interface CollectionStat {
  exists: boolean;
  count?: number;
  hasDocuments?: boolean;
  sampleDocFields?: string[];
  error?: string;
}

export async function GET() {
  try {
    console.log('Checking MongoDB connection status...')
    const client = await clientPromise
    
    const admin = client.db().admin()
    const serverInfo = await admin.serverInfo()
    
    // Directly use fundgrant database instead of default db
    const db = client.db('fundgrant')
    const databaseName = db.databaseName
    
    // List collections
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    
    // Collections to check
    const collectionsToCheck = [
      'analysis-data', 
      'analysis-questions', 
      'document-sections', 
      'agents',
      'referenceDocuments',
      'companies',
      'funding-projects'
    ]
    
    // Get counts for each collection
    const collectionStats: Record<string, CollectionStat> = {}
    
    for (const collectionName of collectionsToCheck) {
      if (collectionNames.includes(collectionName)) {
        try {
          const count = await db.collection(collectionName).countDocuments()
          // Get a sample document to confirm schema
          const sampleDoc = count > 0 
            ? await db.collection(collectionName).findOne({})
            : null
            
          collectionStats[collectionName] = {
            exists: true,
            count,
            hasDocuments: count > 0,
            sampleDocFields: sampleDoc ? Object.keys(sampleDoc) : []
          }
        } catch (err) {
          console.error(`Error checking ${collectionName}:`, err)
          collectionStats[collectionName] = {
            exists: true,
            error: err instanceof Error ? err.message : 'Unknown error'
          }
        }
      } else {
        collectionStats[collectionName] = {
          exists: false,
          count: 0
        }
      }
    }
    
    // Check MongoDB URI without exposing credentials
    const uri = process.env.MONGODB_URI || 'not set'
    const uriInfo = {
      set: !!process.env.MONGODB_URI,
      includes: {
        atlas: uri.includes('mongodb.net'),
        localhost: uri.includes('localhost') || uri.includes('127.0.0.1')
      }
    }
    
    const result = {
      status: 'connected',
      version: serverInfo.version,
      database: databaseName,
      collections: collectionNames,
      connectionInfo: uriInfo,
      collectionStats
    }
    
    console.log('MongoDB connection status:', JSON.stringify(result, null, 2))
    
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    }, { status: 500 })
  }
} 