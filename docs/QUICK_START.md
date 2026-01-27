# Quick Reference Card

Print this or save it to your phone!

---

## Setup Paths Cheat Sheet

```
I want to...              | Path               | Time
--------------------------|-------------------|------
Try it immediately        | Cloud              | 5 min
Run locally (have Node)   | npm                | 5 min
Run with Docker           | Docker             | 2 min
Full control/modify code  | Manual             | 15 min
Not sure                  | START_HERE.md      | 2 min
```

---

## Commands (Copy & Paste)

### npm Path

```bash
npm run setup
npm run dev
```

### Docker Path

```bash
docker-compose up
```

### Cloud Path

Go to https://vercel.com → New Project → Deploy

---

## API Keys (Get in 5 Minutes)

### Google Gemini (FREE - Recommended)

1. Go: https://makersuite.google.com/app/apikey
2. Click: "Create API Key"
3. Copy: The long string
4. Paste: Into setup or .env

### OpenAI (Optional)

1. Go: https://platform.openai.com/api-keys
2. Click: "Create new secret key"
3. Paste value

### Anthropic (Optional)

1. Go: https://console.anthropic.com
2. API Keys section
3. Create & copy

---

## Troubleshooting Quick Tips

### "Module not found"

```bash
npm install
```

### "Port 5000/5173 in use"

- Close other apps using that port
- Or change port in config

### "API key invalid"

- Check for extra spaces
- Verify key from provider website
- Try regenerating key

### "Docker not found"

- Install Docker Desktop: https://docker.com

### "Node not found"

- Install Node.js: https://nodejs.org

---

## File Quick Reference

| File                                 | Purpose               | When to Read           |
| ------------------------------------ | --------------------- | ---------------------- |
| [START_HERE.md](START_HERE.md)       | Main entry point      | First time             |
| [USER_JOURNEY.md](USER_JOURNEY.md)   | Step-by-step journeys | Different skill levels |
| [GET_STARTED.md](GET_STARTED.md)     | npm quick start       | Have Node.js           |
| [DOCKER_SETUP.md](DOCKER_SETUP.md)   | Docker quick start    | Have Docker            |
| [DEPLOYMENT.md](DEPLOYMENT.md)       | Cloud deployment      | Want to share          |
| [SETUP.md](SETUP.md)                 | Full documentation    | Need details           |
| [API.md](API.md)                     | API endpoints         | Building apps          |
| [BUILD_SUMMARY.md](BUILD_SUMMARY.md) | What was built        | Curious about code     |

---

## URLs to Bookmark

```
Local development:  http://localhost:5173 (npm)
                    http://localhost:5000 (Docker)

API endpoint:       http://localhost:5000/api/grade

Gemini keys:        https://makersuite.google.com/app/apikey
OpenAI keys:        https://platform.openai.com/api-keys
Anthropic keys:     https://console.anthropic.com/

Deploy to cloud:    https://vercel.com
                    https://railway.app
                    https://render.com
                    https://fly.io
```

---

## Environment Variables

```
GEMINI_API_KEY=xxxxx
OPENAI_API_KEY=xxxxx
ANTHROPIC_API_KEY=xxxxx
PORT=5000 (optional)
NODE_ENV=development (optional)
```

Only need ONE API key minimum (Gemini recommended).

---

## Typical Workflow

1. **Get API key** (3 min) → Gemini
2. **Setup** (2-5 min) → Choose your path
3. **Start** (30 sec) → One command
4. **Upload** (1 min) → Drag image
5. **Grade** (5 sec) → AI analyzes
6. **Export** (1 min) → JSON/PDF/HTML/Text

**Total**: ~13 minutes from zero to grading

---

## Support

| Issue               | Solution      | Link                               |
| ------------------- | ------------- | ---------------------------------- |
| Not sure which path | Decision tree | [USER_JOURNEY.md](USER_JOURNEY.md) |
| npm setup issues    | npm guide     | [GET_STARTED.md](GET_STARTED.md)   |
| Docker issues       | Docker guide  | [DOCKER_SETUP.md](DOCKER_SETUP.md) |
| Deployment help     | Cloud guide   | [DEPLOYMENT.md](DEPLOYMENT.md)     |
| API questions       | API docs      | [API.md](API.md)                   |
| Still stuck         | Full setup    | [SETUP.md](SETUP.md)               |

---

## Key Facts

✅ **Free to start**: Gemini has free tier  
✅ **5 minutes**: From download to grading  
✅ **Works everywhere**: Cloud, Docker, npm, manual  
✅ **Share easily**: Cloud link works for anyone  
✅ **Full featured**: All 3 AI providers supported  
✅ **Production ready**: Enforces CGC standards  
✅ **Open source**: Modify however you want

---

## Pro Tips

1. **Start with Gemini** - Free, fast, easy
2. **Use Cloud if sharing** - Share link, not instructions
3. **Use Docker if not sure** - One command, everything works
4. **Use npm if developing** - Live reload, easy debugging
5. **Set all 3 keys** - Switch providers in app
6. **Upload JPG/PNG** - Works best with these formats
7. **Check page quality** - Affects grade (auto-capped)
8. **Export as JSON** - For programmatic use

---

## Next Step: Pick Your Path

**New user?** → [START_HERE.md](START_HERE.md)  
**Different skill?** → [USER_JOURNEY.md](USER_JOURNEY.md)  
**Know what you want?** → [DEPLOYMENT.md](DEPLOYMENT.md) / [GET_STARTED.md](GET_STARTED.md) / [DOCKER_SETUP.md](DOCKER_SETUP.md)  
**Ready to start?** → [npm: `npm run setup`] or [Docker: `docker-compose up`]

---

**You're ready! Go forth and grade! 🚀**
