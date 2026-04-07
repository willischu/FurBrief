'use client';

import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';

const languages = ['en', 'es', 'ko', 'zh'] as const;
const langLabels: Record<typeof languages[number], string> = {
  en: 'English',
  es: 'Español',
  ko: '한국어',
  zh: '中文',
};

const translations = {
  en: {
    nav_cta: 'get my furbrief',
    eyebrow: 'the briefing your vet forgot to give you',
    h1a: 'everything',
    h1b: 'your vet said.',
    h1em: 'translated.',
    sub: 'upload your discharge papers and get a plain-english care plan in 60 seconds. day by day. no jargon. no panic.',
    def: 'fur·brief — your vet\'s discharge papers, translated into language you can actually use at midnight.',
    upload_t: 'drop your discharge papers here',
    upload_h: 'PDF, photo, or screenshot · any clinic · any format',
    blang_lbl: 'furbrief language:',
    cta: 'get my furbrief',
    price: '$6 one-time',
    t1: 'no subscription',
    t2: 'ready in 60 sec',
    t3: 'papers never stored',
    t4: 'refund if it doesn\'t help',
    dec_t: 'your furbrief decodes things like this…',
    dec_live: 'LIVE',
    dec_sub: 'from your papers → into plain english',
    d1: 'watch for the <strong>wound opening back up</strong> — gaps in stitches or skin separating. call vet immediately.',
    d2: 'give <strong>one pain tablet twice a day, always with a meal.</strong> never on an empty stomach.',
    d3: 'stitches are <strong>under the skin</strong> — they <strong>dissolve on their own.</strong> no removal needed.',
    d4: 'a <strong>soft squishy fluid pocket</strong> may form near the wound. usually harmless.',
    d5: '<strong>no running, jumping, or stairs.</strong> leash walks only — even when they look fine.',
    pf1n: '60s',
    pf1l: 'average turnaround',
    pf2n: 'any vet',
    pf2l: 'no clinic login',
    pf3l: 'one-time only',
    pf4n: '100%',
    pf4l: 'refund guarantee',
    p1n: '60s',
    p1l: 'turnaround',
    p2n: 'any vet',
    p2l: 'no login',
    p3l: 'one-time',
    prob_ey: 'the problem',
    prob_h1: 'vets are brilliant.',
    prob_h2: 'their paperwork is not written for you.',
    prob_p1: 'you just got home. your pet is groggy. you have three pages of clinical shorthand and no idea what half of it means. the clinic is closed.',
    prob_p2: 'you\'re not a vet. you shouldn\'t need to be. your vet told you everything — they just wrote it in a language you can\'t use at 9pm when you\'re exhausted.',
    prob_p3: 'a furbrief is that same document, translated into plain english. ready in 60 seconds.',
    paper_lbl: 'what actual discharge papers look like',
    how_ey: 'how it works',
    how_h: 'three steps. one furbrief.',
    s1t: 'upload your papers',
    s1d: 'photo, PDF, or screenshot — any format from any clinic. blurry midnight photos totally fine.',
    s2t: 'tell us about your pet',
    s2d: 'name, species, surgery type. 30 seconds. makes your furbrief feel personal, not generic.',
    s3t: 'get your furbrief',
    s3d: 'plain english, day by day. meds decoded. warning signs clear. save, print, or share it.',
    st_photo: 'photo',
    st_ss: 'screenshot',
    st_hw: 'handwritten',
    st_dog: 'dogs',
    st_cat: 'cats',
    st_dental: 'dental',
    st_sched: 'daily schedule',
    st_meds: 'meds guide',
    st_warn: 'warnings',
    wyg_ey: "what's in your furbrief",
    wyg_h: 'four things. all of them useful.',
    w1n: 'day-by-day schedule',
    w1d: 'not generic — pulled from your actual papers. know what to expect today, days 1–3, 4–7, and when you can finally breathe.',
    d_today: 'today',
    d_today_t: 'may be groggy for hours. half meal. e-collar on always.',
    d_1_3: 'days 1–3',
    d_1_3_t: 'leash walks only. check incision twice. carprofen with food.',
    d_4_7: 'days 4–7',
    d_4_7_t: 'may seem fine — don\'t be fooled. still no running or jumping.',
    d_8_14: 'days 8–14',
    d_8_14_t: 'gradually increase walks. vet recheck on day 14.',
    w2n: 'medication guide',
    w2d: 'every medication decoded — what it\'s for, how to give it, and what "BID with food" means when you\'re in the kitchen at midnight.',
    w3n: 'warning signs',
    w3d: '"call your vet if you see this" — specific to your surgery. only the flags that actually apply to your situation.',
    w4n: "don't panic section",
    w4d: 'things that look scary but are completely expected. know what\'s normal so you can actually sleep tonight.',
    samp_ey: 'real example',
    samp_h: 'this is what you get',
    samp_sub: 'Luna had a spay. Here\'s a condensed version of her furbrief — generated from a real discharge sheet.',
    samp_pet: 'Luna · dog · spay',
    samp_med_name: 'pain relief tablet',
    samp_med_clin: 'Carprofen 25mg',
    samp_med_dose: '1 tablet · twice a day · 5 days',
    samp_med_note: 'Always give with food — never on an empty stomach.',
    samp_w1: 'Wound opening or stitches separating',
    samp_w2: 'Yellow or green discharge from incision',
    samp_w3: 'Not eating after 24 hours',
    samp_n1: 'Groggy for 12–24 hours after surgery — this is the anaesthesia wearing off, not a problem.',
    samp_n2: 'Small amount of redness right at the incision edge — normal in the first 48 hours.',
    samp_cta: 'get a furbrief for your pet →',
    obj_ey: 'fair questions',
    obj_h: 'a few things worth knowing',
    oq1: '"is this replacing my vet?"',
    oa1: '<strong>not even slightly.</strong> everything in your furbrief comes from the papers your vet already gave you. we translate — we don\'t add anything.',
    oq2: '"is my pet\'s info safe?"',
    oa2: '<strong>your papers are processed and immediately deleted.</strong> nothing stored. once your furbrief is ready, it\'s gone from our end.',
    oq3: '"what if my papers are blurry?"',
    oa3: '<strong>that\'s exactly what furbrief was built for.</strong> blurry photos, handwritten notes, any clinic\'s pdf. if unreadable we\'ll tell you — not guess.',
    oq4: '"is the $6 refundable?"',
    oa4: '<strong>yes — within 24 hours, no questions.</strong> if it\'s not useful, email us and we\'ll refund immediately.',
    ins_t: 'surgery like this typically costs $2,000–$6,000 without insurance',
    ins_d: 'most pet owners get insurance right after their first emergency. if you\'re thinking about it now — which is exactly the right time — here\'s where we\'d start.',
    ins_btn: 'compare pet insurance →',
    faq_ey: 'FAQ',
    faq_h: 'quick answers',
    fq1: 'what surgeries does this work for?',
    fa1: 'any surgery where your vet gave you discharge papers — spays, neuters, TPLO, dental extractions, tumour removals, emergency procedures.',
    fq2: 'does it work for cats?',
    fa2: 'yes — dogs, cats, and most other pets. just tell us the species when you upload.',
    fq3: 'can i share it with a partner or dog sitter?',
    fa3: 'yes — your furbrief is a clean printable page. save as pdf, screenshot it, or share the link with anyone helping with recovery.',
    fq4: 'my vet\'s papers are already pretty clear — do i need this?',
    fa4: 'probably not! furbrief is for the 90% of discharge papers written in clinical shorthand.',
    fin_h1: 'you\'ve already done',
    fin_h2: 'the hard part.',
    fin_sub: 'your pet is home. your vet did their job. now you just need to know what to do next — in language you can actually use tonight.',
    foot_tag: 'everything your vet said, in plain english.',
    foot_disc: 'furbrief translates vet discharge papers for pet owners. not veterinary advice. not a substitute for professional care. always contact your vet in an emergency.',
  },
  es: {
    nav_cta: 'obtener mi furbrief',
    eyebrow: 'el resumen que tu vet olvidó darte',
    h1a: 'todo',
    h1b: 'lo que dijo tu vet.',
    h1em: 'traducido.',
    sub: 'sube tus papeles de alta y recibe un plan de cuidado en español en 60 segundos. día a día. sin jerga médica.',
    def: 'fur·brief — los papeles de alta de tu vet, traducidos a un lenguaje que puedes usar a medianoche.',
    upload_t: 'arrastra tus papeles aquí',
    upload_h: 'PDF, foto o captura · cualquier clínica · cualquier formato',
    blang_lbl: 'idioma del furbrief:',
    cta: 'obtener mi furbrief',
    price: '$6 pago único',
    t1: 'sin suscripción',
    t2: 'listo en 60 seg',
    t3: 'papeles no almacenados',
    t4: 'reembolso si no ayuda',
    dec_t: 'tu furbrief descifra cosas como esta…',
    dec_live: 'EN VIVO',
    dec_sub: 'de tus papeles → en lenguaje claro',
    d1: 'vigila que la <strong>herida no se abra</strong> — separación en puntos. llama al vet inmediatamente.',
    d2: 'da <strong>una pastilla dos veces al día, siempre con comida.</strong> nunca con el estómago vacío.',
    d3: 'los puntos están <strong>bajo la piel</strong> — se <strong>disuelven solos.</strong> no hace falta quitarlos.',
    d4: 'puede formarse una <strong>bolsa suave de líquido</strong> cerca de la herida. normalmente inofensiva.',
    d5: '<strong>nada de correr, saltar ni escaleras.</strong> solo paseos con correa.',
    pf1n: '60s',
    pf1l: 'tiempo promedio',
    pf2n: 'cualquier vet',
    pf2l: 'sin inicio de sesión',
    pf3l: 'pago único',
    pf4n: '100%',
    pf4l: 'garantía de reembolso',
    p1n: '60s',
    p1l: 'tiempo',
    p2n: 'cualquier vet',
    p2l: 'sin login',
    p3l: 'pago único',
    prob_ey: 'el problema',
    prob_h1: 'los vets son brillantes.',
    prob_h2: 'sus papeles no están escritos para ti.',
    prob_p1: 'acabas de llegar a casa. tu mascota está aturdida. tienes tres páginas de jerga clínica y no entiendes la mitad. la clínica está cerrada.',
    prob_p2: 'no eres vet. no deberías necesitar serlo. tu vet te dijo todo — solo lo escribió en un idioma que no puedes usar a las 9pm agotado/a.',
    prob_p3: 'un furbrief es ese mismo documento, traducido a lenguaje claro. listo en 60 segundos.',
    paper_lbl: 'cómo se ven los papeles de alta reales',
    how_ey: 'cómo funciona',
    how_h: 'tres pasos. un furbrief.',
    s1t: 'sube tus papeles',
    s1d: 'foto, PDF o captura — cualquier formato. fotos borrosas de medianoche también.',
    s2t: 'cuéntanos sobre tu mascota',
    s2d: 'nombre, especie, tipo de cirugía. 30 segundos. hace tu furbrief personal, no genérico.',
    s3t: 'recibe tu furbrief',
    s3d: 'en español, día a día. medicamentos descifrados. señales claras. guárdalo o compártelo.',
    st_photo: 'foto',
    st_ss: 'captura',
    st_hw: 'manuscrito',
    st_dog: 'perros',
    st_cat: 'gatos',
    st_dental: 'dental',
    st_sched: 'plan diario',
    st_meds: 'guía de meds',
    st_warn: 'señales de alerta',
    wyg_ey: 'qué incluye tu furbrief',
    wyg_h: 'cuatro cosas. todas útiles.',
    w1n: 'plan día a día',
    w1d: 'no genérico — extraído de tus papeles. sabe qué esperar hoy, días 1–3, 4–7 y cuándo puedes relajarte.',
    d_today: 'hoy',
    d_today_t: 'puede estar aturdido/a horas. mitad de comida. collar isabelino siempre.',
    d_1_3: 'días 1–3',
    d_1_3_t: 'solo paseos con correa. revisa la incisión dos veces. carprofen con comida.',
    d_4_7: 'días 4–7',
    d_4_7_t: 'puede parecer recuperado/a — no te confíes. aún nada de correr.',
    d_8_14: 'días 8–14',
    d_8_14_t: 'aumenta paseos gradualmente. regresa al vet el día 14.',
    w2n: 'guía de medicamentos',
    w2d: 'cada medicamento descifrado — para qué es, cómo darlo, y qué significa "BID con comida" a medianoche.',
    w3n: 'señales de alerta',
    w3d: '"llama al vet si ves esto" — específico para tu cirugía. solo las señales que aplican.',
    w4n: 'sección no te asustes',
    w4d: 'cosas que parecen aterradoras pero son normales. sabe qué esperar para poder dormir.',
    samp_ey: 'ejemplo real',
    samp_h: 'esto es lo que obtienes',
    samp_sub: 'Luna tuvo una esterilización. Aquí tienes una versión condensada de su furbrief — generada a partir de un papel de alta real.',
    samp_pet: 'Luna · perra · esterilización',
    samp_med_name: 'pastilla para el dolor',
    samp_med_clin: 'Carprofen 25mg',
    samp_med_dose: '1 pastilla · dos veces al día · 5 días',
    samp_med_note: 'Da siempre con comida — nunca con el estómago vacío.',
    samp_w1: 'La herida se abre o los puntos se separan',
    samp_w2: 'Secreción amarilla o verde en la incisión',
    samp_w3: 'Sin comer después de 24 horas',
    samp_n1: 'Aturdida 12–24 horas después de la cirugía — es la anestesia pasando, no un problema.',
    samp_n2: 'Algo de enrojecimiento en el borde de la incisión — normal en las primeras 48 horas.',
    samp_cta: 'obtener un furbrief para tu mascota →',
    obj_ey: 'preguntas frecuentes',
    obj_h: 'algunas cosas que vale la pena saber',
    oq1: '"¿esto reemplaza a mi vet?"',
    oa1: '<strong>para nada.</strong> todo viene de los papeles que tu vet ya te dio. solo traducimos — no añadimos nada.',
    oq2: '"¿es segura la info de mi mascota?"',
    oa2: '<strong>tus papeles se procesan y se eliminan inmediatamente.</strong> nada se almacena. una vez listo, desaparece.',
    oq3: '"¿y si mis papeles son borrosos?"',
    oa3: '<strong>para eso existe furbrief.</strong> fotos borrosas, notas manuscritas, cualquier pdf. si ilegible te lo decimos.',
    oq4: '"¿es el $6 reembolsable?"',
    oa4: '<strong>sí — dentro de 24 horas, sin preguntas.</strong> si no es útil, escríbenos y te devolvemos el dinero.',
    ins_t: 'una cirugía así suele costar $2,000–$6,000 sin seguro',
    ins_d: 'la mayoría contrata seguro después de su primera emergencia. si lo estás considerando ahora — es el momento ideal.',
    ins_btn: 'comparar seguros para mascotas →',
    faq_ey: 'FAQ',
    faq_h: 'respuestas rápidas',
    fq1: '¿para qué cirugías funciona?',
    fa1: 'cualquier cirugía con papeles de alta — esterilizaciones, rodilla, extracciones dentales, emergencias.',
    fq2: '¿funciona para gatos?',
    fa2: 'sí — perros, gatos y la mayoría de mascotas. solo indícanos la especie.',
    fq3: '¿puedo compartirlo con mi pareja o cuidador?',
    fa3: 'sí — página limpia e imprimible. guárdala como pdf o comparte el enlace.',
    fq4: '¿mis papeles ya son claros — lo necesito?',
    fa4: '¡probablemente no! furbrief es para los papeles escritos en jerga clínica.',
    fin_h1: 'ya hiciste',
    fin_h2: 'lo más difícil.',
    fin_sub: 'tu mascota está en casa. ahora solo necesitas saber qué hacer esta noche — en un lenguaje que puedas usar.',
    foot_tag: 'todo lo que dijo tu vet, en lenguaje claro.',
    foot_disc: 'furbrief traduce papeles de alta veterinaria. no es consejo médico. no reemplaza la atención profesional. en emergencias contacta a tu vet.',
  },
  ko: {
    nav_cta: '퍼브리프 받기',
    eyebrow: '수의사가 설명 못한 내용',
    h1a: '수의사가',
    h1b: '한 말, 전부.',
    h1em: '번역됩니다.',
    sub: '퇴원 서류를 올리면 60초 안에 쉬운 한국어 케어 플랜을 받아보세요. 날짜별로. 전문 용어 없이.',
    def: '퍼브리프 — 반려동물의 퇴원 서류를 자정에도 이해할 수 있는 말로 번역해드립니다.',
    upload_t: '퇴원 서류를 여기에 끌어다 놓으세요',
    upload_h: 'PDF · 사진 · 스크린샷 · 모든 클리닉',
    blang_lbl: '퍼브리프 언어:',
    cta: '퍼브리프 받기',
    price: '$6 일회 결제',
    t1: '정기결제 없음',
    t2: '60초 안에 완성',
    t3: '서류 저장 안 함',
    t4: '불만족 시 환불',
    dec_t: '퍼브리프가 이런 것들을 해석해드려요…',
    dec_live: '실제 예시',
    dec_sub: '서류 → 쉬운 말로',
    d1: '<strong>상처가 벌어지는지</strong> 확인하세요. 봉합 분리 시 즉시 수의사에게 연락.',
    d2: '<strong>매일 두 번, 반드시 식사와 함께</strong> 진통제를 주세요. 공복에는 절대 안 됩니다.',
    d3: '봉합실은 <strong>피부 아래</strong> — <strong>저절로 녹습니다.</strong> 제거 불필요.',
    d4: '상처 근처에 <strong>말랑말랑한 체액 주머니</strong>가 생길 수 있어요. 보통 무해합니다.',
    d5: '<strong>달리기, 점프, 계단 금지.</strong> 배변 시에만 짧은 줄로 산책.',
    pf1n: '60초',
    pf1l: '평균 처리 시간',
    pf2n: '모든 병원',
    pf2l: '로그인 불필요',
    pf3l: '일회 결제',
    pf4n: '100%',
    pf4l: '환불 보장',
    p1n: '60초',
    p1l: '소요 시간',
    p2n: '모든 병원',
    p2l: '로그인 없음',
    p3l: '일회 결제',
    prob_ey: '문제',
    prob_h1: '수의사는 훌륭해요.',
    prob_h2: '하지만 서류는 다른 수의사를 위해 쓰여졌어요.',
    prob_p1: '방금 집에 도착했어요. 반려동물은 아직 마취에서 깨어나는 중이고, 이해하기 어려운 의학 용어가 가득한 서류 세 장이 있어요. 병원은 문을 닫았고요.',
    prob_p2: '수의사가 아닌 건 당연해요. 수의사가 될 필요도 없어요. 수의사가 필요한 말은 다 했어요 — 다만 지친 밤 9시에 쓰기 어려운 언어로 썼을 뿐이에요.',
    prob_p3: '퍼브리프는 그 서류를 이해하기 쉬운 말로 번역한 것입니다. 60초 안에 준비됩니다.',
    paper_lbl: '실제 퇴원 서류는 이렇게 생겼어요',
    how_ey: '이용 방법',
    how_h: '세 단계. 하나의 퍼브리프.',
    s1t: '서류 업로드',
    s1d: '사진, PDF, 스크린샷. 어떤 형식이든 OK — 밤에 찍은 흐린 사진도 괜찮아요.',
    s2t: '반려동물 정보 입력',
    s2d: '이름, 종류, 수술 유형. 30초면 됩니다. 맞춤형 퍼브리프를 위한 정보예요.',
    s3t: '퍼브리프 받기',
    s3d: '쉬운 말로. 날짜별로. 약 복용 안내 포함. 저장, 인쇄, 공유 가능.',
    st_photo: '사진',
    st_ss: '스크린샷',
    st_hw: '손글씨',
    st_dog: '강아지',
    st_cat: '고양이',
    st_dental: '치과',
    st_sched: '일별 일정',
    st_meds: '약 안내',
    st_warn: '주의 신호',
    wyg_ey: '퍼브리프에 포함된 내용',
    wyg_h: '네 가지. 모두 유용해요.',
    w1n: '일별 회복 일정',
    w1d: '일반 안내가 아닌 — 실제 서류에서 추출. 오늘, 1–3일, 4–7일, 안심할 수 있는 시점을 정확히 알 수 있어요.',
    d_today: '오늘',
    d_today_t: '몇 시간 동안 몽롱할 수 있어요. 식사 절반. 넥카라 항상 착용.',
    d_1_3: '1–3일',
    d_1_3_t: '짧은 줄 산책만. 봉합 부위 하루 두 번 확인. 카프로펜은 식사와 함께.',
    d_4_7: '4–7일',
    d_4_7_t: '멀쩡해 보여도 방심 금물. 아직 달리기와 점프는 안 돼요.',
    d_8_14: '8–14일',
    d_8_14_t: '산책을 조금씩 늘려가세요. 14일째 재진 예정.',
    w2n: '약 복용 안내',
    w2d: '모든 약을 해석해드려요 — 어떤 약인지, 어떻게 투여하는지, "BID with food"가 무슨 뜻인지.',
    w3n: '주의 신호',
    w3d: '"이럴 때는 바로 수의사에게 전화하세요" — 수술에 맞게 맞춤화. 실제로 해당하는 신호만.',
    w4n: '걱정 마세요 섹션',
    w4d: '무섭게 보이지만 완전히 정상적인 것들. 미리 알아두면 잠을 잘 수 있어요.',
    samp_ey: '실제 예시',
    samp_h: '이런 결과물을 받게 돼요',
    samp_sub: '루나는 중성화 수술을 받았어요. 실제 퇴원 서류로 만든 퍼브리프의 축약 버전입니다.',
    samp_pet: '루나 · 강아지 · 중성화',
    samp_med_name: '진통제',
    samp_med_clin: 'Carprofen 25mg',
    samp_med_dose: '1정 · 하루 2회 · 5일',
    samp_med_note: '항상 음식과 함께 주세요 — 절대 공복에 주지 마세요.',
    samp_w1: '상처가 벌어지거나 봉합사가 분리됨',
    samp_w2: '절개 부위에서 노란색 또는 초록색 분비물',
    samp_w3: '24시간 후에도 식욕 없음',
    samp_n1: '수술 후 12–24시간 동안 멍한 것 — 마취가 깨는 과정이에요, 문제가 아니에요.',
    samp_n2: '절개 부위 가장자리의 약간의 발적 — 처음 48시간 동안은 정상이에요.',
    samp_cta: '우리 반려동물 퍼브리프 받기 →',
    obj_ey: '자주 묻는 질문',
    obj_h: '알아두면 좋은 것들',
    oq1: '"수의사를 대신하는 건가요?"',
    oa1: '<strong>전혀 아니에요.</strong> 수의사가 이미 준 서류의 내용만 번역합니다. 새로운 내용을 추가하지 않아요.',
    oq2: '"반려동물 정보는 안전한가요?"',
    oa2: '<strong>서류는 처리 후 즉시 삭제됩니다.</strong> 아무것도 저장하지 않아요. 퍼브리프 완성 후 우리 쪽에는 아무것도 남지 않아요.',
    oq3: '"서류가 흐리거나 손글씨면요?"',
    oa3: '<strong>그런 상황을 위해 만들었어요.</strong> 흐린 사진, 손글씨, 어떤 병원의 PDF든 OK.',
    oq4: '"$6 환불이 되나요?"',
    oa4: '<strong>네 — 24시간 내, 묻지 않고요.</strong> 도움이 안 됐다면 이메일 주시면 바로 환불해드려요.',
    ins_t: '이런 수술은 보통 $2,000–$6,000이 듭니다',
    ins_d: '대부분의 보호자는 첫 응급 상황 이후에 보험에 가입해요. 지금 생각하고 계신다면 — 딱 맞는 타이밍이에요.',
    ins_btn: '반려동물 보험 비교하기 →',
    faq_ey: '자주 묻는 질문',
    faq_h: '빠른 답변',
    fq1: '어떤 수술에 사용할 수 있나요?',
    fa1: '수의사가 퇴원 서류를 준 모든 수술 — 중성화, 슬개골, 치과, 종양 제거, 응급 처치 등.',
    fq2: '고양이도 되나요?',
    fa2: '네 — 강아지, 고양이, 대부분의 반려동물. 업로드 시 종류를 알려주세요.',
    fq3: '파트너나 펫시터와 공유할 수 있나요?',
    fa3: '네 — 깔끔하게 인쇄할 수 있는 페이지예요. PDF로 저장하거나 링크를 공유하세요.',
    fq4: '병원 서류가 이미 이해하기 쉬운데 필요한가요?',
    fa4: '아마 필요 없을 거예요! 퍼브리프는 의학 전문 용어로 가득한 서류를 위한 거예요.',
    fin_h1: '가장 힘든 부분은',
    fin_h2: '이미 끝났어요.',
    fin_sub: '반려동물이 집에 왔어요. 이제 오늘 밤 무엇을 해야 할지만 알면 돼요.',
    foot_tag: '수의사가 한 말, 전부. 쉬운 말로.',
    foot_disc: '퍼브리프는 수의사 퇴원 서류를 번역합니다. 수의학적 조언이 아닙니다. 응급 상황에서는 반드시 수의사에게 연락하세요.',
  },
  zh: {
    nav_cta: '获取我的毛简报',
    eyebrow: '兽医忘记解释的那部分',
    h1a: '兽医说的',
    h1b: '一切。',
    h1em: '已翻译。',
    sub: '上传出院文件，60秒内获取简明中文护理计划。按天分类。无专业术语。',
    def: '毛简报 — 将宠物出院文件翻译成您在深夜也能读懂的语言。',
    upload_t: '将出院文件拖放到这里',
    upload_h: 'PDF · 照片 · 截图 · 任何诊所',
    blang_lbl: '毛简报语言：',
    cta: '获取我的毛简报',
    price: '$6 一次性付款',
    t1: '无需订阅',
    t2: '60秒内完成',
    t3: '文件不存储',
    t4: '不满意可退款',
    dec_t: '您的毛简报会解读这类内容…',
    dec_live: '实际示例',
    dec_sub: '从文件 → 转为通俗语言',
    d1: '观察<strong>伤口是否裂开</strong> — 缝合处分离请立即联系兽医。',
    d2: '<strong>每天两次随餐服用</strong>一片止痛药。切勿空腹服用。',
    d3: '缝合线在<strong>皮肤下方</strong> — 会<strong>自行溶解</strong>，无需拆线。',
    d4: '伤口附近可能出现<strong>柔软的液体囊肿</strong>，通常无害。',
    d5: '<strong>禁止奔跑、跳跃和爬楼梯。</strong>只能短绳遛弯。',
    pf1n: '60秒',
    pf1l: '平均处理时间',
    pf2n: '任何诊所',
    pf2l: '无需登录',
    pf3l: '一次性付款',
    pf4n: '100%',
    pf4l: '退款保证',
    p1n: '60秒',
    p1l: '处理时间',
    p2n: '任何诊所',
    p2l: '无需登录',
    p3l: '一次性',
    prob_ey: '问题所在',
    prob_h1: '兽医很专业。',
    prob_h2: '但他们的文件是写给其他兽医看的。',
    prob_p1: '你刚到家。宠物还在麻醉中恢复。手里拿着三页专业术语文件，一半都看不懂。诊所已经关门了。',
    prob_p2: '你不是兽医，也不应该需要成为兽医。兽医已经告诉了你需要知道的一切——只是用了在晚上9点精疲力竭时根本用不上的语言。',
    prob_p3: '毛简报就是把同一份文件翻译成清晰易懂的语言。60秒内完成。',
    paper_lbl: '实际出院文件长这样',
    how_ey: '使用方法',
    how_h: '三个步骤。一份毛简报。',
    s1t: '上传文件',
    s1d: '照片、PDF或截图。任何格式，任何诊所 — 包括深夜拍的模糊照片。',
    s2t: '填写宠物信息',
    s2d: '名字、种类、手术类型。30秒搞定。让毛简报更贴近您的宠物。',
    s3t: '获取毛简报',
    s3d: '简明易懂。按天分类。用药解读。警示明确。可保存、打印或分享。',
    st_photo: '照片',
    st_ss: '截图',
    st_hw: '手写',
    st_dog: '狗狗',
    st_cat: '猫咪',
    st_dental: '口腔',
    st_sched: '每日计划',
    st_meds: '用药指南',
    st_warn: '警示信号',
    wyg_ey: '毛简报包含什么',
    wyg_h: '四项内容。全部实用。',
    w1n: '每日康复计划',
    w1d: '非通用模板 — 直接从您的文件提取。准确了解今天、第1–3天、4–7天该做什么。',
    d_today: '今天',
    d_today_t: '可能昏沉好几个小时。喂平时一半食量。伊丽莎白圈始终佩戴。',
    d_1_3: '第1–3天',
    d_1_3_t: '只能短绳遛弯。每天检查伤口两次。卡洛芬随餐服用。',
    d_4_7: '第4–7天',
    d_4_7_t: '看起来恢复了——别大意。仍然禁止奔跑和跳跃。',
    d_8_14: '第8–14天',
    d_8_14_t: '逐渐增加散步时间。第14天返回诊所复诊。',
    w2n: '用药指南',
    w2d: '每种药物全面解读 — 用途、用法，以及"BID with food"是什么意思。',
    w3n: '警示信号',
    w3d: '"出现这种情况请立即联系兽医" — 针对您的手术定制，非通用清单。',
    w4n: '别担心专区',
    w4d: '看起来吓人但其实完全正常的情况。提前了解，才能安心入睡。',
    samp_ey: '真实示例',
    samp_h: '这就是您将获得的内容',
    samp_sub: '露娜接受了绝育手术。这是根据真实出院文件生成的毛简报浓缩版。',
    samp_pet: '露娜 · 狗 · 绝育',
    samp_med_name: '止痛片',
    samp_med_clin: 'Carprofen 25mg',
    samp_med_dose: '1片 · 每天两次 · 5天',
    samp_med_note: '必须随餐服用 — 绝不能空腹服用。',
    samp_w1: '伤口裂开或缝线脱落',
    samp_w2: '切口处出现黄色或绿色分泌物',
    samp_w3: '24小时后仍不进食',
    samp_n1: '术后12–24小时昏昏沉沉 — 这是麻醉代谢的过程，不是问题。',
    samp_n2: '切口边缘轻微发红 — 前48小时内属于正常现象。',
    samp_cta: '为您的宠物获取毛简报 →',
    obj_ey: '常见问题',
    obj_h: '几点值得了解的事',
    oq1: '"这会取代我的兽医吗？"',
    oa1: '<strong>完全不会。</strong>毛简报的所有内容都来自兽医已经给您的文件。我们只是翻译——不添加任何内容。',
    oq2: '"宠物的信息安全吗？"',
    oa2: '<strong>文件处理后立即删除。</strong>不存储任何内容。毛简报生成后，我们这边什么都不留。',
    oq3: '"文件模糊或是手写的怎么办？"',
    oa3: '<strong>毛简报就是为这种情况而生的。</strong>模糊照片、手写笔记、任何诊所的PDF都可以。',
    oq4: '"$6可以退款吗？"',
    oa4: '<strong>可以 — 24小时内，无需说明原因。</strong>如果毛简报没有帮助，请发邮件，我们立即退款。',
    ins_t: '此类手术通常花费$2,000–$6,000（无保险情况下）',
    ins_d: '大多数宠物主人在第一次紧急情况后才购买保险。如果您正在考虑——现在正是最佳时机。',
    ins_btn: '比较宠物保险 →',
    faq_ey: '常见问题',
    faq_h: '快速解答',
    fq1: '适用于哪些手术？',
    fa1: '任何兽医给您出院文件的手术 — 绝育、膝关节手术、拔牙、肿瘤切除、急诊手术等。',
    fq2: '适用于猫咪吗？',
    fa2: '是的 — 狗狗、猫咪和大多数宠物都适用。上传时告诉我们宠物种类即可。',
    fq3: '可以与伴侣或宠物护理员分享吗？',
    fa3: '可以 — 毛简报是一份清晰的可打印页面。可保存为PDF或分享链接。',
    fq4: '我的兽医的文件已经很清楚了，还需要这个吗？',
    fa4: '可能不需要！毛简报适用于90%使用临床专业术语的出院文件。',
    fin_h1: '最难的部分',
    fin_h2: '已经完成了。',
    fin_sub: '宠物已经回家了。现在只需要知道今晚要做什么——用您能理解的语言。',
    foot_tag: '兽医说的一切，用你能懂的语言。',
    foot_disc: '毛简报翻译兽医出院文件。非兽医建议。不能替代专业医疗护理。紧急情况请务必联系您的兽医。',
  },
};

type Lang = keyof typeof translations;

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [storedFileName, setStoredFileName] = useState<string | null>(null);
  const [storedFileSize, setStoredFileSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  // On mount, check if user already uploaded a file
  useEffect(() => {
    const name = sessionStorage.getItem('furbrief_file_name');
    const size = sessionStorage.getItem('furbrief_file_size');
    if (name) { setStoredFileName(name); setStoredFileSize(size); }
  }, []);

  const clearStored = () => {
    sessionStorage.removeItem('furbrief_blob_url');
    sessionStorage.removeItem('furbrief_file_name');
    sessionStorage.removeItem('furbrief_file_size');
    setStoredFileName(null);
    setStoredFileSize(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLandingFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setUploadError('File must be 10MB or smaller.'); return; }
    clearStored();
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload failed');
      sessionStorage.setItem('furbrief_blob_url', data.blob_url);
      sessionStorage.setItem('furbrief_file_name', file.name);
      sessionStorage.setItem('furbrief_file_size', `${(file.size / 1024 / 1024).toFixed(2)} MB`);
      window.location.assign('/upload');
    } catch (err) {
      setUploadError((err as Error).message);
      setIsUploading(false);
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.className = lang === 'ko' ? 'ko' : lang === 'zh' ? 'zh' : '';
  }, [lang]);

useEffect(() => {
    const handle = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.lang-wrap')) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, []);

  return (
    <main>
      <nav>
        <a href="#" className="brand">
          <div className="bmark">
            <svg viewBox="0 0 32 42" width="18" height="24">
              <path d="M3,0 L20,0 L32,12 L32,39 Q32,42 29,42 L3,42 Q0,42 0,39 L0,3 Q0,0 3,0 Z" fill="#FFFBEE" />
              <path d="M20,0 L32,12 L20,12 Z" fill="rgba(255,255,255,.3)" />
              <line x1="6" y1="20" x2="26" y2="20" stroke="rgba(58,32,16,.2)" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="27" x2="26" y2="27" stroke="rgba(58,32,16,.2)" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="34" x2="18" y2="34" stroke="rgba(58,32,16,.2)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="bname">
            <em>fur</em>brief
          </span>
        </a>
        <div className="nav-r">
          <div className="lang-wrap">
            <button className="globe-btn" type="button" onClick={() => setShowLangMenu(!showLangMenu)}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span id="globe-lbl">{lang.toUpperCase()}</span>
            </button>
            <div className={`ldrop ${showLangMenu ? 'open' : ''}`} id="ldrop">
              {(Object.keys(translations) as Lang[]).map((key) => (
                <button
                  key={key}
                  className={`lopt ${lang === key ? 'active' : ''} ${key === 'ko' ? 'ko' : key === 'zh' ? 'zh' : ''}`}
                  type="button"
                  onClick={() => {
                    setLang(key);
                    setShowLangMenu(false);
                  }}
                >
                  {langLabels[key]}
                </button>
              ))}
            </div>
          </div>
          <a href="/upload" className="nav-cta">
            <span>{t.nav_cta}</span>
            <span className="nprice">$6</span>
          </a>
        </div>
      </nav>

      <section className="hero-outer dot-bg">
        <div className="hero-inner">
          <div className="fu">
            <div className="eyebrow">
              <div className="eyebrow-dot" />
              <span className="eyebrow-text">{t.eyebrow}</span>
            </div>
            <h1 className="hero-h1">
              <span>{t.h1a}</span>
              <br />
              <span>{t.h1b}</span>
              <br />
              <em>{t.h1em}</em>
            </h1>
            <p className="hero-sub">{t.sub}</p>
            <p className="hero-def">{t.def}</p>

            {storedFileName ? (
              <div className="flex items-center gap-4 p-5 rounded-3xl border-2 border-[#6BA888] bg-[#E4F4EC] mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#6BA888] flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#3D7A58] text-sm truncate">{storedFileName}</p>
                  <p className="text-[#6BA888] text-xs font-semibold mt-0.5">{storedFileSize} · ready to translate</p>
                </div>
                <button onClick={clearStored} className="text-[#6BA888] hover:text-[#3D7A58] p-1 flex-shrink-0" title="Upload a different file">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                className={`uzone${isDragging ? ' drag-over' : ''}`}
                id="upload"
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={async (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) await handleLandingFile(e.dataTransfer.files[0]); }}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <div className="uico">
                  {isUploading ? (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  )}
                </div>
                <p className="utit">{isUploading ? 'uploading…' : t.upload_t}</p>
                <p className="uhint">{t.upload_h}</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/heic"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleLandingFile(e.target.files[0])}
            />
            {uploadError && <p className="text-sm font-semibold mt-2" style={{ color: '#A86860' }}>{uploadError}</p>}

            <button className="cbtn" type="button" onClick={() => window.location.assign('/upload')}>
              <span>{t.cta}</span>
              <span className="cprice">{t.price}</span>
            </button>

            <div className="trust-row">
              <div className="titem">
                <div className="tchk">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{t.t1}</span>
              </div>
              <div className="titem">
                <div className="tchk">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{t.t2}</span>
              </div>
              <div className="titem">
                <div className="tchk">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{t.t3}</span>
              </div>
            </div>
          </div>

          <div className="hero-r fu2">
            <div className="mascot-wrap">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <svg viewBox="0 0 100 100" width="100" height="100">
                  <use href="#cat" />
                </svg>
                <svg viewBox="0 0 16 16" width="18" height="18" style={{ position: 'absolute', top: -4, right: -8 }}>
                  <use href="#spark" />
                </svg>
                <svg viewBox="0 0 16 16" width="13" height="13" style={{ position: 'absolute', top: 10, right: -18, fill: '#C4837A' }}>
                  <use href="#spark" />
                </svg>
              </div>
            </div>

            <div className="decoder">
              <div className="dec-head">
                <span className="dec-title">{t.dec_t}</span>
                <span className="dec-live">{t.dec_live}</span>
              </div>
              <p className="dec-sub">{t.dec_sub}</p>
              <div className="dec-body">
                <div className="drow">
                  <div>
                    <span className="jtag">monitor for dehiscence</span>
                  </div>
                  <p className="dplain" dangerouslySetInnerHTML={{ __html: t.d1 }} />
                </div>
                <div className="drow">
                  <div>
                    <span className="jtag">Carprofen 25mg BID with food</span>
                  </div>
                  <p className="dplain" dangerouslySetInnerHTML={{ __html: t.d2 }} />
                </div>
                <div className="drow">
                  <div>
                    <span className="jtag">subcutaneous sutures</span>
                  </div>
                  <p className="dplain" dangerouslySetInnerHTML={{ __html: t.d3 }} />
                </div>
                <div className="drow">
                  <div>
                    <span className="jtag">seroma may develop</span>
                  </div>
                  <p className="dplain" dangerouslySetInnerHTML={{ __html: t.d4 }} />
                </div>
                <div className="drow">
                  <div>
                    <span className="jtag">restrict activity 10–14 days</span>
                  </div>
                  <p className="dplain" dangerouslySetInnerHTML={{ __html: t.d5 }} />
                </div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-card">
                <div className="stat-n">{t.p1n}</div>
                <div className="stat-l">{t.p1l}</div>
              </div>
              <div className="stat-card">
                <div className="stat-n">{t.p2n}</div>
                <div className="stat-l">{t.p2l}</div>
              </div>
              <div className="stat-card accent">
                <div className="stat-n">$6</div>
                <div className="stat-l">{t.p3l}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="proof-bar">
        <div className="pfact">
          <span className="pfn">{t.pf1n}</span>
          <div className="pfdot" />
          <span className="pfl">{t.pf1l}</span>
        </div>
        <div className="pfact">
          <span className="pfn">{t.pf2n}</span>
          <div className="pfdot" />
          <span className="pfl">{t.pf2l}</span>
        </div>
        <div className="pfact">
          <span className="pfn">$6</span>
          <div className="pfdot" />
          <span className="pfl">{t.pf3l}</span>
        </div>
        <div className="pfact">
          <span className="pfn">{t.pf4n}</span>
          <div className="pfdot" />
          <span className="pfl">{t.pf4l}</span>
        </div>
      </div>

      <section className="problem">
        <div className="prob-inner">
          <div className="sec-ey">{t.prob_ey}</div>
          <h2 className="sec-h" style={{ marginBottom: 20 }}>
            <span>{t.prob_h1}</span>
            <br />
            <em>{t.prob_h2}</em>
          </h2>
          <div className="prob-body">
            <p>{t.prob_p1}</p>
            <p>{t.prob_p2}</p>
            <p>
              <strong>{t.prob_p3}</strong>
            </p>
          </div>
          <div className="paper-card">
            <div className="paper-top">{t.paper_lbl}</div>
            <p className="pline">
              administer <span className="phl">Carprofen 25mg PO BID</span> with food × 5 days. do not give if{' '}
              <span className="phl">anorexic or vomiting.</span>
            </p>
            <p className="pline">
              monitor surgical site for <span className="phl">erythema, exudate,</span> or <span className="phl">dehiscence.</span> e-collar to remain in place.
            </p>
            <p className="pline">
              <span className="phl">restrict activity</span> 10–14 days. <span className="phl">leash walks only</span> for elimination.
            </p>
            <p className="pline">
              <span className="phl">amoxicillin 250mg BID</span> × 7 days. <span className="phl">recheck</span> in 14 days.
            </p>
          </div>
        </div>
      </section>

      <section className="steps-sec">
        <div className="sec-ey">{t.how_ey}</div>
        <h2 className="sec-h">{t.how_h}</h2>
        <div className="steps">
          <div className="step-card">
            <div className="step-num">1</div>
            <p className="step-title">{t.s1t}</p>
            <p className="step-desc">{t.s1d}</p>
            <div className="step-tags">
              <span className="stag">PDF</span>
              <span className="stag">{t.st_photo}</span>
              <span className="stag">{t.st_ss}</span>
              <span className="stag">{t.st_hw}</span>
            </div>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <p className="step-title">{t.s2t}</p>
            <p className="step-desc">{t.s2d}</p>
            <div className="step-tags">
              <span className="stag">{t.st_dog}</span>
              <span className="stag">{t.st_cat}</span>
              <span className="stag">spay/neuter</span>
              <span className="stag">TPLO</span>
              <span className="stag">{t.st_dental}</span>
            </div>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <p className="step-title">{t.s3t}</p>
            <p className="step-desc">{t.s3d}</p>
            <div className="step-tags">
              <span className="stag">{t.st_sched}</span>
              <span className="stag">{t.st_meds}</span>
              <span className="stag">{t.st_warn}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="wyg">
        <div className="wyg-inner">
          <div className="sec-ey">{t.wyg_ey}</div>
          <h2 className="sec-h">{t.wyg_h}</h2>
          <div className="wyg-grid">
            <div className="wcard big">
              <div>
                <div className="wico">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <p className="wname">{t.w1n}</p>
                <p className="wdesc">{t.w1d}</p>
              </div>
              <div className="dprev">
                <div className="dday">
                  <span className="ddtag">{t.d_today}</span>
                  <span className="ddtxt">{t.d_today_t}</span>
                </div>
                <div className="dday">
                  <span className="ddtag">{t.d_1_3}</span>
                  <span className="ddtxt">{t.d_1_3_t}</span>
                </div>
                <div className="dday">
                  <span className="ddtag">{t.d_4_7}</span>
                  <span className="ddtxt">{t.d_4_7_t}</span>
                </div>
                <div className="dday">
                  <span className="ddtag">{t.d_8_14}</span>
                  <span className="ddtxt">{t.d_8_14_t}</span>
                </div>
              </div>
            </div>
            <div className="wcard rose-card">
              <div className="wico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <p className="wname">{t.w2n}</p>
              <p className="wdesc">{t.w2d}</p>
            </div>
            <div className="wcard honey-card">
              <div className="wico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="wname">{t.w3n}</p>
              <p className="wdesc">{t.w3d}</p>
            </div>
            <div className="wcard mint-card">
              <div className="wico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <p className="wname">{t.w4n}</p>
              <p className="wdesc">{t.w4d}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SAMPLE BRIEF ── */}
      <section style={{ background: '#FFF6DC', padding: '72px 5%', borderTop: '2px solid #E8D098', borderBottom: '2px solid #E8D098' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="sec-ey">{t.samp_ey}</div>
          <h2 className="sec-h" style={{ marginBottom: 8 }}>{t.samp_h}</h2>
          <p style={{ fontSize: 15, color: '#8A6840', fontWeight: 600, marginBottom: 36, lineHeight: 1.6 }}>{t.samp_sub}</p>

          {/* mock brief card */}
          <div style={{ background: '#FFFBEE', borderRadius: 28, border: '2px solid #E8D098', overflow: 'hidden', boxShadow: '0 8px 40px rgba(58,32,16,.08)' }}>

            {/* brief header */}
            <div style={{ background: '#FCF0C8', padding: '20px 28px', borderBottom: '2px solid #E8D098', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 22, color: '#3A2010' }}>Luna's recovery plan</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#8A6840', marginTop: 2 }}>{t.samp_pet}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, background: '#C4837A', color: '#fff', padding: '5px 14px', borderRadius: 50, letterSpacing: '.04em', textTransform: 'uppercase' as const }}>
                sample
              </span>
            </div>

            <div style={{ padding: '24px 28px', display: 'grid', gap: 20 }}>

              {/* day schedule */}
              <div style={{ background: '#FFF6DC', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #E8D098' }}>
                <div style={{ padding: '14px 20px', background: '#FCF0C8', borderBottom: '1px solid #E8D098' }}>
                  <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 16, color: '#3A2010' }}>{t.d_today.charAt(0).toUpperCase() + t.d_today.slice(1)} — {t.d_4_7}</p>
                </div>
                {[
                  { tag: t.d_today, txt: t.d_today_t },
                  { tag: t.d_1_3, txt: t.d_1_3_t },
                  { tag: t.d_4_7, txt: t.d_4_7_t },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 20px', borderBottom: i < 2 ? '1px solid #ECC888' : 'none', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, background: '#B8866A', color: '#fff', padding: '3px 10px', borderRadius: 50, whiteSpace: 'nowrap' as const, flexShrink: 0, marginTop: 2 }}>{row.tag}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#3A2010', lineHeight: 1.6 }}>{row.txt}</span>
                  </div>
                ))}
              </div>

              {/* medication */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '18px 20px', border: '1.5px solid #F9E8E4' }}>
                <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 17, color: '#C4837A', marginBottom: 4 }}>{t.samp_med_name}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#3A2010', marginBottom: 10 }}>{t.samp_med_dose}</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#FAE0B8', color: '#8A5A40', padding: '3px 10px', borderRadius: 8, fontFamily: 'monospace' }}>{t.samp_med_clin}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#E4F4EC', color: '#3D7A58', padding: '3px 10px', borderRadius: 50 }}>with food</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#8A6840', paddingTop: 10, borderTop: '1px solid #FAE0B8' }}>{t.samp_med_note}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* warning signs */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#8A6840', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 10 }}>⚠️ warning signs</p>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                    {[
                      { txt: t.samp_w1, color: '#C4837A', bg: '#F9E8E4' },
                      { txt: t.samp_w2, color: '#C4837A', bg: '#F9E8E4' },
                      { txt: t.samp_w3, color: '#D4A030', bg: '#FEF9EE' },
                    ].map((w, i) => (
                      <div key={i} style={{ background: w.bg, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${w.color}30`, fontSize: 13, fontWeight: 700, color: '#3A2010', lineHeight: 1.5 }}>{w.txt}</div>
                    ))}
                  </div>
                </div>

                {/* don't panic */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#8A6840', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 10 }}>✅ don't panic</p>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                    {[t.samp_n1, t.samp_n2].map((n, i) => (
                      <div key={i} style={{ background: '#E4F4EC', borderRadius: 12, padding: '10px 14px', border: '1.5px solid #B8E4CA', fontSize: 13, fontWeight: 600, color: '#1A3325', lineHeight: 1.5 }}>{n}</div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="/upload" className="cbtn" style={{ display: 'inline-flex' }}>{t.samp_cta}</a>
          </div>
        </div>
      </section>

      <section className="obj-sec">
        <div className="sec-ey">{t.obj_ey}</div>
        <h2 className="sec-h" style={{ marginBottom: 20 }}>
          {t.obj_h}
        </h2>
        <div className="obj-grid">
          <div className="obj">
            <p className="oq">{t.oq1}</p>
            <p className="oa" dangerouslySetInnerHTML={{ __html: t.oa1 }} />
          </div>
          <div className="obj">
            <p className="oq">{t.oq2}</p>
            <p className="oa" dangerouslySetInnerHTML={{ __html: t.oa2 }} />
          </div>
          <div className="obj">
            <p className="oq">{t.oq3}</p>
            <p className="oa" dangerouslySetInnerHTML={{ __html: t.oa3 }} />
          </div>
          <div className="obj">
            <p className="oq">{t.oq4}</p>
            <p className="oa" dangerouslySetInnerHTML={{ __html: t.oa4 }} />
          </div>
        </div>
      </section>

      <div className="ins">
        <div className="ins-inner">
          <div className="ins-ico">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="ins-body">
            <p className="ins-t">{t.ins_t}</p>
            <p className="ins-d">{t.ins_d}</p>
          </div>
          <a href="#upload" className="ins-btn">
            {t.ins_btn}
          </a>
        </div>
      </div>

      <section className="faq-sec">
        <div className="faq-inner">
          <div className="sec-ey">{t.faq_ey}</div>
          <h2 className="sec-h" style={{ marginBottom: 20 }}>
            {t.faq_h}
          </h2>
          <div className="fitem">
            <div className="fq">
              <span>{t.fq1}</span>
              <div className="fchk">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <p className="fa">{t.fa1}</p>
          </div>
          <div className="fitem">
            <div className="fq">
              <span>{t.fq2}</span>
              <div className="fchk">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <p className="fa">{t.fa2}</p>
          </div>
          <div className="fitem">
            <div className="fq">
              <span>{t.fq3}</span>
              <div className="fchk">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <p className="fa">{t.fa3}</p>
          </div>
          <div className="fitem">
            <div className="fq">
              <span>{t.fq4}</span>
              <div className="fchk">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <p className="fa">{t.fa4}</p>
          </div>
        </div>
      </section>

      <section className="final dot-bg">
        <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 24px' }}>
          <svg viewBox="0 0 100 100" width="120" height="120">
            <use href="#cat" />
          </svg>
          <svg viewBox="0 0 16 16" width="20" height="20" style={{ position: 'absolute', top: -6, right: -6 }}>
            <use href="#spark" />
          </svg>
          <svg viewBox="0 0 16 16" width="14" height="14" style={{ position: 'absolute', bottom: 10, left: -10, fill: '#C4837A' }}>
            <path d="M8 0 L9.6 5.6 L16 8 L9.6 10.4 L8 16 L6.4 10.4 L0 8 L6.4 5.6 Z" />
          </svg>
          <svg viewBox="0 0 16 16" width="11" height="11" style={{ position: 'absolute', top: 5, left: -12 }}>
            <use href="#spark" />
          </svg>
        </div>
        <h2 className="fin-h">
          <span>{t.fin_h1}</span>
          <br />
          <em>{t.fin_h2}</em>
        </h2>
        <p className="fin-sub">{t.fin_sub}</p>
        <a href="/upload" className="fin-btn">
          <span>{t.cta}</span>
          <span className="cprice" style={{ background: 'rgba(255,255,255,.2)' }}>
            {t.price}
          </span>
        </a>
        <div className="fin-trust">
          <div className="fts">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{t.t1}</span>
          </div>
          <div className="fts">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{t.t2}</span>
          </div>
          <div className="fts">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{t.t3}</span>
          </div>
          <div className="fts">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{t.t4}</span>
          </div>
        </div>
      </section>

      <Footer language={lang} />

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <g id="cat">
            <circle cx="50" cy="54" r="44" fill="#FAE0B8" stroke="#ECC888" strokeWidth="2" />
            <polygon points="11,22 23,3 35,22" fill="#FAE0B8" stroke="#ECC888" strokeWidth="2" />
            <polygon points="15,21 23,9 32,21" fill="#ECC888" />
            <polygon points="65,22 77,3 89,22" fill="#FAE0B8" stroke="#ECC888" strokeWidth="2" />
            <polygon points="68,21 77,9 86,21" fill="#ECC888" />
            <path d="M22 18 Q26 22 24 28" fill="none" stroke="#E0A858" strokeWidth="1.5" opacity="0.4" />
            <path d="M28 15 Q30 20 28 26" fill="none" stroke="#E0A858" strokeWidth="1.5" opacity="0.4" />
            <path d="M72 18 Q76 22 74 28" fill="none" stroke="#E0A858" strokeWidth="1.5" opacity="0.4" />
            <path d="M78 15 Q80 20 78 26" fill="none" stroke="#E0A858" strokeWidth="1.5" opacity="0.4" />
            <ellipse cx="33" cy="50" rx="9" ry="10" fill="#3A2010" />
            <ellipse cx="33" cy="50" rx="5" ry="7" fill="#C47810" />
            <ellipse cx="33" cy="50" rx="2.5" ry="5" fill="#1A0C04" />
            <circle cx="36" cy="45" r="3" fill="white" />
            <circle cx="37.5" cy="43.5" r="1.3" fill="white" />
            <ellipse cx="67" cy="50" rx="9" ry="10" fill="#3A2010" />
            <ellipse cx="67" cy="50" rx="5" ry="7" fill="#C47810" />
            <ellipse cx="67" cy="50" rx="2.5" ry="5" fill="#1A0C04" />
            <circle cx="70" cy="45" r="3" fill="white" />
            <circle cx="71.5" cy="43.5" r="1.3" fill="white" />
            <ellipse cx="18" cy="63" rx="12" ry="7.5" fill="#FFB3CF" opacity="0.45" />
            <ellipse cx="82" cy="63" rx="12" ry="7.5" fill="#FFB3CF" opacity="0.45" />
            <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="#E8A070" />
            <path d="M44 67 Q50 74 56 67" fill="none" stroke="#C4714F" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="1" y1="58" x2="27" y2="61" stroke="#C49050" strokeWidth="1" opacity="0.35" />
            <line x1="1" y1="64" x2="27" y2="64" stroke="#C49050" strokeWidth="1" opacity="0.35" />
            <line x1="73" y1="61" x2="99" y2="58" stroke="#C49050" strokeWidth="1" opacity="0.35" />
            <line x1="73" y1="64" x2="99" y2="64" stroke="#C49050" strokeWidth="1" opacity="0.35" />
          </g>
          <g id="spark">
            <path d="M8 0 L9.6 5.6 L16 8 L9.6 10.4 L8 16 L6.4 10.4 L0 8 L6.4 5.6 Z" fill="#ECC888" />
          </g>
        </defs>
      </svg>
    </main>
  );
}
