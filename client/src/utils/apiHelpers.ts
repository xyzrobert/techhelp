// API configuration
export const apiUrl = ''; // Empty string for same-origin requests in development

/**
 * API helper functions with proper error handling
 */

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Important for cookies
    });
    
    // Check if response is OK
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      
      // Handle different response types
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 100) + '...');
        throw new Error(`API returned ${response.status}: Not a valid JSON response`);
      }
    }
    
    // Parse JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Expected JSON but got:', text.substring(0, 100) + '...');
      throw new Error('API response is not JSON');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('JSON Parse Error:', error);
      throw new Error('Failed to parse JSON response');
    }
    throw error;
  }
}

export async function postJson<T>(url: string, data: any): Promise<T> {
  return fetchJson<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
