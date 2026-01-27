import axios from 'axios';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5 minute timeout for AI processing
});

/**
 * Check API health
 */
export async function checkHealth() {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}

/**
 * Submit comic for grading
 */
export async function gradeComic(formData) {
  try {
    const response = await apiClient.post('/grade', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Grading request failed:', error);
    throw error;
  }
}

/**
 * Submit comic for multi-provider grading
 */
export async function gradComicBatch(formData) {
  try {
    const response = await apiClient.post('/grade/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Batch grading request failed:', error);
    throw error;
  }
}
