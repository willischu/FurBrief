import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy — Furbrief',
  description: 'What data Furbrief collects, how it is used, and when it is deleted.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 36 }}>
    <h2 style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 22, color: '#3A2010', marginBottom: 12 }}>{title}</h2>
    <div style={{ fontSize: 15, color: '#5A3A20', lineHeight: 1.8, fontWeight: 600 }}>{children}</div>
  </section>
);

export default function PrivacyPage() {
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
      </nav>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 24px 80px' }}>

        <div style={{ marginBottom: 40 }}>
          <div className="eyebrow">
            <div className="eyebrow-dot" />
            <span className="eyebrow-text">last updated April 2026</span>
          </div>
          <h1 style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 'clamp(28px,4vw,40px)', color: '#3A2010', marginTop: 12, marginBottom: 12 }}>
            privacy policy
          </h1>
          <p style={{ fontSize: 15, color: '#8A6840', fontWeight: 600, lineHeight: 1.7 }}>
            Furbrief is a simple, one-time tool. We collect only what we need to generate your care plan and nothing more.
          </p>
        </div>

        <Section title="What we collect">
          <p style={{ marginBottom: 12 }}>When you use Furbrief, we collect:</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong>Your discharge document</strong> — the PDF, photo, or text you upload. This is stored temporarily in our secure file storage and permanently deleted immediately after your furbrief is generated.</li>
            <li><strong>Pet details</strong> — your pet's name, species, and optional surgery type. These are used to personalise your care plan.</li>
            <li><strong>Your email address</strong> — collected by Stripe at checkout and used only to email you a link to your furbrief. We do not use it for marketing.</li>
            <li><strong>Your language preference</strong> — used to generate your furbrief in the correct language.</li>
            <li><strong>Payment information</strong> — handled entirely by Stripe. We never see or store your card details.</li>
            <li><strong>IP address</strong> — recorded temporarily to enforce upload rate limits (maximum 10 uploads per IP per hour). Not linked to your identity.</li>
          </ul>
        </Section>

        <Section title="What we do NOT collect">
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>We do not require an account or login.</li>
            <li>We do not use tracking pixels, advertising cookies, or third-party analytics.</li>
            <li>We do not sell, share, or rent your data to any third party.</li>
            <li>We do not store your discharge document after processing is complete.</li>
          </ul>
        </Section>

        <Section title="How your document is processed">
          <p style={{ marginBottom: 12 }}>
            After payment, your discharge document is sent to Anthropic's Claude API for translation into plain language. Anthropic's API processes your document in-memory and does not store it. Your document is deleted from our storage immediately after the furbrief is generated, regardless of success or failure.
          </p>
          <p>
            The resulting furbrief is stored in our database and accessible via a private, unguessable link. Only someone with that link can view it.
          </p>
        </Section>

        <Section title="How long we keep your data">
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong>Your discharge document:</strong> deleted immediately after processing (within minutes of payment).</li>
            <li><strong>Your furbrief content:</strong> stored indefinitely so your share link continues to work. Email us to request deletion.</li>
            <li><strong>Order records</strong> (pet name, species, language, email): retained for customer support and refund purposes.</li>
            <li><strong>IP rate limit records:</strong> automatically cleared hourly.</li>
          </ul>
        </Section>

        <Section title="Third-party services">
          <p style={{ marginBottom: 12 }}>Furbrief uses the following third-party services:</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong>Stripe</strong> — payment processing. Subject to <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#C4837A' }}>Stripe's privacy policy</a>.</li>
            <li><strong>Supabase</strong> — database and file storage. Data is stored in the United States.</li>
            <li><strong>Anthropic</strong> — AI document translation. Subject to <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#C4837A' }}>Anthropic's privacy policy</a>.</li>
            <li><strong>Resend</strong> — transactional email delivery of your furbrief link.</li>
          </ul>
        </Section>

        <Section title="Your rights">
          <p style={{ marginBottom: 12 }}>You have the right to:</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Request a copy of any personal data we hold about you.</li>
            <li>Request deletion of your furbrief and associated order data.</li>
            <li>Request a refund if your furbrief failed to generate.</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            To exercise any of these rights, email us at{' '}
            <a href="https://mail.google.com/mail/?view=cm&to=furbrief@proton.me" target="_blank" rel="noopener noreferrer" style={{ color: '#C4837A', fontWeight: 700 }}>
              furbrief@proton.me
            </a>.
          </p>
        </Section>

        <Section title="Not medical advice">
          <p>
            Furbrief is an AI-assisted translation tool. The information in your furbrief comes directly from your vet's discharge papers and is not veterinary advice. It does not replace professional veterinary care. In an emergency, always contact your vet or an emergency animal hospital immediately.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we make material changes to this policy, we will update the date at the top of this page. Continued use of Furbrief after changes are posted constitutes acceptance of the updated policy.
          </p>
        </Section>

        <div style={{ background: '#FCF0C8', borderRadius: 20, padding: '20px 24px', border: '2px solid #E8D098' }}>
          <p style={{ fontSize: 13, color: '#8A5A40', fontWeight: 700, lineHeight: 1.7, margin: 0 }}>
            Questions? Email us at{' '}
            <a href="https://mail.google.com/mail/?view=cm&to=furbrief@proton.me" target="_blank" rel="noopener noreferrer" style={{ color: '#C4837A' }}>
              furbrief@proton.me
            </a>. We're a small team and will respond within 48 hours.
          </p>
        </div>

      </div>

      <Footer />
    </main>
  );
}
