#!/usr/bin/env node

/**
 * GTR Comic Grader - Interactive Setup Script
 * Simplifies installation and configuration for non-technical users
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, resolve);
  });

async function main() {
  console.log(`
╔════════════════════════════════════════════════╗
║  GTR Comic Grader - Setup Wizard               ║
║  Let's get you grading comics!                 ║
╚════════════════════════════════════════════════╝
`);

  try {
    // Step 1: Check Node.js
    console.log('📋 Checking system requirements...');
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
      console.log(`✅ Node.js ${nodeVersion} found\n`);
    } catch (e) {
      console.log('❌ Node.js not found. Please install Node.js 18+');
      console.log('📥 Download: https://nodejs.org\n');
      process.exit(1);
    }

    // Step 2: Install dependencies
    console.log('📦 Installing dependencies...');
    
    const rootModules = path.join(__dirname, 'node_modules');
    const clientModules = path.join(__dirname, 'client', 'node_modules');

    if (fs.existsSync(rootModules) && fs.existsSync(clientModules)) {
      console.log('✅ Dependencies already installed. Skipping...');
    } else {
      console.log('(This may take a couple minutes)\n');

      if (!fs.existsSync(rootModules)) {
        try {
          execSync('npm install', { stdio: 'inherit', cwd: __dirname });
          console.log('\n✅ Root dependencies installed');
        } catch (e) {
          console.log('❌ Failed to install root dependencies');
          process.exit(1);
        }
      }

      if (!fs.existsSync(clientModules)) {
        try {
          const clientDir = path.join(__dirname, 'client');
          execSync('npm install', { stdio: 'inherit', cwd: clientDir });
          console.log('✅ Client dependencies installed\n');
        } catch (e) {
          console.log('❌ Failed to install client dependencies');
          process.exit(1);
        }
      }
    }

    // Step 3: Ask about AI providers
    console.log('🤖 AI Provider Setup\n');
    console.log('Which AI providers would you like to use?');
    console.log('(Get free API keys in seconds - all support free tier)\n');

    const gemini = await question('✨ Use Google Gemini (fastest, free tier)? [Y/n]: ');
    const openai = await question('🟢 Use OpenAI GPT-4o? [y/N]: ');
    const anthropic = await question('🟣 Use Anthropic Claude? [y/N]: ');
    const ollama = await question('🦙 Use local Ollama (Free, private, requires local setup)? [y/N]: ');

    // Step 4: Collect API keys
    const env = {
      PORT: '5000',
      NODE_ENV: 'development',
    };

    console.log('\n🔑 API Keys Setup\n');

    if (gemini.toLowerCase() !== 'n') {
      console.log('Google Gemini (Recommended - FREE):');
      console.log('  1. Go to: https://aistudio.google.com/app/apikeys');
      console.log('  2. Click "Create API Key"');
      console.log('  3. Copy the key and paste below\n');
      const key = await question('Gemini API Key (or press Enter to skip): ');
      if (key) env.GEMINI_API_KEY = key;
    }

    if (openai.toLowerCase() === 'y') {
      console.log('\nOpenAI GPT-4o:');
      console.log('  1. Go to: https://platform.openai.com/api-keys');
      console.log('  2. Create a new API key');
      console.log('  3. Copy and paste below\n');
      const key = await question('OpenAI API Key (or press Enter to skip): ');
      if (key) env.OPENAI_API_KEY = key;
    }

    if (anthropic.toLowerCase() === 'y') {
      console.log('\nAnthropic Claude:');
      console.log('  1. Go to: https://console.anthropic.com/keys');
      console.log('  2. Create a new API key');
      console.log('  3. Copy and paste below\n');
      const key = await question('Anthropic API Key (or press Enter to skip): ');
      if (key) env.ANTHROPIC_API_KEY = key;
    }

    if (ollama.toLowerCase() === 'y') {
      console.log('\nLocal Ollama:');
      console.log('  1. Install Ollama from https://ollama.ai');
      console.log('  2. Run: ollama pull llama3-vision');
      const url = await question('Ollama URL (default: http://localhost:11434): ');
      if (url) env.OLLAMA_API_URL = url;
    }

    // Check if at least one provider is configured
    const providers = [
      env.GEMINI_API_KEY, 
      env.OPENAI_API_KEY, 
      env.ANTHROPIC_API_KEY,
      ollama.toLowerCase() === 'y'
    ].filter(Boolean).length;

    if (providers === 0) {
      console.log(
        '\n⚠️  No API keys provided. Get a free Gemini key to get started:\n  https://aistudio.google.com/app/apikeys\n'
      );
    } else {
      console.log(`\n✅ Found ${providers} AI provider(s) configured\n`);
    }

    // Step 5: Write .env file
    const envContent = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent + '\n');
    console.log('✅ Configuration saved to .env');

    // Step 6: Summary
    console.log(`
╔════════════════════════════════════════════════╗
║  ✅ Setup Complete!                            ║
╚════════════════════════════════════════════════╝

Next steps:

1️⃣  Start the app:
    npm run dev

2️⃣  Open in your browser:
    http://localhost:5173

3️⃣  Start grading comics!

📚 Need help?
   - Docs: README.md or START_HERE.md
   - Troubleshooting: SETUP.md

Happy grading! 🎉📚
`);

    rl.close();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
