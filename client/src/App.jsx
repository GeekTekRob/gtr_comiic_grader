import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AISelector } from './components/AISelector';
import { GradeReport } from './components/GradeReport';
import { SaveReport } from './components/SaveReport';
import { useGrader } from './hooks/useGrader';
import { checkHealth } from './api';
import './App.css';

export function App() {
  const [comicName, setComicName] = useState('');
  const [issueNumber, setIssueNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [availableProviders, setAvailableProviders] = useState(null);

  const { loading, error, report, progress, submitGradingRequest, clearError } = useGrader();

  // Check available providers on mount
  useEffect(() => {
    const checkProviders = async () => {
      try {
        const health = await checkHealth();
        setAvailableProviders(health.providers);
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

    if (selectedImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    const formData = new FormData();
    formData.append('comicName', comicName);
    formData.append('issueNumber', issueNumber);
    formData.append('aiProvider', selectedProvider);

    selectedImages.forEach((img) => {
      formData.append('images', img);
    });

    await submitGradingRequest(formData);
  };

  const handleReset = () => {
    setComicName('');
    setIssueNumber('');
    setSelectedProvider('');
    setSelectedImages([]);
    clearError();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎨 GTR Comic Grader</h1>
          <p>Professional AI-Powered Comic Book Grading</p>
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
                  disabled={loading}
                  availableProviders={availableProviders}
                />
              </div>

              <div className="form-section">
                <h2>Images</h2>
                <ImageUploader
                  onImagesSelected={setSelectedImages}
                  disabled={loading}
                />
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
                  disabled={loading || !availableProviders || (!availableProviders.gemini && !availableProviders.openai && !availableProviders.anthropic)}
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
              <GradeReport report={report} />
              <SaveReport report={report} />
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
