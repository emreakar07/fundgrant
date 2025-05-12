import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

/**
 * GET - Migrate sections from document-sections to projects
 */
export async function GET(request: NextRequest) {
  try {
    console.log('Starting migration from document-sections to projects...')
    const client = await clientPromise
    const db = client.db("fundgrant")
    // Check for project ID
    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId parameter is required' },
        { status: 400 }
      )
    }
    
    // Validate the project ID format and fetch project
    let project: any = null;
    try {
      project = await db.collection('projects').findOne({
        _id: new ObjectId(projectId)
      })
    } catch (error) {
      console.log('Using projectId as string identifier for test/demo')
      project = await db.collection('projects').findOne({ id: projectId })
    }
    
    if (!project) {
      // If project doesn't exist, create a new one
      console.log(`Creating new project with ID: ${projectId}`)
      
      const newProject = {
        id: projectId, // Keep original ID for reference
        name: `Project ${projectId}`,
        description: 'Auto-generated project from migration',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: []
      }
      
      const result = await db.collection('projects').insertOne(newProject)
      
      if (!result.insertedId) {
        return NextResponse.json(
          { error: 'Failed to create project' },
          { status: 500 }
        )
      }
      
      project = await db.collection('projects').findOne({
        _id: result.insertedId
      })
      
      if (!project) {
        return NextResponse.json(
          { error: 'Failed to retrieve newly created project' },
          { status: 500 }
        )
      }
    }
    
    // Fetch all sections from document-sections
    console.log('Fetching sections from document-sections...')
    const sections = await db.collection('document-sections').find({}).toArray()
    console.log(`Found ${sections.length} sections in document-sections`)
    
    // If project doesn't have sections array, initialize it
    if (!project.sections) {
      project.sections = []
    }
    
    // Transform and add sections to project
    let updatedCount = 0
    for (const section of sections) {
      // Check if section already exists in project
      const existingSectionIndex = project.sections.findIndex(
        (s: any) => s.id === section.id
      )
      
      // Prepare section data for project
      const sectionData = {
        id: section.id,
        title: section.title,
        description: section.description || '',
        content: section.content || '',
        wordCount: section.wordCount || 0,
        status: section.status || 'not_started',
        required: section.required || false,
        hasWarning: section.hasWarning || false,
        createdAt: section.createdAt || new Date().toISOString(),
        updatedAt: section.updatedAt || new Date().toISOString()
      }
      
      if (existingSectionIndex >= 0) {
        // Update existing section
        console.log(`Updating existing section: ${section.id}`)
        project.sections[existingSectionIndex] = {
          ...project.sections[existingSectionIndex],
          ...sectionData,
          updatedAt: new Date().toISOString()
        }
      } else {
        // Add new section
        console.log(`Adding new section: ${section.id}`)
        project.sections.push(sectionData)
      }
      
      updatedCount++
    }
    
    // Update project with migrated sections
    const updateResult = await db.collection('projects').updateOne(
      { _id: project._id },
      {
        $set: {
          sections: project.sections,
          updatedAt: new Date().toISOString()
        }
      }
    )
    
    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update project with sections' },
        { status: 500 }
      )
    }
    
    console.log(`Successfully migrated ${updatedCount} sections to project ${projectId}`)
    
    return NextResponse.json({
      message: `Successfully migrated ${updatedCount} sections to project ${projectId}`,
      projectId: project._id.toString(),
      sectionsCount: updatedCount
    }, { status: 200 })
  } catch (error) {
    console.error('Error during migration:', error)
    return NextResponse.json(
      { error: 'Failed to migrate sections' },
      { status: 500 }
    )
  }
} 