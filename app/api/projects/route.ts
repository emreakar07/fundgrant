import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

/**
 * GET - Fetch all projects
 */
export async function GET() {
  try {
    console.log('Starting to fetch projects from MongoDB...')
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    const db = client.db("fundgrant")
    console.log('Using database:', db.databaseName)
    
    // Get all projects from the projects collection
    console.log('Querying projects collection...')
    const projects = await db.collection('projects').find({}).toArray()
    console.log(`Found ${projects.length} projects in MongoDB`)
    
    // Transform ObjectId to string for each project
    const formattedProjects = projects.map(project => {
      // Extract the _id
      const { _id, ...rest } = project
      
      // Return the formatted project
      return {
        ...rest,
        id: _id.toString()
      }
    })
    
    console.log(`Retrieved and formatted ${formattedProjects.length} projects from projects collection`)
    
    return NextResponse.json(formattedProjects, { status: 200 })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create a new project or update an existing one
 */
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    // Parse the request body
    const projectData = await request.json()
    
    // If projectId is provided, try to update existing project
    if (projectData.projectId) {
      // Check if project exists
      const existingProject = await db.collection('projects').findOne({
        _id: new ObjectId(projectData.projectId)
      })
      
      if (existingProject) {
        // Update existing project
        console.log(`Updating existing project with ID: ${projectData.projectId}`)
        
        // Update the project with new data
        const updateResult = await db.collection('projects').updateOne(
          { _id: new ObjectId(projectData.projectId) },
          { 
            $set: {
              updatedAt: new Date().toISOString(),
              ...projectData
            } 
          }
        )
        
        if (updateResult.modifiedCount === 0) {
          console.warn('No changes were made to the project')
        }
        
        // Get the updated project
        const updatedProject = await db.collection('projects').findOne({
          _id: new ObjectId(projectData.projectId)
        })
        
        const formattedProject = {
          ...updatedProject,
          id: updatedProject?._id.toString()
        }
        
        return NextResponse.json(formattedProject, { status: 200 })
      }
    }
    
    // Create a new project if no existing project was found or no projectId was provided
    console.log('Creating new project...')
    
    // Remove id fields if present
    const { id, _id, projectId, ...newProject } = projectData
    
    // Add timestamps
    const now = new Date().toISOString()
    newProject.createdAt = now
    newProject.updatedAt = now
    
    // Insert the new project
    const result = await db.collection('projects').insertOne(newProject)
    
    if (!result.insertedId) {
      throw new Error('Failed to create project')
    }
    
    // Return the new project with the generated ID
    const createdProject = {
      ...newProject,
      id: result.insertedId.toString()
    }
    
    console.log(`Project created with ID: ${createdProject.id}`)
    
    return NextResponse.json(createdProject, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating project:', error)
    return NextResponse.json(
      { error: 'Failed to create/update project' },
      { status: 500 }
    )
  }
} 