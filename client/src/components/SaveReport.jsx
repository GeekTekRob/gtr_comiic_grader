import React, { useState } from 'react';

export function SaveReport({ report, comicName, issueNumber, coverImage }) {
  const [saving, setSaving] = useState(false);

  if (!report || !report.success) {
    return null;
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const downloadReport = async (format) => {
    setSaving(true);
    try {
      let content = '';
      let filename = `Grade_Report_${(comicName || 'comic').replace(/[^a-z0-9]/gi, '_')}_${issueNumber || '0'}`;
      let mimeType = 'text/plain';
      let extension = 'txt';
      let imageBase64 = null;

      if (coverImage && format === 'html') {
          try {
            imageBase64 = await fileToBase64(coverImage);
          } catch(e) {
              console.error("Failed to convert image", e);
          }
      }

      const meta = { comicName, issueNumber, imageBase64 };

      switch (format) {
        case 'json':
          content = JSON.stringify({ ...report, comicName, issueNumber }, null, 2);
          extension = 'json';
          mimeType = 'application/json';
          break;

        case 'markdown':
          content = formatMarkdown(report, meta);
          extension = 'md';
          mimeType = 'text/markdown';
          break;

        case 'html':
          content = formatHTML(report, meta);
          extension = 'html';
          mimeType = 'text/html';
          break;

        case 'txt':
        default:
          content = formatText(report, meta);
          extension = 'txt';
          break;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error saving report:', err);
      alert('Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="save-section">
      <div className="export-button-group">
        <button 
          className="export-btn" 
          onClick={() => downloadReport('json')} 
          disabled={saving}
          title="Download as JSON"
        >
          📄
        </button>
        <button 
          className="export-btn" 
          onClick={() => downloadReport('html')} 
          disabled={saving}
          title="Print or Save as PDF"
        >
          🖨️
        </button>
        <button 
          className="export-btn" 
          onClick={() => downloadReport('txt')} 
          disabled={saving}
          title="Download as Text"
        >
          📋
        </button>
      </div>
    </div>
  );
}

function formatMarkdown(report, meta) {
  const { grade, gradeLabel, analysis, suggestions, metadata } = report;
  const { comicName, issueNumber } = meta;

  return `# Comic Book Grading Report

# ${comicName} #${issueNumber}

## Grade

**${grade}** - ${gradeLabel}

## Analysis

### Defects
${analysis.defects}

### Page Quality
${analysis.pageQuality}

### Restoration
${analysis.restoration}

## Suggestions

### Repair/Improvement
${suggestions.repair}

### Prevention
${suggestions.prevention}

## Metadata

- Provider: ${report.provider}
- Timestamp: ${new Date(report.timestamp).toLocaleString()}
- Grade was capped: ${metadata.gradeWasCapped}
${metadata.gradeWasCapped ? `- Original grade: ${metadata.originalGrade}\n- Page quality cap: ${metadata.pageQualityCap}` : ''}

${metadata.warnings.length > 0 ? `\n## Warnings\n${metadata.warnings.map((w) => `- ${w}`).join('\n')}` : ''}
`;
}

function formatHTML(report, meta) {
  const { grade, gradeLabel, analysis, suggestions, metadata } = report;
  const { comicName, issueNumber, imageBase64 } = meta;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Comic Grading Report - ${comicName} #${issueNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; }
    .header-info { text-align: center; margin-bottom: 30px; }
    .cover-img { max-width: 300px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); margin: 20px 0; border-radius: 4px; }
    .grade-box { background: #667eea; color: white; padding: 25px; border-radius: 8px; text-align: center; font-size: 32px; margin: 20px 0; font-weight: bold; }
    .section { margin: 20px 0; padding: 20px; border-left: 5px solid #667eea; background: #f8f9fa; border-radius: 0 4px 4px 0; }
    .sub-section { margin-bottom: 15px; }
    h3 { color: #555; margin-bottom: 5px; }
    .meta { font-size: 0.9em; color: #7f8c8d; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div className="header-info">
      <h1>${comicName} #${issueNumber}</h1>
      ${imageBase64 ? `<img src="${imageBase64}" class="cover-img" alt="Cover Image">` : ''}
      <div class="grade-box">${grade} - ${gradeLabel}</div>
    </div>
    
    <h2>Grading Analysis</h2>
    <div class="section">
      <div class="sub-section">
        <h3>Defects</h3>
        <p>${analysis.defects}</p>
      </div>
      
      <div class="sub-section">
        <h3>Page Quality</h3>
        <p>${analysis.pageQuality}</p>
      </div>
      
      <div class="sub-section">
        <h3>Restoration</h3>
        <p>${analysis.restoration}</p>
      </div>
    </div>

    <h2>Suggestions</h2>
    <div class="section">
      <div class="sub-section">
        <h3>Repair/Improvement</h3>
        <p>${suggestions.repair}</p>
      </div>
      
      <div class="sub-section">
        <h3>Prevention</h3>
        <p>${suggestions.prevention}</p>
      </div>
    </div>

    <div class="meta">
      <p><strong>Provider:</strong> ${report.provider}</p>
      <p><strong>Date:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
      ${metadata.gradeWasCapped ? `<p style="color: #e74c3c"><strong>Note:</strong> Grade was capped due to page quality (Original: ${metadata.originalGrade}, Cap: ${metadata.pageQualityCap})</p>` : ''}
    </div>
  </div>
</body>
</html>`;
}

function formatText(report, meta) {
  const { grade, gradeLabel, analysis, suggestions, metadata } = report;
  const { comicName, issueNumber } = meta;

  return `COMIC BOOK GRADING REPORT
${'='.repeat(50)}
TITLE: ${comicName}
ISSUE: #${issueNumber}
${'='.repeat(50)}

GRADE: ${grade} - ${gradeLabel}

GRADING ANALYSIS
${'-'.repeat(50)}

Defects:
${analysis.defects}

Page Quality:
${analysis.pageQuality}

Restoration:
${analysis.restoration}

SUGGESTIONS
${'-'.repeat(50)}

Repair/Improvement:
${suggestions.repair}

Prevention:
${suggestions.prevention}

METADATA
${'-'.repeat(50)}

Provider: ${report.provider}
Timestamp: ${new Date(report.timestamp).toLocaleString()}
Grade was capped: ${metadata.gradeWasCapped}
${metadata.gradeWasCapped ? `Original grade: ${metadata.originalGrade}\nPage quality cap: ${metadata.pageQualityCap}` : ''}

${metadata.warnings.length > 0 ? `\nWARNINGS:\n${metadata.warnings.map((w) => `- ${w}`).join('\n')}` : ''}
`;
}
