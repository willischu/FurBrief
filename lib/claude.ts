import { Anthropic } from '@anthropic-ai/sdk';
import type { TextCitation } from '@anthropic-ai/sdk/resources/messages/messages';
import { PapersContent } from './extract';

const MOCK_BRIEFS: Record<string, object> = {
  en: {
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
    follow_up: { when: 'Day 14', notes: 'Recheck to inspect healing and confirm stitches have dissolved properly' },
  },
  es: {
    day_schedule: [
      { period: 'Hoy', instructions: ['Mantén a tu mascota tranquila y descansada', 'Dale la mitad de su comida habitual esta noche', 'El collar isabelino puesto en todo momento — incluso al dormir'] },
      { period: 'Días 1–3', instructions: ['Solo paseos con correa para ir al baño', 'Revisa la incisión dos veces al día', 'Da el medicamento para el dolor con comida'] },
      { period: 'Días 4–7', instructions: ['Puede parecer completamente bien — sigue restringiendo la actividad', 'Sin correr, saltar ni subir escaleras'] },
      { period: 'Días 8–14', instructions: ['Aumenta gradualmente la duración de los paseos', 'Regresa al veterinario el día 14 para revisión'] },
    ],
    medications: [
      { name: 'pastilla para el dolor', clinical_name: 'Carprofen 25mg', dose: 'una pastilla', frequency: 'dos veces al día', with_food: true, duration: '5 días', notes: 'Nunca dar con el estómago vacío' },
      { name: 'antibiótico', clinical_name: 'Amoxicillin 250mg', dose: 'una cápsula', frequency: 'dos veces al día', with_food: false, duration: '7 días', notes: 'Termina el tratamiento completo aunque tu mascota parezca mejor' },
    ],
    warning_signs: [
      { sign: 'La herida se abre o los puntos se separan', urgency: 'call_now' },
      { sign: 'Secreción amarilla, verde o con mal olor', urgency: 'call_now' },
      { sign: 'Inflamación que empeora después del día 3', urgency: 'call_now' },
      { sign: 'Sin comer después de 24 horas', urgency: 'watch_closely' },
      { sign: 'Letargo que dura más de 48 horas', urgency: 'watch_closely' },
    ],
    normal_things: [
      'Aturdida y somnolienta las primeras 12–24 horas — es la anestesia pasando',
      'Un poco de enrojecimiento justo alrededor de los bordes de la incisión',
      'Bolsa de líquido suave cerca de la herida — generalmente inofensiva y desaparece sola',
      'No querer comer la primera noche — completamente normal',
    ],
    follow_up: { when: 'Día 14', notes: 'Revisión para inspeccionar la cicatrización y confirmar que los puntos se han disuelto' },
  },
  ko: {
    day_schedule: [
      { period: '오늘', instructions: ['반려동물을 조용하고 편안하게 쉬게 해주세요', '오늘 저녁은 평소 식사량의 절반만 주세요', 'E-칼라는 잘 때도 항상 착용 상태를 유지하세요'] },
      { period: '1–3일', instructions: ['화장실 용도로만 목줄을 하고 산책하세요', '하루 두 번 절개 부위의 발적이나 부종을 확인하세요', '진통제는 음식과 함께 주세요'] },
      { period: '4–7일', instructions: ['완전히 나은 것처럼 보여도 활동을 제한하세요', '달리기, 점프, 계단은 금지입니다'] },
      { period: '8–14일', instructions: ['산책 시간을 서서히 늘려가세요', '14일째 되는 날 재진을 위해 동물병원에 방문하세요'] },
    ],
    medications: [
      { name: '진통제', clinical_name: 'Carprofen 25mg', dose: '1정', frequency: '하루 2회', with_food: true, duration: '5일', notes: '빈속에 절대 투여하지 마세요' },
      { name: '항생제', clinical_name: 'Amoxicillin 250mg', dose: '1캡슐', frequency: '하루 2회', with_food: false, duration: '7일', notes: '반려동물이 나아 보여도 전체 복용 과정을 마치세요' },
    ],
    warning_signs: [
      { sign: '상처가 벌어지거나 봉합사가 분리됨', urgency: 'call_now' },
      { sign: '노란색, 초록색 또는 나쁜 냄새가 나는 분비물', urgency: 'call_now' },
      { sign: '3일 이후에도 부종이 악화됨', urgency: 'call_now' },
      { sign: '24시간 후에도 식욕 없음', urgency: 'watch_closely' },
      { sign: '48시간 이상 지속되는 무기력증', urgency: 'watch_closely' },
    ],
    normal_things: [
      '처음 12–24시간 동안 멍하고 졸린 것은 마취제가 빠져나가는 과정입니다',
      '절개 부위 주변의 약간의 발적은 정상입니다',
      '상처 근처에 생기는 부드러운 액체 주머니는 대개 무해하며 자연스럽게 사라집니다',
      '첫날 밤에 먹으려 하지 않는 것은 완전히 정상입니다',
    ],
    follow_up: { when: '14일째', notes: '봉합 부위 회복 상태 확인 및 봉합사 용해 여부 점검을 위한 재진' },
  },
  zh: {
    day_schedule: [
      { period: '今天', instructions: ['让您的宠物保持安静和休息', '今晚只喂平时一半的食物', 'E型项圈随时佩戴——包括睡觉时'] },
      { period: '第1–3天', instructions: ['只用牵引绳带出去上厕所', '每天两次检查切口是否有红肿', '随餐服用止痛药'] },
      { period: '第4–7天', instructions: ['看起来完全正常——仍需限制活动', '禁止跑跳和爬楼梯'] },
      { period: '第8–14天', instructions: ['逐渐增加散步时间', '第14天返回兽医复诊'] },
    ],
    medications: [
      { name: '止痛片', clinical_name: 'Carprofen 25mg', dose: '一片', frequency: '每天两次', with_food: true, duration: '5天', notes: '绝不能空腹服用' },
      { name: '抗生素', clinical_name: 'Amoxicillin 250mg', dose: '一粒胶囊', frequency: '每天两次', with_food: false, duration: '7天', notes: '即使宠物看起来已经好了，也要完成整个疗程' },
    ],
    warning_signs: [
      { sign: '伤口裂开或缝线脱落', urgency: 'call_now' },
      { sign: '黄色、绿色或有异味的分泌物', urgency: 'call_now' },
      { sign: '第3天后肿胀加剧', urgency: 'call_now' },
      { sign: '24小时后仍不进食', urgency: 'watch_closely' },
      { sign: '嗜睡超过48小时', urgency: 'watch_closely' },
    ],
    normal_things: [
      '前12–24小时昏昏欲睡——这是麻醉药代谢的正常过程',
      '切口边缘轻微发红是正常的',
      '伤口附近出现柔软的积液囊——通常无害，会自行消退',
      '第一晚不想吃东西——完全正常',
    ],
    follow_up: { when: '第14天', notes: '复诊检查愈合情况，确认缝线已正常溶解' },
  },
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
    return MOCK_BRIEFS[language] ?? MOCK_BRIEFS['en'];
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
    model: 'claude-sonnet-4-6',
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessageContent }],
    temperature: 0.18,
    max_tokens: 4096,
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
