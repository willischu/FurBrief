import { supabaseAdmin } from '../../../lib/supabase';
import BriefPageClient from '../../../components/BriefPageClient';
import { labels, languageNames } from '../../../i18n/strings';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const { data, error } = await (supabaseAdmin() as any)
    .from('orders')
    .select('pet_name, language')
    .eq('share_token', params.token)
    .single();

  if (error || !data) {
    return { title: 'Furbrief' };
  }

  return {
    title: `${data.pet_name}'s furbrief is ready`,
    openGraph: {
      title: `${data.pet_name}'s furbrief is ready`,
      images: ['/og-image.png'],
    },
  };
}

interface BriefData {
  orders: {
    pet_name: string;
    species: string;
    surgery_type: string | null;
    language: 'en' | 'es' | 'ko' | 'zh';
    share_token: string;
  };
  briefs: {
    day_schedule: Array<{ period: string; instructions: string[] }>;
    medications: Array<{
      name: string;
      clinical_name: string;
      dose: string;
      frequency: string;
      with_food: boolean;
      duration: string;
      notes: string;
    }>;
    warning_signs: Array<{ sign: string; urgency: 'call_now' | 'watch_closely' | 'mention_at_checkup' }>;
    normal_things: string[];
    follow_up: { when: string; notes: string };
  };
}

export default async function BriefPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const { data, error } = await (supabaseAdmin() as any)
    .from('orders')
    .select(
      `pet_name, species, surgery_type, language, share_token, briefs(day_schedule,medications,warning_signs,normal_things,follow_up)`
    )
    .eq('share_token', token)
    .single();

  if (error || !data || !data.briefs) {
    return (
      <main className="hero-outer dot-bg" style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-h1">furbrief not found</h1>
          <p className="hero-sub">We couldn't find that furbrief. Please check the link or start a new upload.</p>
          <a href="/upload" className="cbtn" style={{ display: 'inline-flex' }}>
            get a new furbrief
          </a>
        </div>
      </main>
    );
  }

  const briefData = Array.isArray(data.briefs) ? data.briefs[0] : data.briefs;
  if (!briefData) {
    return (
      <main className="hero-outer dot-bg" style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-h1">furbrief not available</h1>
          <p className="hero-sub">This furbrief is still processing, or it could not be retrieved yet.</p>
          <a href="/upload" className="cbtn" style={{ display: 'inline-flex' }}>
            get a new furbrief
          </a>
        </div>
      </main>
    );
  }

  const brief = briefData as BriefData['briefs'];
  const language = (data.language || 'en') as 'en' | 'es' | 'ko' | 'zh';
  const labelSet = labels[language];
  const followUp = brief.follow_up;

  return (
    <main className="hero-outer" style={{ background: '#FFFBEE', minHeight: '100vh', padding: '40px 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px' }}>
        <div id="furbrief-content">
          <div style={{ marginBottom: 24 }}>
            <p className="sec-ey">{data.pet_name}'s furbrief</p>
            <h1 className="sec-h" style={{ marginBottom: 8 }}>
              {data.pet_name}'s recovery plan
            </h1>
            <p className="hero-sub">{languageNames[language]} furbrief · {data.species}</p>
          </div>

          <section className="wcard big" style={{ borderColor: '#B8866A', background: '#3A2010' }}>
            <div>
              <div className="wico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="wname" style={{ color: '#fff' }}>{labelSet.schedule}</p>
              <p className="wdesc" style={{ color: 'rgba(255,255,255,.78)' }}>
                Your recovery schedule is written from your actual discharge papers and organized into clear daily guidance.
              </p>
            </div>
            <div className="dprev">
              {brief.day_schedule.map((item) => (
                <div key={item.period} className="dday">
                  <span className="ddtag">{item.period}</span>
                  <span className="ddtxt">{item.instructions.join(' ')}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 28 }}>
            <div className="sec-ey">{labelSet.meds}</div>
            <div style={{ display: 'grid', gap: 16 }}>
              {brief.medications.map((med) => (
                <div key={med.name} className="wcard rose-card">
                  <p className="wname">{med.name}</p>
                  <p className="wdesc" style={{ marginBottom: 10 }}>{med.dose} · {med.frequency} · {med.duration}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span className="jtag">{med.clinical_name}</span>
                    {med.with_food ? <span className="stag">with food</span> : null}
                  </div>
                  <p className="wdesc">{med.notes}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 28 }}>
            <div className="sec-ey">{labelSet.warnings}</div>
            <div style={{ display: 'grid', gap: 16 }}>
              {brief.warning_signs.map((warning) => {
                const variant =
                  warning.urgency === 'call_now'
                    ? { border: '2px solid #C4837A', icon: '⚠️' }
                    : warning.urgency === 'watch_closely'
                    ? { border: '2px solid #ECC888', icon: '👀' }
                    : { border: '2px solid #FCF0C8', icon: 'ℹ️' };
                return (
                  <div key={warning.sign} className="wcard honey-card" style={{ border: variant.border }}>
                    <p className="wname" style={{ color: '#8A6840' }}>
                      {variant.icon} {warning.sign}
                    </p>
                    <p className="wdesc">{warning.urgency === 'call_now' ? labelSet.callNow : warning.urgency === 'watch_closely' ? labelSet.watchClosely : labelSet.mention}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={{ marginTop: 28 }}>
            <div className="sec-ey">{labelSet.normal}</div>
            <div style={{ display: 'grid', gap: 16 }}>
              {brief.normal_things.map((item) => (
                <div key={item} className="wcard mint-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: '#6BA888', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>
                    ✓
                  </div>
                  <div>
                    <p className="wname" style={{ color: '#3D7A58', marginBottom: 6 }}>{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 28, marginBottom: 40 }}>
            <div className="wcard honey-card">
              <p className="wname">Follow-up</p>
              <p className="wdesc" style={{ marginBottom: 8 }}>
                {followUp.when}
              </p>
              <p className="wdesc">{followUp.notes}</p>
            </div>
          </section>
        </div>

        <aside style={{ position: 'relative' }}>
          <BriefPageClient shareToken={token} language={language} />
          <div className="ins" style={{ marginTop: 20 }}>
            <div className="ins-inner" style={{ display: 'block' }}>
              <div className="ins-ico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="ins-body">
                <p className="ins-t">surgery like this typically costs $2,000–$6,000 without insurance</p>
                <p className="ins-d">Most owners consider insurance after their first emergency. This furbrief is a simple shareable recovery plan while you decide.</p>
              </div>
              <a href="/upload" className="ins-btn">get a furbrief for another pet →</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
