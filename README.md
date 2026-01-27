# GTR Comic Grader

**AI-Powered Comic Book Grading & Restoration Detection**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

A professional comic book grading platform that uses AI (Gemini, GPT-4o, or Claude) to analyze images and provide standardized CGC grading reports.

---

## 🚀 Quick Start in 5 Minutes

### Option 1: Docker (Easiest)

Get running in 2 minutes with no dependency mess.

```bash
# 1. Create .env file with your API key (GEMINI_API_KEY=...)
# 2. Run:
docker-compose up
```

_See [Docker Guide](docs/DOCKER_SETUP.md) for details._

### Option 2: NPM (For Developers)

Interactive setup wizard to get you running fast.

```bash
# 1. Run the setup wizard
npm run setup

# 2. Start the app
npm run dev
```

_See [NPM Guide](docs/GET_STARTED.md) for details._

### Option 3: Cloud (No Install)

Deploy instantly to Vercel, Railway, or Render.
_See [Cloud Deployment Guide](docs/DEPLOYMENT.md)._

---

## ✨ Features

- **Multi-AI Support**: Switch between Gemini (Free), OpenAI, or Anthropic.
- **CGC Standards**: 10-point grading scale (0.5 - 10.0) with page quality grade caps.
- **Restoration Detection**: Identifies trimming, color touch, and other conservation work.
- **Export Reports**: Save grades as JSON, Markdown, HTML, or Text.
- **Batch Grading**: Process multiple comics at once.

---

## 📂 Documentation

We've moved the detailed documentation to the [`docs/`](docs/) folder to keep things clean.

- **[User Journey Guide](docs/USER_JOURNEY.md)** - Not sure where to start? Read this.
- **[Quick Start Cheat Sheet](docs/QUICK_START.md)** - Commands & API Keys.
- **[Full Manual Setup](docs/SETUP.md)** - For advanced configuration.
- **[API Documentation](docs/API.md)** - Endpoints and integration.
- **[Docker Setup](docs/DOCKER_SETUP.md)** - Container instructions.
- **[Cloud Deployment](docs/DEPLOYMENT.md)** - Hosting instructions.

---

## 🛠 Projects Structure

- `setup.js` - The interactive setup script.
- `setup.bat` / `setup.sh` - One-click installers.
- `src/` - Backend logic (Node/Express).
- `client/` - Frontend application (React/Vite).
- `docs/` - Extensive documentation.

---

## 🔑 API Keys

You need at least one API key to use this.

- **Google Gemini**: Free and fast. [Get Key](https://makersuite.google.com/app/apikey)
- **OpenAI**: Best for details. [Get Key](https://platform.openai.com/api-keys)
- **Anthropic**: Good reasoning. [Get Key](https://console.anthropic.com/)

---

_Built with Node.js, Express, React, & Vite._
