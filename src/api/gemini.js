/**
 * Gemini AI Handler
 * Integrates with Google's Gemini API for comic grading
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
 * Convert image to base64 for Gemini API
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {string} - Base64 encoded image
 */
function bufferToBase64(imageBuffer) {
  return imageBuffer.toString('base64');
}

/**
 * Grade a comic using Gemini API
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

    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prepare content parts
    const contentParts = [
      {
        text: `${systemPrompt}\n\n---\n\nPlease grade the following comic book:\n\nTitle: ${comicName}\nIssue #: ${issueNumber}\n\nAnalyze all provided images and provide your grading assessment.`,
      },
    ];

    // Add images to the request
    for (const imageBuffer of images) {
      const base64Image = bufferToBase64(imageBuffer);
      contentParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      });
    }

    const response = await model.generateContent(contentParts);
    const textResponse = response.response.text();

    return {
      success: true,
      provider: 'Gemini',
      response: textResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      success: false,
      provider: 'Gemini',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Check if Gemini API is configured
 * @returns {boolean} - True if API key is configured
 */
export function isConfigured() {
  return !!process.env.GEMINI_API_KEY;
}
