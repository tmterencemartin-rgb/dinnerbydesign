import React from 'react';
import { ArrowRight } from 'lucide-react';
import { COOKING_FOR_ONE_GUIDE as guide } from '../../content/seoFoodCostGuides';
import { COOKING_FOR_ONE_DISCLOSURES, COOKING_FOR_ONE_DISCLOSURE_FOOTER } from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

interface CookingForOneGuideViewProps {
  onPlanDinners: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`mt-10 ${className}`.trim()}>
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">{children}</div>
  </section>
);

const BulletList: React.FC<{ children: React.ReactNode }> = ({ children }) => <ul className="space-y-3">{children}</ul>;
const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => <li className="flex gap-3"><span aria-hidden="true" className="text-dbd-accent">—</span><span>{children}</span></li>;

export const CookingForOneGuideView: React.FC<CookingForOneGuideViewProps> = ({ onPlanDinners }) => (
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
          <p>Half a bag of spinach going soft in the drawer. A bunch of coriander bought for one recipe, most of it left over. A pack of chicken thighs sized for four, when you only wanted two. Cooking for one often means working around packaging built for someone else's household, and it's easy to end up either throwing food away or eating the same dinner three nights running.</p>
          <p>Neither has to be the trade-off. With a little planning, the same handful of ingredients can move in several different directions across a few days — a different spice, a different texture, a different feel — without extra shopping trips or a freezer full of identical containers.</p>
        </section>

        <GuideSection title="Plan a short sequence, not a rigid week">
          <p>Rather than mapping out a full week, choose three or four dinners at a time that share two or three core ingredients — a vegetable, a grain, a tin of something. A short sequence like this is easier to stick to than a rigid plan, and it leaves room to swap a dinner in or out if your week changes. It also means less produce sitting forgotten at the back of the fridge, because everything you've bought already has somewhere to go.</p>
        </GuideSection>

        <GuideSection title="Buy ingredients that can do more than one job">
          <p>When you're choosing what to buy, look for ingredients that can cross into more than one style of dinner. A tray of vegetables for roasting, a tin of chickpeas and a pot of a grain such as couscous or bulgur wheat can each be cooked once and then taken in different directions with whatever you add afterwards. The versatility comes from the flavourings you finish with, not from buying something different for every dinner.</p>
        </GuideSection>

        <GuideSection title="Cook once, then change direction">
          <p>There's a difference between eating the same dinner three times and cooking one component once to use three ways. A tray of roasted vegetables, a pot of cooked grain, a pan of softened onion and garlic, or a simple tomato base can each be finished in a different direction — stirred through lemon and yogurt one night, folded into a spiced stew the next, tossed with ginger and soy after that. The cooking happens once; the dinner changes each time.</p>
        </GuideSection>

        <GuideSection title="Right-size fresh ingredients, and freeze early">
          <p>Where your supermarket sells fruit and vegetables loose, buying only the amount you'll use avoids the choice between a fixed pack and a fridge drawer of leftovers. For fresh meat, fish or vegetables you won't get through in a day or two, freezing them while they're still fresh protects both quality and your food budget more than leaving the decision until the last moment.</p>
          <p>Divide food into individual portions and label them clearly before freezing, rather than freezing one large block — it's much easier to take out exactly what you need.</p>
        </GuideSection>

        <ProgrammaticDisclosureList items={COOKING_FOR_ONE_DISCLOSURES} className="mt-6" />

        <GuideSection title="Build a flexible cupboard">
          <p>A small set of tinned, dried and frozen staples makes it much easier to put a dinner together without a shop: rice, pasta, lentils, chickpeas, tinned tomatoes, eggs and a bag of frozen vegetables between them cover a wide range of dinners on their own. What stops them feeling repetitive is what you add at the end — a spoonful of a spiced paste, a squeeze of lemon, a scattering of toasted seeds, a spoonful of yogurt or a chilli-flecked oil. The base stays simple; the finish is where the dinner changes character.</p>
        </GuideSection>

        <GuideSection title="Reduce effort without reducing variety">
          <p>Preparing aromatics — chopped onion, garlic, ginger — in one go, and keeping a base sauce or stock ready in the fridge or freezer, cuts down on the small repeated tasks that can make cooking for one feel like more effort than it should. A short rotation of dinners you know well is worth keeping too, not as a limit, but as a dependable starting point to build from when you feel like trying something new.</p>
        </GuideSection>

        <GuideSection title="A three-dinner example">
          <p>Roast a tray of onions, peppers and courgettes, and warm through a tin of chickpeas alongside a pot of a cooked grain such as couscous or bulgur wheat. From there:</p>
          <BulletList>
            <Bullet>Take a portion in a North African-inspired direction: a spiced paste, a squeeze of lemon and a spoonful of yogurt or a plant-based alternative on top.</Bullet>
            <Bullet>Take another towards a tomato and smoked paprika stew, finished with a slice of toasted bread for crunch.</Bullet>
            <Bullet>Use what's left in a ginger, garlic and soy-inspired bowl, with something crisp and fresh — sliced spring onion or a handful of beansprouts — added at the end.</Bullet>
          </BulletList>
          <p>Same roasting tray, same tin of chickpeas, same pot of grain — three distinctly different dinners. This sequence is an illustration of the technique rather than a claim about how any particular dish is traditionally made, and it's a starting point rather than a complete recipe with fixed quantities.</p>
        </GuideSection>

        <GuideSection title="Frequently asked questions">
          {guide.faqs.map(faq => <section key={faq.question}><h3 className="font-bold text-dbd-ink">{faq.question}</h3><p className="mt-2">{faq.answer}</p></section>)}
        </GuideSection>

        <GuideSection title="Sources and further reading" className="border-t border-dbd-rule/50 pt-8">
          <ul className="space-y-3 text-sm leading-6">{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">{source.label}</a></li>)}</ul>
        </GuideSection>

        <section className="mt-10 rounded border border-dbd-rule/60 bg-white p-5">
          <h2 className="text-xl font-bold">Related guidance</h2>
          <p className="mt-3 text-sm leading-6 text-dbd-ink-3"><a href="/food-costs/low-cost-cooking-techniques" className="font-semibold text-dbd-accent hover:underline">Explore low-cost cooking techniques</a>, <a href="/food-safety" className="font-semibold text-dbd-accent hover:underline">review food-safety guidance</a> or <a href="/recipe-methodology" className="font-semibold text-dbd-accent hover:underline">read how dinners are selected</a>.</p>
        </section>
      </article>

      <ProgrammaticDisclosureFooter copy={COOKING_FOR_ONE_DISCLOSURE_FOOTER} className="mt-10" />

      <section className="mt-10 rounded bg-dbd-ink p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div><h2 className="text-xl font-bold">Make your ingredients work harder</h2><p className="mt-2 text-sm leading-6 text-white/70">Use DinnerByDesign to find suitable dinners, save your choices and plan around ingredients you want to use well.</p></div>
        <button type="button" onClick={onPlanDinners} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white px-5 text-sm font-bold text-dbd-ink sm:mt-0 sm:w-auto">Plan dinners for one <ArrowRight size={16} /></button>
      </section>
    </main>
  </div>
);
