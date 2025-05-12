import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

/**
 * Helper function to check if a string is a valid ObjectId
 */
function isValidObjectId(id: string) {
  // Check if ID matches a test/demo pattern like 'proj-1', 'proj-xyz', etc.
  if (id.startsWith('proj-')) {
    return true;
  }
  
  try {
    new ObjectId(id)
    return true
  } catch (error) {
    return false
  }
}

/**
 * GET - Fetch a specific project by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID from URL path instead of directly from params
    const pathname = request.nextUrl.pathname;
    const idMatch = pathname.match(/\/api\/projects\/([^\/]+)/);
    const id = idMatch ? idMatch[1] : null;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID not found in the URL' },
        { status: 400 }
      );
    }
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    console.log(`Fetching project with ID: ${id}...`)
    
    // Try to find project using MongoDB ObjectId
    let project = null
    try {
      project = await db.collection('projects').findOne({
        _id: new ObjectId(id)
      })
    } catch (error) {
      console.log('Invalid ObjectId format, searching by string ID')
    }
    
    // If not found and this is a test ID, try finding by string ID
    if (!project && id.startsWith('proj-')) {
      console.log(`Searching for test project with ID string: ${id}`)
      project = await db.collection('projects').findOne({ id: id })
      
      // If still not found, create a new test project
      if (!project) {
        console.log(`Creating new test project with ID: ${id}`)
        
        const newProject = {
          id: id,
          name: `Project ${id}`,
          description: 'Auto-generated test project',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: []
        }
        
        const result = await db.collection('projects').insertOne(newProject)
        
        project = await db.collection('projects').findOne({
          _id: result.insertedId
        })
      }
    }
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Format the project
    const formattedProject = {
      ...project,
      id: project._id ? project._id.toString() : project.id
    }
    
    return NextResponse.json(formattedProject, { status: 200 })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Replace a project
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID from URL path instead of directly from params
    const pathname = request.nextUrl.pathname;
    const idMatch = pathname.match(/\/api\/projects\/([^\/]+)/);
    const id = idMatch ? idMatch[1] : null;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID not found in the URL' },
        { status: 400 }
      );
    }
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    const updateData = await request.json()
    
    // Remove id from update data if present
    const { id: projectId, _id, ...projectToUpdate } = updateData
    
    console.log(`Updating entire project with ID: ${id}...`)
    
    // Update the updatedAt timestamp
    projectToUpdate.updatedAt = new Date().toISOString()
    
    const result = await db.collection('projects').replaceOne(
      { _id: new ObjectId(id) },
      projectToUpdate
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Get the updated project
    const updatedProject = await db.collection('projects').findOne({
      _id: new ObjectId(id)
    })
    
    const formattedProject = {
      ...updatedProject,
      id: updatedProject?._id.toString()
    }
    
    return NextResponse.json(formattedProject, { status: 200 })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

/**
 * PATCH - Update specific fields of a project, particularly for updating sections
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID from URL path instead of directly from params
    const pathname = request.nextUrl.pathname;
    const idMatch = pathname.match(/\/api\/projects\/([^\/]+)/);
    const id = idMatch ? idMatch[1] : null;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID not found in the URL' },
        { status: 400 }
      );
    }
    
    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db()
    
    const updateData = await request.json()
    console.log('Update data received:', updateData)
    
    // Get the existing project
    let existingProject = null;
    
    // Try to find by MongoDB ObjectId first
    try {
      existingProject = await db.collection('projects').findOne({
        _id: new ObjectId(id)
      });
    } catch (error) {
      console.log('Not a valid ObjectId, searching by string ID instead');
    }
    
    // If not found and this is a test/demo ID (e.g., "proj-1"), search by string ID
    if (!existingProject && id.startsWith('proj-')) {
      console.log(`Searching for test project with ID string: ${id}`);
      existingProject = await db.collection('projects').findOne({ id: id });
    }
    
    if (!existingProject) {
      // If project still not found, create a new one for test/demo IDs
      if (id.startsWith('proj-')) {
        console.log(`Creating new test project with ID: ${id}`);
        
        const newProject = {
          id: id, // Keep original string ID for reference
          name: `Project ${id}`,
          description: 'Auto-generated project',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: []
        };
        
        const result = await db.collection('projects').insertOne(newProject);
        
        existingProject = await db.collection('projects').findOne({
          _id: result.insertedId
        });
        
        if (!existingProject) {
          return NextResponse.json(
            { error: 'Failed to create and retrieve project' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
    }
    
    // Handle section update
    if (updateData.sectionId) {
      console.log(`Updating section ${updateData.sectionId} for project ${id}...`)
      
      // Initialize sections array if it doesn't exist
      if (!existingProject.sections) {
        existingProject.sections = []
      }
      
      // Find if section already exists
      const sectionIndex = existingProject.sections.findIndex(
        (section: any) => section.id === updateData.sectionId
      )
      
      if (sectionIndex >= 0) {
        // Update existing section
        existingProject.sections[sectionIndex] = {
          ...existingProject.sections[sectionIndex],
          content: updateData.content,
          wordCount: updateData.content.split(/\s+/).filter(Boolean).length,
          status: updateData.status || existingProject.sections[sectionIndex].status,
          updatedAt: new Date().toISOString(),
        }
      } else {
        // Add new section
        existingProject.sections.push({
          id: updateData.sectionId,
          title: updateData.title || 'Untitled Section',
          description: updateData.description || '',
          content: updateData.content,
          wordCount: updateData.content.split(/\s+/).filter(Boolean).length,
          status: updateData.status || 'in_progress',
          required: updateData.required || false,
          hasWarning: updateData.hasWarning || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      // Update the project with the modified sections
      let updateResult;
      
      // If the project has a MongoDB _id, use that for updating
      if (existingProject._id) {
        updateResult = await db.collection('projects').updateOne(
          { _id: existingProject._id },
          { 
            $set: {
              sections: existingProject.sections,
              updatedAt: new Date().toISOString()
            } 
          }
        );
      } 
      // Otherwise use the string id for test/demo projects
      else if (existingProject.id) {
        updateResult = await db.collection('projects').updateOne(
          { id: existingProject.id },
          { 
            $set: {
              sections: existingProject.sections,
              updatedAt: new Date().toISOString()
            } 
          }
        );
      } else {
        return NextResponse.json(
          { error: 'Could not determine project identifier for update' },
          { status: 500 }
        );
      }
      
      if (updateResult && updateResult.modifiedCount === 0) {
        return NextResponse.json(
          { error: 'Failed to update project section' },
          { status: 500 }
        )
      }
      
      // Get the updated project
      let updatedProject = null;
      
      // Try to fetch by MongoDB _id first
      if (existingProject._id) {
        updatedProject = await db.collection('projects').findOne({
          _id: existingProject._id
        });
      } 
      // Otherwise try the string id for test/demo projects
      else if (existingProject.id) {
        updatedProject = await db.collection('projects').findOne({
          id: existingProject.id
        });
      }
      
      if (!updatedProject) {
        return NextResponse.json(
          { error: 'Failed to retrieve updated project' },
          { status: 500 }
        );
      }
      
      const formattedProject = {
        ...updatedProject,
        id: updatedProject._id ? updatedProject._id.toString() : updatedProject.id
      }
      
      return NextResponse.json(formattedProject, { status: 200 })
    } else {
      // Handle other field updates
      console.log(`Updating fields for project ${id}...`)
      
      // Remove any id fields
      const { id: projectId, _id, sectionId, ...fieldsToUpdate } = updateData
      
      // Always update the timestamp
      fieldsToUpdate.updatedAt = new Date().toISOString()
      
      // Determine which ID to use for the update
      const updateQuery = existingProject._id 
        ? { _id: existingProject._id }
        : { id: existingProject.id };
      
      const result = await db.collection('projects').updateOne(
        updateQuery,
        { $set: fieldsToUpdate }
      )
      
      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: 'No changes made to the project' },
          { status: 400 }
        )
      }
      
      // Get the updated project using the same query
      const updatedProject = await db.collection('projects').findOne(updateQuery)
      
      if (!updatedProject) {
        return NextResponse.json(
          { error: 'Failed to retrieve updated project' },
          { status: 500 }
        );
      }
      
      const formattedProject = {
        ...updatedProject,
        id: updatedProject._id ? updatedProject._id.toString() : updatedProject.id
      }
      
      return NextResponse.json(formattedProject, { status: 200 })
    }
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
} 