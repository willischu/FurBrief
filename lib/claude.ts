import { Anthropic } from '@anthropic-ai/sdk';
import type { TextCitation } from '@anthropic-ai/sdk/resources/messages/messages';
import { PapersContent } from './extract';

const MOCK_BRIEF = {
  day_schedule: [
    { period: 'Today', instructions: ['Keep your pet calm and rested', 'Feed half their normal meal tonight', 'E-collar on at all times — even when sleeping'] },
    { period: 'Days 1–3', instructions: ['Leash walks only for bathroom breaks', 'Check incision twice daily for redness or swelling', 'Give pain medication with food'] },
    { period: 'Days 4–7', instructions: ['May seem totally fine — still restrict activity', 'No running, jumping, or stairs'] },
    { period: 'Days 8–14', instructions: ['Gradually increase walk length', 'Return to vet on Day 14 for recheck'] },
  ],
  medications: [
    { name: 'pain relief tablet', clinical_name: 'Carprofen 25mg', dose: 'one tablet', frequency: 'twice a day', with_food: true, duration: '5 days', notes: 'Never give on an empty stomach' },
    { name: 'antibiotic', clinical_name: 'Amoxicillin 250mg', dose: 'one capsule', frequency: 'twice a day', with_food: false, duration: '7 days', notes: 'Finish the full course even if your pet seems better' },
  ],
  warning_signs: [
    { sign: 'Wound opening or stitches separating', urgency: 'call_now' },
    { sign: 'Discharge that is yellow, green, or has a bad smell', urgency: 'call_now' },
    { sign: 'Swelling that gets worse after day 3', urgency: 'call_now' },
    { sign: 'Not eating after 24 hours', urgency: 'watch_closely' },
    { sign: 'Lethargy lasting more than 48 hours', urgency: 'watch_closely' },
  ],
  normal_things: [
    'Groggy and sleepy for the first 12–24 hours — this is the anaesthesia wearing off',
    'Small amount of redness right around the incision edges',
    'Soft fluid pocket forming near the wound — usually harmless and resolves on its own',
    'Not wanting to eat the first night — totally normal',
  ],
  follow_up: { when: 'Day 14', notes: 'Recheck to inspect healing and confirm stitches have dissolved properly' }
};

let client: Anthropic | null = null;

function getClaudeClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Missing ANTHROPIC_API_KEY');
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

const SYSTEM = `You are Furbrief, a veterinary discharge paper translator.
Your job is to take clinical vet discharge papers and translate them into warm,
plain-language care guides for pet owners who are stressed and at home at night
with a recovering animal. Always respond with valid JSON only — no markdown, no preamble, no trailing text.`;

type AnthropicTextBlock = {
  type: 'text';
  text: string;
};

type AnthropicImageBlock = {
  type: 'image';
  source: {
    type: 'base64';
    media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    data: string;
  };
};

type AnthropicTextResponseBlock = {
  type: 'text';
  text: string;
  citations: Array<TextCitation> | null;
};

type AnthropicMessageContent = string | Array<AnthropicTextBlock | AnthropicImageBlock>;

const buildUserPrompt = (
  papersText: string,
  petName: string,
  species: string,
  surgeryType: string,
  language: string
) => {
  const langInstructions: Record<string, string> = {
    en: '',
    es: '\n\nIMPORTANT: Write the ENTIRE furbrief in Spanish (Español). Use warm, accessible Spanish throughout. Use "tu" form.',
    ko: '\n\nIMPORTANT: Write the ENTIRE furbrief in Korean (한국어). Use warm, polite Korean (해요체) throughout. Keep clinical terms in original but translate all explanations.',
    zh: '\n\nIMPORTANT: Write the ENTIRE furbrief in Simplified Chinese (简体中文). Use warm, accessible Mandarin throughout. Keep clinical terms in original but translate all explanations.',
  };

  return `Here are the vet discharge papers for ${petName}, a ${species}${
    surgeryType ? ` who had ${surgeryType}` : ' who had surgery'
  }:

${papersText}

Translate these into a furbrief using this exact JSON structure:
{
  "day_schedule": [
    { "period": "Today", "instructions": ["...", "..."] },
    { "period": "Days 1–3", "instructions": ["...", "..."] },
    { "period": "Days 4–7", "instructions": ["...", "..."] },
    { "period": "Days 8–14", "instructions": ["...", "..."] }
  ],
  "medications": [
    {
      "name": "plain language name",
      "clinical_name": "exact clinical name from papers",
      "dose": "plain e.g. one tablet",
      "frequency": "plain e.g. twice a day with a meal",
      "with_food": true,
      "duration": "e.g. 5 days",
      "notes": "any caveats"
    }
  ],
  "warning_signs": [
    {
      "sign": "plain language description",
      "urgency": "call_now" | "watch_closely" | "mention_at_checkup"
    }
  ],
  "normal_things": ["plain description of something expected but scary-looking"],
  "follow_up": {
    "when": "e.g. Day 14",
    "notes": "what the recheck is for"
  }
}

Rules:
- Write for a stressed non-medical person reading at 9pm
- Translate EVERY clinical term into plain language
- Be specific and actionable — no vague advice like "monitor carefully"
- Warm but not cutesy — this is serious care information
- Always keep clinical_name in its original language regardless of output language
- If papers are unclear or unreadable, note it explicitly rather than guessing
- Always include at least 3 warning_signs and 3 normal_things${langInstructions[language]}`;
};

export async function generateFurbrief(
  content: PapersContent,
  petName: string,
  species: string,
  surgeryType: string,
  language: string
) {
  if (process.env.MOCK_CLAUDE === 'true') {
    console.log('🐱 MOCK MODE — skipping Claude API');
    await new Promise(r => setTimeout(r, 3000));
    return MOCK_BRIEF;
  }

  const text =
    content.type === 'text'
      ? content.text
      : `Veterinary discharge papers image attached. Please review the text carefully.`;

  const prompt = buildUserPrompt(text, petName, species, surgeryType, language);

  const userMessageContent: AnthropicMessageContent =
    content.type === 'text'
      ? prompt
      : [
          { type: 'text', text: prompt },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: content.source.media_type as AnthropicImageBlock['source']['media_type'],
              data: content.source.data,
            },
          },
        ];

  const response = await getClaudeClient().messages.create({
    model: 'claude-sonnet-4-5',
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessageContent }],
    temperature: 0.18,
    max_tokens: 1400,
  });

  const outputText = response.content
    .filter((block): block is AnthropicTextResponseBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  let parsed;
  try {
    parsed = JSON.parse(outputText.trim());
  } catch (error) {
    throw new Error(`Claude output was not valid JSON: ${outputText}`);
  }

  return parsed;
}
