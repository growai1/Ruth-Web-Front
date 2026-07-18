export const BASE_URL = import.meta.env.VITE_API_URL || '/api/ruth';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}`);
    error.status = res.status;
    try {
      error.data = await res.json();
    } catch {
      error.data = null;
    }
    throw error;
  }
  return res;
}

export async function createSession(topic) {
  const res = await request(`${BASE_URL}/session/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });
  return res.json();
}

export async function uploadFile(slug, file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request(`${BASE_URL}/session/${slug}/upload-file`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function startGeneration(slug) {
  const res = await request(`${BASE_URL}/session/${slug}/start`, {
    method: 'POST',
  });
  return res.json();
}

export async function getProgress(slug) {
  const res = await request(`${BASE_URL}/session/${slug}/progress`);
  return res.json();
}

export function getVideoUrl(slug) {
  return `${BASE_URL}/session/${slug}/video`;
}

export function pollProgress(slug, onProgress, intervalMs = 2000) {
  let stopped = false;

  const poll = async () => {
    while (!stopped) {
      try {
        const data = await getProgress(slug);
        onProgress(data);
        if (data.status === 'done' || data.status === 'failed' || data.status === 'needs_human_review') {
          return data;
        }
      } catch (err) {
        onProgress({ status: 'failed', error: err.message });
        return { status: 'failed' };
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  };

  const promise = poll();

  return {
    promise,
    stop() {
      stopped = true;
    },
  };
}
