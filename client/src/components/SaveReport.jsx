import React from 'react';

export function SaveReport({ report }) {
  if (!report || !report.success) {
    return null;
  }

  const downloadReport = (format) => {
    let content = '';
    let filename = 'comic-grading-report';
    let mimeType = 'text/plain';

    switch (format) {
      case 'json':
        content = JSON.stringify(report, null, 2);
        filename += '.json';
        mimeType = 'application/json';
        break;

      case 'markdown':
        content = formatMarkdown(report);
        filename += '.md';
        mimeType = 'text/markdown';
        break;

      case 'html':
        content = formatHTML(report);
        filename += '.html';
        mimeType = 'text/html';
        break;

      case 'txt':
      default:
        content = formatText(report);
        filename += '.txt';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="save-section">
      <h3>Export Report</h3>
      <div className="button-group">
        <button className="btn btn-secondary" onClick={() => downloadReport('json')}>
          📄 Download as JSON
        </button>
        <button className="btn btn-secondary" onClick={() => downloadReport('markdown')}>
          📝 Download as Markdown
        </button>
        <button className="btn btn-secondary" onClick={() => downloadReport('html')}>
          🌐 Download as HTML
        </button>
        <button className="btn btn-secondary" onClick={() => downloadReport('txt')}>
          📋 Download as Text
        </button>
      </div>
    </div>
  );
}

function formatMarkdown(report) {
  const { grade, gradeLabel, analysis, suggestions, metadata } = report;

  return `# Comic Book Grading Report

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

function formatHTML(report) {
  const { grade, gradeLabel, analysis, suggestions, metadata } = report;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Comic Grading Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { color: #2c3e50; }
    .grade-box { background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; margin: 20px 0; }
    .section { margin: 20px 0; padding: 15px; border-left: 4px solid #3498db; background: #ecf0f1; }
    h2 { color: #34495e; }
    h3 { color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Comic Book Grading Report</h1>
    <div class="grade-box">${grade} - ${gradeLabel}</div>
    
    <h2>Grading Analysis</h2>
    <div class="section">
      <h3>Defects</h3>
      <p>${analysis.defects}</p>
      
      <h3>Page Quality</h3>
      <p>${analysis.pageQuality}</p>
      
      <h3>Restoration</h3>
      <p>${analysis.restoration}</p>
    </div>

    <h2>Suggestions</h2>
    <div class="section">
      <h3>Repair/Improvement</h3>
      <p>${suggestions.repair}</p>
      
      <h3>Prevention</h3>
      <p>${suggestions.prevention}</p>
    </div>

    <p><small>Provider: ${report.provider} | ${new Date(report.timestamp).toLocaleString()}</small></p>
  </div>
</body>
</html>`;
}

function formatText(report) {
  const { grade, gradeLabel, analysis, suggestions, metadata } = report;

  return `COMIC BOOK GRADING REPORT
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
