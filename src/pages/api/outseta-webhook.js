import { handleOutsetaWebhook } from '../../services/outsetaWebhook';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await handleOutsetaWebhook(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
}