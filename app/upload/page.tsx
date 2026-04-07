'use client';

import { useMemo, useRef, useState } from 'react';

const languages = [
  { value: 'en', label: 'English', className: '' },
  { value: 'es', label: 'Español', className: '' },
  { value: 'ko', label: '한국어', className: 'ko-p' },
  { value: 'zh', label: '中文', className: 'zh-p' },
] as const;

const speciesOptions = [
  { value: 'dog', label: 'dog' },
  { value: 'cat', label: 'cat' },
  { value: 'other', label: 'other' },
] as const;

export default function UploadPage() {
  const [step, setStep] = useState(1);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [textFallback, setTextFallback] = useState('');
  const [useTextFallback, setUseTextFallback] = useState(false);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [surgeryType, setSurgeryType] = useState('');
  const [language, setLanguage] = useState<'en' | 'es' | 'ko' | 'zh'>('en');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLanguage = useMemo(() => languages.find((item) => item.value === language), [language]);

  const clearFile = () => {
    setBlobUrl(null);
    setFileName('');
    setFileSize('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setCheckoutError('File must be 10MB or smaller.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    setCheckoutError(null);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Upload failed');
      setBlobUrl(data.blob_url);
      setFileName(file.name);
      setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      setCheckoutError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) await handleFile(event.dataTransfer.files[0]);
  };

  const handlePasteSubmit = async () => {
    if (!textFallback.trim()) {
      setCheckoutError('Please paste your text or upload a file.');
      return;
    }
    setIsLoading(true);
    setCheckoutError(null);
    const formData = new FormData();
    formData.append('text', textFallback.trim());
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Upload failed');
      setBlobUrl(data.blob_url);
      setFileName('pasted notes');
      setFileSize('text');
    } catch (error) {
      setCheckoutError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!blobUrl) { setCheckoutError('Please upload your papers first.'); return; }
    if (!petName.trim()) { setCheckoutError("Please tell us your pet's name."); setStep(2); return; }
    setIsLoading(true);
    setCheckoutError(null);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blobUrl, petName, species, surgeryType, language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Checkout failed');
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="hero-outer dot-bg">
      <div className="hero-inner">
        <section className="fu">
          <div className="eyebrow">
            <div className="eyebrow-dot" />
            <span className="eyebrow-text">the briefing your vet forgot to give you</span>
          </div>
          <h1 className="hero-h1">
            get your<br />pet's<br /><em>furbrief</em>
          </h1>
          <p className="hero-sub">
            upload vet discharge papers, choose your language, then pay $6 for a plain-English care plan.
          </p>
          <p className="hero-def">
            no login required. no subscription. your papers are processed once and deleted immediately.
          </p>
        </section>

        <section className="hero-r fu2">

          {/* Upload zone — swaps to success card once uploaded */}
          {blobUrl ? (
            <div className="flex items-center gap-4 p-5 rounded-3xl border-2 border-[#6BA888] bg-[#E4F4EC] mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#6BA888] flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#3D7A58] text-sm truncate">{fileName}</p>
                <p className="text-[#6BA888] text-xs font-semibold mt-0.5">{fileSize} · ready to translate</p>
              </div>
              <button onClick={clearFile} className="text-[#6BA888] hover:text-[#3D7A58] p-1 flex-shrink-0" title="Remove file">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              className="uzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <div className="uico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="utit">drop your discharge papers here</p>
              <p className="uhint">PDF, photo, or screenshot · any clinic · any format</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/heic"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {/* Step 1 */}
          <div className="step-card" style={{ marginTop: 16 }}>
            <div className="step-num">1</div>
            <p className="step-title">upload your papers</p>
            <p className="step-desc">drag and drop or select a file. if it is easier, paste your text instead.</p>
            <div className="step-tags">
              <span className="stag">PDF</span>
              <span className="stag">photo</span>
              <span className="stag">screenshot</span>
              <span className="stag">HEIC</span>
            </div>
            <button
              type="button"
              className="cbtn"
              style={{ marginTop: 16, width: 'auto', padding: '11px 18px' }}
              onClick={() => setUseTextFallback(!useTextFallback)}
            >
              {useTextFallback ? 'hide paste field' : 'or paste the text instead'}
            </button>
            {useTextFallback && (
              <>
                <textarea
                  value={textFallback}
                  onChange={(e) => setTextFallback(e.target.value)}
                  placeholder="Paste your discharge notes here"
                  rows={6}
                  className="border border-[#ECC888] rounded-[16px] p-4 w-full mt-4"
                  style={{ fontFamily: 'Nunito, sans-serif', fontSize: 15, minHeight: 160 }}
                />
                <button type="button" className="cbtn" onClick={handlePasteSubmit} disabled={isLoading}>
                  {isLoading ? 'uploading…' : 'upload text'}
                </button>
              </>
            )}
            {checkoutError && <p className="text-sm font-semibold mt-3" style={{ color: '#A86860' }}>{checkoutError}</p>}
          </div>

          {/* Step 2 */}
          <div className="step-card" style={{ marginTop: 20 }}>
            <div className="step-num">2</div>
            <p className="step-title">tell us about your pet</p>
            <p className="step-desc">name, species, surgery type, and language. makes your furbrief feel personal.</p>
            <label className="block text-sm font-semibold text-[#3A2010] mt-4">
              what's your pet's name?
              <input
                className="mt-2 w-full rounded-[18px] border border-[#ECC888] bg-white px-4 py-3 text-base"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g. luna"
              />
            </label>
            <div style={{ marginTop: 16 }}>
              <div className="blang-lbl">species</div>
              <div className="bpills" style={{ marginTop: 10 }}>
                {speciesOptions.map((item) => (
                  <button key={item.value} type="button" className={`bpill ${species === item.value ? 'on' : ''}`} onClick={() => setSpecies(item.value)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="block text-sm font-semibold text-[#3A2010] mt-4">
              what was the surgery for? (optional)
              <input
                className="mt-2 w-full rounded-[18px] border border-[#ECC888] bg-white px-4 py-3 text-base"
                value={surgeryType}
                onChange={(e) => setSurgeryType(e.target.value)}
                placeholder="e.g. dental extraction"
              />
            </label>
            <div style={{ marginTop: 16 }}>
              <div className="blang-lbl">furbrief language</div>
              <div className="bpills" style={{ marginTop: 10 }}>
                {languages.map((option) => (
                  <button key={option.value} type="button" className={`bpill ${language === option.value ? 'on' : ''} ${option.className}`} onClick={() => setLanguage(option.value)}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-card" style={{ marginTop: 20 }}>
            <div className="step-num">3</div>
            <p className="step-title">checkout</p>
            <p className="step-desc">review your order, then pay $6 and get routed to the processing page.</p>
            <div className="paper-card" style={{ marginTop: 14 }}>
              <div className="paper-top">order summary</div>
              <p className="pline">furbrief for <span className="phl">{petName || 'your pet'}</span> — language <span className="phl">{selectedLanguage?.label}</span></p>
              <p className="pline">price <span className="phl">$6.00 one-time</span></p>
            </div>
            <button type="button" className="cbtn" style={{ marginTop: 16 }} onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? 'redirecting…' : 'get my furbrief →'}
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}
