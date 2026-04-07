import { footerStrings } from '../i18n/strings';

type Lang = 'en' | 'es' | 'ko' | 'zh';

export default function Footer({ language = 'en' }: { language?: Lang }) {
  const f = footerStrings[language];
  return (
    <footer>
      <div>
        <div className="fbrand">
          <em>fur</em>
          <span>brief</span>
        </div>
        <div className="ftag">{f.tag}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {f.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <p className="fdisc">{f.disc}</p>
    </footer>
  );
}
