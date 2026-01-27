import React from 'react';

export function GradeReport({ report }) {
  if (!report || !report.success) {
    return (
      <div className="report error">
        <h2>Grading Error</h2>
        <p>{report?.error || 'Unknown error occurred'}</p>
      </div>
    );
  }

  const { grade, gradeLabel, analysis, suggestions, metadata } = report;

  return (
    <div className="report success">
      <div className="grade-header">
        <div className="grade-display">
          <div className="grade-number">{grade}</div>
          <div className="grade-label">{gradeLabel}</div>
        </div>
        <div className="provider-badge">{report.provider}</div>
      </div>

      <div className="analysis-section">
        <h3>Grading Analysis</h3>

        <div className="analysis-item">
          <h4>Defects</h4>
          <p>{analysis.defects}</p>
        </div>

        <div className="analysis-item">
          <h4>Page Quality</h4>
          <p>{analysis.pageQuality}</p>
        </div>

        <div className="analysis-item">
          <h4>Restoration</h4>
          <p>{analysis.restoration}</p>
        </div>
      </div>

      <div className="suggestions-section">
        <h3>Suggestions</h3>

        <div className="suggestion-item">
          <h4>Repair / Improvement</h4>
          <p>{suggestions.repair}</p>
        </div>

        <div className="suggestion-item">
          <h4>Prevention</h4>
          <p>{suggestions.prevention}</p>
        </div>
      </div>

      {metadata.warnings && metadata.warnings.length > 0 && (
        <div className="warnings-section">
          <h4>⚠️ Warnings</h4>
          <ul>
            {metadata.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {metadata.gradeWasCapped && (
        <div className="grade-cap-info">
          <strong>Grade Adjustment:</strong> Original grade {metadata.originalGrade} was capped to{' '}
          {grade} based on page quality designation (cap: {metadata.pageQualityCap})
        </div>
      )}

      <div className="report-footer">
        <small>Provided by: {report.provider} | {new Date(report.timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
}
