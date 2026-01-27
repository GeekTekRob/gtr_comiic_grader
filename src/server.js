/**
 * GTR Comic Grader - Main Server
 * Express backend for AI-powered comic grading
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import API handlers
import * as geminiHandler from './api/gemini.js';
import * as openaiHandler from './api/openai.js';
import * as anthropicHandler from './api/anthropic.js';

// Import utilities
import { upload, validateFiles } from './utils/fileUpload.js';
import { formatGradingReport } from './utils/responseFormat.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from client build (production)
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// API Routes

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    providers: {
      gemini: geminiHandler.isConfigured(),
      openai: openaiHandler.isConfigured(),
      anthropic: anthropicHandler.isConfigured(),
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/grade
 * Submit a comic for grading
 *
 * Request body:
 * {
 *   comicName: string,
 *   issueNumber: string|number,
 *   aiProvider: 'gemini' | 'openai' | 'anthropic',
 *   images: File[] (multipart form data)
 * }
 */
app.post('/api/grade', upload.array('images', 10), async (req, res) => {
  try {
    // Validate request
    const { comicName, issueNumber, aiProvider } = req.body;

    if (!comicName || !issueNumber || !aiProvider) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: comicName, issueNumber, aiProvider',
      });
    }

    // Validate files
    const fileValidation = validateFiles(req.files);
    if (!fileValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'File validation failed',
        details: fileValidation.errors,
      });
    }

    // Log request
    console.log(`\n[${new Date().toISOString()}] Grading Request`);
    console.log(`Comic: ${comicName} #${issueNumber}`);
    console.log(`Provider: ${aiProvider}`);
    console.log(`Images: ${req.files.length}`);

    // Route to appropriate AI handler
    let aiResult;

    switch (aiProvider.toLowerCase()) {
      case 'gemini':
        if (!geminiHandler.isConfigured()) {
          return res.status(400).json({
            success: false,
            error: 'Gemini API is not configured',
          });
        }
        aiResult = await geminiHandler.gradeComic({
          comicName,
          issueNumber,
          images: req.files.map((f) => f.buffer),
        });
        break;

      case 'openai':
        if (!openaiHandler.isConfigured()) {
          return res.status(400).json({
            success: false,
            error: 'OpenAI API is not configured',
          });
        }
        aiResult = await openaiHandler.gradeComic({
          comicName,
          issueNumber,
          images: req.files.map((f) => f.buffer),
        });
        break;

      case 'anthropic':
      case 'claude':
        if (!anthropicHandler.isConfigured()) {
          return res.status(400).json({
            success: false,
            error: 'Anthropic API is not configured',
          });
        }
        aiResult = await anthropicHandler.gradeComic({
          comicName,
          issueNumber,
          images: req.files.map((f) => f.buffer),
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Unknown AI provider: ${aiProvider}`,
          availableProviders: ['gemini', 'openai', 'anthropic'],
        });
    }

    // Format the response
    const formattedReport = formatGradingReport(aiResult);

    res.json({
      success: true,
      data: formattedReport,
    });
  } catch (error) {
    console.error('Error processing grade request:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/grade/batch
 * Submit multiple comics for grading with multiple providers
 */
app.post('/api/grade/batch', upload.array('images', 10), async (req, res) => {
  try {
    const { comicName, issueNumber, providers } = req.body;
    const providerList = Array.isArray(providers)
      ? providers
      : providers.split(',').map((p) => p.trim());

    if (!comicName || !issueNumber || !providerList.length) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: comicName, issueNumber, providers',
      });
    }

    const fileValidation = validateFiles(req.files);
    if (!fileValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'File validation failed',
        details: fileValidation.errors,
      });
    }

    console.log(`\n[${new Date().toISOString()}] Batch Grading Request`);
    console.log(`Comic: ${comicName} #${issueNumber}`);
    console.log(`Providers: ${providerList.join(', ')}`);

    const results = [];
    const images = req.files.map((f) => f.buffer);

    for (const provider of providerList) {
      let aiResult;

      try {
        switch (provider.toLowerCase()) {
          case 'gemini':
            if (!geminiHandler.isConfigured()) {
              results.push({
                provider: 'Gemini',
                error: 'Not configured',
              });
              break;
            }
            aiResult = await geminiHandler.gradeComic({
              comicName,
              issueNumber,
              images,
            });
            break;

          case 'openai':
            if (!openaiHandler.isConfigured()) {
              results.push({
                provider: 'OpenAI',
                error: 'Not configured',
              });
              break;
            }
            aiResult = await openaiHandler.gradeComic({
              comicName,
              issueNumber,
              images,
            });
            break;

          case 'anthropic':
          case 'claude':
            if (!anthropicHandler.isConfigured()) {
              results.push({
                provider: 'Claude',
                error: 'Not configured',
              });
              break;
            }
            aiResult = await anthropicHandler.gradeComic({
              comicName,
              issueNumber,
              images,
            });
            break;

          default:
            results.push({
              provider,
              error: `Unknown provider: ${provider}`,
            });
            continue;
        }

        const formattedReport = formatGradingReport(aiResult);
        results.push(formattedReport);
      } catch (error) {
        results.push({
          provider,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error processing batch grade request:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Serve React frontend for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({
        error: 'Not found',
      });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   GTR Comic Grader - Server Started    ║
╠════════════════════════════════════════╣
║ Port: ${PORT}                            
║ Environment: ${process.env.NODE_ENV || 'development'}
║ API Providers:
║   - Gemini: ${geminiHandler.isConfigured() ? '✓ Configured' : '✗ Not configured'}
║   - OpenAI: ${openaiHandler.isConfigured() ? '✓ Configured' : '✗ Not configured'}
║   - Anthropic: ${anthropicHandler.isConfigured() ? '✓ Configured' : '✗ Not configured'}
╚════════════════════════════════════════╝

API Endpoints:
  GET  /api/health          - Health check
  POST /api/grade           - Grade a comic
  POST /api/grade/batch     - Grade with multiple providers

Frontend: http://localhost:${PORT}
`);
});
