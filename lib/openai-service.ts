/**
 * OpenAI Service
 * 
 * This file provides functions to interact with the OpenAI API
 * for generating content and analyzing project data.
 */

/**
 * Enhances existing content based on specific instructions
 * 
 * @param existingContent Current content 
 * @param instructions User instructions (e.g., "make more technical", "emphasize benefits more")
 * @param sectionInfo Information about the section
 * @param agentProfile Profile of the selected agent
 * @returns Enhanced content
 */
export async function enhanceContent(
  existingContent: string,
  instructions: string,
  sectionInfo: { title: string; description: string },
  agentProfile: { name: string; tone: string; specialization: string }
): Promise<string> {
  // Get the API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.");
  }
  
  try {
    // Construct the prompt for the OpenAI API
    const prompt = `
I have written the following content for the "${sectionInfo.title}" section of an EU funding application:

"""
${existingContent}
"""

Section description: ${sectionInfo.description}

I'd like you to enhance this content with the following instruction:
"${instructions}"

Please maintain the core information but revise it according to the instruction.
Write with a ${agentProfile.tone} tone, focusing on ${agentProfile.specialization}.
Keep the length similar to the original.
`;

    // Make the API call to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",  // Use the appropriate model
        messages: [
          {
            role: "system",
            content: `You are ${agentProfile.name}, an expert in writing EU funding applications with a ${agentProfile.tone} tone. You specialize in ${agentProfile.specialization}.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error enhancing content:", error);
    throw error;
  }
}

/**
 * Simulates the enhanceContent function without making an actual API call
 * Use this for development and testing
 */
export async function simulateEnhanceContent(
  existingContent: string,
  instructions: string,
  sectionInfo: { title: string; description: string },
  agentProfile: { name: string; tone: string; specialization: string }
): Promise<string> {
  console.log('Simulating content enhancement with instructions:', instructions);
  
  // Wait 2 seconds to simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a simulated enhanced version based on instructions
      let enhancedContent = existingContent;
      
      if (instructions.toLowerCase().includes('technical')) {
        enhancedContent += "\n\nEnhanced with more technical details: Our solution implements a multi-layered approach utilizing advanced algorithms and proprietary methodologies. The technical architecture ensures scalability with N+1 redundancy and fault tolerance.";
      }
      
      if (instructions.toLowerCase().includes('emotional') || instructions.toLowerCase().includes('persuasive')) {
        enhancedContent += "\n\nEnhanced with more emotional appeal: This innovation represents not just a technological advancement, but a profound shift in how we address the critical challenges facing our communities. The impact will be felt across generations, transforming lives and creating a more sustainable future for all.";
      }
      
      if (instructions.toLowerCase().includes('emphasize')) {
        enhancedContent += "\n\nWith emphasized benefits: Most importantly, this approach delivers significant cost savings while simultaneously increasing efficiency by 35%. The return on investment is expected within the first 18 months, making this an exceptionally valuable opportunity.";
      }
      
      if (instructions.toLowerCase().includes('concise') || instructions.toLowerCase().includes('shorter')) {
        // Create a shorter version by taking the first paragraph
        const firstParagraph = existingContent.split('\n\n')[0];
        enhancedContent = firstParagraph + "\n\n(Content made more concise as requested)";
      }
      
      // Add agent fingerprint
      enhancedContent += `\n\nThis content was enhanced by ${agentProfile.name} with a ${agentProfile.tone} tone, focusing on ${agentProfile.specialization}.`;
      
      resolve(enhancedContent);
    }, 2000);
  });
} 