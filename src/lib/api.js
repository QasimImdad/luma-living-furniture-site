export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
).replace(/\/+$/, '');
const API_ORIGIN = new URL(API_BASE_URL).origin;

const pendingGetRequests = new Map();

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  const requestOptions = { ...options, headers };
  const method = (requestOptions.method || 'GET').toUpperCase();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (requestOptions.body !== undefined && requestOptions.body !== null) {
    headers.set('Content-Type', 'application/json');
    if (typeof requestOptions.body !== 'string') {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }
  }

  const url = `${API_BASE_URL}/api/v1${path}`;
  const requestKey = `${token || ''}:${url}`;
  if (method === 'GET' && pendingGetRequests.has(requestKey)) {
    return pendingGetRequests.get(requestKey);
  }

  const performRequest = async () => {
    let response;
    try {
      response = await fetch(url, requestOptions);
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new Error(
        `Unable to connect to the API at ${API_BASE_URL}. Check that the backend is running.`,
        { cause: error },
      );
    }

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error('The API returned an unreadable response.');
    }

    if (!response.ok || result?.status === false) {
      const error = new Error(result?.message || `The API request failed (${response.status}).`);
      error.status = response.status;
      throw error;
    }

    return result;
  };

  if (method !== 'GET') {
    return performRequest();
  }

  const pendingRequest = performRequest();
  pendingGetRequests.set(requestKey, pendingRequest);
  try {
    return await pendingRequest;
  } finally {
    if (pendingGetRequests.get(requestKey) === pendingRequest) {
      pendingGetRequests.delete(requestKey);
    }
  }
}

export function getProductImageUrl(imagePath, variant) {
  if (!imagePath || typeof imagePath !== 'string') return '';

  let url;
  try {
    url = new URL(imagePath);
  } catch {
    url = new URL(imagePath.replace(/^\/+/, ''), `${API_BASE_URL}/`);
  }

  if (variant && url.origin === API_ORIGIN && url.pathname.startsWith('/uploads/')) {
    url.searchParams.set('variant', variant);
  }

  return url.toString();
}

export const formatUsd = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount) || 0);
