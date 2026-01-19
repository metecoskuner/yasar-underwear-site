import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type FormState = { name: string; email: string; message: string };

export default function ContactSection(): JSX.Element {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = tr('components.contact.errors.nameRequired', 'İsim zorunlu');
    if (!form.email.trim()) e.email = tr('components.contact.errors.emailRequired', 'E-posta zorunlu');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = tr('components.contact.errors.emailInvalid', 'Geçersiz e-posta');
    if (!form.message.trim()) e.message = tr('components.contact.errors.messageRequired', 'Mesaj boş olamaz');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // simulate
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <section id="contact-form" className="relative py-20 bg-gradient-to-b from-slate-50 to-white">
  <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 overflow-hidden">
        {/* Left - modern card */}
        <div className="space-y-6 min-w-0">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-black">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold">{tr('components.contact.title','İletişime Geç')}</h2>
                <p className="text-slate-600 mt-2 max-w-full leading-relaxed">
                  {tr('components.contact.intro','Sorularınız, iş birlikleri veya toptan talepler için bize yazabilirsiniz. Ortalama dönüş süresi')} <span className="font-semibold">{tr('components.contact.avgResponse','24 saat')}</span>.
                </p>
              </div>
              <div className="hidden md:flex items-center">
                <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">{tr('components.contact.replyApprox','Yanıt: ~24s')}</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="bg-slate-50 border border-black rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <div>
                    <div className="text-xs text-slate-500">{tr('components.contact.emailLabel','E-posta')}</div>
                    <a href="mailto:info@yasarunderwear.example" className="text-slate-800 font-medium hover:underline">info@yasarunderwear.example</a>
                  </div>
                </div>
                <div className="border-t border-slate-200 flex items-center gap-3 px-4 py-3">
                  <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684L10.9 7.63a1 1 0 01-.217 1.03l-1.2 1.2a11 11 0 005.657 5.657l1.2-1.2a1 1 0 011.03-.217l3.946 1.622A1 1 0 0121 19.72V23a2 2 0 01-2 2A19 19 0 013 6z"></path></svg>
                  <div>
                    <div className="text-xs text-slate-500">{tr('components.contact.phoneLabel','Telefon')}</div>
                    <a href="tel:+905551234567" className="text-slate-800 font-medium hover:underline">+90 555 123 4567</a>
                  </div>
                </div>
                <div className="border-t border-slate-200 flex items-center gap-3 px-4 py-3">
                  <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7v5l3 2" /></svg>
                  <div>
                    <div className="text-xs text-slate-500">{tr('components.contact.hoursLabel','Saatler')}</div>
                    <div className="text-slate-800 font-medium">{tr('components.contact.hours','Hafta içi 09:00 – 18:00')}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="mailto:info@yasarunderwear.example" className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{tr('components.contact.sendEmail','E-posta Gönder')}</a>
                <a href="tel:+905551234567" className="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:bg-neutral-800">{tr('components.contact.callUs','Bizi Ara')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
  <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-xl border min-w-0" noValidate>
          <div className="space-y-5">
            <Field
              label={tr('components.contact.form.name','İsim')}
              value={form.name}
              error={errors.name}
              onChange={(v) => setForm((s) => ({ ...s, name: v }))}
            />
            <Field
              label={tr('components.contact.form.email','E-posta')}
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(v) => setForm((s) => ({ ...s, email: v }))}
            />
            <Field
              label={tr('components.contact.form.message','Mesaj')}
              textarea
              value={form.message}
              error={errors.message}
              onChange={(v) => setForm((s) => ({ ...s, message: v }))}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black text-white py-3 font-semibold transition hover:bg-neutral-800 disabled:opacity-60 hover:cursor-pointer active:scale-95"
            >
              {loading ? tr('components.contact.sending','Gönderiliyor…') : tr('components.contact.sendMessage','Mesaj Gönder')}
            </button>

            {success && (
              <div role="status" aria-live="polite" className="text-sm text-emerald-600 text-center">
                {tr('components.contact.success','Mesajınız başarıyla gönderildi ✅')}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  textarea,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-1 group">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 bg-white transition-colors transition-shadow duration-150 outline-none ${
            error ? 'border-red-400' : 'border-slate-200 group-hover:border-slate-300'
          } focus:border-black focus:ring-2 focus:ring-black/10`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 bg-white transition-colors transition-shadow duration-150 outline-none ${
            error ? 'border-red-400' : 'border-slate-200 group-hover:border-slate-300'
          } focus:border-black focus:ring-2 focus:ring-black/10`}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}


