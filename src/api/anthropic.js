/**
 * Anthropic Claude Handler
 * Integrates with Anthropic's Claude API for comic grading
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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
 * Convert buffer to base64
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {string} - Base64 encoded data
 */
function bufferToBase64(imageBuffer) {
  return imageBuffer.toString('base64');
}

/**
 * Grade a comic using Anthropic Claude API
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
      const base64Image = bufferToBase64(imageBuffer);
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/jpeg',
          data: base64Image,
        },
      });
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    });

    const textResponse = response.content[0].text;

    return {
      success: true,
      provider: 'Claude',
      response: textResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Anthropic API error:', error);
    return {
      success: false,
      provider: 'Claude',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Check if Anthropic API is configured
 * @returns {boolean} - True if API key is configured
 */
export function isConfigured() {
  return !!process.env.ANTHROPIC_API_KEY;
}
