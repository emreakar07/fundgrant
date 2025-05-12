import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    // Get company and project IDs from query parameters
    const searchParams = request.nextUrl.searchParams
    const companyId = searchParams.get('companyId')
    const projectId = searchParams.get('projectId')
    const projectName = searchParams.get('projectName')
    
    // At least one parameter is required
    if (!companyId && !projectId && !projectName) {
      return NextResponse.json(
        { error: 'Either companyId, projectId, or projectName query parameter is required' },
        { status: 400 }
      )
    }
    
    console.log(`Fetching analysis questions for company: ${companyId}, project ID: ${projectId}, project name: ${projectName}`)
    
    const client = await clientPromise
    const db = client.db("fundgrant")
    
    // Build query based on provided parameters
    const query: any = {}
    const orConditions = []
    
    if (companyId) {
      query.companyId = companyId
    }
    
    if (projectId) {
      // Search for direct projectId match
      orConditions.push({ projectId: projectId })
      
      // Search in relatedProjects array for the ID
      orConditions.push({ relatedProjects: { $in: [projectId] } })
    }
    
    if (projectName) {
      // Search in relatedProjects array for the name
      orConditions.push({ relatedProjects: { $in: [projectName] } })
      
      // Create a regex pattern for partial project name matching
      const namePattern = new RegExp(projectName, 'i')  // case insensitive
      
      // Search in projectName field
      orConditions.push({ projectName: namePattern })
      
      // Search in relatedProjects array with regex (for partial matches)
      orConditions.push({ relatedProjects: { $elemMatch: { $regex: namePattern } } })
    }
    
    // Add the OR conditions to the query if we have any
    if (orConditions.length > 0) {
      query.$or = orConditions
    }
    
    console.log('Executing query:', JSON.stringify(query))
    
    // Get analysis questions that match the query
    const questions = await db.collection('analysis-questions').find(query).toArray()
    console.log(`Found ${questions.length} analysis questions matching the criteria`)
    
    // Transform ObjectId to string for each question
    const formattedQuestions = questions.map(question => {
      // Extract the _id
      const { _id, ...rest } = question
      
      // Return the formatted question
      return {
        ...rest,
        id: _id.toString()
      }
    })
    
    return NextResponse.json(formattedQuestions, { status: 200 })
  } catch (error) {
    console.error('Error fetching analysis questions by project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis questions' },
      { status: 500 }
    )
  }
} 