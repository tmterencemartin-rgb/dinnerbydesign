import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AppView } from '../../types';

interface MethodologyProps { setView: (view: AppView) => void; }

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3 border-t border-gray-100 pt-6">
    <h2 className="text-[18px] font-bold text-gray-900">{title}</h2>
    <div className="space-y-3 text-[14px] leading-relaxed text-gray-600">{children}</div>
  </section>
);

const MethodologyShell: React.FC<MethodologyProps & { eyebrow: string; title: string; introduction: string; children: React.ReactNode }> = ({ setView, eyebrow, title, introduction, children }) => {
  const { user } = useAuth();
  const isGuest = !user || user.isAnonymous;
  return (
    <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto max-w-2xl px-4 py-12 pb-20 select-text">
      <button type="button" onClick={() => setView(isGuest ? 'landing' : 'home')} className="mb-6 rounded p-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent">
        ← {isGuest ? 'Back to DinnerByDesign' : 'Back to Search'}
      </button>
      <header className="space-y-3">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dbd-accent">{eyebrow}</p>
        <h1 className="text-[24px] font-bold leading-9 text-gray-950">{title}</h1>
        <p className="text-[14px] leading-relaxed text-gray-600">{introduction}</p>
        <p className="text-[11.5px] text-gray-500">Last updated: 18 July 2026</p>
      </header>
      <div className="mt-8 space-y-6">{children}</div>
      <div className="mt-10 border-t border-gray-100 pt-6 text-[14px] leading-relaxed text-gray-500">
        Questions can be sent to <a href="mailto:terence@dinnerbydesign.app" className="font-semibold text-dbd-accent hover:underline">terence@dinnerbydesign.app</a>.
      </div>
    </motion.main>
  );
};

export const FoodSafetyMethodologyView: React.FC<MethodologyProps> = ({ setView }) => (
  <MethodologyShell setView={setView} eyebrow="Safety and dietary transparency" title="Dietary, allergy and cooking safety" introduction="DinnerByDesign uses saved dietary rules, allergy selections and ingredient exclusions to filter dinner suggestions. These safeguards reduce unsuitable results, but they cannot replace checking ingredients, packaging and safe cooking guidance yourself.">
    <Section title="How dietary filtering works">
      <p>Dietary rules, declared allergies and ingredients to avoid are passed into the search process as hard constraints. Results are then checked programmatically against recognised ingredient and dietary terms before being shown.</p>
      <p>Rules can include vegetarian, vegan, pescatarian and other dietary patterns, as well as named allergens and personal exclusions. A recipe is rejected when its available information conflicts with an active hard constraint.</p>
    </Section>
    <Section title="Why filtering cannot guarantee suitability">
      <p>Recipe titles, descriptions and ingredient lists may be incomplete, ambiguous or use unfamiliar names. Cross-contamination, manufacturing methods, compound ingredients and changes to branded products are not always visible in recipe information.</p>
      <p>DinnerByDesign therefore cannot certify a dinner as allergen-free, medically suitable, religiously compliant or safe for a particular person. The absence of a warning does not prove the absence of an allergen.</p>
    </Section>
    <Section title="Packaged and ready-made products">
      <p>Always read the current product label before buying or eating a ready-made product. Manufacturers may change ingredients, allergen statements, preparation instructions and production facilities without notice.</p>
      <p>Where allergies are serious, contact the manufacturer or retailer when the label does not provide enough certainty. Do not rely on a product title, an older listing or DinnerByDesign’s summary.</p>
    </Section>
    <Section title="Cross-contamination and shared kitchens">
      <p>The app does not know how food was manufactured, transported, stored or prepared. It cannot assess “may contain” risks, shared production lines, restaurant kitchens, shared utensils or contamination within the home.</p>
    </Section>
    <Section title="Cooking temperatures and preparation">
      <p>Cooking times are practical guidance and can vary with ingredient size, starting temperature, appliance performance, cookware and recipe changes. Check that food is cooked safely throughout and follow current packaging and appliance instructions.</p>
      <p>Take particular care with poultry, minced meat, eggs, seafood, reheated food and leftovers. Use an appropriate food thermometer where necessary and follow recognised UK food-safety guidance.</p>
    </Section>
    <Section title="Medical diets and vulnerable people">
      <p>People managing diagnosed allergies, coeliac disease, diabetes, kidney disease, pregnancy-related restrictions or other medical needs should seek advice from an appropriately qualified professional. DinnerByDesign is not a medical or dietetic service.</p>
    </Section>
    <Section title="Your responsibility">
      <p>Before preparing or consuming a dinner, check the complete ingredient list, allergen information, product label, use-by date, storage instructions and cooking guidance. If anything is uncertain, do not use the suggestion until it has been independently confirmed.</p>
    </Section>
  </MethodologyShell>
);

export const RecipeMethodologyView: React.FC<MethodologyProps> = ({ setView }) => (
  <MethodologyShell setView={setView} eyebrow="Recipe and recommendation transparency" title="How dinner information is created and selected" introduction="DinnerByDesign uses Google Search to find published recipes, then combines user instructions, structured filters and generated summaries to produce focused dinner suggestions. Every recipe result includes a direct link to its original publisher.">
    <Section title="Search suggestions and recipe details">
      <p>Recipe cards and fuller details may be generated to match the user’s search, household, dietary rules, budget, cooking time and other preferences. They are concise DinnerByDesign summaries, not a verbatim reproduction of the publisher’s recipe.</p>
      <p>Use the original-publisher link for the complete current ingredient list, method and any source details that matter. Normal judgement and safety checks still apply.</p>
    </Section>
    <Section title="Where AI and automation are used">
      <p>Automated AI services help interpret searches, summarise recipe information, expand ingredient lists and methods, describe why a result may suit the user, and build candidate weekly plans. Structured software then applies required fields, dietary checks, exclusions and other consistency rules.</p>
      <p>Results are not routinely reviewed by a person before display. Automation can still produce an incorrect recipe detail, product name, price, retailer or explanation. Important information should be checked against the linked source, current product label or retailer listing.</p>
      <p>These systems support dinner planning; they do not make decisions with legal or similarly significant effects about users.</p>
    </Section>
    <Section title="Where recipes come from">
      <p>DinnerByDesign uses Google Search to find published recipes. Where Google supplies an exact source link, that link is used. If it does not, DinnerByDesign accepts only a direct recipe page from an approved publisher, never a search-results or category page. The publisher owns that recipe and its current ingredients, method and other details.</p>
      <p>We include publishers only when a direct recipe page is accessible. A publisher may be left out when a page requires a subscription, sign-in or app hand-off, or does not reliably open as a direct recipe link.</p>
      <p>Preferred publishers are a ranking preference, not a guarantee. They can influence relevance, but a stronger source-backed match from another publisher may still appear.</p>
      <p>A source link does not mean that the publisher created, approved or endorsed DinnerByDesign’s summary, or that DinnerByDesign has a commercial relationship with that publisher.</p>
    </Section>
    <Section title="How search results are selected">
      <p>Search terms establish the user’s immediate intent. Active dietary rules, allergies and exclusions act as hard constraints. Other settings—such as cuisine, time, budget, cooking method, preferred sources, nearby retailers and nutrition priorities—help narrow or rank suitable options.</p>
      <p>Some preferences are priorities rather than guarantees. The app may return the closest suitable alternatives when the request and the available constraints cannot all be satisfied.</p>
    </Section>
    <Section title="Commercial relationships and ranking independence">
      <p>DinnerByDesign does not currently accept payment from chefs, publishers, supermarkets or manufacturers to place a result higher. Results are not ranked according to advertising spend, commission or sponsorship.</p>
      <p>External recipe and retailer links are not currently presented as affiliate links. If a future link can generate commission, or if content is sponsored or paid for, that relationship will be clearly labelled close to the relevant result.</p>
      <p>User-selected preferred sources and retailers can influence relevance and ranking because the user has asked for that preference. This is different from commercial promotion and does not guarantee that the preferred source will appear when another result is materially more suitable.</p>
    </Section>
    <Section title="How Plan My Week selects dinners">
      <p>Weekly planning considers the requested number of dinners, household size, weekly budget, available time, protein choices and saved search preferences. When selected, it also prioritises lower estimated costs and ingredients that can be reused across more than one dinner.</p>
      <p>The planner creates candidate dinners and applies the same dietary safeguards used in search. It does not guarantee the mathematically cheapest possible basket, and early dinner estimates may change after scheduling, ingredient consolidation and full-pack calculations.</p>
    </Section>
    <Section title="Ready-made product information">
      <p>Ready-made mode is intended to identify plausible commercially available UK products and useful accompaniments. Product names, retailers, availability, serving sizes, prices and preparation instructions can change.</p>
      <p>Always confirm that the named product currently exists at the stated retailer and check the retailer listing and product packaging before purchase or preparation. Suggested sides and upgrades are DinnerByDesign recommendations, not necessarily part of the manufacturer’s product.</p>
    </Section>
    <Section title="Verification and limitations">
      <p>DinnerByDesign applies structured checks for dietary conflicts, required fields and retailer restrictions, but it does not manually test every recipe or continuously verify every external page and supermarket listing.</p>
      <p>Report information that appears inaccurate, unavailable, unsafe or incorrectly attributed so it can be reviewed.</p>
    </Section>
    <Section title="What ad-free means">
      <p>“Ad-free” means the core app does not display third-party banner advertising, behavioural adverts or paid placements disguised as ordinary dinner results. References to products, supermarkets and publishers are part of the search and planning function.</p>
      <p>If the commercial model changes, paid promotion will not be represented as an independent recommendation and this methodology will be updated.</p>
    </Section>
  </MethodologyShell>
);

export const NutritionMethodologyView: React.FC<MethodologyProps> = ({ setView }) => (
  <MethodologyShell setView={setView} eyebrow="Nutrition transparency" title="How nutrition estimates should be understood" introduction="Calories, protein and other nutritional figures in DinnerByDesign are planning estimates. They help compare dinners and apply broad preferences, but they are not laboratory measurements or medical nutrition advice.">
    <Section title="Where nutrition figures come from">
      <p>Nutrition values may be generated from the described ingredients, quantities, portions and typical values for comparable foods. For ready-made products, figures may reflect available product information or a representative estimate.</p>
      <p>The app does not currently calculate every result from a continuously updated, independently verified product-level nutrition database.</p>
    </Section>
    <Section title="Per-portion calculations">
      <p>Values shown per portion depend on the assumed recipe yield and serving size. Changing portions can change the quantities used, while the actual amount served to each person may differ from the calculated share.</p>
    </Section>
    <Section title="Why actual values vary">
      <p>Nutrition changes with brands, varieties, fat content, preparation, drained weight, trimming, cooking losses, absorbed oil, optional ingredients and substitutions. Fresh ingredients also vary naturally.</p>
      <p>Even manufacturer declarations use permitted tolerances and may change when a product is reformulated.</p>
    </Section>
    <Section title="Nutrition filters and priorities">
      <p>A calorie ceiling is used to prefer or exclude results according to the available estimate. “High protein”, “nutritious” and similar choices influence selection but do not certify a dinner against a regulated nutrition or health claim.</p>
      <p>A missing nutrition value means the app does not have enough information to present that figure; it should not be interpreted as zero.</p>
    </Section>
    <Section title="Medical and performance use">
      <p>Do not rely on DinnerByDesign alone for insulin dosing, therapeutic diets, eating-disorder treatment, renal diets, pregnancy nutrition, sports performance plans or other medical decisions. Consult product labels and an appropriately qualified professional.</p>
    </Section>
    <Section title="Our presentation standard">
      <p>Nutrition figures should be labelled as estimates and shown with their portion basis. DinnerByDesign will not describe generated nutrition as exact, clinically validated or laboratory tested unless evidence supports that description.</p>
    </Section>
  </MethodologyShell>
);
