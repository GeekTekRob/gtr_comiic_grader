# Cloud Deployment (Share With Anyone)

Deploy to the cloud in 5 minutes with zero local setup.

## Choose Your Platform

### **1. Vercel** (Easiest for Beginners)

[Vercel Dashboard](https://vercel.com)

**Steps:**

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "New Project" → Select this repository
3. Add environment variables:
   - `GEMINI_API_KEY` = your key
   - `OPENAI_API_KEY` = your key (optional)
   - `ANTHROPIC_API_KEY` = your key (optional)
4. Click "Deploy"
5. Share your URL with friends!

**Time**: 5 minutes  
**Cost**: Free for starter  
**Best for**: Quick demos, sharing with friends

---

### **2. Railway** (Great for Full Stack)

[Railway Dashboard](https://railway.app)

**Steps:**

1. Go to [railway.app](https://railway.app) → Sign up
2. Click "Create Project" → Select "Deploy from GitHub"
3. Choose this repository
4. Add environment variables (same as above)
5. Railway auto-deploys on push

**Time**: 5 minutes  
**Cost**: Free $5/month credits  
**Best for**: Continuous deployment, development

---

### **3. Render** (Reliable & Free)

[Render Dashboard](https://render.com)

**Steps:**

1. Go to [render.com](https://render.com) → Sign up
2. Click "New +" → "Web Service"
3. Select "Node"
4. Add your repository
5. Configure same env vars
6. Deploy

**Time**: 5 minutes  
**Cost**: Free tier available  
**Best for**: Production deployment, reliability

---

### **4. Fly.io** (Best Performance)

[Fly.io Dashboard](https://fly.io)

**Steps:**

1. Install Fly CLI: `brew install flyctl` (Mac) or [download](https://fly.io/docs/hands-on/install-flyctl/)
2. Run: `flyctl launch`
3. Choose Node.js
4. Set env vars: `flyctl secrets set GEMINI_API_KEY=xxx`
5. Deploy: `flyctl deploy`

**Time**: 10 minutes  
**Cost**: Free tier with generous limits  
**Best for**: Global performance, Docker deployments

---

## Environment Variables You Need

Get these API keys first (5 min total):

### Google Gemini (Recommended - Free)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Set as `GEMINI_API_KEY`

### OpenAI (Optional - Need Credits)

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key
4. Set as `OPENAI_API_KEY`

### Anthropic (Optional - Need Credits)

1. Go to https://console.anthropic.com
2. Go to API Keys section
3. Create new key
4. Set as `ANTHROPIC_API_KEY`

---

## Recommended Setup

**Minimum (works great):**

- ✅ GEMINI_API_KEY only
- Deploy on Vercel
- Works perfectly for testing

**Better (recommended):**

- ✅ GEMINI_API_KEY (free tier)
- ✅ OPENAI_API_KEY (better vision)
- Deploy on Railway or Render
- Good balance of cost/quality

**Best (full features):**

- ✅ All three API keys
- Deploy on Fly.io
- Maximum flexibility and speed

---

## After Deployment

### Test Your Deployment

Your app is now at: `https://your-app-name.vercel.app` (or similar)

1. Open the URL
2. Upload a comic book image
3. Select AI provider
4. Click "Grade"
5. See results!

### Share the Link

Send `https://your-app-name.vercel.app` to friends.

They can use it without installing anything!

---

## Managing Deployed App

### Update Environment Variables

**Vercel**: Settings → Environment Variables → Edit → Redeploy
**Railway**: Variables → Edit → Auto-redeploys
**Render**: Environment → Edit → Trigger Redeploy
**Fly.io**: `flyctl secrets set KEY=value`

### View Logs

**Vercel**: Deployments → Select → Logs
**Railway**: Logs tab shows real-time
**Render**: Logs in dashboard
**Fly.io**: `flyctl logs`

### Redeploy

**Vercel**: Push to GitHub (auto-deploys)
**Railway**: Git push (auto-deploys)
**Render**: Git push (auto-deploys)
**Fly.io**: `flyctl deploy`

---

## Cost Comparison

| Platform    | Free Tier   | Good For        |
| ----------- | ----------- | --------------- |
| **Vercel**  | ✅ Generous | Demos, learning |
| **Railway** | ⚠️ $5/mo    | Small projects  |
| **Render**  | ✅ Limited  | Testing         |
| **Fly.io**  | ✅ Generous | Production      |

**API Costs** (separate from hosting):

- Gemini: Free tier (generous)
- OpenAI: ~$0.01-0.10 per image
- Anthropic: ~$0.01-0.10 per image

---

## Common Issues

**"Cannot find module"**

- Probably missing dependency
- Check your `npm install` ran on deploy
- Restart deployment

**"API key invalid"**

- Double-check key is correct
- No extra spaces in env var
- Try regenerating key from provider

**"Port already in use"**

- Cloud platforms handle this automatically
- No action needed

**"Timeout on large images"**

- Upload smaller images
- Check AI provider rate limits

---

## Scaling Up

When you need more:

1. **Add database**: Supabase or Railway Postgres
2. **Enable authentication**: Clerk or Auth0
3. **Add email**: SendGrid or Resend
4. **Use CDN**: Cloudflare

All platforms support these integrations.

---

## Next Steps

1. **Pick a platform** above ☝️ (Vercel recommended)
2. **Get GEMINI_API_KEY** (5 min)
3. **Deploy** (5 min)
4. **Share link** with friends!

---

## Support

**Issue**: Deployment failed

- Check logs in platform dashboard
- Verify all env vars set
- Try redeploying

**Issue**: App works locally but not in cloud

- Check Node.js version (should be 18+)
- Verify env vars exactly match
- Check file paths are relative

**Issue**: Can't get API key

- Visit provider websites listed above
- May need to verify phone/payment
- Gemini is easiest to start with

---

## Bonus: GitHub Actions Auto-Deploy

Want auto-deployment on every push? Add this to your repository:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

Every time you push to GitHub, it auto-deploys!

---

That's it! You now have a production app running in the cloud. 🎉
