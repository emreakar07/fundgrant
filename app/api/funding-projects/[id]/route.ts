import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    let query = {}
    
    // Check if ID is a valid ObjectId format or a string ID
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { id: id }
    }
    
    const client = await clientPromise
    const db = client.db('fundgrant')
    
    const project = await db.collection('funding-projects').findOne(query)
    
    if (!project) {
      return NextResponse.json(
        { error: 'Funding project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching funding project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch funding project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    let query = {}
    
    // Check if ID is a valid ObjectId format or a string ID
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { id: id }
    }
    
    const client = await clientPromise
    const db = client.db('fundgrant')
    
    const result = await db.collection('funding-projects').deleteOne(query)
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Funding project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting funding project:', error)
    return NextResponse.json(
      { error: 'Failed to delete funding project' },
      { status: 500 }
    )
  }
} 