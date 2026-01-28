import React, { useState, useEffect } from 'react';

export function ImageUploader({ 
  onImagesSelected, 
  disabled, 
  label = "Upload Comic Images",
  helperText = "Drag and drop or click to select images",
  maxImages = 10,
  singleImage = false
}) {
  const [preview, setPreview] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Clear preview if parent clears selection (hacky check: if component is re-mounted or parent resets)
  // Ideally parent controls state, but for now we'll stick to internal state reset via key in parent

  const handleFiles = (files) => {
    const filters = Array.from(files).filter((file) => file.type.startsWith('image/'));

    if (filters.length === 0) {
      if (files.length > 0) alert('Please select image files only');
      return;
    }

    let imageFiles = filters;

    if (singleImage) {
        imageFiles = [imageFiles[0]];
    } else if (preview.length + imageFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Create preview URLs
    const newPreviews = imageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file // Keep reference to file if needed locally
    }));

    if (singleImage) {
        setPreview(newPreviews);
        onImagesSelected(imageFiles); // Send single file array
    } else {
        const updatedPreviews = [...preview, ...newPreviews];
        setPreview(updatedPreviews);
        
        // Convert back to array of files for parent
        const updatedFiles = updatedPreviews.map(p => p.file);
        // We need to maintain the original files. 
        // Actually, mixing new and old 'files' is tricky if we don't store them.
        // Let's store files in state too.
        onImagesSelected(files);
    }
  };
  
  // Re-implementing state management to be cleaner
  // We need to keep track of accumulating files if not singleImage
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleNewFiles = (files) => {
     const incomingFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
     if (incomingFiles.length === 0) return;

     let updatedFiles;
     let updatedPreviews;

     if (singleImage) {
         updatedFiles = [incomingFiles[0]];
         updatedPreviews = [{
             name: updatedFiles[0].name,
             url: URL.createObjectURL(updatedFiles[0])
         }];
     } else {
         if (selectedFiles.length + incomingFiles.length > maxImages) {
             alert(`Maximum ${maxImages} images allowed in this section`);
             return;
         }
         updatedFiles = [...selectedFiles, ...incomingFiles];
         updatedPreviews = [
             ...preview, 
             ...incomingFiles.map(f => ({
                 name: f.name,
                 url: URL.createObjectURL(f)
             }))
         ];
     }

     setSelectedFiles(updatedFiles);
     setPreview(updatedPreviews);
     onImagesSelected(updatedFiles);
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
    handleNewFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    handleNewFiles(e.target.files);
  };

  const removeImage = (index) => {
    const newPreview = preview.filter((_, i) => i !== index);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    
    setPreview(newPreview);
    setSelectedFiles(newFiles);
    onImagesSelected(newFiles);
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
          multiple={!singleImage}
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          id={`image-input-${label.replace(/\s+/g, '-')}`}
          style={{ display: 'none' }}
        />

        <label htmlFor={`image-input-${label.replace(/\s+/g, '-')}`} className="upload-label">
          <div className="upload-icon">📷</div>
          <h3>{label}</h3>
          <p>{helperText}</p>
          <p className="file-hint">Supported: JPG, PNG, WebP (Max 10 MB each, {singleImage ? '1 image' : `up to ${maxImages} images`})</p>
        </label>
      </div>

      {preview.length > 0 && (
        <div className="preview-section">
          <h4>Selected ({preview.length})</h4>
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
