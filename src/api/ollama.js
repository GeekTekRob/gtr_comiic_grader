/**
 * Ollama Local Vision Model Handler
 * Integrates with Ollama for local vision models like llama3-vision, qwen3-vl, etc.
 * Requires Ollama running locally
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ollama API client
const ollamaClient = axios.create({
  baseURL: process.env.OLLAMA_API_URL || 'http://localhost:11434',
  timeout: 600000, // 10 minute timeout for local processing
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
 * @returns {string} - Base64 encoded image
 */
function bufferToBase64(imageBuffer) {
  return imageBuffer.toString('base64');
}

/**
 * Check if Ollama model is available
 * @param {string} model - Model name to check
 * @returns {Promise<boolean>} - True if model is available
 */
export async function isModelAvailable(model) {
  try {
    const response = await ollamaClient.get('/api/tags');
    const availableModels = response.data.models || [];
    
    if (availableModels.length === 0) {
      return false;
    }

    // Normalize the model name by removing :latest suffix if present
    const normalizedModel = model.replace(/:latest$/, '');
    
    // Check for exact match or with :latest suffix
    return availableModels.some((m) => {
      const normalizedAvailable = m.name.replace(/:latest$/, '');
      return (
        m.name === model ||
        m.name === `${model}:latest` ||
        normalizedAvailable === normalizedModel ||
        normalizedAvailable === model.split(':')[0] // Match by base name
      );
    });
  } catch (error) {
    console.error('Error checking Ollama models:', error.message);
    return false;
  }
}

/**
 * List all available Ollama models
 * @returns {Promise<Array>} - Array of available models
 */
export async function listAvailableModels() {
  try {
    const response = await ollamaClient.get('/api/tags');
    return (response.data.models || []).map((m) => ({
      name: m.name,
      modified: m.modified_at,
      size: m.size,
    }));
  } catch (error) {
    console.error('Error listing Ollama models:', error.message);
    return [];
  }
}

/**
 * Grade a comic using Ollama local vision model
 * @param {object} params - Grading parameters
 * @param {string} params.comicName - Comic title
 * @param {string} params.issueNumber - Issue number
 * @param {Buffer[]} params.images - Array of image buffers
 * @param {string} params.model - Ollama model name (e.g., 'llama3-vision', 'qwen3-vl')
 * @returns {Promise<object>} - Grading response
 */
export async function gradeComic(params) {
  const { comicName, issueNumber, images, model } = params;

  try {
    if (!images || images.length === 0) {
      throw new Error('No images provided for grading');
    }

    const modelName = model || process.env.OLLAMA_MODEL || 'llama3-vision';

    if (!modelName) {
      throw new Error('No model specified');
    }

    console.log('[Ollama] Starting grading request:', {
      comic: comicName,
      issue: issueNumber,
      imageCount: images.length,
      model: modelName,
    });

    // Verify model is available
    const modelAvailable = await isModelAvailable(modelName);
    if (!modelAvailable) {
      const availableModels = await listAvailableModels();
      throw new Error(
        `Model "${modelName}" is not available in Ollama. Available models: ${availableModels.map((m) => m.name).join(', ') || 'none'}. Please pull it first using: ollama pull ${modelName}`
      );
    }

    // Build the message with images
    // Ollama's chat endpoint requires images in a specific format
    // Images should be base64 encoded and passed as a separate array
    const imageData = images.map((imageBuffer) => bufferToBase64(imageBuffer));
    
    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Please grade the following comic book:\n\nTitle: ${comicName}\nIssue #: ${issueNumber}\n\nAnalyze all provided images and provide your grading assessment.`,
        images: imageData,
      },
    ];

    // Send request to Ollama
    console.log('[Ollama] Sending request to Ollama API...');
    console.log('[Ollama] Request details:', {
      url: `${process.env.OLLAMA_API_URL || 'http://localhost:11434'}/api/chat`,
      model: modelName,
      messageCount: messages.length,
      imageCount: messages[0]?.images?.length || 0,
    });

    const response = await ollamaClient.post('/api/chat', {
      model: modelName,
      messages: messages,
      stream: false, // Wait for full response
      temperature: 0.3, // Lower temperature for consistent grading
    });

    const textResponse = response.data.message?.content || '';

    if (!textResponse) {
      throw new Error('Empty response from Ollama model');
    }

    console.log('[Ollama] Successfully received response from model');
    console.log('[Ollama] Response length:', textResponse.length, 'characters');
    console.log('[Ollama] First 800 chars of response:', textResponse.substring(0, 800));
    console.log('[Ollama] Successfully graded comic:', { comic: comicName, model: modelName });

    return {
      success: true,
      provider: 'Ollama',
      model: modelName,
      response: textResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Ollama] Grading error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      model: params.model,
      envModel: process.env.OLLAMA_MODEL,
      url: process.env.OLLAMA_API_URL || 'http://localhost:11434',
    });
    return {
      success: false,
      provider: 'Ollama',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Check if Ollama is configured and available
 * @returns {Promise<object>} - Configuration status and available models
 */
export async function isConfigured() {
  try {
    const response = await ollamaClient.get('/api/tags');
    const models = response.data.models || [];

    const ollamaStatus = {
      enabled: true,
      url: process.env.OLLAMA_API_URL || 'http://localhost:11434',
      modelCount: models.length,
      models: models.map((m) => m.name),
      defaultModel: process.env.OLLAMA_MODEL || 'llama3-vision',
    };
    
    console.log('[Ollama] Configuration check:', {
      enabled: ollamaStatus.enabled,
      modelCount: ollamaStatus.modelCount,
      models: ollamaStatus.models,
      url: ollamaStatus.url,
    });

    return ollamaStatus;
  } catch (error) {
    console.error('[Ollama] Configuration check failed:', {
      url: process.env.OLLAMA_API_URL || 'http://localhost:11434',
      error: error.message,
      code: error.code,
    });

    return {
      enabled: false,
      url: process.env.OLLAMA_API_URL || 'http://localhost:11434',
      error: error.message,
      modelCount: 0,
      models: [],
    };
  }
}
