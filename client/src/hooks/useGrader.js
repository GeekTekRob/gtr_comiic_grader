import { useState } from 'react';

export function useGrader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [progress, setProgress] = useState('');

  const submitGradingRequest = async (formData) => {
    setLoading(true);
    setError(null);
    setProgress('Sending images to AI...');

    try {
      const { gradeComic } = await import('../api.js');
      const response = await gradeComic(formData);

      if (response.success) {
        setReport(response.data);
        setProgress('Grading complete!');
      } else {
        setError(response.error || 'Grading failed');
        setProgress('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    report,
    progress,
    submitGradingRequest,
    clearReport: () => setReport(null),
    clearError: () => setError(null),
  };
}
