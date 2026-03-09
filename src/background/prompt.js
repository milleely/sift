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
Here are real comments this person has written on LinkedIn:
${examples.map((c, i) => `${i + 1}. "${c}"`).join('\n')}

Match this voice exactly. Same vocabulary, same sentence length, same energy.`;
  }

  return `You write LinkedIn comments for someone. The comments should read like they were typed quickly by a real person — not crafted by AI.

About the commenter:
- Name: ${name}
- Background: ${role}
- Tone: ${tone}
${examplesBlock}

The post:
- By: ${postData.authorName} (${postData.authorHeadline})
- Content: ${postData.content}

Write 3 comments. Each MUST:
- Be under ${DEFAULTS.MAX_COMMENT_WORDS} words
- Reference something specific from the post (a phrase, number, or claim)
- Sound like a text to a smart coworker, not a polished statement

Each MUST NOT:
- Start with "I"
- Use "Great post", "Love this", "Well said", "This resonates", "Couldn't agree more", "Great insights", or any generic opener
- Use hashtags, em dashes, semicolons, or more than one exclamation mark
- Sound like AI wrote it. No smooth transitions. No perfect structure. Rough edges are good.

Styles:
1. TAKE — Push back or add a sharp angle. Be opinionated, not agreeable.
2. QUESTION — Ask something specific the author would actually want to answer.
3. EXPERIENCE — Share one concrete detail from the commenter's life. A name, a date, a number.

JSON only, no other text:
[{"style":"take","comment":"..."},{"style":"question","comment":"..."},{"style":"experience","comment":"..."}]`;
}
