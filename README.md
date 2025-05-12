# AI Writing Workspace with LLM Integration

This project is an AI-powered writing assistant for creating EU funding applications. The application enables content generation with specialized AI agents and analysis for funding projects.

## New LLM Integration Features

We've added a new component and service for integrating with real LLM APIs:

### 1. OpenAI Service Integration

The `lib/openai-service.ts` file provides two key functions:

- `enhanceContent()`: Enhances existing content based on specific user instructions
- `simulateEnhanceContent()`: A simulation version for development/testing

### 2. Enhanced Writing Canvas with LLM

The `components/writing-canvas-with-llm.tsx` component adds the following features:

- The "Enhance with [Agent]" button is disabled until the user enters content
- When clicked, it opens a dialog for specific enhancement instructions
- User can enter instructions like "make more technical" or "emphasize benefits"
- Content is regenerated based on these specific instructions
- Undo functionality to revert to previous versions

## How to Implement

### 1. Set up OpenAI API

1. Get an API key from OpenAI at https://platform.openai.com/
2. Create a `.env.local` file in the root directory with:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### 2. Replace the Current Writing Canvas

Replace the current writing canvas with the LLM-enhanced version:

1. In `app/page.tsx`, update the import:
   ```typescript
   import WritingCanvas from "@/components/writing-canvas-with-llm"
   ```

### 3. For Production Use

For production, update the service to use the real OpenAI API:

1. In `writing-canvas-with-llm.tsx`, replace:
   ```typescript
   import { simulateEnhanceContent } from "@/lib/openai-service"
   ```

   With:
   ```typescript
   import { enhanceContent } from "@/lib/openai-service"
   ```

2. In the `handleRegenerateWithPrompt` function, replace:
   ```typescript
   const enhancedContent = await simulateEnhanceContent(...)
   ```

   With:
   ```typescript
   const enhancedContent = await enhanceContent(...)
   ```

## Usage Notes

1. The "Enhance with [Agent]" button will be disabled until the user enters some content.
2. When clicked, it opens a dialog where the user can enter specific instructions.
3. Content history is maintained, allowing users to undo changes if needed.
4. Different AI agents have different tones and specializations, affecting the enhanced content.

## Best Practices for Prompts

Encourage users to be specific in their enhancement instructions:

- "Make this section more technical, focusing on engineering specifications"
- "Emphasize the environmental impact more, with specific metrics"
- "Rewrite with a more formal tone for EU officials"
- "Make it more concise, focusing only on key benefits"
- "Add more persuasive language about cost-effectiveness"

## Future Enhancements

Possible future enhancements for the LLM integration:

1. Add preset prompt templates for common enhancement types
2. Implement a feedback system for tracking which enhancements produce the best results
3. Add version history with the ability to compare and merge different versions
4. Implement fine-tuning for specialized EU funding language
5. Add document analysis for comparing with successful applications 