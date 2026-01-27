# Quick Reference Guide

## Installation (5 minutes)

```bash
# 1. Install root dependencies
npm install

# 2. Install client dependencies
cd client && npm install && cd ..

# 3. Setup environment variables
cp .env.example .env

# 4. Edit .env with your API keys
# GEMINI_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here

# 5. Start development server
npm run dev
```

**Frontend**: http://localhost:5173  
**Backend API**: http://localhost:5000

---

## API Quick Reference

### Grade a Comic

```bash
curl -X POST http://localhost:5000/api/grade \
  -F "comicName=Amazing Spider-Man" \
  -F "issueNumber=100" \
  -F "aiProvider=gemini" \
  -F "images=@image1.jpg"
```

### Check Health

```bash
curl http://localhost:5000/api/health
```

---

## File Structure Cheat Sheet

```
Backend API:          Frontend:
src/server.js         client/src/App.jsx
src/api/              client/src/components/
src/logic/            client/src/hooks/
src/prompts/          client/src/main.css
src/utils/
```

---

## CGC Grading Scale (Quick Lookup)

| Grade | Label    |
| ----- | -------- |
| 10.0  | Gem Mint |
| 9.8   | NM/M     |
| 9.0   | VF/NM    |
| 8.5   | VF+      |
| 8.0   | VF       |
| 7.5   | VF-      |
| 7.0   | FN/VF    |
| 6.0   | FN       |

---

## Page Quality Caps (Quick Lookup)

| Page Quality     | Max Grade |
| ---------------- | --------- |
| White Pages      | 10.0      |
| Off-White        | 9.9       |
| Light Tan        | 8.5       |
| Tan              | 7.5       |
| Slightly Brittle | 6.5       |
| Brittle          | 3.5       |

---

## Environment Variables

```
GEMINI_API_KEY=      # Required for Gemini
OPENAI_API_KEY=      # Required for OpenAI
ANTHROPIC_API_KEY=   # Required for Anthropic
PORT=5000            # Optional
NODE_ENV=development # Optional
```

---

## Common Commands

```bash
# Development
npm run dev              # Start both server and client
npm run dev:server      # Just backend
npm run dev:client      # Just frontend

# Production
npm run build           # Build client
npm start               # Start production server

# Testing
npm test                # Run tests
npm run lint            # Lint code
```

---

## Troubleshooting Quick Tips

**No AI providers available?**

- Check `.env` file exists
- Verify API keys are set correctly
- Restart the server

**Images won't upload?**

- Max 10 MB per image
- Must be JPG, PNG, or WebP
- Max 10 images per submission

**Grade not showing?**

- Check page quality is specified
- Look for warnings (grade capping)
- Check browser console for errors

**Server won't start?**

- Check port 5000 is available
- Run `npm install` again
- Check Node.js version: `node --version` (need 18+)

---

## AI Provider Selection Guide

| Provider | Speed  | Vision | Cost         | Best For          |
| -------- | ------ | ------ | ------------ | ----------------- |
| Gemini   | ⚡⚡⚡ | ⭐⭐⭐ | 🔥 Free tier | Fast analysis     |
| GPT-4o   | ⚡⚡   | ⭐⭐⭐ | 💰 Paid      | Detail detection  |
| Claude   | ⚡     | ⭐⭐   | 💰 Paid      | Complex reasoning |

---

## Response Format Example

```json
{
  "grade": 7.5,
  "gradeLabel": "Very Fine Minus (VF-)",
  "analysis": {
    "defects": "...",
    "pageQuality": "Tan to Off-White",
    "restoration": "None"
  },
  "suggestions": {
    "repair": "...",
    "prevention": "..."
  },
  "metadata": {
    "gradeWasCapped": true,
    "originalGrade": 8.0,
    "pageQualityCap": 7.5
  }
}
```

---

## Documentation Files

| File             | Purpose                |
| ---------------- | ---------------------- |
| README.md        | Overview & features    |
| SETUP.md         | Detailed setup guide   |
| API.md           | API documentation      |
| BUILD_SUMMARY.md | What was built         |
| Instructions.md  | AI prompt instructions |

---

## Key Logic Files

| File                       | Purpose                   |
| -------------------------- | ------------------------- |
| `logic/gradeCaps.js`       | Enforce page quality caps |
| `logic/restoration.js`     | Analyze restoration work  |
| `logic/gradeValidator.js`  | Parse & validate grades   |
| `prompts/systemPrompt.txt` | CGC standards for AI      |

---

## Production Checklist

- [ ] Set all API keys in `.env`
- [ ] Run `npm run build`
- [ ] Test on production URL
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper error logging
- [ ] Set up monitoring
- [ ] Back up CGC reference PDFs

---

## Getting Help

1. **Setup Issues**: See `SETUP.md` troubleshooting
2. **API Questions**: See `API.md` documentation
3. **Feature Questions**: See `README.md`
4. **Implementation Details**: See `BUILD_SUMMARY.md`
5. **Server Logs**: Check terminal output when running `npm run dev`

---

## Important Notes

⚠️ API keys are required - get them from:

- Gemini: https://aistudio.google.com/app/apikeys
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/keys

⚠️ File uploads are processed in-memory (default 50 MB limit)

⚠️ Grade capping is ENFORCED - cannot exceed page quality cap

⚠️ All grades must match one of the 23 CGC grades (0.5-10.0)

---

## Version Info

- **Node.js Required**: 18+
- **React**: 18.2
- **Express**: 4.18
- **Vite**: 5.0
- **API Version**: 1.0

Last Updated: January 2024
