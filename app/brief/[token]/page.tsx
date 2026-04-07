import { supabaseAdmin } from '../../../lib/supabase';
import BriefPageClient from '../../../components/BriefPageClient';
import { labels, languageNames } from '../../../i18n/strings';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const { data, error } = await (supabaseAdmin() as any)
    .from('briefs')
    .select('orders(pet_name, language)')
    .eq('token', params.token)
    .single();

  if (error || !data || !data.orders) return { title: 'Furbrief' };

  return {
    title: `${data.orders.pet_name}'s furbrief is ready`,
    openGraph: {
      title: `${data.orders.pet_name}'s furbrief is ready`,
      images: ['/og-image.png'],
    },
  };
}

const urgencyConfig = {
  call_now:        { border: '#C4837A', bg: '#F9E8E4', iconBg: '#C4837A', icon: '⚠️', labelKey: 'callNow' as const },
  watch_closely:   { border: '#ECC888', bg: '#FEF9EE', iconBg: '#D4A030', icon: '👁',  labelKey: 'watchClosely' as const },
  mention_at_checkup: { border: '#E8D098', bg: '#FFFBEE', iconBg: '#B8866A', icon: 'ℹ️', labelKey: 'mention' as const },
};

export default async function BriefPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const { data, error } = await (supabaseAdmin() as any)
    .from('briefs')
    .select('token, day_schedule, medications, warning_signs, normal_things, follow_up, orders(pet_name, species, surgery_type, language)')
    .eq('token', token)
    .single();

  if (error || !data || !data.orders) {
    return (
      <main style={{ background: '#FFFBEE', minHeight: '100vh', padding: '80px 5%' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-h1">furbrief not found</h1>
          <p className="hero-sub" style={{ marginTop: 12, marginBottom: 24 }}>we couldn't find that furbrief. please check the link or start a new upload.</p>
          <a href="/upload" className="cbtn" style={{ display: 'inline-flex' }}>get a new furbrief</a>
        </div>
      </main>
    );
  }

  const language = (data.orders.language || 'en') as 'en' | 'es' | 'ko' | 'zh';
  const labelSet = labels[language];
  const { day_schedule, medications, warning_signs, normal_things, follow_up } = data;
  const petName = data.orders.pet_name;

  return (
    <main style={{ background: '#FFFBEE', minHeight: '100vh', padding: '40px 5% 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div id="furbrief-content">

          {/* header */}
          <div style={{ marginBottom: 32 }}>
            <div className="sec-ey">{petName}'s furbrief</div>
            <h1 style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 'clamp(28px,4vw,44px)', color: '#3A2010', lineHeight: 1.15, marginBottom: 6 }}>
              {petName}'s recovery plan
            </h1>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#8A6840' }}>
              {languageNames[language]} furbrief · {data.orders.species}
            </p>
          </div>

          {/* day schedule */}
          <section style={{ background: '#FFF6DC', borderRadius: 28, overflow: 'hidden', marginBottom: 20, border: '2px solid #E8D098' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E8D098', background: '#FCF0C8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 13, background: '#B8866A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 20, color: '#3A2010' }}>{labelSet.schedule}</p>
              </div>
            </div>
            <div style={{ padding: '4px 0 8px' }}>
              {day_schedule.map((item: { period: string; instructions: string[] }, i: number) => (
                <div key={item.period} style={{ padding: '14px 24px', borderBottom: i < day_schedule.length - 1 ? '1px solid #ECC888' : 'none' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, background: '#B8866A', color: '#fff', padding: '3px 10px', borderRadius: 50, whiteSpace: 'nowrap', marginTop: 2, flexShrink: 0, fontFamily: 'Nunito, sans-serif' }}>
                      {item.period}
                    </span>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {item.instructions.map((ins: string, j: number) => (
                        <li key={j} style={{ fontSize: 15, color: '#3A2010', lineHeight: 1.6, fontWeight: 600, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <span style={{ color: '#B8866A', marginTop: 4, flexShrink: 0, fontSize: 12 }}>●</span>
                          {ins}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* medications */}
          <section style={{ marginBottom: 20 }}>
            <div className="sec-ey" style={{ marginBottom: 14 }}>{labelSet.meds}</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {medications.map((med: any) => (
                <div key={med.name} style={{ background: '#fff', borderRadius: 24, padding: '20px 24px', border: '2px solid #F9E8E4', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 18, color: '#C4837A', marginBottom: 6 }}>{med.name}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#3A2010', marginBottom: 12 }}>
                    {med.dose} · {med.frequency} · {med.duration}
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: med.notes ? 12 : 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#FAE0B8', color: '#8A5A40', padding: '3px 10px', borderRadius: 8, fontFamily: 'monospace' }}>
                      {med.clinical_name}
                    </span>
                    {med.with_food && (
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#E4F4EC', color: '#3D7A58', padding: '3px 10px', borderRadius: 50 }}>
                        with food
                      </span>
                    )}
                  </div>
                  {med.notes && (
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#8A6840', marginTop: 8, paddingTop: 10, borderTop: '1px solid #FAE0B8' }}>
                      {med.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* warning signs */}
          <section style={{ marginBottom: 20 }}>
            <div className="sec-ey" style={{ marginBottom: 14 }}>{labelSet.warnings}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {warning_signs.map((w: any) => {
                const cfg = urgencyConfig[w.urgency as keyof typeof urgencyConfig] || urgencyConfig.mention_at_checkup;
                return (
                  <div key={w.sign} style={{ background: cfg.bg, borderRadius: 20, padding: '16px 20px', border: `2px solid ${cfg.border}`, display: 'flex', gap: 14, alignItems: 'flex-start', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 12, background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {cfg.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#3A2010', marginBottom: 4 }}>{w.sign}</p>
                      <p style={{ fontSize: 12, fontWeight: 800, color: cfg.iconBg, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                        {labelSet[cfg.labelKey]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* don't panic */}
          <section style={{ marginBottom: 20 }}>
            <div className="sec-ey" style={{ marginBottom: 14 }}>{labelSet.normal}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {normal_things.map((item: string) => (
                <div key={item} style={{ background: '#E4F4EC', borderRadius: 20, padding: '16px 20px', border: '2px solid #B8E4CA', display: 'flex', gap: 14, alignItems: 'flex-start', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 50, background: '#6BA888', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1A3325', lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* follow up */}
          <section style={{ marginBottom: 40 }}>
            <div style={{ background: '#FCF0C8', borderRadius: 20, padding: '20px 24px', border: '2px solid #E8D098' }}>
              <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 16, color: '#8A5A40', marginBottom: 6 }}>follow-up appointment</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#3A2010', marginBottom: 6 }}>{follow_up.when}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#8A6840' }}>{follow_up.notes}</p>
            </div>
          </section>

        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* share + download */}
          <BriefPageClient shareToken={token} language={language} />

          {/* insurance strip */}
          <div style={{ background: '#E4F4EC', borderRadius: 24, padding: '20px 20px 16px', border: '2px solid #B8E4CA' }}>
            <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 13, border: '2px solid #B8E4CA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D7A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 15, color: '#2D5A3D', marginBottom: 6, lineHeight: 1.3 }}>
              surgery like this typically costs $2,000–$6,000 without insurance
            </p>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#3D7A58', lineHeight: 1.6, marginBottom: 14 }}>
              most owners consider insurance after their first emergency. this furbrief is a simple shareable recovery plan while you decide.
            </p>
            <a href="#" style={{ display: 'block', background: '#3D7A58', color: '#fff', borderRadius: 50, padding: '10px 16px', fontFamily: 'Fredoka One, sans-serif', fontSize: 13, textAlign: 'center', textDecoration: 'none', marginBottom: 8 }}>
              compare pet insurance →
            </a>
          </div>

          {/* get another furbrief */}
          <a href="/upload" style={{ display: 'block', background: '#C4837A', color: '#fff', borderRadius: 50, padding: '13px 16px', fontFamily: 'Fredoka One, sans-serif', fontSize: 15, textAlign: 'center', textDecoration: 'none' }}>
            get a furbrief for another pet →
          </a>

        </aside>
      </div>
    </main>
  );
}
