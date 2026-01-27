import React from 'react';

export function AISelector({ selectedProvider, onProviderChange, disabled, availableProviders }) {
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
      </select>

      {!availableProviders || (!availableProviders.gemini && !availableProviders.openai && !availableProviders.anthropic) && (
        <div className="warning">
          ⚠️ No AI providers are configured. Please set up API keys in your .env file.
        </div>
      )}
    </div>
  );
}
