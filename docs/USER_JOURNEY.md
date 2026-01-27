# User Journey: From Zero to Grading

## Your Starting Point

Pick ONE statement that matches you:

### 👤 "I've never installed anything"

**Skill**: Non-technical  
**Time available**: 15 minutes  
**Goal**: Just use it

👉 **YOUR PATH**: [Cloud Deployment](DEPLOYMENT.md)

- No installation needed
- Click → Set API key → Done
- **Time**: 5 minutes
- **Cost**: Free (Gemini API only)

---

### 👤 "I have Node.js installed"

**Skill**: Beginner developer  
**Time available**: 20 minutes  
**Goal**: Run it locally

👉 **YOUR PATH**: [npm Setup](GET_STARTED.md)

- Run: `npm run setup`
- Answer 3 questions
- Done!
- **Time**: 5 minutes
- **Cost**: Free (Gemini API only)

---

### 👤 "I have Docker installed"

**Skill**: Docker-comfortable  
**Time available**: 10 minutes  
**Goal**: Containerized setup

👉 **YOUR PATH**: [Docker Setup](DOCKER_SETUP.md)

- Create `.env` file
- Run: `docker-compose up`
- Open: http://localhost:5000
- **Time**: 2 minutes
- **Cost**: Free (Gemini API only)

---

### 👤 "I'm a developer"

**Skill**: Advanced  
**Time available**: 30+ minutes  
**Goal**: Understand & modify code

👉 **YOUR PATH**: [Complete Setup](SETUP.md)

- Full documentation
- All configuration options
- Development mode
- Debugging tools
- **Time**: 15+ minutes
- **Details**: [BUILD_SUMMARY.md](BUILD_SUMMARY.md)

---

## Don't Know Which Path?

### Quick Decision Tree

```
Have Docker Desktop?
├─ YES → Use Docker (fastest) → [DOCKER_SETUP.md](DOCKER_SETUP.md)
└─ NO → Have Node.js?
        ├─ YES → Use npm → [GET_STARTED.md](GET_STARTED.md)
        └─ NO → Use Cloud → [DEPLOYMENT.md](DEPLOYMENT.md)
```

Or just **[START_HERE.md](START_HERE.md)** for visual guide.

---

## Complete User Journeys

### 🟢 **Non-Technical User (Cloud)**

```
Time: 5 minutes
Tools: Browser only
Cost: Free

1. Go to [DEPLOYMENT.md](DEPLOYMENT.md)
2. Pick "Vercel"
3. Sign up with GitHub
4. Add GEMINI_API_KEY
5. Click Deploy
6. Open your link
7. Start grading!
```

---

### 🟡 **Beginner Developer (npm)**

```
Time: 5 minutes
Tools: Terminal + Node.js
Cost: Free

1. Open terminal
2. `npm run setup`
3. Answer questions:
   - Want Gemini? [y]
   - API key? [paste it]
4. Press Enter
5. `npm run dev`
6. Open http://localhost:5173
7. Start grading!
```

---

### 🟠 **Docker User**

```
Time: 2 minutes
Tools: Docker + Docker Compose
Cost: Free

1. Create `.env`:
```

GEMINI_API_KEY=your_key

```
2. Run: `docker-compose up`
3. Wait 10 seconds
4. Open http://localhost:5000
5. Start grading!
```

---

### 🔴 **Advanced Developer**

```
Time: 30+ minutes
Tools: Git + Node.js + Terminal
Cost: Free

1. Clone repo
2. `npm install`
3. `cd client && npm install`
4. Configure `.env` with all keys
5. `npm run dev`
6. Customize code as needed
7. `npm run build` for production
8. Deploy anywhere
```

---

## Step-by-Step: Pick Your Path

### Path 1️⃣: Cloud (No Installation)

**Step 1**: Get API Key (3 min)

```
1. Go: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy it
```

**Step 2**: Deploy (5 min)

```
1. Go: https://vercel.com
2. Sign up with GitHub
3. Import this project
4. Add GEMINI_API_KEY
5. Deploy!
```

**Step 3**: Use (1 min)

```
1. Click your Vercel link
2. Upload comic image
3. Get grade!
```

**Total time**: 9 minutes

---

### Path 2️⃣: npm (Has Node.js)

**Step 1**: Get API Key (3 min)

```bash
# Same as above
```

**Step 2**: Run Setup (2 min)

```bash
npm run setup
# It will ask you questions
# Answer them and it's done!
```

**Step 3**: Start App (30 sec)

```bash
npm run dev
# Opens http://localhost:5173
```

**Total time**: 5.5 minutes

---

### Path 3️⃣: Docker

**Step 1**: Get API Key (3 min)

```bash
# Same as above
```

**Step 2**: Create .env (1 min)

```
File: .env
Content:
GEMINI_API_KEY=your_key_here
```

**Step 3**: Run Docker (1 min)

```bash
docker-compose up
# Opens automatically at http://localhost:5000
```

**Total time**: 5 minutes

---

### Path 4️⃣: Manual (Full Control)

**Step 1**: Read Setup (5 min)

```
Read: SETUP.md
(Full detailed guide)
```

**Step 2**: Install & Configure (10 min)

```bash
npm install
cd client && npm install
cp .env.example .env
# Edit .env with your keys
```

**Step 3**: Start Server (30 sec)

```bash
npm run dev
# Runs on http://localhost:5173
```

**Total time**: 15.5 minutes

---

## What's an API Key?

### Think of it as a password

```
Google Gemini API Key = Access code for Google's AI
OpenAI API Key = Access code for ChatGPT
Anthropic API Key = Access code for Claude
```

### How to get one

1. Go to provider's website
2. Create account (free)
3. Go to API Keys section
4. Click "Create Key"
5. Copy the long string
6. Paste into `.env` or deployment config

**Easiest**: Gemini (free, no credit card needed)

---

## Troubleshooting by Path

### Cloud Path Problems

| Problem             | Solution                    |
| ------------------- | --------------------------- |
| "Deployment failed" | Check logs, retry           |
| "API key invalid"   | Verify key from Gemini site |
| "App won't load"    | Wait 30 seconds, refresh    |

[Full cloud troubleshooting →](DEPLOYMENT.md#troubleshooting)

### npm Path Problems

| Problem                  | Solution           |
| ------------------------ | ------------------ |
| "command not found: npm" | Install Node.js    |
| "Module not found"       | Run: `npm install` |
| "Port 5173 in use"       | Close other apps   |

[Full npm troubleshooting →](GET_STARTED.md#troubleshooting)

### Docker Path Problems

| Problem            | Solution                                 |
| ------------------ | ---------------------------------------- |
| "Docker not found" | Install Docker Desktop                   |
| "Port 5000 in use" | Change port in compose                   |
| "Build failed"     | Delete volumes: `docker-compose down -v` |

[Full docker troubleshooting →](DOCKER_SETUP.md#troubleshooting)

---

## After You're Up & Running

### Try These Features

1. **Upload Image**
   - Comic book cover
   - Full comic page
   - Vintage vs modern

2. **Select AI Provider**
   - Gemini (free, fast)
   - OpenAI (paid, detailed)
   - Anthropic (paid, thorough)

3. **Get Grade**
   - Shows CGC grade (0.5-10.0)
   - Page quality assessment
   - Restoration detection
   - Export as JSON/PDF

4. **Export Results**
   - JSON (for apps)
   - Markdown (for notes)
   - HTML (for sharing)
   - Text (for copy/paste)

---

## API Key Providers Explained

### 🟢 Google Gemini (RECOMMENDED)

- **Cost**: Free tier (generous)
- **Speed**: ⚡⚡⚡ Fastest
- **Quality**: Excellent
- **Setup**: 1 minute
- **Best for**: Starting out
- [Get key](https://makersuite.google.com/app/apikey)

### 🔵 OpenAI (GPT-4o Vision)

- **Cost**: $0.01-0.10 per image
- **Speed**: ⚡⚡ Medium
- **Quality**: Best for detail
- **Setup**: 5 minutes
- **Best for**: Production
- [Get key](https://platform.openai.com/api-keys)

### 🟣 Anthropic Claude

- **Cost**: $0.01-0.10 per image
- **Speed**: ⚡ Slower
- **Quality**: Good reasoning
- **Setup**: 5 minutes
- **Best for**: Complex analysis
- [Get key](https://console.anthropic.com/)

---

## FAQ

**Q**: Do I need to pay?
**A**: No! Gemini is free. You only pay if you use OpenAI or Anthropic (optional).

**Q**: Which method is fastest?
**A**: Cloud (Vercel) - 5 minutes total

**Q**: Which method is easiest?
**A**: Cloud - just clicks in browser

**Q**: Can I modify the code?
**A**: Yes! Use npm or manual path. Docker is also modifiable.

**Q**: Can I share with friends?
**A**: Yes! Use cloud deployment - share the link.

**Q**: Is my data safe?
**A**: Yes - images only sent to AI provider, not stored locally.

**Q**: Can I use multiple AI providers?
**A**: Yes! Add all 3 API keys, switch in UI.

---

## Checklist: Getting Started

### Before Starting

- [ ] 5-15 minutes available
- [ ] Pick your path (Cloud/npm/Docker/Manual)
- [ ] Know your skill level

### During Setup

- [ ] Get API key (Gemini recommended)
- [ ] Follow your path's guide
- [ ] Note any errors

### After Deployment

- [ ] App loads without errors
- [ ] Can upload an image
- [ ] Gets a grade
- [ ] Can export result

### Troubleshooting

- [ ] Check correct path's guide
- [ ] Look at error messages
- [ ] Try the solution listed
- [ ] Ask for help if stuck

---

## Next Steps

### Immediate (Choose One)

1. **Cloud?** → [DEPLOYMENT.md](DEPLOYMENT.md)
2. **npm?** → [GET_STARTED.md](GET_STARTED.md)
3. **Docker?** → [DOCKER_SETUP.md](DOCKER_SETUP.md)
4. **Manual?** → [SETUP.md](SETUP.md)
5. **Not sure?** → [START_HERE.md](START_HERE.md)

### Pick One Above & Follow Link!

---

**You're ready! 🚀 Pick your path and start grading!**
