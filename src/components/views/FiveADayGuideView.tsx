import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FIVE_A_DAY_GUIDE as guide } from '../../content/fiveADayGuide';
import { FIVE_A_DAY_DISCLOSURE_FOOTER, FIVE_A_DAY_DISCLOSURES } from '../../content/programmaticDisclosures';
import { ProgrammaticDisclosureFooter, ProgrammaticDisclosureList } from '../ProgrammaticDisclosures';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-10">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="mt-4 space-y-4 text-[15px] leading-7 text-dbd-ink-3">{children}</div>
  </section>
);

export const FiveADayGuideView: React.FC<{ onFindDinner: () => void }> = ({ onFindDinner }) => (
  <div className="min-h-screen bg-[#faf9f7] text-dbd-ink">
    <header className="border-b border-dbd-rule/50 bg-dbd-surface">
      <div className="mx-auto flex min-h-[82px] max-w-5xl items-center justify-between px-4 sm:min-h-[96px]">
        <a href="/" aria-label="DinnerByDesign home"><img src="/dbd-logo-with-pin.png" alt="DinnerByDesign" className="h-[38px] w-auto max-w-[230px] object-contain mix-blend-multiply sm:h-[44px]" /></a>
        <a href="/signin?mode=signin" className="text-xs font-bold text-dbd-accent hover:underline">Sign in</a>
      </div>
    </header>
    <main className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-dbd-ink-3"><a href="/" className="hover:underline">DinnerByDesign</a><span className="px-2">/</span><a href="/guides" className="hover:underline">Guides</a><span className="px-2">/</span><span>Nutrition guide</span></nav>
      <article>
        <header className="mt-7">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">Nutrition guide</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-dbd-ink-3">{guide.description}</p>
          <p className="mt-3 text-xs text-dbd-ink-3">By {guide.editorialOwner} · Published 24 July 2026 · Last reviewed 24 July 2026</p>
        </header>

        <section className="mt-10 border-t border-dbd-rule/50 pt-8">
          <div className="space-y-4 text-[15px] leading-7 text-dbd-ink-3">
            <p>Onion, carrot, celery and tomato go into the pan for a Bolognese. Four vegetables, and a natural assumption follows: that is four portions of your 5 A Day, sorted. It is not quite that simple, though the vegetables are not wasted either.</p>
            <p>They still count. Cooking, mixing and serving vegetables inside a dish does not cancel them out. What changes is the maths, not the eligibility.</p>
          </div>
        </section>

        <Section title="Vegetables cooked into a dish still count">
          <p>The NHS is direct on this point: fruit and vegetables do not have to be eaten on their own to count, and they do not have to be fresh. Frozen, tinned and dried varieties are all eligible, and so are vegetables cooked into soups, stews, curries and pasta sauces.</p>
          <p>That covers much of what a UK household cooks on a weeknight. A chilli made with tinned tomatoes and kidney beans, a paella built on peppers and peas, or a curry base of onion and garlic can all contribute. Cooking a vegetable into a sauce does not remove it from the count.</p>
          <p>Base ingredients people may overlook can contribute too. Onion counts when enough reaches the plate. Concentrated tomato purée follows a different calculation from fresh tomato, with one heaped tablespoon counting as a portion.</p>
        </Section>

        <Section title="Variety and portion count are not the same thing">
          <p>This is where the confusion usually starts. Four vegetable varieties in a recipe reads as four portions, but a portion is a quantity, not a headcount of ingredients.</p>
          <p>An adult portion is roughly 80g of eligible vegetable, and it has to reach the plate. A Bolognese made with onion, carrot, celery and tomato may deliver only one or two full portions per serving once the total vegetable weight is divided across everyone eating it. The dish contains four varieties. It is unlikely to contain four portions.</p>
          <p>Potatoes are a separate case and worth flagging early. They are classed as a starchy food by the NHS, not a vegetable, so they do not count towards the total, however they are cooked.</p>
        </Section>

        <Section title="Working out what a dinner is actually giving you">
          <p>For ordinary fresh, frozen or tinned vegetables, the calculation is straightforward once the ingredient weights are known. Purées, dried produce, beans and pulses each follow their own rule instead. Add up the eligible vegetable weight in the full recipe, divide by the number of servings, then divide that figure by 80.</p>
          <div className="rounded border border-dbd-rule/70 bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dbd-accent">Illustrative calculation</p>
            <ul className="mt-3 space-y-2 text-sm leading-6">
              <li>800g eligible vegetables in the pot</li>
              <li>Recipe serves four</li>
              <li>200g vegetables per serving</li>
              <li className="font-semibold text-dbd-ink">200 ÷ 80 = roughly 2.5 portions per serving</li>
            </ul>
          </div>
          <p>Treat that as an estimate rather than a fixed figure. Trimming, ingredient swaps and how generously a dish is served can all move the number up or down. A recipe listing four vegetables and a recipe delivering four portions on the plate are two different things, and the gap between them is usually where people overestimate.</p>
        </Section>

        <ProgrammaticDisclosureList items={FIVE_A_DAY_DISCLOSURES} className="mt-8" />

        <Section title="Does cooking reduce the benefit?">
          <p>Some vitamins are heat-sensitive, and prolonged cooking does reduce levels of certain ones, vitamin C among them. That is a real trade-off, not a reason to write off cooked vegetables generally.</p>
          <p>Cooking can also improve access to certain nutrients. The clearest evidence is for tomatoes: a controlled trial found that lycopene from tomato paste was substantially more available to the body than the same dose from fresh tomato, when both were eaten alongside a source of fat. That finding is specific to tomatoes and to this comparison. It is not a general rule that cooking improves nutrient absorption across vegetables.</p>
          <p>Tinned, frozen and dried forms can all contribute, though not always by the same rule. Tinned and frozen vegetables match fresh weight for weight. Dried fruit is measured differently, at 30g rather than 80g. Beans and pulses can count only once per day, however much of them you eat.</p>
        </Section>

        <Section title="Getting more from dinners you already cook">
          <p>Reaching a higher portion count rarely means changing what is on the menu. Smaller adjustments to a recipe already in rotation tend to move the number more than switching to something new.</p>
          <p>Bulking a Bolognese or chilli with extra tinned tomatoes or added vegetables such as mushrooms and peppers raises the total vegetable weight without changing the dish. Beans and pulses are a partial exception: a second tin adds volume and fibre, but it does not add a second portion, since beans and pulses can count only once per day.</p>
          <p>The ratio of sauce to servings matters too. Stretching a sauce from four servings to six leaves each serving at about two-thirds of its original amount. The drop still reduces what each person gets.</p>
        </Section>

        <Section title="The short version">
          <p>A dish with several vegetable ingredients is not the same as a dish with several portions. Cooking does not disqualify a vegetable from the 5 A Day count, and tinned, frozen and dried forms can all contribute, though each follows its own rule rather than one shared 80g calculation. What determines the portion figure is weight per serving, not the number of vegetables listed. Working that out, even roughly, is a better guide than counting ingredients on the packet.</p>
        </Section>

        <Section title="Sources and further reading">
          <ul className="space-y-2">
            {guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-dbd-accent hover:underline">{source.label}</a></li>)}
          </ul>
        </Section>

        <ProgrammaticDisclosureFooter copy={FIVE_A_DAY_DISCLOSURE_FOOTER} className="mt-10" />
      </article>

      <section className="mt-10 rounded bg-dbd-ink p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div><h2 className="text-lg font-semibold">Put the vegetables you have to use</h2><p className="mt-1.5 max-w-xl text-xs leading-5 text-white/70 sm:text-sm">Tell DinnerByDesign what needs using, along with your time, budget and preferences, and find a dinner that fits.</p></div>
        <button type="button" onClick={onFindDinner} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-white px-4 text-xs font-semibold text-dbd-ink sm:mt-0 sm:w-auto">Find a dinner <ArrowRight size={14} /></button>
      </section>
    </main>
  </div>
);
