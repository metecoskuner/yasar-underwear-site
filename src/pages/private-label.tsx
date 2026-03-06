import SEO from '@/components/SEO';
import PrivateLabelForm from '@/components/PrivateLabelForm';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivateLabelPage() {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch (err) {
      void err;
      return fallback;
    }
  };
  return (
    <>
      <SEO title={tr('pages.privateLabel.seo.title','Private Label & OEM — Yasar')} description={tr('pages.privateLabel.seo.description','Private label and OEM manufacturing — full-service from design to packaging. MOQ and lead times vary by material and quantities.')} url="/private-label" />

      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="text-center mb-10">
          <h1 className="text-3xl font-bold">{tr('pages.privateLabel.header.title','Private Label & OEM')}</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{tr('pages.privateLabel.header.lead','Take your brand to market — we offer full-service private label manufacturing from design to packaging. MOQ and lead times vary by materials and quantities.')}</p>
          <p className="mt-2 text-sm text-gray-500">{tr('pages.privateLabel.header.typicalMoq','Typical MOQ: 1000 pcs / style — contact us for a custom quote.')}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="#form" className="inline-block bg-black text-white px-5 py-2 rounded">{tr('pages.privateLabel.header.ctaStart','Start private label')}</a>
            <Link href="/uretim" className="inline-block border border-gray-300 px-5 py-2 rounded">{tr('pages.privateLabel.header.productionDetails','Production details')}</Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="p-4 bg-white rounded shadow col-span-1 md:col-span-2">
            <h3 className="font-semibold">{tr('pages.privateLabel.sections.productionDetails.title','Production details')}</h3>
            <p className="mt-2 text-sm text-gray-600">{tr('pages.privateLabel.sections.productionDetails.body','Process: Design review → Sampling → Production → Quality control → Shipment. We provide packaging and labeling support for retail-ready products.')}</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{tr('pages.privateLabel.sections.samplePolicy.title','Sample policy')}</h3>
            <p className="mt-2 text-sm text-gray-600">{tr('pages.privateLabel.sections.samplePolicy.body','Samples are provided upon request; sample fees may apply and can be refunded on approved orders.')}</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{tr('pages.privateLabel.sections.designPayment.title','Design & Payment')}</h3>
            <p className="mt-2 text-sm text-gray-600">{tr('pages.privateLabel.sections.designPayment.body','Send your design files in vector PDF/AI format. Payment terms vary; typically deposit with balance on delivery, or letter of credit for large orders.')}</p>
          </div>
        </section>

        <section id="form" className="mb-16 min-h-screen flex items-center justify-center">
          <div className="w-full px-4">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <h2 className="text-2xl font-semibold">{tr('pages.privateLabel.form.title','Private label request')}</h2>
            </div>
            <div className="flex items-center justify-center">
              <PrivateLabelForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
