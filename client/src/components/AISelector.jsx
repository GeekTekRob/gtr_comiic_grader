import React, { useState, useEffect } from 'react';

export function AISelector({ selectedProvider, onProviderChange, disabled, availableProviders, ollamaInfo, selectedOllamaModel, onOllamaModelChange }) {
  const [showOllamaModels, setShowOllamaModels] = useState(false);

  useEffect(() => {
    setShowOllamaModels(selectedProvider === 'ollama');
  }, [selectedProvider]);

  return (
    <div className="ai-selector">
      <label htmlFor="provider-select">Select AI Provider:</label>
      <select
        id="provider-select"
        value={selectedProvider}
        onChange={(e) => onProviderChange(e.target.value)}
        disabled={disabled}
        className="provider-select"
      >
        <option value="">-- Choose a provider --</option>

        {availableProviders?.gemini && (
          <option value="gemini">🔵 Google Gemini</option>
        )}

        {availableProviders?.openai && (
          <option value="openai">🟢 OpenAI GPT-4o</option>
        )}

        {availableProviders?.anthropic && (
          <option value="anthropic">🟣 Anthropic Claude 3.5</option>
        )}

        {availableProviders?.ollama && (
          <option value="ollama">🐫 Ollama (Local Models)</option>
        )}
      </select>

      {showOllamaModels && ollamaInfo && (
        <div className="ollama-info">
          <div className="ollama-status">
            <strong>Ollama Status:</strong> Connected
            {ollamaInfo.modelCount > 0 && (
              <span className="model-count"> ({ollamaInfo.modelCount} models available)</span>
            )}
          </div>
          {ollamaInfo.modelCount === 0 && (
            <div className="warning">
              ⚠️ No models found. Pull a vision model using:
              <br />
              <code>ollama pull llama3-vision</code> or <code>ollama pull qwen3-vl</code>
            </div>
          )}
          {ollamaInfo.models && ollamaInfo.models.length > 0 && (
            <div className="ollama-model-selector">
              <label htmlFor="ollama-model-select">Select Model:</label>
              <select
                id="ollama-model-select"
                value={selectedOllamaModel}
                onChange={(e) => onOllamaModelChange(e.target.value)}
                disabled={disabled}
                className="model-select"
              >
                <option value="">-- Choose a model --</option>
                {ollamaInfo.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {(!availableProviders || (!availableProviders.gemini && !availableProviders.openai && !availableProviders.anthropic && !availableProviders.ollama)) && (
        <div className="warning">
          ⚠️ No AI providers are configured. Please set up API keys in your .env file or install Ollama.
        </div>
      )}
    </div>
  );
}
