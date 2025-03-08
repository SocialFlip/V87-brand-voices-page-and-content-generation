import { HOOK_ENDPOINTS } from '../utils/webhookConfig';

export async function generateHook(content, hookType) {
  try {
    const endpoint = HOOK_ENDPOINTS[hookType];
    if (!endpoint) {
      throw new Error(`Unsupported hook type: ${hookType}`);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error('Failed to generate hook');
    }

    const data = await response.text();
    return typeof data === 'string' ? data : JSON.parse(data).content;
  } catch (error) {
    console.error('Hook generation error:', error);
    throw new Error('Failed to generate hook. Please try again.');
  }
}