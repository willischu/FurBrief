'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

const langLabels: Record<string, string> = {
  en: 'English', es: 'Español', ko: '한국어', zh: '中文',
};

const t = {
  en: {
    updated: 'last updated April 2026',
    title: 'privacy policy',
    intro: 'Furbrief is a simple, one-time tool. We collect only what we need to generate your care plan and nothing more.',
    s1_title: 'What we collect',
    s1_intro: 'When you use Furbrief, we collect:',
    s1_l1: 'Your discharge document — the PDF, photo, or text you upload. This is stored temporarily in our secure file storage and permanently deleted immediately after your furbrief is generated.',
    s1_l2: 'Pet details — your pet\'s name, species, and optional surgery type. These are used to personalise your care plan.',
    s1_l3: 'Your email address — collected by Stripe at checkout and used only to email you a link to your furbrief. We do not use it for marketing.',
    s1_l4: 'Your language preference — used to generate your furbrief in the correct language.',
    s1_l5: 'Payment information — handled entirely by Stripe. We never see or store your card details.',
    s1_l6: 'IP address — recorded temporarily to enforce upload rate limits (maximum 10 uploads per IP per hour). Not linked to your identity.',
    s2_title: 'What we do NOT collect',
    s2_l1: 'We do not require an account or login.',
    s2_l2: 'We do not use tracking pixels, advertising cookies, or third-party analytics.',
    s2_l3: 'We do not sell, share, or rent your data to any third party.',
    s2_l4: 'We do not store your discharge document after processing is complete.',
    s3_title: 'How your document is processed',
    s3_p1: 'After payment, your discharge document is sent to Anthropic\'s Claude API for translation into plain language. Anthropic\'s API processes your document in-memory and does not store it. Your document is deleted from our storage immediately after the furbrief is generated, regardless of success or failure.',
    s3_p2: 'The resulting furbrief is stored in our database and accessible via a private, unguessable link. Only someone with that link can view it.',
    s4_title: 'How long we keep your data',
    s4_l1: 'Your discharge document: deleted immediately after processing (within minutes of payment).',
    s4_l2: 'Your furbrief content: stored indefinitely so your share link continues to work. Email us to request deletion.',
    s4_l3: 'Order records (pet name, species, language, email): retained for customer support and refund purposes.',
    s4_l4: 'IP rate limit records: automatically cleared hourly.',
    s5_title: 'Third-party services',
    s5_intro: 'Furbrief uses the following third-party services:',
    s5_l1: 'Stripe — payment processing.',
    s5_l2: 'Supabase — database and file storage. Data is stored in the United States.',
    s5_l3: 'Anthropic — AI document translation.',
    s5_l4: 'Resend — transactional email delivery of your furbrief link.',
    s6_title: 'Your rights',
    s6_intro: 'You have the right to:',
    s6_l1: 'Request a copy of any personal data we hold about you.',
    s6_l2: 'Request deletion of your furbrief and associated order data.',
    s6_l3: 'Request a refund if your furbrief failed to generate.',
    s6_contact: 'To exercise any of these rights, email us at',
    s7_title: 'Not medical advice',
    s7_p: 'Furbrief is an AI-assisted translation tool. The information in your furbrief comes directly from your vet\'s discharge papers and is not veterinary advice. It does not replace professional veterinary care. In an emergency, always contact your vet or an emergency animal hospital immediately.',
    s8_title: 'Changes to this policy',
    s8_p: 'If we make material changes to this policy, we will update the date at the top of this page. Continued use of Furbrief after changes are posted constitutes acceptance of the updated policy.',
    contact_q: 'Questions? Email us at',
    contact_note: 'We\'re a small team and will respond within 48 hours.',
  },
  es: {
    updated: 'última actualización abril 2026',
    title: 'política de privacidad',
    intro: 'Furbrief es una herramienta sencilla de uso único. Solo recopilamos lo necesario para generar tu plan de cuidados.',
    s1_title: 'Qué recopilamos',
    s1_intro: 'Cuando usas Furbrief, recopilamos:',
    s1_l1: 'Tu documento de alta — el PDF, foto o texto que subes. Se almacena temporalmente y se elimina permanentemente después de generar tu furbrief.',
    s1_l2: 'Datos de tu mascota — nombre, especie y tipo de cirugía (opcional). Se usan para personalizar tu plan de cuidados.',
    s1_l3: 'Tu correo electrónico — recopilado por Stripe al pagar y usado solo para enviarte el enlace a tu furbrief. No lo usamos para marketing.',
    s1_l4: 'Tu preferencia de idioma — usada para generar tu furbrief en el idioma correcto.',
    s1_l5: 'Información de pago — gestionada íntegramente por Stripe. Nunca vemos ni almacenamos los datos de tu tarjeta.',
    s1_l6: 'Dirección IP — registrada temporalmente para limitar subidas (máximo 10 por IP por hora). No está vinculada a tu identidad.',
    s2_title: 'Qué NO recopilamos',
    s2_l1: 'No requerimos cuenta ni inicio de sesión.',
    s2_l2: 'No usamos píxeles de seguimiento, cookies publicitarias ni analíticas de terceros.',
    s2_l3: 'No vendemos, compartimos ni alquilamos tus datos a ningún tercero.',
    s2_l4: 'No guardamos tu documento de alta una vez procesado.',
    s3_title: 'Cómo se procesa tu documento',
    s3_p1: 'Tras el pago, tu documento se envía a la API Claude de Anthropic para su traducción. La API lo procesa en memoria y no lo almacena. El documento se elimina de nuestro almacenamiento inmediatamente después de generar tu furbrief, independientemente de si tuvo éxito o no.',
    s3_p2: 'El furbrief resultante se guarda en nuestra base de datos y es accesible mediante un enlace privado e impredecible. Solo quien tenga ese enlace puede verlo.',
    s4_title: 'Cuánto tiempo guardamos tus datos',
    s4_l1: 'Tu documento de alta: eliminado inmediatamente tras procesarlo (minutos después del pago).',
    s4_l2: 'El contenido de tu furbrief: guardado indefinidamente para que el enlace siga funcionando. Escríbenos para solicitar su eliminación.',
    s4_l3: 'Registros del pedido (nombre, especie, idioma, email): conservados para atención al cliente y reembolsos.',
    s4_l4: 'Registros de límite de IP: se borran automáticamente cada hora.',
    s5_title: 'Servicios de terceros',
    s5_intro: 'Furbrief usa los siguientes servicios de terceros:',
    s5_l1: 'Stripe — procesamiento de pagos.',
    s5_l2: 'Supabase — base de datos y almacenamiento. Los datos se guardan en Estados Unidos.',
    s5_l3: 'Anthropic — traducción de documentos con IA.',
    s5_l4: 'Resend — envío de correos transaccionales con el enlace a tu furbrief.',
    s6_title: 'Tus derechos',
    s6_intro: 'Tienes derecho a:',
    s6_l1: 'Solicitar una copia de los datos personales que tenemos sobre ti.',
    s6_l2: 'Solicitar la eliminación de tu furbrief y los datos del pedido.',
    s6_l3: 'Solicitar un reembolso si tu furbrief no se generó correctamente.',
    s6_contact: 'Para ejercer cualquiera de estos derechos, escríbenos a',
    s7_title: 'No es consejo médico',
    s7_p: 'Furbrief es una herramienta de traducción asistida por IA. La información proviene directamente de los papeles de alta de tu veterinario y no constituye consejo veterinario. No reemplaza la atención profesional. En caso de emergencia, contacta a tu vet o un hospital de animales de urgencias.',
    s8_title: 'Cambios en esta política',
    s8_p: 'Si realizamos cambios significativos, actualizaremos la fecha en la parte superior de esta página. El uso continuado de Furbrief tras publicar los cambios implica la aceptación de la política actualizada.',
    contact_q: '¿Preguntas? Escríbenos a',
    contact_note: 'Somos un equipo pequeño y responderemos en menos de 48 horas.',
  },
  ko: {
    updated: '최종 업데이트: 2026년 4월',
    title: '개인정보처리방침',
    intro: '퍼브리프는 간단한 일회성 도구입니다. 케어 플랜 생성에 필요한 정보만 수집합니다.',
    s1_title: '수집하는 정보',
    s1_intro: '퍼브리프를 사용하면 다음 정보를 수집합니다:',
    s1_l1: '퇴원 서류 — 업로드한 PDF, 사진, 텍스트. 퍼브리프 생성 후 즉시 영구 삭제됩니다.',
    s1_l2: '반려동물 정보 — 이름, 종류, 수술 유형(선택). 케어 플랜 맞춤화에 사용됩니다.',
    s1_l3: '이메일 주소 — Stripe 결제 시 수집되며 퍼브리프 링크 전송에만 사용됩니다. 마케팅에 사용하지 않습니다.',
    s1_l4: '언어 설정 — 올바른 언어로 퍼브리프를 생성하는 데 사용됩니다.',
    s1_l5: '결제 정보 — Stripe가 전적으로 처리합니다. 카드 정보는 저장하지 않습니다.',
    s1_l6: 'IP 주소 — 업로드 횟수 제한(시간당 최대 10회)을 위해 임시 기록됩니다. 신원과는 연결되지 않습니다.',
    s2_title: '수집하지 않는 정보',
    s2_l1: '계정이나 로그인이 필요하지 않습니다.',
    s2_l2: '추적 픽셀, 광고 쿠키, 제3자 분석 도구를 사용하지 않습니다.',
    s2_l3: '어떤 제3자에게도 데이터를 판매하거나 공유하지 않습니다.',
    s2_l4: '처리 완료 후 퇴원 서류를 저장하지 않습니다.',
    s3_title: '문서 처리 방식',
    s3_p1: '결제 후 퇴원 서류는 Anthropic의 Claude API로 전송되어 번역됩니다. API는 메모리 내에서만 처리하며 저장하지 않습니다. 성공 여부와 관계없이 퍼브리프 생성 직후 서류는 삭제됩니다.',
    s3_p2: '생성된 퍼브리프는 데이터베이스에 저장되며 추측하기 어려운 비공개 링크로만 접근 가능합니다. 해당 링크를 가진 사람만 볼 수 있습니다.',
    s4_title: '데이터 보관 기간',
    s4_l1: '퇴원 서류: 처리 직후(결제 후 수 분 내) 삭제됩니다.',
    s4_l2: '퍼브리프 내용: 공유 링크가 계속 작동하도록 무기한 저장됩니다. 삭제를 원하시면 이메일로 문의하세요.',
    s4_l3: '주문 기록(이름, 종류, 언어, 이메일): 고객 지원 및 환불 처리를 위해 보관됩니다.',
    s4_l4: 'IP 제한 기록: 매 시간 자동으로 초기화됩니다.',
    s5_title: '제3자 서비스',
    s5_intro: '퍼브리프는 다음 제3자 서비스를 사용합니다:',
    s5_l1: 'Stripe — 결제 처리.',
    s5_l2: 'Supabase — 데이터베이스 및 파일 저장소. 데이터는 미국에 저장됩니다.',
    s5_l3: 'Anthropic — AI 문서 번역.',
    s5_l4: 'Resend — 퍼브리프 링크 이메일 발송.',
    s6_title: '귀하의 권리',
    s6_intro: '귀하는 다음 권리를 가집니다:',
    s6_l1: '당사가 보유한 개인정보 사본 요청.',
    s6_l2: '퍼브리프 및 관련 주문 데이터 삭제 요청.',
    s6_l3: '퍼브리프 생성 실패 시 환불 요청.',
    s6_contact: '이 권리들을 행사하려면 다음으로 이메일을 보내주세요',
    s7_title: '의료 조언 아님',
    s7_p: '퍼브리프는 AI 번역 도구입니다. 내용은 수의사의 퇴원 서류에서 직접 가져온 것이며 수의학적 조언이 아닙니다. 전문 수의 치료를 대체하지 않습니다. 응급 상황에서는 즉시 수의사나 응급 동물 병원에 연락하세요.',
    s8_title: '방침 변경',
    s8_p: '중요한 변경이 있을 경우 페이지 상단의 날짜를 업데이트합니다. 변경 후 계속 사용하면 업데이트된 방침에 동의한 것으로 간주됩니다.',
    contact_q: '문의사항이 있으신가요?',
    contact_note: '소규모 팀이지만 48시간 이내에 답변 드리겠습니다.',
  },
  zh: {
    updated: '最后更新：2026年4月',
    title: '隐私政策',
    intro: '毛简报是一款简单的一次性工具。我们只收集生成您的护理计划所需的信息。',
    s1_title: '我们收集的信息',
    s1_intro: '使用毛简报时，我们会收集：',
    s1_l1: '您的出院文件 — 您上传的PDF、照片或文本。文件临时存储，在毛简报生成后立即永久删除。',
    s1_l2: '宠物信息 — 宠物的名字、种类和手术类型（可选）。用于个性化护理计划。',
    s1_l3: '您的电子邮件地址 — 由Stripe在结账时收集，仅用于向您发送毛简报链接。不用于营销。',
    s1_l4: '语言偏好 — 用于以正确语言生成毛简报。',
    s1_l5: '支付信息 — 完全由Stripe处理。我们从不查看或存储您的卡片信息。',
    s1_l6: 'IP地址 — 临时记录以限制上传频率（每IP每小时最多10次）。不与您的身份关联。',
    s2_title: '我们不收集的信息',
    s2_l1: '我们不要求账户或登录。',
    s2_l2: '我们不使用跟踪像素、广告Cookie或第三方分析工具。',
    s2_l3: '我们不向任何第三方出售、共享或出租您的数据。',
    s2_l4: '处理完成后我们不存储您的出院文件。',
    s3_title: '文件处理方式',
    s3_p1: '付款后，您的出院文件将发送至Anthropic的Claude API进行翻译。API在内存中处理文件，不进行存储。无论成功与否，毛简报生成后文件将立即从我们的存储中删除。',
    s3_p2: '生成的毛简报存储在我们的数据库中，只能通过私密的难以猜测的链接访问。只有拥有该链接的人才能查看。',
    s4_title: '数据保留时间',
    s4_l1: '您的出院文件：处理后立即删除（付款后数分钟内）。',
    s4_l2: '毛简报内容：无限期存储以确保分享链接持续有效。如需删除，请发送邮件联系我们。',
    s4_l3: '订单记录（宠物名称、种类、语言、邮箱）：保留用于客户支持和退款处理。',
    s4_l4: 'IP限制记录：每小时自动清除。',
    s5_title: '第三方服务',
    s5_intro: '毛简报使用以下第三方服务：',
    s5_l1: 'Stripe — 支付处理。',
    s5_l2: 'Supabase — 数据库和文件存储。数据存储在美国。',
    s5_l3: 'Anthropic — AI文档翻译。',
    s5_l4: 'Resend — 毛简报链接的事务性邮件发送。',
    s6_title: '您的权利',
    s6_intro: '您有权：',
    s6_l1: '请求获取我们持有的您的个人数据副本。',
    s6_l2: '请求删除您的毛简报及相关订单数据。',
    s6_l3: '如毛简报生成失败，请求退款。',
    s6_contact: '如需行使上述权利，请发送邮件至',
    s7_title: '非医疗建议',
    s7_p: '毛简报是一款AI辅助翻译工具。毛简报中的信息直接来自您兽医的出院文件，不构成兽医建议。它不能替代专业兽医护理。如遇紧急情况，请立即联系您的兽医或紧急动物医院。',
    s8_title: '政策变更',
    s8_p: '如果我们对本政策做出重大变更，将在页面顶部更新日期。变更发布后继续使用毛简报即表示接受更新后的政策。',
    contact_q: '有问题？请发邮件至',
    contact_note: '我们是一支小团队，将在48小时内回复。',
  },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 36 }}>
    <h2 style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 22, color: '#3A2010', marginBottom: 12 }}>{title}</h2>
    <div style={{ fontSize: 15, color: '#5A3A20', lineHeight: 1.8, fontWeight: 600 }}>{children}</div>
  </section>
);

export default function PrivacyPage() {
  const [language, setLanguage] = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const c = t[language];

  return (
    <main style={{ background: '#FFFBEE', minHeight: '100vh' }}>
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
          <span className="bname"><em>fur</em>brief</span>
        </a>
        <div className="nav-r">
          <div className="lang-wrap">
            <button className="globe-btn" type="button" onClick={() => setShowLangMenu(!showLangMenu)}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span suppressHydrationWarning>{language.toUpperCase()}</span>
            </button>
            <div className={`ldrop ${showLangMenu ? 'open' : ''}`}>
              {(['en', 'es', 'ko', 'zh'] as const).map((key) => (
                <button
                  key={key}
                  className={`lopt ${language === key ? 'active' : ''} ${key === 'ko' ? 'ko' : key === 'zh' ? 'zh' : ''}`}
                  type="button"
                  onClick={() => { setLanguage(key); setShowLangMenu(false); }}
                >
                  {langLabels[key]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 24px 80px' }}>

        <div style={{ marginBottom: 40 }}>
          <div className="eyebrow">
            <div className="eyebrow-dot" />
            <span className="eyebrow-text" suppressHydrationWarning>{c.updated}</span>
          </div>
          <h1 style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 'clamp(28px,4vw,40px)', color: '#3A2010', marginTop: 12, marginBottom: 12 }} suppressHydrationWarning>
            {c.title}
          </h1>
          <p style={{ fontSize: 15, color: '#8A6840', fontWeight: 600, lineHeight: 1.7 }} suppressHydrationWarning>
            {c.intro}
          </p>
        </div>

        <Section title={c.s1_title}>
          <p style={{ marginBottom: 12 }} suppressHydrationWarning>{c.s1_intro}</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li suppressHydrationWarning>{c.s1_l1}</li>
            <li suppressHydrationWarning>{c.s1_l2}</li>
            <li suppressHydrationWarning>{c.s1_l3}</li>
            <li suppressHydrationWarning>{c.s1_l4}</li>
            <li suppressHydrationWarning>{c.s1_l5}</li>
            <li suppressHydrationWarning>{c.s1_l6}</li>
          </ul>
        </Section>

        <Section title={c.s2_title}>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li suppressHydrationWarning>{c.s2_l1}</li>
            <li suppressHydrationWarning>{c.s2_l2}</li>
            <li suppressHydrationWarning>{c.s2_l3}</li>
            <li suppressHydrationWarning>{c.s2_l4}</li>
          </ul>
        </Section>

        <Section title={c.s3_title}>
          <p style={{ marginBottom: 12 }} suppressHydrationWarning>{c.s3_p1}</p>
          <p suppressHydrationWarning>{c.s3_p2}</p>
        </Section>

        <Section title={c.s4_title}>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li suppressHydrationWarning>{c.s4_l1}</li>
            <li suppressHydrationWarning>{c.s4_l2}</li>
            <li suppressHydrationWarning>{c.s4_l3}</li>
            <li suppressHydrationWarning>{c.s4_l4}</li>
          </ul>
        </Section>

        <Section title={c.s5_title}>
          <p style={{ marginBottom: 12 }} suppressHydrationWarning>{c.s5_intro}</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li suppressHydrationWarning>{c.s5_l1} <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#C4837A' }}>Stripe privacy policy</a></li>
            <li suppressHydrationWarning>{c.s5_l2}</li>
            <li suppressHydrationWarning>{c.s5_l3} <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#C4837A' }}>Anthropic privacy policy</a></li>
            <li suppressHydrationWarning>{c.s5_l4}</li>
          </ul>
        </Section>

        <Section title={c.s6_title}>
          <p style={{ marginBottom: 12 }} suppressHydrationWarning>{c.s6_intro}</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li suppressHydrationWarning>{c.s6_l1}</li>
            <li suppressHydrationWarning>{c.s6_l2}</li>
            <li suppressHydrationWarning>{c.s6_l3}</li>
          </ul>
          <p style={{ marginTop: 12 }} suppressHydrationWarning>
            {c.s6_contact}{' '}
            <a href="https://mail.google.com/mail/?view=cm&to=furbrief@proton.me" target="_blank" rel="noopener noreferrer" style={{ color: '#C4837A', fontWeight: 700 }}>
              furbrief@proton.me
            </a>.
          </p>
        </Section>

        <Section title={c.s7_title}>
          <p suppressHydrationWarning>{c.s7_p}</p>
        </Section>

        <Section title={c.s8_title}>
          <p suppressHydrationWarning>{c.s8_p}</p>
        </Section>

        <div style={{ background: '#FCF0C8', borderRadius: 20, padding: '20px 24px', border: '2px solid #E8D098' }}>
          <p style={{ fontSize: 13, color: '#8A5A40', fontWeight: 700, lineHeight: 1.7, margin: 0 }} suppressHydrationWarning>
            {c.contact_q}{' '}
            <a href="https://mail.google.com/mail/?view=cm&to=furbrief@proton.me" target="_blank" rel="noopener noreferrer" style={{ color: '#C4837A' }}>
              furbrief@proton.me
            </a>. {c.contact_note}
          </p>
        </div>

      </div>

      <Footer />
    </main>
  );
}
