'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import CatSvg from '../../components/CatSvg';
import { useLanguage, type Lang } from '../../contexts/LanguageContext';

const AFFILIATE_URL = 'https://furbrief.getrewardful.com/signup';

const t = {
  en: {
    nav_cta: 'translate my vet papers',
    eyebrow: 'affiliate program',
    h1: 'share furbrief. earn $2 per referral.',
    sub: 'free to join. no approval process. works for vets, pet bloggers, rescue orgs, or anyone who loves animals.',
    cta: 'become an affiliate →',
    how_h: 'how it works',
    steps: [
      { n: '1', t: 'sign up free', d: 'create your account at furbrief.getrewardful.com in under a minute. no contract, no approval queue.' },
      { n: '2', t: 'share your link', d: 'you get a unique referral link. share it on social media, in your newsletter, or with clients after discharge.' },
      { n: '3', t: 'earn $2 per order', d: 'every time someone follows your link and buys a furbrief, you earn $2. tracked automatically by Rewardful.' },
    ],
    who_h: 'who does well as an affiliate?',
    who: [
      { icon: '🐾', t: 'vet clinics & techs', d: 'share with clients at checkout. it reinforces your discharge instructions.' },
      { icon: '📝', t: 'pet bloggers & creators', d: 'your audience already cares about pet health. this is a natural fit.' },
      { icon: '🏠', t: 'rescue organizations', d: 'newly adopted pets often come with medical histories. furbrief helps new owners understand them.' },
      { icon: '💬', t: 'pet community moderators', d: 'facebook groups, reddit subs, local pet forums — post once and earn passively.' },
    ],
    faq_h: 'questions',
    faqs: [
      { q: 'how much can I earn?', a: '$2 per order. furbrief costs $6, so you earn 33% commission. there\'s no cap.' },
      { q: 'when do I get paid?', a: 'Rewardful pays out monthly via PayPal once your balance reaches $10.' },
      { q: 'do I need a website?', a: 'no. you can share your link anywhere — a text message, an instagram story, an email. it all counts.' },
      { q: 'how long does the tracking cookie last?', a: '30 days. if someone clicks your link and buys within 30 days, you get credit.' },
    ],
    bottom_h: 'ready to start?',
    bottom_sub: 'join in under a minute. no approval needed.',
  },
  es: {
    nav_cta: 'traducir mis papeles del vet',
    eyebrow: 'programa de afiliados',
    h1: 'comparte furbrief. gana $2 por referido.',
    sub: 'gratis para unirse. sin proceso de aprobación. ideal para vets, bloggers de mascotas, organizaciones de rescate o cualquier persona que ame a los animales.',
    cta: 'convertirse en afiliado →',
    how_h: 'cómo funciona',
    steps: [
      { n: '1', t: 'regístrate gratis', d: 'crea tu cuenta en furbrief.getrewardful.com en menos de un minuto. sin contrato ni aprobación.' },
      { n: '2', t: 'comparte tu enlace', d: 'recibes un enlace único. compártelo en redes sociales, en tu boletín o con clientes al momento del alta.' },
      { n: '3', t: 'gana $2 por pedido', d: 'cada vez que alguien sigue tu enlace y compra un furbrief, ganas $2. rastreado automáticamente.' },
    ],
    who_h: '¿quién funciona bien como afiliado?',
    who: [
      { icon: '🐾', t: 'clínicas y técnicos veterinarios', d: 'comparte con clientes al momento del alta. refuerza las instrucciones de tu clínica.' },
      { icon: '📝', t: 'bloggers y creadores de contenido', d: 'tu audiencia ya se preocupa por la salud de las mascotas.' },
      { icon: '🏠', t: 'organizaciones de rescate', d: 'los animales recién adoptados a menudo vienen con historiales médicos. furbrief ayuda a los nuevos dueños.' },
      { icon: '💬', t: 'moderadores de comunidades', d: 'grupos de facebook, subreddits, foros locales — publica una vez y gana de forma pasiva.' },
    ],
    faq_h: 'preguntas',
    faqs: [
      { q: '¿cuánto puedo ganar?', a: '$2 por pedido. furbrief cuesta $6, así que ganas un 33% de comisión. sin límite.' },
      { q: '¿cuándo cobro?', a: 'Rewardful paga mensualmente vía PayPal cuando tu saldo llega a $10.' },
      { q: '¿necesito un sitio web?', a: 'no. puedes compartir tu enlace en cualquier lugar — un mensaje de texto, una historia de instagram, un correo.' },
      { q: '¿cuánto dura la cookie?', a: '30 días. si alguien hace clic en tu enlace y compra dentro de 30 días, obtienes el crédito.' },
    ],
    bottom_h: '¿listo para empezar?',
    bottom_sub: 'únete en menos de un minuto. sin aprobación.',
  },
  ko: {
    nav_cta: '동물병원 서류 번역하기',
    eyebrow: '제휴 파트너 프로그램',
    h1: '퍼브리프를 공유하고 추천당 $2를 받으세요.',
    sub: '무료 가입. 승인 절차 없음. 수의사, 반려동물 블로거, 구조 단체, 동물을 사랑하는 누구에게나 적합합니다.',
    cta: '제휴 파트너 시작하기 →',
    how_h: '이용 방법',
    steps: [
      { n: '1', t: '무료로 가입', d: 'furbrief.getrewardful.com에서 1분 이내에 계정을 만드세요. 계약이나 승인 대기 없음.' },
      { n: '2', t: '링크 공유', d: '고유한 추천 링크를 받습니다. SNS, 뉴스레터, 또는 퇴원 후 고객에게 공유하세요.' },
      { n: '3', t: '주문당 $2 적립', d: '누군가 링크를 통해 퍼브리프를 구매하면 $2가 적립됩니다. Rewardful이 자동으로 추적합니다.' },
    ],
    who_h: '누가 제휴 파트너로 잘 맞나요?',
    who: [
      { icon: '🐾', t: '동물병원 및 수의 기사', d: '퇴원 시 고객과 공유하세요. 퇴원 지침을 보강하는 효과가 있습니다.' },
      { icon: '📝', t: '반려동물 블로거 및 크리에이터', d: '팔로워들이 이미 반려동물 건강에 관심이 많습니다.' },
      { icon: '🏠', t: '구조 단체', d: '새로 입양된 반려동물은 의료 기록을 가져오는 경우가 많습니다. 퍼브리프가 새 보호자를 도와줍니다.' },
      { icon: '💬', t: '커뮤니티 운영자', d: '페이스북 그룹, 레딧 서브, 지역 반려동물 포럼 — 한 번 게시하고 지속적으로 수익을 얻으세요.' },
    ],
    faq_h: '자주 묻는 질문',
    faqs: [
      { q: '얼마나 벌 수 있나요?', a: '주문당 $2. 퍼브리프는 $6이므로 33% 커미션입니다. 상한선 없음.' },
      { q: '언제 지급되나요?', a: 'Rewardful은 잔액이 $10 이상이면 PayPal을 통해 매월 지급합니다.' },
      { q: '웹사이트가 필요한가요?', a: '아닙니다. 문자, 인스타그램 스토리, 이메일 등 어디서든 링크를 공유할 수 있습니다.' },
      { q: '추적 쿠키는 얼마나 유지되나요?', a: '30일. 링크 클릭 후 30일 이내에 구매하면 크레딧이 적립됩니다.' },
    ],
    bottom_h: '시작할 준비가 되셨나요?',
    bottom_sub: '1분 이내에 가입하세요. 승인 불필요.',
  },
  zh: {
    nav_cta: '翻译我的兽医文件',
    eyebrow: '推广合作计划',
    h1: '分享毛简报，每次推荐赚 $2。',
    sub: '免费加入，无需审批，适合兽医、宠物博主、救助机构或任何爱动物的人。',
    cta: '成为推广伙伴 →',
    how_h: '如何运作',
    steps: [
      { n: '1', t: '免费注册', d: '在 furbrief.getrewardful.com 一分钟内创建账户，无需合同或审批。' },
      { n: '2', t: '分享您的链接', d: '获得专属推荐链接，通过社交媒体、电子报或在出院时与客户分享。' },
      { n: '3', t: '每笔订单赚 $2', d: '每当有人通过您的链接购买毛简报，您即可获得 $2，由 Rewardful 自动追踪。' },
    ],
    who_h: '谁适合成为推广伙伴？',
    who: [
      { icon: '🐾', t: '兽医诊所及技术员', d: '在出院时与客户分享，有助于加强您的出院指导。' },
      { icon: '📝', t: '宠物博主及创作者', d: '您的受众本就关心宠物健康，毛简报与您的内容天然契合。' },
      { icon: '🏠', t: '救助机构', d: '新领养的宠物通常附带病历，毛简报帮助新主人读懂它们。' },
      { icon: '💬', t: '宠物社区版主', d: '在 Facebook 群组、Reddit 或本地宠物论坛发布一次，持续获得收益。' },
    ],
    faq_h: '常见问题',
    faqs: [
      { q: '我能赚多少？', a: '每笔订单 $2。毛简报售价 $6，即 33% 佣金，无上限。' },
      { q: '何时付款？', a: 'Rewardful 每月通过 PayPal 付款，余额达到 $10 即可提现。' },
      { q: '我需要网站吗？', a: '不需要。您可以在任何地方分享链接——短信、Instagram 故事或电子邮件，均计入佣金。' },
      { q: '追踪 Cookie 有效期多长？', a: '30 天。若有人点击链接后 30 天内购买，您即可获得佣金。' },
    ],
    bottom_h: '准备好开始了吗？',
    bottom_sub: '不到一分钟即可加入，无需审批。',
  },
};

export default function AffiliatesPage() {
  const [language] = useLanguage();
  const copy = t[language] || t.en;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main style={{ background: '#FFFBEE', minHeight: '100vh' }}>

      {/* nav */}
      <nav>
        <a href="/" className="brand">
          <div className="bmark">
            <svg viewBox="0 0 32 42" width="18" height="24">
              <path d="M16 2 C8 2 4 8 4 16 C4 26 16 38 16 38 C16 38 28 26 28 16 C28 8 24 2 16 2Z" fill="#C4837A"/>
              <ellipse cx="12" cy="14" rx="2.5" ry="3" fill="white" opacity="0.9"/>
              <ellipse cx="20" cy="14" rx="2.5" ry="3" fill="white" opacity="0.9"/>
              <ellipse cx="12" cy="14.5" rx="1.2" ry="1.8" fill="#3A2010"/>
              <ellipse cx="20" cy="14.5" rx="1.2" ry="1.8" fill="#3A2010"/>
              <ellipse cx="16" cy="20" rx="3" ry="2" fill="white" opacity="0.7"/>
              <path d="M14 22 Q16 24 18 22" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
            </svg>
          </div>
          <div className="bname"><em>fur</em><span>brief</span></div>
        </a>
        <div className="nav-r">
          <a href="/about" style={{ fontSize: 13, fontWeight: 700, color: '#8A6840', textDecoration: 'none', padding: '6px 4px' }}>about</a>
          <a href="/upload" className="nav-cta">
            <span className="nav-cta-label">{copy.nav_cta}</span>
            <span className="nprice">$6</span>
          </a>
        </div>
      </nav>

      {/* hero */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '60px 5% 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 32 }}>
          <div style={{ flexShrink: 0 }}>
            <CatSvg size={90} />
          </div>
          <div>
            <div className="sec-ey" style={{ marginBottom: 10 }}>{copy.eyebrow}</div>
            <h1 style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 'clamp(26px,4vw,42px)', color: '#3A2010', lineHeight: 1.15, marginBottom: 14 }}>
              {copy.h1}
            </h1>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#8A6840', lineHeight: 1.7, marginBottom: 24 }}>
              {copy.sub}
            </p>
            <a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#C4837A', color: '#fff', borderRadius: 50, padding: '13px 28px', fontFamily: 'Fredoka One, sans-serif', fontSize: 16, textDecoration: 'none' }}>
              {copy.cta}
            </a>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section style={{ background: '#FFF6DC', borderTop: '2px solid #E8D098', borderBottom: '2px solid #E8D098', padding: '48px 5%' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="sec-ey" style={{ marginBottom: 24 }}>{copy.how_h}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {copy.steps.map(step => (
              <div key={step.n} style={{ background: '#fff', borderRadius: 20, padding: '24px 20px', border: '1.5px solid #E8D098' }}>
                <div style={{ width: 36, height: 36, background: '#C4837A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 18, color: '#fff' }}>{step.n}</span>
                </div>
                <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 17, color: '#3A2010', marginBottom: 8 }}>{step.t}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#8A6840', lineHeight: 1.6 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* who it's for */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 5%' }}>
        <div className="sec-ey" style={{ marginBottom: 20 }}>{copy.who_h}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {copy.who.map(w => (
            <div key={w.t} style={{ background: '#FFF6DC', borderRadius: 20, padding: '20px', border: '1.5px solid #E8D098' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{w.icon}</div>
              <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 15, color: '#3A2010', marginBottom: 6 }}>{w.t}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#8A6840', lineHeight: 1.6 }}>{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* faq */}
      <section style={{ background: '#FCF0C8', borderTop: '2px solid #E8D098', borderBottom: '2px solid #E8D098', padding: '48px 5%' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="sec-ey" style={{ marginBottom: 24 }}>{copy.faq_h}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {copy.faqs.map(faq => (
              <div key={faq.q} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1.5px solid #E8D098' }}>
                <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 16, color: '#C4837A', marginBottom: 6 }}>{faq.q}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#3A2010', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* bottom CTA */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '56px 5% 80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 'clamp(22px,3vw,32px)', color: '#3A2010', marginBottom: 10 }}>
          {copy.bottom_h}
        </h2>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#8A6840', marginBottom: 28 }}>{copy.bottom_sub}</p>
        <a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: '#C4837A', color: '#fff', borderRadius: 50, padding: '15px 36px', fontFamily: 'Fredoka One, sans-serif', fontSize: 17, textDecoration: 'none' }}>
          {copy.cta}
        </a>
      </section>

      <Footer />
    </main>
  );
}
