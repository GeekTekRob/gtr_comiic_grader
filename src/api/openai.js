/**
 * OpenAI GPT-4o Handler
 * Integrates with OpenAI's GPT-4o API for comic grading
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let systemPrompt = '';

// Load system prompt on module initialization
async function loadSystemPrompt() {
  if (!systemPrompt) {
    const promptPath = path.join(__dirname, '..', 'prompts', 'systemPrompt.txt');
    systemPrompt = fs.readFileSync(promptPath, 'utf-8');
  }
}

await loadSystemPrompt();

/**
 * Convert buffer to base64 data URL
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {string} - Data URL
 */
function bufferToDataUrl(imageBuffer) {
  const base64 = imageBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Grade a comic using OpenAI GPT-4o API
 * @param {object} params - Grading parameters
 * @param {string} params.comicName - Comic title
 * @param {string} params.issueNumber - Issue number
 * @param {Buffer[]} params.images - Array of image buffers
 * @returns {Promise<object>} - Grading response
 */
export async function gradeComic(params) {
  const { comicName, issueNumber, images } = params;

  try {
    if (!images || images.length === 0) {
      throw new Error('No images provided for grading');
    }

    // Prepare message content
    const content = [
      {
        type: 'text',
        text: `${systemPrompt}\n\n---\n\nPlease grade the following comic book:\n\nTitle: ${comicName}\nIssue #: ${issueNumber}\n\nAnalyze all provided images and provide your grading assessment.`,
      },
    ];

    // Add images to the request
    for (const imageBuffer of images) {
      const imageUrl = bufferToDataUrl(imageBuffer);
      content.push({
        type: 'image_url',
        image_url: {
          url: imageUrl,
          detail: 'high',
        },
      });
    }

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    });

    const textResponse = response.choices[0].message.content;

    return {
      success: true,
      provider: 'OpenAI',
      response: textResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      success: false,
      provider: 'OpenAI',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Check if OpenAI API is configured
 * @returns {boolean} - True if API key is configured
 */
export function isConfigured() {
  return !!process.env.OPENAI_API_KEY;
}
