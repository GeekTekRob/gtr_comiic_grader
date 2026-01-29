import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AISelector } from './components/AISelector';
import { GradeReport } from './components/GradeReport';
import { SaveReport } from './components/SaveReport';
import { useGrader } from './hooks/useGrader';
import { checkHealth } from './api';

export function App() {
  const [comicName, setComicName] = useState('');
  const [issueNumber, setIssueNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedOllamaModel, setSelectedOllamaModel] = useState('');
  
  // New separated image states
  const [coverImages, setCoverImages] = useState([]);
  const [spineImages, setSpineImages] = useState([]);
  const [backImages, setBackImages] = useState([]);
  const [pageImages, setPageImages] = useState([]);
  
  const [availableProviders, setAvailableProviders] = useState(null);
  const [ollamaInfo, setOllamaInfo] = useState(null);
  const [formKey, setFormKey] = useState(0); // For resetting form components

  const { loading, error, report, progress, submitGradingRequest, clearError, clearReport } = useGrader();

  // Check available providers on mount
  useEffect(() => {
    const checkProviders = async () => {
      try {
        const health = await checkHealth();
        setAvailableProviders(health.providers);
        if (health.ollama) {
          setOllamaInfo(health.ollama);
          // Auto-select first available model if available
          if (health.ollama.models && health.ollama.models.length > 0) {
            setSelectedOllamaModel(health.ollama.models[0]);
          }
        }

        // Auto-select if only one provider is available
        const activeProviders = Object.entries(health.providers)
          .filter(([_, isActive]) => isActive)
          .map(([key]) => key);

        if (activeProviders.length === 1) {
          setSelectedProvider(activeProviders[0]);
        }
      } catch (err) {
        console.error('Failed to check providers:', err);
      }
    };

    checkProviders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comicName.trim()) {
      alert('Please enter comic name');
      return;
    }

    if (!issueNumber.trim()) {
      alert('Please enter issue number');
      return;
    }

    if (!selectedProvider) {
      alert('Please select an AI provider');
      return;
    }

    if (selectedProvider === 'ollama' && !selectedOllamaModel) {
      alert('Please select an Ollama model');
      return;
    }

    if (coverImages.length === 0) {
      alert('Cover Image is required');
      return;
    }

    const formData = new FormData();
    formData.append('comicName', comicName);
    formData.append('issueNumber', issueNumber);
    formData.append('aiProvider', selectedProvider);
    
    // Include model selection for Ollama
    if (selectedProvider === 'ollama' && selectedOllamaModel) {
      formData.append('ollamaModel', selectedOllamaModel);
    }

    // Combine images ensuring Cover is first
    const allImages = [...coverImages, ...spineImages, ...backImages, ...pageImages];

    // Minimal validation to ensure we have something
    if (allImages.length === 0) {
         alert('Please follow the upload validation steps.');
         return;
    }

    allImages.forEach((img) => {
      formData.append('images', img);
    });

    await submitGradingRequest(formData);
  };

  const isFormValid = () => {
    if (!comicName.trim()) return false;
    if (!issueNumber.trim()) return false;
    if (!selectedProvider) return false;
    if (selectedProvider === 'ollama' && !selectedOllamaModel) return false;
    if (coverImages.length === 0) return false;
    return true;
  };

  const handleReset = () => {
    setComicName('');
    setIssueNumber('');
    setSelectedProvider('');
    setSelectedOllamaModel('');
    setCoverImages([]);
    setSpineImages([]);
    setBackImages([]);
    setPageImages([]);
    setFormKey(prev => prev + 1); // Force remount of uploaders
    clearError();
    clearReport(); // Ensure we go back to form
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <img src="/gtr_comic_grader_logo.webp" alt="GTR Comic Grader" className="header-logo" />
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {!report ? (
            <form onSubmit={handleSubmit} className="grading-form">
              <div className="form-section">
                <h2>Comic Information</h2>

                <div className="form-group">
                  <label htmlFor="comic-name">Comic Title:</label>
                  <input
                    id="comic-name"
                    type="text"
                    value={comicName}
                    onChange={(e) => setComicName(e.target.value)}
                    placeholder="e.g., Amazing Spider-Man"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="issue-number">Issue Number:</label>
                  <input
                    id="issue-number"
                    type="text"
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(e.target.value)}
                    placeholder="e.g., 100"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>AI Provider</h2>
                <AISelector
                  selectedProvider={selectedProvider}
                  onProviderChange={setSelectedProvider}
                  disabled={loading || (availableProviders && Object.values(availableProviders).filter(Boolean).length === 1)}
                  availableProviders={availableProviders}
                  ollamaInfo={ollamaInfo}
                  selectedOllamaModel={selectedOllamaModel}
                  onOllamaModelChange={setSelectedOllamaModel}
                />
              </div>

              <div className="form-section">
                <h2>Images</h2>
                
                <div className="image-uploads-container" key={formKey}>
                    <ImageUploader
                      label="Front Cover (Required)"
                      helperText="Clear full front cover scan/photo"
                      singleImage={true}
                      onImagesSelected={setCoverImages}
                      disabled={loading}
                    />

                    <ImageUploader
                      label="Back Cover (Optional)"
                      helperText="Clear full back cover scan/photo"
                      singleImage={true}
                      onImagesSelected={setBackImages}
                      disabled={loading}
                    />

                    <ImageUploader
                      label="Spine Detail (Optional)"
                      helperText="Close-ups of the spine and staples"
                      maxImages={3}
                      onImagesSelected={setSpineImages}
                      disabled={loading}
                    />

                    <ImageUploader
                      label="Interior Pages (Optional)"
                      helperText="First page and centerfold recommended"
                      maxImages={5}
                      onImagesSelected={setPageImages}
                      disabled={loading}
                    />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <p>❌ {error}</p>
                  <button type="button" onClick={clearError}>
                    Dismiss
                  </button>
                </div>
              )}

              {progress && <div className="progress-message">⏳ {progress}</div>}

              <div className="button-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !isFormValid()}
                >
                  {loading ? 'Grading...' : '📊 Get Grade Report'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Clear Form
                </button>
              </div>
            </form>
          ) : (
            <div className="report-container">
              <button className="btn btn-secondary back-btn" onClick={() => handleReset()}>
                ← Back to Grading
              </button>
              <GradeReport 
                 report={report} 
                 comicName={comicName}
                 issueNumber={issueNumber}
                 coverImage={coverImages.length > 0 ? coverImages[0] : null}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>🔬 Professional Comic Grading Standards | Using CGC 10-Point Scale</p>
        <p>
          <small>
            For reference materials, visit:
            <a href="https://www.cgccomics.com" target="_blank" rel="noopener noreferrer">
              CGC Comics
            </a>
          </small>
        </p>
      </footer>
    </div>
  );
}

export default App;
