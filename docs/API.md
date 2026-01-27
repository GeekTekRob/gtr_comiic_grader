# GTR Comic Grader - API Documentation

## Overview

The GTR Comic Grader API provides endpoints for submitting comics for AI-powered grading using CGC standards.

**Base URL**: `http://localhost:5000/api`

## Authentication

No authentication required. Use environment variables for API key configuration:

- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

## Endpoints

### 1. Health Check

**GET** `/api/health`

Check server status and available AI providers.

**Response**:

```json
{
  "status": "ok",
  "providers": {
    "gemini": true,
    "openai": false,
    "anthropic": true
  },
  "timestamp": "2024-01-27T10:30:45.123Z"
}
```

**Status Codes**:

- `200 OK` - Server is running

---

### 2. Grade Comic

**POST** `/api/grade`

Submit a comic for grading analysis by a single AI provider.

**Request**:

Content-Type: `multipart/form-data`

| Field         | Type   | Required | Description                                             |
| ------------- | ------ | -------- | ------------------------------------------------------- |
| `comicName`   | string | Yes      | Name/title of the comic (e.g., "Amazing Spider-Man")    |
| `issueNumber` | string | Yes      | Issue number (e.g., "100" or "1A")                      |
| `aiProvider`  | string | Yes      | AI provider to use: `gemini`, `openai`, or `anthropic`  |
| `images`      | File[] | Yes      | Comic images (JPG, PNG, WebP). Max 10 files, 10 MB each |

**Example Request**:

```bash
curl -X POST http://localhost:5000/api/grade \
  -F "comicName=Amazing Spider-Man" \
  -F "issueNumber=100" \
  -F "aiProvider=gemini" \
  -F "images=@front.jpg" \
  -F "images=@back.jpg" \
  -F "images=@spine.jpg"
```

**Response (Success)**:

```json
{
  "success": true,
  "data": {
    "grade": 7.5,
    "gradeLabel": "Very Fine Minus (VF-)",
    "provider": "Gemini",
    "timestamp": "2024-01-27T10:30:45.123Z",
    "analysis": {
      "defects": "Light creasing on spine and edges, minor handling marks on cover",
      "pageQuality": "Tan to Off-White with signs of tanning on interior pages",
      "restoration": "No signs of restoration or conservation detected"
    },
    "suggestions": {
      "repair": "Consider de-acidification of interior pages to arrest tanning process. Use acid-free boards and Mylar sleeves for future storage",
      "prevention": "Store in 65-70°F temperature, 40-50% humidity. Use acid-free materials exclusively. Avoid prolonged light exposure"
    },
    "metadata": {
      "gradeWasCapped": true,
      "originalGrade": 8.0,
      "pageQualityCap": 7.5,
      "warnings": ["Grade was capped from 8.0 to 7.5 based on page quality"],
      "errors": []
    }
  }
}
```

**Response (Error)**:

```json
{
  "success": false,
  "error": "Gemini API is not configured"
}
```

**Status Codes**:

- `200 OK` - Grading completed successfully
- `400 Bad Request` - Missing required fields or invalid file format
- `500 Internal Server Error` - Server error during processing

**Error Messages**:

- `"Missing required fields: comicName, issueNumber, aiProvider"` - Missing form data
- `"No files uploaded"` - No images provided
- `"Gemini API is not configured"` - API key not set in environment
- `"Unknown AI provider: [provider]"` - Invalid provider name

---

### 3. Grade with Multiple Providers (Batch)

**POST** `/api/grade/batch`

Submit a comic for grading with multiple AI providers simultaneously.

**Request**:

Content-Type: `multipart/form-data`

| Field         | Type   | Required | Description                                              |
| ------------- | ------ | -------- | -------------------------------------------------------- |
| `comicName`   | string | Yes      | Name/title of the comic                                  |
| `issueNumber` | string | Yes      | Issue number                                             |
| `providers`   | string | Yes      | Comma-separated provider list: `gemini,openai,anthropic` |
| `images`      | File[] | Yes      | Comic images                                             |

**Example Request**:

```bash
curl -X POST http://localhost:5000/api/grade/batch \
  -F "comicName=Amazing Spider-Man" \
  -F "issueNumber=100" \
  -F "providers=gemini,openai" \
  -F "images=@front.jpg" \
  -F "images=@back.jpg"
```

**Response (Success)**:

```json
{
  "success": true,
  "data": [
    {
      "grade": 7.5,
      "gradeLabel": "Very Fine Minus (VF-)",
      "provider": "Gemini",
      "timestamp": "2024-01-27T10:30:45.123Z",
      "analysis": {
        /* ... */
      }
    },
    {
      "grade": 7.0,
      "gradeLabel": "Fine/Very Fine (FN/VF)",
      "provider": "OpenAI",
      "timestamp": "2024-01-27T10:31:15.456Z",
      "analysis": {
        /* ... */
      }
    }
  ]
}
```

**Status Codes**:

- `200 OK` - All providers responded
- `400 Bad Request` - Invalid request format
- `500 Internal Server Error` - Server error

---

## Response Schema

### Grading Report

```json
{
  "success": true,
  "data": {
    "grade": 7.5,
    "gradeLabel": "Very Fine Minus (VF-)",
    "provider": "Gemini",
    "timestamp": "2024-01-27T10:30:45.123Z",
    "analysis": {
      "defects": "Description of observed defects",
      "pageQuality": "Page quality designation and any caps applied",
      "restoration": "Any restoration or conservation detected"
    },
    "suggestions": {
      "repair": "Specific archival repair recommendations",
      "prevention": "Storage and environmental recommendations"
    },
    "metadata": {
      "gradeWasCapped": true,
      "originalGrade": 8.0,
      "pageQualityCap": 7.5,
      "warnings": ["Array of warnings if any"],
      "errors": ["Array of errors if any"]
    }
  }
}
```

### Field Descriptions

| Field                     | Type     | Description                                           |
| ------------------------- | -------- | ----------------------------------------------------- |
| `grade`                   | number   | Final numerical grade (0.5-10.0)                      |
| `gradeLabel`              | string   | Formatted grade label (e.g., "Very Fine Minus (VF-)") |
| `provider`                | string   | AI provider used (Gemini, OpenAI, Claude)             |
| `timestamp`               | string   | ISO 8601 timestamp of grading                         |
| `analysis.defects`        | string   | Description of observable defects                     |
| `analysis.pageQuality`    | string   | Page color and quality assessment                     |
| `analysis.restoration`    | string   | Detection of restoration or conservation work         |
| `suggestions.repair`      | string   | Archival repair recommendations                       |
| `suggestions.prevention`  | string   | Storage and environmental guidelines                  |
| `metadata.gradeWasCapped` | boolean  | Whether grade was capped due to page quality          |
| `metadata.originalGrade`  | number   | Grade before capping (if applicable)                  |
| `metadata.pageQualityCap` | number   | Maximum grade allowed for page quality                |
| `metadata.warnings`       | string[] | Non-critical issues found                             |
| `metadata.errors`         | string[] | Critical issues encountered                           |

---

## Grading Standards

### CGC 10-Point Scale

| Grade | Label               | CGC Code |
| ----- | ------------------- | -------- |
| 10.0  | Gem Mint            | GM       |
| 9.8   | Near Mint/Mint      | NM/M     |
| 9.6   | Near Mint Plus      | NM+      |
| 9.4   | Near Mint           | NM       |
| 9.2   | Near Mint Minus     | NM-      |
| 9.0   | Very Fine/Near Mint | VF/NM    |
| 8.5   | Very Fine Plus      | VF+      |
| 8.0   | Very Fine           | VF       |
| 7.5   | Very Fine Minus     | VF-      |
| 7.0   | Fine/Very Fine      | FN/VF    |
| 6.5   | Fine Plus           | FN+      |
| 6.0   | Fine                | FN       |
| 5.5   | Fine Minus          | FN-      |
| 5.0   | Very Good/Fine      | VG/FN    |
| 4.5   | Very Good Plus      | VG+      |
| 4.0   | Very Good           | VG       |
| 3.5   | Very Good Minus     | VG-      |
| 3.0   | Good/Very Good      | GD/VG    |
| 2.5   | Good Plus           | GD+      |
| 2.0   | Good                | GD       |
| 1.5   | Fair/Good           | FR/GD    |
| 1.0   | Fair                | FR       |
| 0.5   | Poor                | PR       |

### Page Quality Caps

The AI enforces automatic grade capping based on interior page condition:

| Page Quality           | Maximum Grade |
| ---------------------- | ------------- |
| White Pages            | 10.0          |
| Off-White to White     | 9.9           |
| Light Tan to Off-White | 8.5           |
| Tan to Off-White       | 7.5           |
| Slightly Brittle       | 6.5           |
| Brittle                | 3.5           |

**Example**: If a comic has excellent condition outside but tan interior pages, even if the surface condition would suggest a 9.0 grade, the final grade will be capped at 7.5.

---

## AI Providers

### Google Gemini

- **Provider ID**: `gemini`
- **Model**: `gemini-1.5-flash`
- **Strengths**:
  - Fast processing
  - Large context window
  - Good for detailed image analysis
- **Max images**: 10
- **API Key**: Set `GEMINI_API_KEY` environment variable

### OpenAI GPT-4o

- **Provider ID**: `openai`
- **Model**: `gpt-4o`
- **Strengths**:
  - Advanced vision capabilities
  - Excellent defect detection
  - Detailed analysis
- **Max images**: 10
- **API Key**: Set `OPENAI_API_KEY` environment variable

### Anthropic Claude 3.5

- **Provider ID**: `anthropic`
- **Model**: `claude-3-5-sonnet-20241022`
- **Strengths**:
  - Logical reasoning
  - Best for complex assessments
  - Detailed restoration analysis
- **Max images**: 10
- **API Key**: Set `ANTHROPIC_API_KEY` environment variable

---

## Error Handling

### Common Error Responses

**400 - Bad Request**:

```json
{
  "success": false,
  "error": "Missing required fields: comicName, issueNumber, aiProvider"
}
```

**400 - File Validation**:

```json
{
  "success": false,
  "error": "File validation failed",
  "details": ["File 1: Exceeds 10 MB limit", "File 2: Not a valid image format"]
}
```

**400 - Provider Not Configured**:

```json
{
  "success": false,
  "error": "Gemini API is not configured"
}
```

**500 - Server Error**:

```json
{
  "success": false,
  "error": "An unexpected error occurred: [error message]"
}
```

---

## Rate Limiting

No rate limiting is enforced on the local server. However, AI providers have their own rate limits:

- **Gemini**: 2 requests/minute (free tier)
- **OpenAI**: Varies by plan
- **Anthropic**: Varies by plan

---

## Examples

### JavaScript/Node.js

```javascript
const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");

async function gradeComic() {
  const form = new FormData();
  form.append("comicName", "Amazing Spider-Man");
  form.append("issueNumber", "100");
  form.append("aiProvider", "gemini");
  form.append("images", fs.createReadStream("front.jpg"));
  form.append("images", fs.createReadStream("back.jpg"));

  try {
    const response = await axios.post("http://localhost:5000/api/grade", form);
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
}

gradeComic();
```

### Python

```python
import requests

url = "http://localhost:5000/api/grade"

data = {
    'comicName': 'Amazing Spider-Man',
    'issueNumber': '100',
    'aiProvider': 'gemini'
}

files = [
    ('images', open('front.jpg', 'rb')),
    ('images', open('back.jpg', 'rb'))
]

response = requests.post(url, data=data, files=files)
print(response.json())
```

### cURL

```bash
curl -X POST http://localhost:5000/api/grade \
  -F "comicName=Amazing Spider-Man" \
  -F "issueNumber=100" \
  -F "aiProvider=gemini" \
  -F "images=@front.jpg" \
  -F "images=@back.jpg"
```

---

## Integration Guide

### Frontend Integration

The web UI handles all API communication automatically. To use in a custom frontend:

1. Prepare FormData with comic details and images
2. POST to `/api/grade`
3. Parse response and display `data.grade` and analysis
4. Apply grade cap from `metadata.pageQualityCap` if `metadata.gradeWasCapped` is true

### Custom Integration

When integrating with external systems:

1. Validate all required fields before submitting
2. Check `success` flag before reading `data`
3. Log any `metadata.warnings` for audit purposes
4. Handle grade capping logic if grade was capped
5. Store `timestamp` for record-keeping

---

## Support

For issues or questions:

1. Check server health: `GET /api/health`
2. Verify API keys are configured: Check `.env` file
3. Review error messages in response body
4. Check server logs for detailed error information
5. Consult CGC documentation in `/docs` folder

---

## Version

API Version: 1.0.0  
Last Updated: January 2024
