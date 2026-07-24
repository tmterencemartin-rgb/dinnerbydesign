import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LOW_COST_COOKING_TECHNIQUES_GUIDE as guide } from '../../content/seoFoodCostGuides';
import {
  LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER,
  LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES,
  LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES,
} from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

interface LowCostCookingTechniquesGuideViewProps {
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

const DetailTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="font-bold text-dbd-ink">{children}</h3>;
const BulletList: React.FC<{ children: React.ReactNode }> = ({ children }) => <ul className="space-y-3">{children}</ul>;
const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => <li className="flex gap-3"><span aria-hidden="true" className="text-dbd-accent">—</span><span>{children}</span></li>;

export const LowCostCookingTechniquesGuideView: React.FC<LowCostCookingTechniquesGuideViewProps> = ({ onFindDinners }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[34.2px] w-auto max-w-[207px] object-contain mix-blend-multiply sm:h-[39.6px]" /></a>
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
          <p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · Published 20 July 2026 · Last reviewed 20 July 2026</p>
        </header>

        <section className="mt-8 space-y-4 border-y border-dbd-rule/50 py-6 text-[15px] leading-7 text-dbd-ink-3">
          <p>Traditional dishes can demonstrate practical ways to build dinners from a small set of affordable, versatile ingredients. This guide explains three techniques, with an example dinner for each and practical notes for using ingredients available in UK supermarkets.</p>
          <p>The examples below illustrate individual cooking principles. They are not intended to rank whole national cuisines by cost, and no claim is made about which culinary traditions are cheapest overall.</p>
        </section>

        <GuideSection title="1. Building a dinner around a staple ingredient">
          <p>Rice, pasta and bread can form a substantial base for several dinners, with beans, vegetables and flavourings added in smaller quantities.</p>
          <DetailTitle>Representative dinner: koshary</DetailTitle>
          <p>Koshary is an Egyptian dish combining pasta, rice, lentils and chickpeas, layered with a spiced tomato sauce and fried onions. The version described here contains no meat or animal-derived ingredients, but individual sauces and toppings should still be checked.</p>
          <DetailTitle>UK supermarket ingredients</DetailTitle>
          <BulletList><Bullet>Rice</Bullet><Bullet>Small pasta shapes, such as macaroni</Bullet><Bullet>Brown or green lentils, dried or tinned</Bullet><Bullet>Tinned chickpeas, or cooked dried chickpeas when time allows</Bullet><Bullet>Tinned tomatoes, onions, garlic and cumin</Bullet></BulletList>
          <p><strong className="text-dbd-ink">Substitution:</strong> use tinned lentils in place of dried lentils to reduce preparation time, noting that the texture may differ.</p>
          <p><strong className="text-dbd-ink">Reusing ingredients:</strong> a larger batch of lentils or tomato sauce can be cooked once and used across two or three dinners during the week.</p>
          <p><strong className="text-dbd-ink">Why it works:</strong> several filling staple ingredients are combined with one strongly flavoured sauce, rather than relying on a large portion of meat.</p>
          <p><strong className="text-dbd-ink">Allergen note:</strong> contains gluten in the pasta. Check individual product labels, including any ready-made crispy onions or sauces.</p>
        </GuideSection>

        <GuideSection title="2. Using a concentrated flavouring in small quantities">
          <p>Rather than relying on a large quantity of meat, some dishes use a small amount of a concentrated, salty or savoury ingredient to flavour a larger quantity of grain or noodles.</p>
          <DetailTitle>Example dinner: vegetable rice noodles with fish sauce</DetailTitle>
          <p>This is a simple UK-adapted dinner illustrating the technique rather than a named traditional dish. A small quantity of fish sauce can add savoury depth to rice noodles and vegetables.</p>
          <DetailTitle>UK supermarket ingredients</DetailTitle>
          <BulletList><Bullet>Rice noodles</Bullet><Bullet>Fish sauce</Bullet><Bullet>Spring onions and garlic</Bullet><Bullet>Vegetables such as pak choi or spring greens</Bullet></BulletList>
          <p><strong className="text-dbd-ink">Substitutions:</strong> use soy sauce as a fish-free alternative, noting that the flavour differs. Tamari may be an option where gluten needs to be avoided, subject to the product label.</p>
          <p><strong className="text-dbd-ink">Why it can offer practical value:</strong> fish sauce is used in small quantities, so one bottle can contribute to several dinners. This does not mean it is inexpensive to buy; the practical value comes from using a little at a time.</p>
          <p><strong className="text-dbd-ink">Why it works:</strong> adding a concentrated savoury ingredient gradually allows a small amount to flavour noodles and vegetables.</p>
        </GuideSection>

        <ProgrammaticDisclosureList items={LOW_COST_TECHNIQUES_PRODUCT_DISCLOSURES} className="mt-6" />

        <GuideSection title="3. Reusing bread or vegetables across further dinners">
          <p>Some dishes make purposeful use of bread that has become dry or vegetables that remain safe to eat but need using soon.</p>
          <DetailTitle>Representative dinner: ribollita</DetailTitle>
          <p>Ribollita is a Tuscan soup made by combining stale bread with cannellini beans, cabbage or cavolo nero, and other vegetables.</p>
          <DetailTitle>UK supermarket ingredients</DetailTitle>
          <BulletList><Bullet>Dry or stale bread that remains safe to eat; never bread with visible mould</Bullet><Bullet>Tinned cannellini beans</Bullet><Bullet>Cabbage or other vegetables that remain safe to eat but need using soon</Bullet><Bullet>Olive oil and garlic</Bullet></BulletList>
          <p><strong className="text-dbd-ink">Substitutions:</strong> use butter beans or haricot beans in place of cannellini beans. Use a cooking oil already in the cupboard rather than buying a separate oil.</p>
          <p><strong className="text-dbd-ink">Reusing ingredients:</strong> safe, usable bread and vegetables already in the household can contribute to a further dinner before they are wasted.</p>
          <p><strong className="text-dbd-ink">Food-safety note:</strong> bread becoming dry or hard is a quality change rather than a safety risk. Visible mould is a safety risk, so discard mouldy bread.</p>
          <p><strong className="text-dbd-ink">Allergen note:</strong> bread usually contains gluten. Check any stock cubes and other packaged ingredients.</p>
          <p><strong className="text-dbd-ink">Why it works:</strong> bread thickens a bean and vegetable soup while using an ingredient that might otherwise be discarded.</p>
        </GuideSection>

        <ProgrammaticDisclosureList items={LOW_COST_TECHNIQUES_SAFETY_DISCLOSURES} className="mt-6" />

        <GuideSection title="Applying the three techniques together">
          <BulletList><Bullet>Choose a versatile staple as the base for more than one dinner.</Bullet><Bullet>Use a concentrated flavouring sparingly to add depth.</Bullet><Bullet>Plan a further dinner around safe, usable bread or vegetables that need using soon.</Bullet></BulletList>
          <p>DinnerByDesign's Low Cost filter can help identify suitable dinners, while Plan My Week can organise choices around your household and ingredients.</p>
        </GuideSection>

        <GuideSection title="Frequently asked questions">
          {guide.faqs.map(faq => <section key={faq.question}><h3 className="font-bold text-dbd-ink">{faq.question}</h3><p className="mt-2">{faq.answer}</p></section>)}
        </GuideSection>

        <GuideSection title="Sources and further reading" className="border-t border-dbd-rule/50 pt-8">
          <ul className="space-y-3 text-sm leading-6">{guide.sources.map(source => <li key={source.url}><SourceLink href={source.url}>{source.label}</SourceLink></li>)}</ul>
        </GuideSection>

        <section className="mt-10 rounded border border-dbd-rule/60 bg-white p-5">
          <h2 className="text-xl font-bold">Related guidance</h2>
          <p className="mt-3 text-sm leading-6 text-dbd-ink-3"><a href="/food-costs/uk-food-costs-2026" className="font-semibold text-dbd-accent hover:underline">Understand the wider UK food-cost picture</a>, <a href="/food-costs/cooking-for-four-with-lower-cost-cuts" className="font-semibold text-dbd-accent hover:underline">compare meat cuts when cooking for four</a>, <a href="/food-safety" className="font-semibold text-dbd-accent hover:underline">review food-safety guidance</a> or <a href="/recipe-methodology" className="font-semibold text-dbd-accent hover:underline">read how dinners are selected</a>.</p>
        </section>
      </article>

      <ProgrammaticDisclosureFooter copy={LOW_COST_TECHNIQUES_DISCLOSURE_FOOTER} className="mt-10" />

      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div><h2 className="text-xl font-bold">Make your ingredients go further</h2><p className="mt-2 text-sm leading-6 text-white/70">Use the Low Cost filter and Plan My Week to find suitable dinners for your household.</p></div>
        <button type="button" onClick={onFindDinners} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Find low-cost dinners <ArrowRight size={16} /></button>
      </section>
    </main>
  </div>
);
