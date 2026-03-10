import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  endpoint?: string;
  initial?: Record<string, string>;
};

export default function B2BForm({ endpoint = '/api/b2b', initial = {} }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState<Record<string, string>>({
    companyName: '',
    country: '',
    website: '',
    businessType: '',
    interestedIn: '',
    estimatedFirstOrder: '',
    annualVolume: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName) e.companyName = t('pages.wholesale.form.validation.companyName');
    if (!form.country) e.country = t('pages.wholesale.form.validation.country');
    if (!form.contactName) e.contactName = t('pages.wholesale.form.validation.contactName');
    if (!form.email) e.email = t('pages.wholesale.form.validation.email');
    return e;
  };

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setSending(true);
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'wholesale', payload: form }) });
      if (!res.ok) throw new Error('submit failed');
  setSuccess(t('pages.wholesale.form.success'));
      setForm({ companyName: '', country: '', website: '', businessType: '', interestedIn: '', estimatedFirstOrder: '', annualVolume: '', contactName: '', email: '', phone: '', message: '' });
    } catch (err) {
      setErrors({ form: t('pages.wholesale.form.submitError') });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl w-full bg-white p-6 rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.companyName')}</label>
          <input value={form.companyName} onChange={(e) => onChange('companyName', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
          {errors.companyName && <div className="text-rose-500 text-sm mt-1">{errors.companyName}</div>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.country')}</label>
          <input value={form.country} onChange={(e) => onChange('country', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
          {errors.country && <div className="text-rose-500 text-sm mt-1">{errors.country}</div>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.website')}</label>
          <input value={form.website} onChange={(e) => onChange('website', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.businessType')}</label>
          <input value={form.businessType} onChange={(e) => onChange('businessType', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.interestedProducts')}</label>
          <input value={form.interestedIn} onChange={(e) => onChange('interestedIn', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.estimatedFirstOrder')}</label>
          <input value={form.estimatedFirstOrder} onChange={(e) => onChange('estimatedFirstOrder', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.annualVolume')}</label>
          <input value={form.annualVolume} onChange={(e) => onChange('annualVolume', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.contactPerson')}</label>
          <input value={form.contactName} onChange={(e) => onChange('contactName', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
          {errors.contactName && <div className="text-rose-500 text-sm mt-1">{errors.contactName}</div>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.email')}</label>
          <input value={form.email} onChange={(e) => onChange('email', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
          {errors.email && <div className="text-rose-500 text-sm mt-1">{errors.email}</div>}
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.phone')}</label>
          <input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-900">{t('pages.wholesale.form.labels.message')}</label>
          <textarea value={form.message} onChange={(e) => onChange('message', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 h-28 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>
      </div>

      {errors.form && <div className="text-rose-500 mt-3">{errors.form}</div>}

      <div className="mt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={sending}
          className={`bg-[var(--brand-color)] text-white px-4 py-2 rounded-lg transform transition duration-150 ease-in-out ${sending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg cursor-pointer'}`}>
          {sending ? t('pages.wholesale.form.sending') : t('pages.wholesale.form.labels.submit')}
        </button>
      </div>

      {success && <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 rounded">{success}</div>}
    </form>
  );
}
