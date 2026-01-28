# GTR Comic Grader - Setup Guide

## Quick Start

### 1. Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org)
- **npm** - Comes with Node.js

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Configure API Keys

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys. You have several options:

#### Option A: Cloud-Based APIs

Add at least one of the following:

```
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=5000
NODE_ENV=development
```

#### Option B: Local Ollama (Free & Private)

Skip the cloud APIs and use local vision models instead:

```
# Comment out or leave empty the cloud API keys above
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2-vision
PORT=5000
NODE_ENV=development
```

See [Ollama Setup Guide](OLLAMA_SETUP.md) for detailed instructions.

#### Getting Cloud API Keys

**Google Gemini:**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click "Create API Key"
3. Copy and paste into `.env`

**OpenAI GPT-4o:**

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy and paste into `.env`

**Anthropic Claude:**

1. Go to [Anthropic Console](https://console.anthropic.com/keys)
2. Create a new API key
3. Copy and paste into `.env`

### 4. Run the Application

```bash
# Start both server and client in development mode
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### 5. Build for Production

```bash
# Build the client
npm run build

# Start the production server
npm start
```

## Project Structure

```
gtr_comiic_grader/
├── src/
│   ├── server.js              # Express server
│   ├── api/
│   │   ├── gemini.js          # Google Gemini handler
│   │   ├── openai.js          # OpenAI GPT-4o handler
│   │   └── anthropic.js       # Anthropic Claude handler
│   ├── logic/
│   │   ├── gradeCaps.js       # Grade capping logic
│   │   ├── restoration.js     # Restoration analysis
│   │   └── gradeValidator.js  # Grade validation
│   ├── prompts/
│   │   └── systemPrompt.txt   # CGC grading standards
│   └── utils/
│       ├── fileUpload.js      # File upload handling
│       └── responseFormat.js  # Report formatting
├── client/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── App.jsx            # Main app component
│   │   └── main.css           # Styling
│   └── index.html
├── docs/
│   ├── CGC Grading Scales.pdf
│   ├── CGC PageQuality.pdf
│   └── CGC RestorationGrading.pdf
├── package.json
└── .env                       # API keys (create this)
```

## Features

### Image Upload

- Drag & drop or click to select images
- Support for JPG, PNG, WebP formats
- Up to 10 images per submission
- Real-time preview

### AI Provider Selection

- Google Gemini for high-context analysis
- OpenAI GPT-4o for advanced vision
- Anthropic Claude 3.5 for logical reasoning

### Grading Standards

- **CGC 10-Point Scale** (0.5 to 10.0)
- **Page Quality Caps** automatically applied
- **Restoration Detection** (Conservation vs Restoration)
- **Professional Archival Advice** included

### Report Export

- Download as JSON
- Download as Markdown
- Download as HTML
- Download as plain text

## API Endpoints

### Health Check

```
GET /api/health

Response:
{
  "status": "ok",
  "providers": {
    "gemini": true,
    "openai": false,
    "anthropic": true
  },
  "timestamp": "2024-01-27T10:00:00Z"
}
```

### Grade Comic

```
POST /api/grade

Request (multipart/form-data):
- comicName: string
- issueNumber: string
- aiProvider: "gemini" | "openai" | "anthropic"
- images: File[]

Response:
{
  "success": true,
  "data": {
    "grade": 7.5,
    "gradeLabel": "Very Fine Minus (VF-)",
    "analysis": {
      "defects": "...",
      "pageQuality": "...",
      "restoration": "..."
    },
    "suggestions": {
      "repair": "...",
      "prevention": "..."
    },
    "metadata": {
      "gradeWasCapped": true,
      "originalGrade": 8.0,
      "pageQualityCap": 7.5,
      "warnings": [],
      "errors": []
    }
  }
}
```

### Grade with Multiple Providers

```
POST /api/grade/batch

Request (multipart/form-data):
- comicName: string
- issueNumber: string
- providers: string (comma-separated or array)
- images: File[]

Response:
{
  "success": true,
  "data": [
    { /* Gemini report */ },
    { /* OpenAI report */ },
    { /* Claude report */ }
  ]
}
```

## Grading Standards Reference

### CGC 10-Point Scale

| Grade | Label         | Description                                      |
| ----- | ------------- | ------------------------------------------------ |
| 10.0  | Gem Mint (GM) | No evidence of manufacturing or handling defects |
| 9.8   | NM/M          | Nearly perfect; negligible defects               |
| 9.6   | NM+           | Slight imperfections                             |
| 9.4   | NM            | Light wear, mostly imperceptible                 |
| 9.2   | NM-           | Light handling marks                             |
| 9.0   | VF/NM         | Light wear on spine, edges slightly worn         |
| 8.5   | VF+           | Minor wear, light creasing possible              |
| 8.0   | VF            | Noticeable wear, some minor creases              |
| 7.5   | VF-           | Moderate wear, creases visible                   |
| 6.0   | FN            | Slightly above-average with one major defect     |

### Page Quality Caps

- **White Pages**: ≤ 10.0
- **Off-White to White**: ≤ 9.9
- **Light Tan to Off-White**: ≤ 8.5
- **Tan to Off-White**: ≤ 7.5
- **Slightly Brittle**: ≤ 6.5
- **Brittle**: ≤ 3.5

### Restoration Categories

**Conservation** (Professional archival work):

- Quality: A (highest)
- Methods: Rice paper, wheat glue, de-acidification

**Restoration** (Aesthetic work):

- Quality: A (best), B (good), C (fair)
- Quantity: 1-5 (minimal to very extensive)

## Troubleshooting

### "API key not configured"

- Ensure `.env` file exists with the correct API key
- Restart the server after adding the key
- Check `http://localhost:5000/api/health` to verify configuration

### Images won't upload

- Check file size (max 10 MB per file)
- Verify file format is JPG, PNG, or WebP
- Check browser console for detailed error messages

### Grade not showing correctly

- Review the page quality designation
- Check for any warnings in the report (may indicate capping)
- Ensure all analysis sections are visible

### Server won't start

- Verify Node.js is installed: `node --version`
- Check port 5000 is available (or change PORT in .env)
- Check for missing dependencies: `npm install`

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Watching for Changes

```bash
npm run dev
```

## Performance Tips

1. **Optimize Images**: Pre-compress photos before uploading for faster processing
2. **Provider Selection**: Gemini is fastest; Claude offers best reasoning
3. **Batch Processing**: Use `/api/grade/batch` to get multiple provider opinions

## Support & Documentation

- **CGC Standards**: See `/docs` folder for official PDFs
- **Issue Tracking**: Check GitHub Issues
- **API Documentation**: See `/docs/API.md`

## License

MIT - See LICENSE file for details
