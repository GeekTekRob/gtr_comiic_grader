import React, { useState, useEffect } from 'react';

const PROVIDER_ICONS = {
  gemini: { icon: '/ai_provider/google-gemini-dark.webp', label: 'Google Gemini' },
  openai: { icon: '/ai_provider/chatgpt.webp', label: 'OpenAI GPT-4o' },
  anthropic: { icon: '/ai_provider/claude.webp', label: 'Anthropic Claude' },
  ollama: { icon: '/ai_provider/ollama.webp', label: 'Ollama' }
};

export function AISelector({ selectedProvider, onProviderChange, disabled, availableProviders, ollamaInfo, selectedOllamaModel, onOllamaModelChange }) {
  const [showOllamaModels, setShowOllamaModels] = useState(false);

  useEffect(() => {
    setShowOllamaModels(selectedProvider === 'ollama');
  }, [selectedProvider]);

  return (
    <div className="ai-selector">
      <div className="provider-section">
        <label className="ai-label">Select AI Provider:</label>
        <div className="provider-buttons">
          {availableProviders?.gemini && (
            <button
              type="button"
              className={`provider-btn ${selectedProvider === 'gemini' ? 'active' : ''}`}
              onClick={() => onProviderChange('gemini')}
              disabled={disabled}
              title={PROVIDER_ICONS.gemini.label}
            >
              <img src={PROVIDER_ICONS.gemini.icon} alt="Gemini" className="provider-icon-img" />
            </button>
          )}

          {availableProviders?.openai && (
            <button
              type="button"
              className={`provider-btn ${selectedProvider === 'openai' ? 'active' : ''}`}
              onClick={() => onProviderChange('openai')}
              disabled={disabled}
              title={PROVIDER_ICONS.openai.label}
            >
               <img src={PROVIDER_ICONS.openai.icon} alt="OpenAI" className="provider-icon-img" />
            </button>
          )}

          {availableProviders?.anthropic && (
            <button
              type="button"
              className={`provider-btn ${selectedProvider === 'anthropic' ? 'active' : ''}`}
              onClick={() => onProviderChange('anthropic')}
              disabled={disabled}
              title={PROVIDER_ICONS.anthropic.label}
            >
               <img src={PROVIDER_ICONS.anthropic.icon} alt="Claude" className="provider-icon-img" />
            </button>
          )}

          {availableProviders?.ollama && (
            <button
              type="button"
              className={`provider-btn ${selectedProvider === 'ollama' ? 'active' : ''}`}
              onClick={() => onProviderChange('ollama')}
              disabled={disabled}
              title={PROVIDER_ICONS.ollama.label}
            >
               <img src={PROVIDER_ICONS.ollama.icon} alt="Ollama" className="provider-icon-img" />
            </button>
          )}
        </div>
      </div>

      {showOllamaModels && ollamaInfo && (
        <div className="model-section">
          {ollamaInfo.modelCount === 0 ? (
            <div className="warning ollama-warning">
              ⚠️ No models found.
            </div>
          ) : (
            <>
                <label htmlFor="ollama-model-select" className="ai-label">Local Model:</label>
                <div className="ollama-model-selector">
                <select
                    id="ollama-model-select"
                    value={selectedOllamaModel}
                    onChange={(e) => onOllamaModelChange(e.target.value)}
                    disabled={disabled}
                    className="model-select"
                >
                    <option value="">-- Choose --</option>
                    {ollamaInfo.models.map((model) => (
                    <option key={model} value={model}>
                        {model}
                    </option>
                    ))}
                </select>
                </div>
            </>
          )}
        </div>
      )}

      {(!availableProviders || (!availableProviders.gemini && !availableProviders.openai && !availableProviders.anthropic && !availableProviders.ollama)) && (
        <div className="warning" style={{width: '100%'}}>
          ⚠️ No AI providers are configured.
        </div>
      )}
    </div>
  );
}
