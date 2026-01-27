import React, { useState } from 'react';

export function ImageUploader({ onImagesSelected, disabled }) {
  const [preview, setPreview] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please select image files only');
      return;
    }

    if (imageFiles.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    // Create preview URLs
    const previews = imageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPreview(previews);
    onImagesSelected(imageFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index) => {
    const newPreview = preview.filter((_, i) => i !== index);
    setPreview(newPreview);
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          id="image-input"
          style={{ display: 'none' }}
        />

        <label htmlFor="image-input" className="upload-label">
          <div className="upload-icon">📷</div>
          <h3>Upload Comic Images</h3>
          <p>Drag and drop or click to select images</p>
          <p className="file-hint">Supported: JPG, PNG, WebP (Max 10 MB each, up to 10 images)</p>
        </label>
      </div>

      {preview.length > 0 && (
        <div className="preview-section">
          <h4>Selected Images ({preview.length})</h4>
          <div className="preview-grid">
            {preview.map((img, index) => (
              <div key={index} className="preview-item">
                <img src={img.url} alt={img.name} />
                <button
                  className="remove-btn"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  type="button"
                >
                  ✕
                </button>
                <small>{img.name}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
