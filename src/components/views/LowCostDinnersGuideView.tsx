import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LOW_COST_DINNERS_GUIDE as guide } from '../../content/lowCostDinnersGuide';
import { LOW_COST_DINNERS_DISCLOSURE_FOOTER, LOW_COST_DINNERS_DISCLOSURES } from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-10">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">{children}</div>
  </section>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="grid gap-2 pl-5 marker:text-dbd-accent sm:grid-cols-2">
    {items.map(item => <li key={item} className="pl-1">{item}</li>)}
  </ul>
);

export const LowCostDinnersGuideView: React.FC<{ onFindDinner: () => void }> = ({ onFindDinner }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[34.2px] w-auto max-w-[207px] object-contain mix-blend-multiply sm:h-[39.6px]" /></a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>
    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><a href="/guides" className="hover:underline">Guides</a><span className="px-2">/</span><span>Food cost guide</span></nav>
      <article>
        <header className="mt-7">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Food cost guide</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{guide.description}</p>
          <p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · Published 24 July 2026 · Last reviewed 24 July 2026</p>
        </header>

        <section className="mt-10 border-t border-dbd-rule/50 pt-8">
          <div className="space-y-4 text-[15px] leading-7 text-dbd-ink-3">
            <p>Cutting the cost of dinner can bring a nagging worry: that the dinners ahead are going to be a long run of plain pasta, unseasoned lentils and baked beans on toast. If every budget dish tastes roughly the same, saving money quickly stops feeling worth it.</p>
            <p>That repetition often isn't caused by the ingredients. It's caused by using them the same way every time. Beans, lentils, eggs, potatoes, tinned tomatoes and cheaper cuts of meat aren't dull by nature. They're starting points, and what happens after they go in the basket is where the variety actually comes from.</p>
          </div>
        </section>

        <Section title="Affordable ingredients are not inherently dull">
          <p>Lentils can turn into a dhal one night, a tomato-based pasta sauce the next, and spiced patties after that. Eggs move just as easily between a frittata, a shakshuka or a vegetable fried rice. None of these are lesser versions of a more expensive dish. They're different dishes that happen to share a starting ingredient.</p>
          <p>Tinned tomatoes work the same way. The same tin can underpin a simple pasta sauce, a shakshuka, a chilli or a curry base, and each can taste quite different despite sharing a shelf-stable ingredient that's usually inexpensive. The variety comes from what's added around it, not from buying something different every week.</p>
        </Section>

        <Section title="Build flavour inexpensively">
          <p>A short list of flavour-builders does most of the work here, and there's no need to own all of them at once, or to restock every one every week. One spice blend, one acidic ingredient and one savoury seasoning will already shift a dish a long way from its last outing.</p>
          <BulletList items={['Mustard', 'Curry powder', 'Smoked paprika', 'Dried herbs', 'Chilli flakes', 'Soy sauce', 'Vinegar or lemon juice', 'Garlic', 'Stock']} />
          <p>It is worth tasting as you go, particularly with stock, soy sauce and other salty seasonings. It's easy to oversalt a dish by adding several of these on top of each other without checking first. <a href="/food-costs/cheap-finishing-touches" className="font-semibold text-dbd-accent hover:underline">See which low-cost finishing touches add acidity, crunch, depth, heat or freshness</a>.</p>
        </Section>

        <Section title="Change the cooking method">
          <p>The same vegetable behaves differently depending on how it's cooked. Roasted cabbage picks up browned, slightly sweet edges that boiled cabbage never gets. Chickpeas can go soft into a curry or crisp up in the oven for a completely different texture. Potatoes can become wedges, mash, a rösti or a pie topping without a single change to the shopping list.</p>
          <p>These changes often require no new main ingredients. The point is to treat cooking method as another variable, alongside seasoning, rather than defaulting to the same pan and the same timing every time. Vegetables roasted quickly at a high temperature can taste quite different from the same vegetables simmered gently in a stew, even when the shopping list is identical.</p>
        </Section>

        <Section title="Add texture and contrast">
          <p>Budget dishes can start to feel monotonous when everything on the plate has the same soft texture. A small contrasting element often makes more difference than adding another costly ingredient.</p>
          <BulletList items={['Toasted breadcrumbs', 'Crisp fried onions', 'Shredded raw vegetables', 'Pickled onions', 'Seeds', 'A spoonful of yoghurt', 'Fresh herbs, when affordable', 'A squeeze of lemon']} />
          <p>A bowl of dhal, for example, changes considerably with a spoonful of yoghurt and a scattering of toasted seeds on top, even though the dhal itself hasn't changed at all. The same logic applies to soups, stews and anything else that tends to come out uniformly soft.</p>
        </Section>

        <Section title="Reuse ingredients without repeating the same dinner">
          <p>Shopping for a small set of ingredients that reappear across several dishes can bring costs down while still giving some variety. Peppers, onions and tinned tomatoes, for instance, can turn up in:</p>
          <BulletList items={['A smoky bean chilli', 'A vegetable paella', 'A tomato and pepper pasta sauce']} />
          <p>The ingredients overlap, but the seasoning, texture and format change from one dinner to the next. It is worth noting that a shared ingredient list doesn't automatically guarantee a saving; pack size, what goes unused and current retailer pricing all affect the real cost.</p>
        </Section>

        <ProgrammaticDisclosureList items={LOW_COST_DINNERS_DISCLOSURES} className="mt-8" />

        <Section title="Give familiar dishes one deliberate change">
          <p>None of this means reinventing every dinner from scratch. Most households already have two or three low-cost dishes on repeat, and the quickest way to see a difference is to leave the dish alone and change one detail around it. Sometimes one small, deliberate change to something already in rotation is enough:</p>
          <BulletList items={['Add mustard and crisp breadcrumbs to cauliflower cheese.', 'Turn leftover chilli into stuffed potatoes.', 'Add roasted carrots and warm spices to lentil soup.', 'Finish tomato pasta with toasted crumbs and lemon zest.', 'Add shredded cabbage and a sharp dressing beside sausages and mash.']} />
          <p>Each of these keeps the original shopping list intact. The change is in the detail added on top, which is usually enough to make a familiar dish feel worth cooking again.</p>
        </Section>

        <Section title="A note on effort and cost">
          <p>It's worth being honest that none of this is effortless for everyone. Time, energy, equipment, food prices and access to a decent supermarket vary a great deal between households, and low-cost cooking asks more of some people than others.</p>
          <p>Ready-made options aren't a step down from this either; they can be the sensible choice, particularly when they cut down on waste or suit a smaller household better than cooking from scratch. <a href="/guides/home-cooked-or-ready-made-dinners" className="font-semibold text-dbd-accent hover:underline">Compare the two approaches in more detail</a>.</p>
        </Section>

        <Section title="Where to start">
          <p>Affordable cooking tends to stick as a habit when it still gives people something to look forward to. Variety doesn't need a bigger shopping list. It needs a change to how the same ingredients are seasoned, cooked or finished.</p>
          <p>This week, try picking one low-cost dish already in rotation and changing a single thing about it: the seasoning, the cooking method, the texture, or the finish.</p>
        </Section>

        <Section title="Related guidance">
          <p><a href="/food-costs/low-cost-cooking-techniques" className="font-semibold text-dbd-accent hover:underline">Explore three low-cost cooking techniques</a>, <a href="/food-costs/five-dinners-same-ingredients" className="font-semibold text-dbd-accent hover:underline">see how shared ingredients can become five different dinners</a> or <a href="/pricing-methodology" className="font-semibold text-dbd-accent hover:underline">read how DinnerByDesign calculates ingredient costs</a>.</p>
        </Section>

        <ProgrammaticDisclosureFooter copy={LOW_COST_DINNERS_DISCLOSURE_FOOTER} className="mt-10" />
      </article>

      <section className="mt-10 rounded bg-dbd-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div><h2 className="text-lg font-semibold">Make familiar ingredients feel less predictable</h2><p className="mt-1.5 max-w-xl text-xs leading-5 text-white/70 sm:text-sm">Tell DinnerByDesign what you already have, your budget and your preferences, and find a dinner that gives those ingredients a different direction.</p></div>
        <button type="button" onClick={onFindDinner} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-white px-4 text-xs font-semibold text-dbd-ink sm:mt-0 sm:w-auto">Find a dinner <ArrowRight size={14} /></button>
      </section>
    </main>
  </div>
);
