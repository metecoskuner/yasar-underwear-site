import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = { endpoint?: string; initial?: Record<string, string> };

export default function PrivateLabelForm({ endpoint = '/api/b2b', initial = {} }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState<Record<string, string>>({
    companyName: '',
    country: '',
    activeBrand: '',
    targetMarket: '',
    modelCount: '',
    colorOptions: '',
    timeline: '',
    estimatedBulkOrder: '',
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
    if (!form.companyName) e.companyName = t('pages.privateLabel.form.validation.companyName');
    if (!form.contactName) e.contactName = t('pages.privateLabel.form.validation.contactName');
    if (!form.email) e.email = t('pages.privateLabel.form.validation.email');
    return e;
  };

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setSending(true);
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'private-label', payload: form }) });
  if (!res.ok) throw new Error('submit failed');
  setSuccess('Teşekkürler — özel marka talebinizi aldık. En kısa sürede dönüş yapacağız.');
      setForm({ companyName: '', country: '', activeBrand: '', targetMarket: '', modelCount: '', colorOptions: '', timeline: '', estimatedBulkOrder: '', contactName: '', email: '', phone: '', message: '' });
    } catch (err) {
      setErrors({ form: 'Unable to submit. Please try again later.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl w-full bg-white p-6 rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.companyName')}</label>
              <input value={form.companyName} onChange={(e) => onChange('companyName', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
            {errors.companyName && <div className="text-rose-500 text-sm mt-1">{errors.companyName}</div>}
          </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.country')}</label>
          <input value={form.country} onChange={(e) => onChange('country', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.activeBrand')}</label>
          <input value={form.activeBrand} onChange={(e) => onChange('activeBrand', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.targetMarket')}</label>
          <input value={form.targetMarket} onChange={(e) => onChange('targetMarket', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.modelCount')}</label>
          <input value={form.modelCount} onChange={(e) => onChange('modelCount', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.colorOptions')}</label>
          <input value={form.colorOptions} onChange={(e) => onChange('colorOptions', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.timeline')}</label>
          <input value={form.timeline} onChange={(e) => onChange('timeline', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.estimatedBulk')}</label>
          <input value={form.estimatedBulkOrder} onChange={(e) => onChange('estimatedBulkOrder', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.contactPerson')}</label>
          <input value={form.contactName} onChange={(e) => onChange('contactName', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
          {errors.contactName && <div className="text-rose-500 text-sm mt-1">{errors.contactName}</div>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.email')}</label>
          <input value={form.email} onChange={(e) => onChange('email', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
          {errors.email && <div className="text-rose-500 text-sm mt-1">{errors.email}</div>}
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.phone')}</label>
          <input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-900">{t('pages.privateLabel.form.labels.message')}</label>
          <textarea value={form.message} onChange={(e) => onChange('message', e.target.value)} className="mt-1 block w-full border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 h-28 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent" />
        </div>
      </div>

      {errors.form && <div className="text-rose-500 mt-3">{errors.form}</div>}

      <div className="mt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={sending}
          className={`bg-[var(--brand-color)] text-white px-4 py-2 rounded-lg transform transition duration-150 ease-in-out ${sending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg cursor-pointer'}`}>
          {sending ? t('pages.privateLabel.form.sending') : t('pages.privateLabel.form.labels.submit')}
        </button>
      </div>

      {success && <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 rounded">{success}</div>}
    </form>
  );
}
