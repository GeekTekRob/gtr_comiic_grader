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

## Cost Comparison

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

**"Timeout on large images"**

- Upload smaller images
- Check AI provider rate limits

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
