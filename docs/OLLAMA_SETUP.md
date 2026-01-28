# Ollama Integration - Local Vision Model Support

This guide explains how to use Ollama with GTR Comic Grader to run vision models locally without requiring cloud API keys.

## What is Ollama?

Ollama is a tool for running large language models locally. It provides easy-to-use command-line utilities and APIs for downloading, installing, and running open-source models on your machine.

**Benefits:**

- No API costs or rate limits
- Completely private - no data sent to cloud services
- Offline capability - works without internet after model download
- Fast inference with GPU acceleration (if available)

## Installation

### Windows

1. Download Ollama from [https://ollama.ai](https://ollama.ai)
2. Run the installer and follow the setup wizard
3. Ollama will start automatically and run in the background
4. Verify installation by opening PowerShell and running:
   ```powershell
   ollama --version
   ```

### macOS

1. Download Ollama from [https://ollama.ai](https://ollama.ai)
2. Open the `.dmg` file and drag Ollama to Applications
3. Launch Ollama from Applications
4. Verify in terminal:
   ```bash
   ollama --version
   ```

### Linux

```bash
curl https://ollama.ai/install.sh | sh
```

Verify installation:

```bash
ollama --version
```

## Recommended Vision Models

### Llama 3.2 Vision (Recommended)

**Size:** ~7-13 GB depending on version  
**Speed:** Fast  
**Quality:** Excellent

```bash
ollama pull llama3.2-vision
```

- Good at detailed analysis
- Balanced performance and quality
- Good for comic grading tasks

### Qwen Vision (qwen3-vl)

**Size:** ~8-17 GB depending on version  
**Speed:** Fast  
**Quality:** Excellent

```bash
ollama pull qwen3-vl
```

- Very good visual understanding
- Competitive with proprietary models
- Excellent for detailed image analysis

### Gemma 3 Vision

**Size:** ~5-10 GB  
**Speed:** Very Fast  
**Quality:** Good

```bash
ollama pull gemma3-vision
```

- Lighter weight option
- Good for basic grading
- Faster inference

### LLaVA (Larger Option)

**Size:** ~15+ GB  
**Speed:** Slower  
**Quality:** Very Good

```bash
ollama pull llava:latest
```

- Very detailed analysis
- Excellent for complex grading scenarios

## Installation Steps

### Step 1: Download a Vision Model

Open PowerShell or Command Prompt and run:

```bash
# For Llama 3.2 Vision (Recommended)
ollama pull llama3.2-vision

# OR for Qwen3-VL
ollama pull qwen3-vl

# OR for Gemma3
ollama pull gemma3-vision
```

This will download the model (typically 7-17 GB depending on the model). This is a one-time operation.

### Step 2: Verify Model Installation

List installed models:

```bash
ollama list
```

You should see your pulled model listed.

### Step 3: Ensure Ollama is Running

Ollama automatically starts on Windows/macOS. For Linux or to verify it's running:

```bash
# Check if Ollama service is running
ollama serve

# It should output something like:
# Starting Ollama...
# Listening on 127.0.0.1:11434
```

Keep this terminal open or run it in the background.

## Configuration

### Environment Variables

Add these to your `.env` file in the project root:

```env
# Required - Ollama API endpoint (default shown)
OLLAMA_API_URL=http://localhost:11434

# Optional - Set default model (if not specified, uses llama3.2-vision)
OLLAMA_MODEL=llama3.2-vision
```

### Available Ollama Configuration

| Variable         | Description          | Default                | Example                    |
| ---------------- | -------------------- | ---------------------- | -------------------------- |
| `OLLAMA_API_URL` | Ollama server URL    | http://localhost:11434 | http://192.168.1.100:11434 |
| `OLLAMA_MODEL`   | Default model to use | llama3.2-vision        | qwen3-vl                   |

## Usage

1. **Make sure Ollama is running:**
   - On Windows/macOS: Should auto-start
   - On Linux: Run `ollama serve` in a terminal

2. **Start GTR Comic Grader:**

   ```bash
   npm run dev
   # or
   npm start
   ```

3. **In the web interface:**
   - Comic information form will auto-detect available Ollama models
   - Select "🐫 Ollama (Local Models)" from the AI Provider dropdown
   - Upload your images as usual
   - Click Grade - the application will automatically use the default model

## Troubleshooting

### "Ollama is not configured or not running"

**Solution:**

1. Verify Ollama is installed: `ollama --version`
2. Check if Ollama service is running:
   - Windows: Check system tray for Ollama icon
   - macOS: Check menu bar for Ollama icon
   - Linux: Run `ollama serve` manually
3. Ensure you're accessing the correct endpoint (default: http://localhost:11434)
4. Check firewall settings aren't blocking port 11434

### "No models found" or "Model not available"

**Solution:**

1. Pull a model: `ollama pull llama3.2-vision`
2. Verify it's installed: `ollama list`
3. Wait for the pull to complete (can take several minutes)
4. Refresh the web interface

### Model pulls but grading fails

**Solution:**

1. Check available system memory (models need 8GB+ RAM ideally)
2. If using GPU, verify GPU drivers are installed
3. Try with a smaller model (Gemma3) first
4. Check Ollama logs: look for error messages in the terminal where Ollama is running

### Performance is slow

**Solutions:**

- **Use GPU:** Install NVIDIA/AMD drivers for GPU acceleration
- **Use smaller model:** Try `gemma3-vision` instead of larger models
- **Increase system RAM:** Models perform better with more available memory
- **Close other applications:** Free up system resources

### "Connection refused" or "ECONNREFUSED"

**Solution:**

1. Ensure Ollama is running: `ollama serve` (if not auto-running)
2. Check the correct API URL in `.env`
3. On Windows, Ollama runs on `http://localhost:11434` by default
4. Network access: If accessing from another machine, use the IP address instead of localhost:
   ```
   OLLAMA_API_URL=http://192.168.1.100:11434
   ```

## Performance Expectations

| Model            | Memory (RAM) | VRAM | Speed     | Quality   |
| ---------------- | ------------ | ---- | --------- | --------- |
| Gemma3           | 6GB          | 4GB  | Very Fast | Good      |
| Llama 3.2 Vision | 8GB          | 6GB  | Fast      | Excellent |
| Qwen3-VL         | 10GB         | 8GB  | Fast      | Excellent |
| LLaVA            | 12GB         | 10GB | Slow      | Very Good |

**Notes:**

- Larger models provide better quality but require more resources
- GPU acceleration significantly improves speed
- First run will be slower as model loads into memory
- Subsequent runs are faster (model stays in cache)

## Advanced Configuration

### Using a Remote Ollama Instance

If running Ollama on a different machine:

```env
OLLAMA_API_URL=http://192.168.1.100:11434
```

### Docker Support

If running in Docker, expose Ollama's port:

```bash
docker run -p 11434:11434 ollama/ollama
```

### GPU Acceleration

For NVIDIA GPUs:

- Install NVIDIA CUDA toolkit
- Ollama will auto-detect and use GPU

For AMD GPUs:

- Install AMD ROCm drivers
- Ollama will auto-detect and use GPU

## Comparison: Cloud APIs vs. Ollama

| Feature       | OpenAI/Gemini/Claude     | Ollama                  |
| ------------- | ------------------------ | ----------------------- |
| Cost          | Per-request charges      | Free (hardware cost)    |
| Privacy       | Data sent to cloud       | All local               |
| Offline       | No                       | Yes\*                   |
| Speed         | Fast (network dependent) | Fast (local)            |
| Quality       | Excellent                | Good-Excellent          |
| Setup         | API keys needed          | Just download           |
| Limitations   | Rate limits, quotas      | Hardware-dependent      |
| Latest Models | Always up-to-date        | Updates needed manually |

\*After initial model download

## Getting Help

1. Check [Ollama Documentation](https://github.com/ollama/ollama)
2. View Ollama logs where you ran `ollama serve`
3. Check the application logs in browser console (F12)
4. Ensure .env file has correct variables

## Next Steps

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a vision model: `ollama pull llama3.2-vision`
3. Start the GTR Comic Grader
4. Select Ollama from the AI Provider dropdown
5. Enjoy free, private comic grading!
