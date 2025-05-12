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
    
    const company = await db.collection('companies').findOne(query)
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    
    // Get request body
    const updatedCompany = await request.json()
    
    // Remove _id if exists to avoid MongoDB error
    if (updatedCompany._id) {
      delete updatedCompany._id
    }
    
    const result = await db.collection('companies').updateOne(
      query,
      { $set: updatedCompany }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }
    
    // Return the updated company
    const updated = await db.collection('companies').findOne(query)
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { error: 'Failed to update company' },
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
    
    const result = await db.collection('companies').deleteOne(query)
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    )
  }
} 