# Docker Setup (Easiest Way)

Only 2 things you need:

1. **Docker** - [Download here](https://www.docker.com/products/docker-desktop)
2. **An API key** - Free options:
   - [Google Gemini](https://makersuite.google.com/app/apikey) (recommended - free tier generous)
   - [OpenAI](https://platform.openai.com/api-keys) (need $5 minimum)
   - [Anthropic Claude](https://console.anthropic.com/) (need credits)

## Quick Start

### 1. Create `.env` file

Create a file named `.env` in the project folder:

```
GEMINI_API_KEY=your_gemini_key_here
```

Replace `your_gemini_key_here` with your actual API key.

### 2. Run it (choose one):

**On Windows (PowerShell):**

```powershell
docker-compose up
```

**On Mac/Linux:**

```bash
docker-compose up
```

**Just Docker (no compose):**

```bash
docker build -t gtr-grader .
docker run -p 5000:5000 --env-file .env gtr-grader
```

### 3. Open in browser

Go to: `http://localhost:5000`

## That's it! 🎉

Upload a comic book image and get instant grading.

## Troubleshooting

**"Docker not found"**

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop) first

**"Port 5000 already in use"**

```bash
docker-compose up -p 5001:5000
```

Then visit `http://localhost:5001`

**"Connection refused"**

- Wait 10-15 seconds for the app to start
- Check logs: `docker-compose logs`

**No grades coming back**

- Check your API key in `.env` is correct
- Check Docker logs: `docker-compose logs app`

## Stopping

Press `Ctrl+C` or run:

```bash
docker-compose down
```

## For Development (with live reload)

Install setup normally:

```bash
npm run setup
npm run dev
```

Docker is mainly for deployment/sharing.

---

**Questions?** Check [GET_STARTED.md](GET_STARTED.md) for non-Docker setup.
