import { DEFAULTS } from '../shared/constants.js';

export function buildPrompt(profile, postData) {
  const name = profile?.name || 'User';
  const role = profile?.role || '';
  const tone = profile?.tone || DEFAULTS.TONE;
  const exampleComments = profile?.exampleComments || '';

  const examples = exampleComments
    .split('\n')
    .map((c) => c.trim())
    .filter(Boolean);

  let examplesBlock = '';
  if (examples.length > 0) {
    examplesBlock = `
Here are examples of how this user actually writes comments on LinkedIn:
${examples.map((c, i) => `${i + 1}. "${c}"`).join('\n')}

Match this voice, vocabulary, and sentence structure.`;
  }

  return `You are a LinkedIn comment assistant. Generate comment options for the following post.

User Profile:
- Name: ${name}
- Role: ${role}
- Tone: ${tone}
${examplesBlock}

Post being commented on:
- Author: ${postData.authorName}
- Author headline: ${postData.authorHeadline}
- Content: ${postData.content}

Rules:
- Each comment must be under ${DEFAULTS.MAX_COMMENT_WORDS} words
- Each comment must reference something specific from the post
- Each comment must add value (a take, question, or experience)
- Never use "Great post", "Love this", "Thanks for sharing", "So true", or similar generic phrases
- Never use hashtags
- Never use em dashes
- Match the user's tone: ${tone}
- Sound like a real person, not an AI

Generate exactly 3 comments, one for each style:
1. ADD A TAKE: Share a perspective that builds on or challenges the post
2. ASK A QUESTION: Ask something specific that invites a response
3. SHARE AN EXPERIENCE: Relate it to a personal experience

Format as JSON:
[
  {"style": "take", "comment": "..."},
  {"style": "question", "comment": "..."},
  {"style": "experience", "comment": "..."}
]`;
}
