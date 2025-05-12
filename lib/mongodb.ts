import { MongoClient } from 'mongodb'

// MongoDB Atlas connection string from environment variables
// No fallback to localhost - Atlas only
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set!');
  throw new Error('MONGODB_URI environment variable is required');
}

const URI = process.env.MONGODB_URI;
console.log('Using MongoDB Atlas connection');

// Connection options optimized for MongoDB Atlas
const options = {
  // Use more robust timeout settings for cloud connections
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Debug connection
async function createConnection() {
  try {
    console.log('Creating MongoDB Atlas connection...')
    console.log(`Connecting to MongoDB with URI prefix: ${URI.split('@')[0].substr(0, 15)}...`)
    
    client = new MongoClient(URI, options)
    const connectionPromise = client.connect()
    await connectionPromise
    
    // Test the connection by getting server info
    const serverInfo = await client.db().admin().serverInfo()
    console.log(`MongoDB connection successful (version ${serverInfo.version})`)
    
    // Always use 'fundgrant' as the database name
    const dbName = 'fundgrant'
    console.log(`Forcing database name to: ${dbName}`)
    
    const db = client.db(dbName)
    console.log(`Using database: ${db.databaseName}`)
    
    // Log available collections
    const collections = await db.listCollections().toArray()
    console.log(`Available collections in ${db.databaseName}:`, collections.map(c => c.name).join(', ') || 'none')
    
    // Create required collections if they don't exist
    const requiredCollections = [
      'referenceDocuments', 
      'document-sections', 
      'analysis-data',
      'analysis-questions',
      'agents',
      'companies',
      'funding-projects'
    ]
    
    for (const collectionName of requiredCollections) {
      if (!collections.some(c => c.name === collectionName)) {
        console.log(`Creating ${collectionName} collection...`)
        await db.createCollection(collectionName)
        console.log(`Collection ${collectionName} created successfully`)
      }
    }
    
    return connectionPromise
  } catch (error) {
    console.error('MongoDB connection error:', error)
    
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // Special case for common MongoDB connection errors
      if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
        console.error('Could not reach MongoDB server. Please check your network connection and MongoDB URI.')
      } else if (error.message.includes('Authentication failed')) {
        console.error('MongoDB authentication failed. Please check your username and password in the connection string.')
      } else if (error.message.includes('not authorized')) {
        console.error('MongoDB authorization failed. Please check if your user has the correct permissions.')
      }
    }
    
    throw error
  }
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  // across hot-reloads
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = createConnection()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, we'll create a new connection each time
  clientPromise = createConnection()
}

export default clientPromise 