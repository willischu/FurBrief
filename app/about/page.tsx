'use client';

import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import { useLanguage, type Lang } from '../../contexts/LanguageContext';

const languages = ['en', 'es', 'ko', 'zh'] as const;
const langLabels: Record<typeof languages[number], string> = {
  en: 'English',
  es: 'Español',
  ko: '한국어',
  zh: '中文',
};

const translations = {
  en: {
    nav_cta: 'translate my vet papers',
    prob_ey: 'the problem',
    prob_h1: 'vets are brilliant.',
    prob_h2: 'their paperwork is not written for you.',
    prob_p1: 'you just got home. your pet is groggy. you have three pages of clinical shorthand and no idea what half of it means. the clinic is closed.',
    prob_p2: 'you\'re not a vet. you shouldn\'t need to be. your vet told you everything — they just wrote it in a language you can\'t use at 9pm when you\'re exhausted.',
    prob_p3: 'a furbrief is that same document, translated into plain english. ready in 60 seconds.',
    paper_lbl: 'what actual discharge papers look like',
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
  },
  es: {
    nav_cta: 'traducir mis papeles',
    prob_ey: 'el problema',
    prob_h1: 'los vets son brillantes.',
    prob_h2: 'sus papeles no están escritos para ti.',
    prob_p1: 'acabas de llegar a casa. tu mascota está aturdida. tienes tres páginas de jerga clínica y no entiendes la mitad. la clínica está cerrada.',
    prob_p2: 'no eres vet. no deberías necesitar serlo. tu vet te dijo todo — solo lo escribió en un idioma que no puedes usar a las 9pm agotado/a.',
    prob_p3: 'un furbrief es ese mismo documento, traducido a lenguaje claro. listo en 60 segundos.',
    paper_lbl: 'cómo se ven los papeles de alta reales',
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
  },
  ko: {
    nav_cta: '퇴원 서류 번역하기',
    prob_ey: '문제',
    prob_h1: '수의사는 훌륭해요.',
    prob_h2: '하지만 서류는 다른 수의사를 위해 쓰여졌어요.',
    prob_p1: '방금 집에 도착했어요. 반려동물은 아직 마취에서 깨어나는 중이고, 이해하기 어려운 의학 용어가 가득한 서류 세 장이 있어요. 병원은 문을 닫았고요.',
    prob_p2: '수의사가 아닌 건 당연해요. 수의사가 될 필요도 없어요. 수의사가 필요한 말은 다 했어요 — 다만 지친 밤 9시에 쓰기 어려운 언어로 썼을 뿐이에요.',
    prob_p3: '퍼브리프는 그 서류를 이해하기 쉬운 말로 번역한 것입니다. 60초 안에 준비됩니다.',
    paper_lbl: '실제 퇴원 서류는 이렇게 생겼어요',
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
  },
  zh: {
    nav_cta: '翻译我的出院文件',
    prob_ey: '问题所在',
    prob_h1: '兽医很专业。',
    prob_h2: '但他们的文件是写给其他兽医看的。',
    prob_p1: '你刚到家。宠物还在麻醉中恢复。手里拿着三页专业术语文件，一半都看不懂。诊所已经关门了。',
    prob_p2: '你不是兽医，也不应该需要成为兽医。兽医已经告诉了你需要知道的一切——只是用了在晚上9点精疲力竭时根本用不上的语言。',
    prob_p3: '毛简报就是把同一份文件翻译成清晰易懂的语言。60秒内完成。',
    paper_lbl: '实际出院文件长这样',
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
  },
};

export default function AboutPage() {
  const [lang, setLang] = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = translations[lang];

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
        <a href="/" className="brand">
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
              <span id="globe-lbl" suppressHydrationWarning>{lang.toUpperCase()}</span>
            </button>
            <div className={`ldrop ${showLangMenu ? 'open' : ''}`} id="ldrop">
              {(Object.keys(translations) as Lang[]).map((key) => (
                <button
                  key={key}
                  className={`lopt ${lang === key ? 'active' : ''} ${key === 'ko' ? 'ko' : key === 'zh' ? 'zh' : ''}`}
                  type="button"
                  onClick={() => { setLang(key); setShowLangMenu(false); }}
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
          <a href="/upload" className="ins-btn">
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

      <Footer />
    </main>
  );
}
