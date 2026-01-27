# 🚀 Getting Started - GTR Comic Grader

**Welcome!** This is all you need to know to get started grading comics.

---

## ⏱️ 5 Minute Setup

### Step 1: Install Node.js (if needed)

- Download: https://nodejs.org
- Click "Install"
- Done!

### Step 2: Run Setup

Open terminal/command prompt in the project folder and run:

```bash
npm run setup
```

This will:

- ✅ Install everything automatically
- ✅ Ask you for API keys (copy/paste only)
- ✅ Save your configuration

### Step 3: Start the App

```bash
npm run dev
```

### Step 4: Open in Browser

Visit: http://localhost:5173

**You're done!** 🎉

---

## Getting API Keys (2 minutes each)

### Google Gemini (RECOMMENDED - FREE)

1. Go to: https://aistudio.google.com/app/apikeys
2. Click "Create API Key"
3. Copy and paste in the setup wizard
4. Done!

### OpenAI (Optional)

1. Go to: https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste in the setup wizard

### Anthropic Claude (Optional)

1. Go to: https://console.anthropic.com/keys
2. Create a new API key
3. Copy and paste in the setup wizard

---

## How to Use

1. **Enter Comic Info**
   - Title (e.g., "Amazing Spider-Man")
   - Issue Number (e.g., "100")

2. **Upload Images**
   - Drag and drop images OR click to select
   - Show front, back, spine, and any pages

3. **Select AI Provider**
   - Choose which AI to use
   - (Gemini is fastest)

4. **Get Your Grade**
   - AI analyzes the images
   - Shows detailed grading report
   - Suggests how to improve it

5. **Save or Share**
   - Download as PDF, JSON, or other format
   - Share with collectors or for insurance

---

## What If Something Goes Wrong?

### "Setup wizard not working"

- Make sure you have Node.js installed
- Try: `node --version` (should show 18+)

### "No AI providers available"

- You need at least one API key
- Get a free Gemini key: https://aistudio.google.com/app/apikeys
- Copy and paste it when setup asks

### "App won't start"

- Make sure port 5000 is available
- Close other apps using that port
- Try again

### Still stuck?

See SETUP.md for more detailed help.

---

## Commands You'll Need

```bash
npm run setup      # Run setup wizard (first time only)
npm run dev        # Start the app
npm run build      # Build for production
npm start          # Run production version
```

---

## That's It!

You now have a professional comic book grading tool running on your computer.

**Questions?** Check out README.md or SETUP.md

**Ready?** Run `npm run setup` and start grading! 📚✨
