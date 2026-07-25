import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PublicEditorialGuideViewProps {
  guide: {
    title: string;
    description: string;
    editorialOwner: string;
  };
  label: string;
  publishedLabel: string;
  renderInitialHtml: () => string;
  ctaTitle: string;
  ctaCopy: string;
  ctaLabel: string;
  onCta: () => void;
}

const getArticleHtml = (renderInitialHtml: () => string) => {
  const match = renderInitialHtml().match(/<article>([\s\S]*?)<\/article>/);
  return match?.[1] || '';
};

export const PublicEditorialGuideView: React.FC<PublicEditorialGuideViewProps> = ({
  guide,
  label,
  publishedLabel,
  renderInitialHtml,
  ctaTitle,
  ctaCopy,
  ctaLabel,
  onCta,
}) => {
  const articleHtml = React.useMemo(() => getArticleHtml(renderInitialHtml), [renderInitialHtml]);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
      <header className="border-b border-dbd-rule/50 bg-dbd-surface">
        <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
          <a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[34.2px] w-auto max-w-[207px] object-contain mix-blend-multiply sm:h-[39.6px]" /></a>
          <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3">
          <a href="/" className="hover:underline">DinnerByDesign</a>
          <span className="px-2">/</span>
          <a href="/guides" className="hover:underline">Guides</a>
          <span className="px-2">/</span>
          <span>{label}</span>
        </nav>

        <header className="mt-7">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">{label}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{guide.description}</p>
          <p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · {publishedLabel}</p>
        </header>

        <article
          className={[
            'text-[15px] leading-7 text-dbd-ink-3',
            '[&>section]:mt-10 [&>aside]:mt-8',
            '[&_section_section]:mt-7',
            '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-dbd-ink',
            '[&_h3]:font-semibold [&_h3]:text-dbd-ink',
            '[&_p]:mt-4',
            '[&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5',
            '[&_li]:list-disc [&_li]:pl-1',
            '[&_a]:font-semibold [&_a]:text-dbd-accent [&_a:hover]:underline',
            '[&_.guide-table-wrap]:mt-5 [&_.guide-table-wrap]:overflow-x-auto',
            '[&_table]:w-full [&_table]:min-w-[620px] [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm',
            '[&_th]:border-b-2 [&_th]:border-dbd-rule [&_th]:bg-white [&_th]:px-3 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-dbd-ink',
            '[&_td]:border-b [&_td]:border-dbd-rule/60 [&_td]:px-3 [&_td]:py-3 [&_td]:align-top',
          ].join(' ')}
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />

        <section className="mt-10 rounded bg-dbd-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-5">
          <div>
            <h2 className="text-lg font-semibold">{ctaTitle}</h2>
            <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/70 sm:text-sm">{ctaCopy}</p>
          </div>
          <button type="button" onClick={onCta} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-white px-4 text-xs font-semibold text-dbd-ink sm:mt-0 sm:w-auto">
            {ctaLabel} <ArrowRight size={14} />
          </button>
        </section>
      </main>
    </div>
  );
};
