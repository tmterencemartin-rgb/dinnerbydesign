import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LOWER_COST_CUTS_GUIDE as guide } from '../../content/seoFoodCostGuides';
import {
  LOWER_COST_CUTS_COMPARISON_DISCLOSURES,
  LOWER_COST_CUTS_DISCLOSURE_FOOTER,
  LOWER_COST_CUTS_SAFETY_DISCLOSURES,
} from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

interface LowerCostCutsGuideViewProps {
  onFindDinners: () => void;
}

const SourceLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">{children}</a>
);

const GuideSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`mt-10 ${className}`.trim()}>
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">{children}</div>
  </section>
);

const BulletList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="space-y-3">{children}</ul>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex gap-3"><span aria-hidden="true" className="text-dbd-accent">—</span><span>{children}</span></li>
);

export const LowerCostCutsGuideView: React.FC<LowerCostCutsGuideViewProps> = ({ onFindDinners }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[38px] w-auto max-w-[230px] object-contain mix-blend-multiply sm:h-[44px]" /></a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>

    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><span>Food cost guides</span></nav>

      <article>
        <header className="mt-7">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Food cost guide</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{guide.description}</p>
          <p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · Published 19 July 2026 · Last reviewed 19 July 2026</p>
        </header>

        <section className="mt-8 border-y border-dbd-rule/50 py-6">
          <p className="text-[15px] leading-7 text-dbd-ink-3">Examples in this guide are based on four standard servings. The amount required may vary with age, appetite and the dishes served alongside. This guide sets out a method for checking whether a cut represents good value at the price on the shelf, rather than a fixed list of cheaper cuts. Price, yield, cooking time and additional ingredients all affect the result, so the method should be applied with the current price each time.</p>
        </section>

        <ProgrammaticDisclosureList items={LOWER_COST_CUTS_COMPARISON_DISCLOSURES} className="mt-6" />

        <GuideSection title="What makes a cut better value?">
          <p>Value depends on price per kilogram, usable yield after bone, skin and fat are removed, and cooking time relative to the result. A cut with a low shelf price can cost more per serving once loss during preparation and cooking is accounted for.</p>
          <p>A full comparison also considers additional ingredients and whether the cut can be used across more than one dinner.</p>
        </GuideSection>

        <GuideSection title="Price per kilogram versus usable quantity">
          <p>Price per kilogram reflects the cost of the whole cut as sold, not the cost of what reaches the plate. Bone-in and skin-on cuts lose weight during trimming and cooking. Two cuts at the same shelf price can differ in cost per serving once usable quantity is calculated.</p>
          <BulletList>
            <Bullet>Divide pack price by the estimated number of servings for an estimated cost per serving, or divide pack price by usable weight in grams and multiply by the grams required per serving.</Bullet>
            <Bullet>Compare cuts on the same date, since prices vary by retailer and by week.</Bullet>
            <Bullet>Include the cost of any stock, marinade or additional ingredients the method requires.</Bullet>
          </BulletList>
          <div className="rounded border border-dbd-rule/60 bg-white p-4 text-sm leading-6"><strong className="text-dbd-ink">Illustrative calculation:</strong> if a pack costs £6.00 and provides four servings, the calculated cost is £1.50 per serving. Use the current pack price and the number of servings it provides for your household.</div>
        </GuideSection>

        <GuideSection title="Bone, fat, cooking loss and serving size">
          <p>Bone-in cuts and cuts with a higher fat content return less edible weight than boneless, trimmed cuts of the same starting weight. Cooking loss varies by cut, preparation and technique, so calculations should use a documented yield assumption rather than a universal percentage.</p>
        </GuideSection>

        <GuideSection title="Cooking-time and energy-cost considerations">
          <p>Cuts suited to long, slow cooking, such as shin and shoulder, typically need a low oven temperature over several hours or a slow cooker. Thighs and drumsticks generally need less time.</p>
          <p>Energy cost depends on appliance, temperature, duration and tariff, so a lower purchase price will not always mean a lower overall cost.</p>
        </GuideSection>

        <GuideSection title="Cuts to run the method on">
          <p>The cuts below are worth applying the method to using the price and pack size in front of you. None is presented here as cheaper; the result depends on the current price and the servings a pack yields.</p>
          <BulletList>
            <Bullet><strong className="text-dbd-ink">Chicken thighs:</strong> bone-in or boneless, skin-on or skinless. Suited to roasting, braising and grilling.</Bullet>
            <Bullet><strong className="text-dbd-ink">Chicken drumsticks:</strong> a bone-in cut worth comparing with breast and thighs on price per usable serving. Suited to roasting, braising and barbecuing.</Bullet>
            <Bullet><strong className="text-dbd-ink">Pork shoulder:</strong> higher fat content. Suited to slow roasting or braising. A joint may supply more than one dinner.</Bullet>
            <Bullet><strong className="text-dbd-ink">Beef shin:</strong> connective tissue breaks down during slow cooking. Suited to stews and braises.</Bullet>
            <Bullet><strong className="text-dbd-ink">Braising steak:</strong> suited to slow, moist cooking. It becomes tough if cooked quickly at high heat.</Bullet>
            <Bullet><strong className="text-dbd-ink">Turkey thigh:</strong> bone-in or boneless. Suited to roasting and braising. Availability varies by retailer and season.</Bullet>
          </BulletList>
        </GuideSection>

        <GuideSection title="Which cooking methods suit each cut?">
          <BulletList>
            <Bullet><strong className="text-dbd-ink">Roasting:</strong> chicken thighs, drumsticks, turkey thigh and pork shoulder.</Bullet>
            <Bullet><strong className="text-dbd-ink">Braising:</strong> pork shoulder, beef shin and braising steak.</Bullet>
            <Bullet><strong className="text-dbd-ink">Slow cooking:</strong> beef shin, braising steak and pork shoulder.</Bullet>
            <Bullet><strong className="text-dbd-ink">Grilling or barbecuing:</strong> chicken thighs and drumsticks.</Bullet>
          </BulletList>
          <p>Matching the method to the cut affects the result and cooking time, which in turn affects energy cost.</p>
        </GuideSection>

        <GuideSection title="Using one pack or joint across more than one dinner">
          <p>A larger joint or pack can supply servings for more than one dinner. Options include cooking a full joint and dividing the cooked meat, freezing raw portions in the quantity required for one dinner, or using cooked meat in a different recipe.</p>
          <p>Label raw or cooked portions with the date before freezing. If a pack contains enough chicken thighs for eight of your household's usual servings, divide it into two four-serving portions. Use one for a traybake and freeze the other for a curry or braise, following the pack's storage instructions.</p>
        </GuideSection>

        <GuideSection title="Storage and food-safety guidance">
          <ProgrammaticDisclosureList items={LOWER_COST_CUTS_SAFETY_DISCLOSURES} />
          <BulletList>
            <Bullet>Keep the fridge at 5°C or below, and follow the product's storage instructions and use-by date.</Bullet>
            <Bullet>Cook poultry thoroughly. Using a clean temperature probe, the centre should reach 70°C for two minutes, or 75°C for 30 seconds.</Bullet>
            <Bullet>Cool leftovers and refrigerate or freeze them within two hours of cooking.</Bullet>
            <Bullet>Eat refrigerated leftovers within 48 hours, or freeze them.</Bullet>
            <Bullet>Defrost in the fridge, or use a microwave immediately before cooking.</Bullet>
            <Bullet>Reheat only once, until steaming hot throughout.</Bullet>
            <Bullet>Freeze before the use-by date and follow the pack instructions. Once fully defrosted, use within 24 hours.</Bullet>
          </BulletList>
        </GuideSection>

        <GuideSection title="Frequently asked questions">
          {guide.faqs.map(faq => <section key={faq.question}><h3 className="font-bold text-dbd-ink">{faq.question}</h3><p className="mt-2">{faq.answer}</p></section>)}
        </GuideSection>

        <GuideSection title="Sources and further reading" className="border-t border-dbd-rule/50 pt-8">
          <ul className="space-y-3 text-sm leading-6">{guide.sources.map(source => <li key={source.url}><SourceLink href={source.url}>{source.label}</SourceLink></li>)}</ul>
        </GuideSection>

        <section className="mt-10 rounded border border-dbd-rule/60 bg-white p-5">
          <h2 className="text-xl font-bold">Related guidance</h2>
          <p className="mt-3 text-sm leading-6 text-dbd-ink-3"><a href="/food-costs/uk-food-costs-2026" className="font-semibold text-dbd-accent hover:underline">Understand the wider UK food-cost picture</a>, <a href="/food-costs/low-cost-cooking-techniques" className="font-semibold text-dbd-accent hover:underline">explore low-cost cooking techniques</a>, <a href="/pricing-methodology" className="font-semibold text-dbd-accent hover:underline">read the pricing methodology</a> or <a href="/food-safety" className="font-semibold text-dbd-accent hover:underline">review storage and cooking safety</a>.</p>
        </section>
      </article>

      <ProgrammaticDisclosureFooter copy={LOWER_COST_CUTS_DISCLOSURE_FOOTER} className="mt-10" />

      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div><h2 className="text-xl font-bold">Make your food budget go further</h2><p className="mt-2 text-sm leading-6 text-white/70">Apply your own prices to suitable dinners for your household.</p></div>
        <button type="button" onClick={onFindDinners} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Find lower-cost dinners for four <ArrowRight size={16} /></button>
      </section>
    </main>
  </div>
);
