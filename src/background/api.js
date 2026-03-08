import { DEFAULTS } from '../shared/constants.js';

export async function generateComments(apiKey, prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULTS.MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key. Check your key in Sift settings.');
    if (res.status === 429) throw new Error('Rate limited. Wait a moment and try again.');
    throw new Error(`API error (${res.status}). Try again.`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  // Extract JSON array from the response text
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Failed to parse comment suggestions. Try again.');

  const comments = JSON.parse(match[0]);
  if (!Array.isArray(comments) || comments.length === 0) {
    throw new Error('No comments generated. Try again.');
  }

  return comments;
}
