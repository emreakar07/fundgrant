import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { mkdir, writeFile } from 'fs/promises'

// Configure where files are stored
const UPLOAD_DIR = './public/uploads'

export async function POST(request: NextRequest) {
  try {
    // Parse the FormData from the request
    const formData = await request.formData()
    
    // Get project ID and section ID
    const projectId = formData.get('projectId') as string
    const sectionId = formData.get('sectionId') as string
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    // Extract files from the form data
    const files = formData.getAll('files') as File[]
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }
    
    // Create directories for the project if they don't exist
    const projectDir = path.join(UPLOAD_DIR, projectId)
    await mkdir(projectDir, { recursive: true })
    
    // Save files and prepare file metadata
    const savedFiles = await Promise.all(
      files.map(async (file) => {
        // Generate a unique file ID
        const fileId = uuidv4()
        
        // Get file extension
        const extension = path.extname(file.name)
        
        // Create a new filename to avoid conflicts
        const filename = `${fileId}${extension}`
        
        // Determine the path where the file will be saved
        const filePath = path.join(projectDir, filename)
        
        // Convert the file to an ArrayBuffer
        const buffer = await file.arrayBuffer()
        
        // Write the file to disk
        await writeFile(filePath, Buffer.from(buffer))
        
        // Create and return file metadata
        return {
          id: fileId,
          originalName: file.name,
          filename: filename,
          path: `/uploads/${projectId}/${filename}`,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          sectionId: sectionId || null
        }
      })
    )
    
    // Store file metadata in MongoDB
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    // Get project attachments collection
    const filesCollection = db.collection('project-attachments')
    
    // Insert file metadata into collection
    await Promise.all(
      savedFiles.map(async (file) => {
        await filesCollection.insertOne({
          ...file,
          projectId
        })
      })
    )
    
    // Update the project to track the attachment IDs
    const projectsCollection = db.collection('projects')
    
    // Bypass TypeScript type checking with 'as any' for both the query and update operations
    // This is needed because we're using string IDs instead of ObjectId
    await projectsCollection.updateOne(
      { _id: projectId } as any,
      { 
        $push: { 
          "attachments": { 
            $each: savedFiles.map(file => ({
              id: file.id,
              path: file.path,
              originalName: file.originalName,
              type: file.type,
              size: file.size,
              sectionId: file.sectionId
            }))
          } 
        } 
      } as any
    )
    
    return NextResponse.json({ 
      success: true, 
      files: savedFiles.map(file => ({
        id: file.id,
        name: file.originalName,
        size: file.size,
        type: file.type,
        url: file.path
      }))
    })
    
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'File upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Endpoint to get attachments for a specific project/section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const sectionId = searchParams.get('sectionId')
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    const filesCollection = db.collection('project-attachments')
    
    let query: any = { projectId }
    
    // If sectionId is provided, filter by section
    if (sectionId) {
      query.sectionId = sectionId
    }
    
    const files = await filesCollection.find(query).toArray()
    
    // Format the response
    const formattedFiles = files.map((file: any) => ({
      id: file.id,
      name: file.originalName,
      size: file.size,
      type: file.type,
      url: file.path
    }))
    
    return NextResponse.json({ files: formattedFiles })
    
  } catch (error) {
    console.error('Error fetching attachments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attachments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 