// Handles webhook communication
export async function sendWebhook(url, endpoint) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error('Failed to process URL');
    }

    const data = await response.text();
    return typeof data === 'string' ? data : JSON.parse(data).content;
  } catch (error) {
    console.error('Webhook error:', error);
    throw new Error('Failed to process content. Please try again.');
  }
}