import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { safeStorage } from '../../lib/storage';
import { 
  Search as SearchIcon, 
  Calendar as CalendarIcon, 
  ShoppingCart as ShoppingCartIcon, 
  Check as CheckIcon, 
  ArrowDown as ArrowDownIcon,
  Globe as GlobeIcon,
  Menu as MenuIcon,
  X as XIcon,
  Sparkles as SparklesIcon
} from 'lucide-react';

const LOGO_EASE: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

const logoVariants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      clipPath: {
        duration: 0.75,
        ease: LOGO_EASE
      },
      opacity: {
        duration: 0.25
      }
    }
  }
};

export const LandingView: React.FC = () => {
  const { setView, goToSignIn, user, accessStatus } = useAuth();
  const hasAccess = !!user && !user.isAnonymous && (accessStatus === 'paid' || accessStatus === 'trial');

  // Scroll tracking & responsive menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [sandboxQuery, setSandboxQuery] = useState('Chicken Fricassee');
  const [sandboxSource, setSandboxSource] = useState<'cook' | 'ready-made'>('cook');
  const [isSandboxSearching, setIsSandboxSearching] = useState(false);
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Predefined datasets for the interactive sandbox mockup
  const mockCookData: Record<string, { title: string; meta: string; source: string }[]> = {
    'Chicken Fricassee': [
      { title: 'Classic Creamy Chicken Fricassée', meta: '45 min · serves 4 · ~£6.80', source: 'BBC Food' },
      { title: 'French Bistro Chicken Fricassée', meta: '50 min · serves 2 · ~£5.50', source: 'Good Food' },
      { title: "Jamie’s Quick Chicken Fricassée", meta: '30 min · serves 4 · ~£7.20', source: 'Jamie Oliver' }
    ],
    'Minced Beef': [
      { title: 'Easy Minced Beef Tacos', meta: '20 min · serves 4 · ~£3.80', source: 'Good Food' },
      { title: 'Classic Cottage Pie with Rich Gravy', meta: '45 min · serves 4 · ~£4.50', source: 'BBC Food' },
      { title: 'Spiced Beef Koftas with Mint Yogurt', meta: '25 min · serves 2 · ~£3.20', source: 'Olive Mag' }
    ],
    'Spaghetti': [
      { title: 'Garlic, Chilli & Oil Spaghetti (Aglio e Olio)', meta: '15 min · serves 2 · ~£1.20', source: 'BBC Good Food' },
      { title: 'Zesty Lemon & Herb Spaghetti with Pangrattato', meta: '20 min · serves 2 · ~£1.80', source: 'Olive Mag' },
      { title: 'Creamy Garlic Mushroom Spaghetti', meta: '20 min · serves 2 · ~£2.50', source: 'Jamie Oliver' }
    ],
    'Jamie Oliver': [
      { title: "Jamie’s Quick Chicken Fricassée", meta: '30 min · serves 4 · ~£7.20', source: 'Jamie Oliver' },
      { title: "Jamie's Simple Tomato & Basil Pasta", meta: '15 min · serves 2 · ~£1.10', source: 'Jamie Oliver' },
      { title: "Jamie's Ultimate Spaghetti Bolognese", meta: '45 min · serves 4 · ~£5.30', source: 'Jamie Oliver' }
    ],
    'Air Fryer': [
      { title: 'Air Fryer Crispy Pork Chops', meta: '20 min · serves 2 · ~£4.80', source: 'Good Food' },
      { title: 'Air Fryer Herb Roasted Potatoes', meta: '15 min · serves 3 · ~£1.20', source: 'BBC Food' },
      { title: 'Air Fryer Beef Meatballs', meta: '18 min · serves 4 · ~£3.90', source: 'BBC Food' }
    ],
    'Lobster': [
      { title: 'Grilled Lobster Tails with Garlic Butter', meta: '25 min · serves 2 · ~£18.50', source: 'Good Food' },
      { title: 'Classic Lobster Thermidor', meta: '45 min · serves 2 · ~£22.00', source: 'BBC Food' },
      { title: 'Creamy Lobster Bisque', meta: '40 min · serves 4 · ~£15.00', source: 'Olive Mag' }
    ],
    'Plaice': [
      { title: 'Pan-Fried Plaice with Lemon Butter', meta: '15 min · serves 2 · ~£6.50', source: 'Good Food' },
      { title: 'Baked Plaice with Herb Crumb', meta: '20 min · serves 2 · ~£5.80', source: 'BBC Food' },
      { title: 'Plaice Goujons with Pea Mash', meta: '25 min · serves 4 · ~£7.20', source: 'Waitrose' }
    ],
    'Vegetarian': [
      { title: 'Roasted Mediterranean Vegetable Tart', meta: '35 min · serves 4 · ~£4.20', source: 'Good Food' },
      { title: 'Creamy Mushroom & Spinach Risotto', meta: '30 min · serves 2 · ~£3.50', source: 'BBC Food' },
      { title: 'Spiced Sweet Potato & Chickpea Curry', meta: '25 min · serves 4 · ~£2.80', source: 'Budget Bytes' }
    ],
    'Pork bones': [
      { title: 'Rich Tonkotsu Pork Bone Broth', meta: '8h · serves 6 · ~£4.50', source: 'Waitrose' },
      { title: 'Slow Cooked Roasted Pork Bone Gravy', meta: '2h · serves 8 · ~£2.20', source: 'BBC Food' },
      { title: 'BBQ Smoked Pork Neck Bones', meta: '3h · serves 4 · ~£5.80', source: 'Good Food' }
    ],
    'Less than £2.50': [
      { title: 'Creamy Spiced Red Lentil Dhal', meta: '25 min · serves 4 · ~£1.80', source: 'Budget Bytes' },
      { title: 'Simple Tomato & Basil Pasta', meta: '15 min · serves 2 · ~£1.10', source: 'Tesco' },
      { title: 'Zesty Chickpea & Spinach Stew', meta: '20 min · serves 2 · ~£2.20', source: 'BBC Food' }
    ]
  };

  const mockReadyMadeData: Record<string, { title: string; meta: string; source: string }[]> = {
    'Chicken Fricassee': [
      { title: 'M&S Gastropub Chicken Fricassée', meta: '40 min · serves 2 · ~£8.00', source: 'Marks & Spencer' },
      { title: 'Waitrose Slow Cooked Chicken Fricassée', meta: '35 min · serves 2 · ~£7.50', source: 'Waitrose' },
      { title: 'Tesco Finest Chicken Fricassée with Rice', meta: '15 min · serves 1 · ~£4.50', source: 'Tesco' }
    ],
    'Minced Beef': [
      { title: 'Sainsbury’s Rich Beef Cottage Pie', meta: '30 min · serves 1 · ~£3.20', source: "Sainsbury's" },
      { title: 'Tesco Finest Beef Lasagne', meta: '40 min · serves 2 · ~£6.50', source: 'Tesco' },
      { title: "Sainsbury's Beef Keema Curry & Rice", meta: '10 min · serves 1 · ~£3.50', source: "Sainsbury's" }
    ],
    'Spaghetti': [
      { title: 'Tesco Italian Meat-Free Spaghetti', meta: '12 min · serves 1 · ~£3.20', source: 'Tesco' },
      { title: "Sainsbury's Tomato & Basil Spaghetti", meta: '10 min · serves 1 · ~£2.80', source: "Sainsbury's" },
      { title: 'M&S Gastropub Tomato & Mozzarella Spaghetti', meta: '12 min · serves 1 · ~£4.00', source: 'Marks & Spencer' }
    ],
    'Jamie Oliver': [
      { title: "Jamie Oliver's Tesco Italian Selection", meta: 'Ready to eat · serves 2 · ~£4.50', source: 'Tesco' },
      { title: "Jamie Oliver Chef Special Pasta Sauce", meta: 'Ready to eat · serves 2 · ~£2.50', source: 'Asda' },
      { title: "Jamie Oliver Veggie Bolognese Pot", meta: 'Ready to eat · serves 1 · ~£3.00', source: 'Tesco' }
    ],
    'Air Fryer': [
      { title: 'Tesco Air-Fryer Ready Crispy Chicken Wings', meta: '18 min · serves 2 · ~£3.80', source: 'Tesco' },
      { title: 'M&S Crispy Air-Fry Chips & Dips', meta: '15 min · serves 2 · ~£4.00', source: 'Marks & Spencer' },
      { title: 'Waitrose Air-Fryer Crispy Salt & Pepper Squid', meta: '12 min · serves 2 · ~£5.50', source: 'Waitrose' }
    ],
    'Lobster': [
      { title: 'M&S Gastropub Lobster Mac & Cheese', meta: '25 min · serves 2 · ~£12.00', source: 'Marks & Spencer' },
      { title: 'Waitrose Whole Cooked Lobster', meta: 'Ready to eat · serves 1 · ~£15.50', source: 'Waitrose' },
      { title: 'Tesco Finest Lobster Thermidor', meta: '15 min · serves 1 · ~£10.50', source: 'Tesco' }
    ],
    'Plaice': [
      { title: 'Waitrose Breaded Plaice Fillets', meta: '18 min · serves 2 · ~£5.50', source: 'Waitrose' },
      { title: 'Tesco Plaice Goujons', meta: '15 min · serves 2 · ~£4.00', source: 'Tesco' },
      { title: 'M&S Lemon & Parsley Plaice Fillets', meta: '20 min · serves 2 · ~£6.50', source: 'Marks & Spencer' }
    ],
    'Vegetarian': [
      { title: 'Tesco Finest Nut Roast with Cranberries', meta: '45 min · serves 2 · ~£6.50', source: 'Tesco' },
      { title: "Sainsbury's Vegetable Lasagne", meta: '40 min · serves 1 · ~£3.20', source: "Sainsbury's" },
      { title: 'M&S Gastropub Roast Vegetable Moussaka', meta: '35 min · serves 2 · ~£7.50', source: 'Marks & Spencer' }
    ],
    'Pork bones': [
      { title: 'Waitrose British Pork Bones for Stock', meta: 'Ready to cook · serves 4 · ~£1.50', source: 'Waitrose' },
      { title: 'Tesco Slow Cooked BBQ Pork Ribs', meta: '35 min · serves 2 · ~£5.50', source: 'Tesco' },
      { title: 'M&S Gastropub Salt & Pepper Pork Ribs', meta: '30 min · serves 2 · ~£6.50', source: 'Marks & Spencer' }
    ],
    'Less than £2.50': [
      { title: "Sainsbury's Macaroni Cheese", meta: '25 min · serves 1 · ~£1.95', source: "Sainsbury's" },
      { title: 'Tesco Everyday Value Cottage Pie', meta: '30 min · serves 1 · ~£2.20', source: 'Tesco' },
      { title: 'Asda Smart Price Minced Beef Hotpot', meta: '25 min · serves 1 · ~£1.85', source: 'Asda' }
    ]
  };

  const handleStart = (initialSearchQuery?: string) => {
    safeStorage.setItem('dbd_has_started', 'true');
    if (initialSearchQuery) {
      safeStorage.session.setItem('dbd_initial_search_query', initialSearchQuery);
    }

    setView('home');
  };

  const handleSignIn = () => {
    if (!user || user.isAnonymous) {
      goToSignIn();
    } else {
      setView('settings');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectSandboxTag = (tag: string) => {
    setIsSandboxSearching(true);
    setSandboxQuery(tag);
    setTimeout(() => {
      setIsSandboxSearching(false);
    }, 450);
  };

  const selectSandboxSource = (source: 'cook' | 'ready-made') => {
    setIsSandboxSearching(true);
    setSandboxSource(source);
    setTimeout(() => {
      setIsSandboxSearching(false);
    }, 400);
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionEmail || !subscriptionEmail.includes('@')) return;
    setIsEmailSubmitting(true);
    setTimeout(() => {
      setIsEmailSubmitting(false);
      setEmailSuccess(true);
      setTimeout(() => {
        handleStart();
      }, 1500);
    }, 1200);
  };

  // Get current state records
  const currentResultList = sandboxSource === 'cook'
    ? (mockCookData[sandboxQuery] || mockCookData['Chicken Fricassee'])
    : (mockReadyMadeData[sandboxQuery] || mockReadyMadeData['Chicken Fricassee']);

  return (
    <div className="native-scroll-root bg-dbd-surface hover:scrollbar-hide min-h-screen text-dbd-ink font-sans selection:bg-dbd-accent selection:text-white antialiased">
      
      {/* 1. STICKY PREMIUM NAVIGATION BAR */}
      <nav id="top-nav" className="sticky top-0 z-[1000] bg-dbd-surface/90 backdrop-blur-md border-b border-dbd-rule/60 py-4.5 px-3 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Group */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex flex-col items-start text-left font-sans">
              <motion.img
                initial="hidden"
                animate="visible"
                variants={logoVariants}
                whileHover={{ scale: 1.035, rotate: -0.3 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                src="/dbd-logo-with-pin.png"
                alt="DinnerByDesign"
                className="h-[35.1px] w-auto max-w-[214.2px] origin-left object-contain mix-blend-multiply sm:h-[44.1px] sm:max-w-[267.3px]"
              />
              <span className="text-[8.5px] font-medium text-dbd-ink-3 tracking-[0.01em] mt-1.5 block leading-none whitespace-nowrap">
                Less searching. Better matches. Dinner, decided.
              </span>
            </div>
          </div>

          {/* Desktop Direct Links */}
          <div className="hidden md:flex items-center gap-8 font-ibm-plex-mono text-[12px] font-semibold text-dbd-ink-2">
            <button 
              onClick={() => scrollToSection('why-different')} 
              className="hover:text-dbd-accent tracking-tight transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
            >
              Why it's different
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-dbd-accent tracking-tight transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="hover:text-dbd-accent tracking-tight transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('public-pathways')}
              className="hover:text-dbd-accent tracking-tight transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
            >
              Explore
            </button>
          </div>

          {/* Mobile Menu Action button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="text-dbd-ink-2 hover:text-dbd-accent transition-colors p-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded"
            >
              {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-dbd-surface border-b border-dbd-rule shadow-xl py-6 px-6 flex flex-col gap-4 font-ibm-plex-mono font-semibold text-[13px] md:hidden"
            >
              <button 
                onClick={() => scrollToSection('why-different')} 
                className="hover:text-dbd-accent py-2 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
              >
                Why it's different
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="hover:text-dbd-accent py-2 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
              >
                How it works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="hover:text-dbd-accent py-2 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('public-pathways')}
                className="hover:text-dbd-accent py-2 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
              >
                Explore public resources
              </button>
              <hr className="border-dbd-rule/40 my-1" />
              <button 
                onClick={handleSignIn} 
                className="bg-dbd-accent text-white text-center font-bold tracking-wider uppercase py-3 rounded-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-dbd-accent w-full cursor-pointer"
              >
                {user && !user.isAnonymous ? 'Account' : 'Sign in'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO HEADER SECTION */}
      <section className="relative px-6 max-w-5xl mx-auto pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-dbd-ink font-sans leading-[1.15] tracking-tight mb-6 max-w-4xl mx-auto">
          Find what to cook, what to buy <br /> and what it might cost.
        </h1>
        <p className="text-[14px] sm:text-[18px] text-dbd-ink-2 max-w-3xl leading-relaxed mx-auto font-sans font-normal mb-10">
          An ad-free, UK-focused dinner app for finding recipes, planning around your budget and building costed shopping lists. Try three real searches without an account, then create one when you want to save, schedule and plan your week.
        </p>

        {/* Action button grouping */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-md mx-auto">
          <button 
            id="hero-start-trial-btn"
            onClick={() => handleStart()}
            className="w-full sm:w-auto bg-dbd-accent hover:bg-dbd-accent-mid text-white font-ibm-plex-mono text-[13px] font-semibold tracking-wider uppercase px-8 py-4 rounded-sm transition-all cursor-pointer shadow-md"
          >
            Try a free search
          </button>
          <button 
            onClick={() => scrollToSection('interactive-sandbox')}
            className="w-full sm:w-auto bg-white border border-dbd-rule hover:border-dbd-accent hover:text-dbd-accent text-dbd-ink font-ibm-plex-mono text-[13px] font-semibold tracking-wider uppercase px-8 py-4 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            See how it works <ArrowDownIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-4 text-[12px] font-medium text-dbd-ink-3">
          Three searches. No account required.
        </p>
      </section>

      <section id="public-pathways" className="scroll-mt-nav border-y border-dbd-rule/50 bg-[#F4F1EA] px-6 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.2em] text-dbd-accent uppercase block mb-3">
              Explore DinnerByDesign
            </span>
            <h2 className="text-2xl font-sans font-bold leading-tight text-dbd-ink sm:text-3xl">Start with what you need</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-dbd-ink-2 sm:text-[16px]">
              Three public pathways keep related topics together, so you can find a plan, a recipe idea or practical cost guidance without searching through one long list.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Affordable dinner plans',
                description: 'Ready-made weeks with servings, shared ingredients and realistic shopping estimates.',
                href: '/dinner-plans',
              },
              {
                number: '02',
                title: 'Recipes and cooking ideas',
                description: 'Flexible formats and practical cooking ideas for everyday dinners.',
                href: '/recipes',
              },
              {
                number: '03',
                title: 'Food-cost and waste guidance',
                description: 'Clear help with grocery costs, portions, ingredient use and avoidable waste.',
                href: '/food-costs',
              },
            ].map(pathway => (
              <a key={pathway.href} href={pathway.href} className="group flex min-h-[188px] flex-col border border-dbd-rule/70 bg-white p-5 transition-colors hover:border-dbd-accent">
                <span className="text-[10px] font-mono font-bold text-dbd-accent">{pathway.number}</span>
                <h3 className="mt-3 text-lg font-bold leading-6 text-dbd-ink group-hover:text-dbd-accent">{pathway.title}</h3>
                <p className="mt-2 text-[13px] leading-5 text-dbd-ink-2">{pathway.description}</p>
                <span className="mt-auto pt-5 text-[11px] font-mono font-bold uppercase tracking-wider text-dbd-accent">Explore pathway →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE BROWSER PREVIEW SANDBOX */}
      <section id="interactive-sandbox" className="py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-5 text-[11px] font-ibm-plex-mono font-bold uppercase tracking-[0.2em] text-dbd-accent-mid select-none">
            — See It Work —
          </div>

          {/* Browser frame decoration */}
          <div className="border border-dbd-rule rounded-xl bg-white shadow-2xl overflow-hidden">
            
            {/* Browser top title bar */}
            <div className="bg-dbd-surface-2 border-b border-dbd-rule/80 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5 select-none shrink-0">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-grow flex justify-center max-w-[500px] mx-auto bg-white border border-dbd-rule rounded-md py-1 px-3 text-center text-[11px] sm:text-[12px] font-mono text-dbd-ink-3 select-none flex items-center justify-center gap-1.5">
                <GlobeIcon className="w-3 h-3 text-dbd-ink-3" />
                https://dinnerbydesign.app
              </div>
              <div className="w-12 shrink-0 hidden sm:block" />
            </div>

            {/* Sandbox Inner App Stage */}
            <div className="p-4 sm:p-8 bg-[#FAF8F5] text-left">
              
              {/* Recipe Source Toggle (HOMEMADE / READY-MADE) */}
              <div className="flex justify-center mb-6 max-w-sm sm:max-w-md mx-auto border border-dbd-rule/80 bg-dbd-surface-2/60 p-1 font-ibm-plex-mono font-semibold">
                <button 
                  onClick={() => selectSandboxSource('cook')}
                  className={`flex-1 py-2 px-3 text-center cursor-pointer transition-all ${sandboxSource === 'cook' ? 'bg-white shadow text-dbd-accent font-bold border-0' : 'text-dbd-ink-3 hover:text-dbd-ink'}`}
                >
                  <span className="block text-[12px] leading-tight uppercase font-bold tracking-wider">Homemade</span>
                  <span className="block text-[9px] text-dbd-ink-3 leading-none font-sans font-normal mt-0.5 lowercase">recipes to cook</span>
                </button>
                <button 
                  onClick={() => selectSandboxSource('ready-made')}
                  className={`flex-1 py-2 px-3 text-center cursor-pointer transition-all ${sandboxSource === 'ready-made' ? 'bg-white shadow text-dbd-accent font-bold border-0' : 'text-dbd-ink-3 hover:text-dbd-ink'}`}
                >
                  <span className="block text-[12px] leading-tight uppercase font-bold tracking-wider">Ready-Made</span>
                  <span className="block text-[9px] text-dbd-ink-3 leading-none font-sans font-normal mt-0.5 lowercase">supermarket options</span>
                </button>
              </div>

              {/* Fake Interactive Input String block */}
              <div className="max-w-2xl mx-auto flex border border-dbd-rule bg-white shadow-sm overflow-hidden select-none hover:border-dbd-accent transition-all">
                <div className="shrink-0 pl-4 py-3 flex items-center justify-center">
                  <SearchIcon className="w-4 h-4 text-dbd-ink-3" />
                </div>
                <div className="flex-grow px-3 py-3 font-ibm-plex-mono text-[12px] uppercase tracking-[0.08em] text-dbd-ink font-semibold flex items-center min-w-0">
                  {sandboxQuery}
                  <span className="animate-pulse font-normal ml-0.5 text-dbd-accent">|</span>
                </div>
                <button 
                  onClick={() => handleStart(sandboxQuery)}
                  className="shrink-0 bg-dbd-accent hover:bg-dbd-accent-mid text-white font-ibm-plex-mono text-[11px] font-bold uppercase tracking-wider px-5 sm:px-7 transition-all flex items-center justify-center"
                >
                  Find options
                </button>
              </div>

              {/* Preset Click Options */}
              <div className="max-w-2xl mx-auto mt-4 px-1">
                <p className="text-[12px] font-ibm-plex-mono font-semibold text-dbd-ink-3 mb-2">Try these preset queries:</p>
                <div className="flex flex-wrap gap-2">
                  {['Chicken Fricassee', 'Minced Beef', 'Spaghetti', 'Jamie Oliver', 'Air Fryer', 'Lobster', 'Plaice', 'Vegetarian', 'Pork bones', 'Less than £2.50'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => selectSandboxTag(tag)}
                      className={`text-[11px] sm:text-[12px] font-mono px-3 py-2 border rounded-sm transition-all cursor-pointer ${sandboxQuery === tag ? 'bg-dbd-accent/10 border-dbd-accent text-dbd-accent font-bold' : 'bg-white border-dbd-rule/80 text-dbd-ink-2 hover:border-dbd-ink hover:text-dbd-ink'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Timing indicator */}
              <div className="max-w-2xl mx-auto mt-8 border-b border-dbd-rule/40 pb-2 mb-4 flex items-center gap-2 select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono text-dbd-ink-3 font-semibold">
                  {isSandboxSearching ? (
                    <span className="text-dbd-accent animate-pulse font-medium">Re-indexing published records...</span>
                  ) : (
                    <span>{currentResultList.length} recipes • verified in 0.54s</span>
                  )}
                </span>
              </div>

              {/* Recipe List sandbox render */}
              <div className="max-w-2xl mx-auto space-y-3 relative min-h-[220px]">
                {isSandboxSearching ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-xs select-none">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-dbd-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-[11px] text-dbd-ink-3 font-mono">Costing ingredients & verifying links...</p>
                    </div>
                  </div>
                ) : null}

                {currentResultList.map((recipe, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleStart(sandboxQuery)}
                    className="group bg-white border border-dbd-rule/50 hover:border-dbd-accent/60 hover:shadow-xs p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div>
                      <h4 className="text-[14px] sm:text-[15px] font-semibold text-dbd-ink group-hover:text-dbd-accent transition-colors leading-tight mb-1 font-sans">
                        {recipe.title}
                      </h4>
                      <p className="text-[11px] sm:text-[12px] font-mono text-dbd-ink-3">
                        {recipe.meta}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-dbd-ink-3 bg-dbd-surface px-2.5 py-1.5 border border-dbd-rule/50 rounded-sm group-hover:border-dbd-accent group-hover:text-dbd-accent group-hover:bg-dbd-accent-light transition-all">
                      from {recipe.source}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. VALUE STATEMENT SECTION (No Ads / No Backstories) */}
      <section id="why-different" className="my-16 bg-[#EEECE7] border-y border-dbd-rule/60 py-16 px-6 sm:px-8 text-center scroll-mt-nav select-none">
        <div className="max-w-4xl mx-auto">
          <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.25em] text-dbd-accent uppercase block mb-6">
            A Tool, Not a Magazine
          </span>
          <div className="space-y-1 mb-8 font-sans text-3xl sm:text-4xl leading-[1.15] font-bold text-dbd-ink select-none">
            <h2>No ads.</h2>
            <h2>No backstories.</h2>
            <h2>No tracking, clutter, clickbait or questionnaires.</h2>
          </div>
          <p className="text-[14px] sm:text-[17px] text-dbd-ink-2 max-w-2xl leading-relaxed mx-auto font-sans font-normal">
            Just recipes.
          </p>
        </div>
      </section>

      {/* 5. BUILT AROUND YOUR KITCHEN */}
      <section className="py-16 px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          <div className="md:col-span-5 select-none">
            <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.2em] text-dbd-accent uppercase block mb-3">
              Built Around Your Kitchen
            </span>
            <h3 className="text-3xl sm:text-4xl font-sans font-bold text-dbd-ink leading-[1.15]">
              Less searching. Better matches. Dinner, decided.
            </h3>
          </div>

          <div className="md:col-span-7">
            <p className="text-[15px] sm:text-[17px] text-dbd-ink-2 leading-relaxed mb-8 max-w-prose select-none">
              Set one or more of the 18 filters once, or adjust per search. DinnerByDesign pinpoints and shortlists recipes that fit your diet, budget, cooking method and time.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8 text-[11.5px] sm:text-[13px] font-mono font-bold text-dbd-ink-3 uppercase tracking-wider select-none">
              <div className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />
                Diet & health
              </div>
              <div className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />
                Cost
              </div>
              <div className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />
                Time & effort
              </div>
              <div className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />
                Cooking methods
              </div>
              <div className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />
                Servings & style
              </div>
              <div className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />
                Sourcing
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. THREE TABS FEATURE EXPLAINER GRID */}
      <section id="how-it-works" className="py-16 bg-[#F4F1EA] border-t border-dbd-rule/40 scroll-mt-nav px-6 sm:px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12 select-none">
            <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.2em] text-dbd-accent uppercase block mb-3">
              How It Works
            </span>
            <h3 className="text-3xl sm:text-4xl font-sans font-bold text-dbd-ink">
              Three tabs. Search, schedule, shop.
            </h3>
          </div>

          <div className="divide-y divide-dbd-rule/70 border-y border-dbd-rule/70 sm:grid sm:grid-cols-3 sm:divide-y-0 sm:border-y-0 sm:gap-6">
            
            {/* Tab Card 1 */}
            <div className="py-4 sm:bg-white sm:border sm:border-dbd-rule sm:rounded-xl sm:p-6 lg:sm:p-8 sm:flex sm:flex-col sm:justify-between sm:shadow-xs sm:select-none sm:hover:scale-[1.01] sm:transition-all">
              <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 sm:block">
                <div className="hidden bg-dbd-accent-light text-dbd-accent w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:flex items-center justify-center sm:mb-6">
                  <SearchIcon className="w-5 h-5" />
                </div>
                <span className="pt-0.5 text-[11px] font-mono text-dbd-accent-mid font-bold sm:hidden">01</span>
                <div className="flex items-center gap-2 mb-1 sm:mb-3">
                  <span className="hidden text-[11px] font-mono text-dbd-accent-mid font-bold sm:inline">01</span>
                  <h4 className="text-[14px] sm:text-[15px] font-ibm-plex-mono font-bold uppercase tracking-wider text-dbd-ink">
                    Search
                  </h4>
                </div>
                <p className="col-start-2 text-[13px] sm:text-[14px] text-dbd-ink-2 leading-relaxed font-sans font-normal">
                  One set of ingredients returns verified, costed recipes or ready-made supermarket options.
                </p>
              </div>
            </div>

            {/* Tab Card 2 */}
            <div className="py-4 sm:bg-white sm:border sm:border-dbd-rule sm:rounded-xl sm:p-6 lg:sm:p-8 sm:flex sm:flex-col sm:justify-between sm:shadow-xs sm:select-none sm:hover:scale-[1.01] sm:transition-all">
              <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 sm:block">
                <div className="hidden bg-dbd-accent-light text-dbd-accent w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:flex items-center justify-center sm:mb-6">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <span className="pt-0.5 text-[11px] font-mono text-dbd-accent-mid font-bold sm:hidden">02</span>
                <div className="flex items-center gap-2 mb-1 sm:mb-3">
                  <span className="hidden text-[11px] font-mono text-dbd-accent-mid font-bold sm:inline">02</span>
                  <h4 className="text-[14px] sm:text-[15px] font-ibm-plex-mono font-bold uppercase tracking-wider text-dbd-ink">
                    Save & Schedule
                  </h4>
                </div>
                <p className="col-start-2 text-[13px] sm:text-[14px] text-dbd-ink-2 leading-relaxed font-sans font-normal">
                  Build several dinners around your weekly budget and preferences, with ingredient reuse prioritised where possible.
                </p>
              </div>
            </div>

            {/* Tab Card 3 */}
            <div className="py-4 sm:bg-white sm:border sm:border-dbd-rule sm:rounded-xl sm:p-6 lg:sm:p-8 sm:flex sm:flex-col sm:justify-between sm:shadow-xs sm:select-none sm:hover:scale-[1.01] sm:transition-all">
              <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 sm:block">
                <div className="hidden bg-dbd-accent-light text-dbd-accent w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:flex items-center justify-center sm:mb-6">
                  <ShoppingCartIcon className="w-5 h-5" />
                </div>
                <span className="pt-0.5 text-[11px] font-mono text-dbd-accent-mid font-bold sm:hidden">03</span>
                <div className="flex items-center gap-2 mb-1 sm:mb-3">
                  <span className="hidden text-[11px] font-mono text-dbd-accent-mid font-bold sm:inline">03</span>
                  <h4 className="text-[14px] sm:text-[15px] font-ibm-plex-mono font-bold uppercase tracking-wider text-dbd-ink">
                    Shopping
                  </h4>
                </div>
                <p className="col-start-2 text-[13px] sm:text-[14px] text-dbd-ink-2 leading-relaxed font-sans font-normal">
                  Schedule your chosen dinners to generate one consolidated, estimated-cost shopping list.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. SUBSCRIPTION PLANS & CONVERSION CONTAINER */}
      <section id="pricing" className="py-10 sm:py-16 px-6 sm:px-8 max-w-5xl mx-auto scroll-mt-nav">
        
        <div className="text-center mb-10 select-none">
          <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.25em] text-dbd-accent uppercase block mb-3">
            It's all about you.
          </span>
          <h3 className="text-3xl sm:text-4xl font-sans font-bold text-dbd-ink">
            Create an account when DinnerByDesign earns it.
          </h3>
          <p className="mt-3 text-dbd-ink-2 font-medium text-[15px] max-w-xl mx-auto">
            Your first 3 searches are free without an account. Sign up to keep searching, save favourites, plan dinners and build shopping lists.
          </p>
        </div>

        {/* Features Checklist column vs Subscription card panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Checklist left */}
          <div className="flex flex-col justify-center space-y-4 w-full">
            
            <ul className="space-y-4 font-sans text-[13.5px] sm:text-[14px] text-dbd-ink-2 select-none">
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Preference-led recipe search</strong>: filter by diet, allergies, budget, portions, time and ingredients to avoid. <button type="button" onClick={() => setView('food-safety')} className="font-semibold text-dbd-accent hover:underline">Read our safety guidance.</button></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Start with what you have.</strong> DinnerByDesign shortlists distinct ways to turn those ingredients into dinner, from quick classics to less obvious combinations.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Fast, focused results</strong>: get tailored dinner ideas quickly, without scrolling through ads, back stories or clutter.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Recipe comparison</strong>: compare cost, calories, time, source, servings and ingredients side by side.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Cost and nutrition per portion</strong>: see estimated cost-per-portion, calorie information and nutritional breakdowns. <button type="button" onClick={() => setView('nutrition-methodology')} className="font-semibold text-dbd-accent hover:underline">How nutrition is estimated.</button></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Budget-aware weekly planning</strong>: set a weekly target, build several personalised dinners and see their combined estimated cost before scheduling. <button type="button" onClick={() => setView('pricing-methodology')} className="font-semibold text-dbd-accent hover:underline">See how prices are calculated.</button></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Save, schedule and shop</strong>: save recipes, add them to your week and build a shopping list scaled to your portions.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Ready-made dinner options</strong>: find supermarket mains and easy add-ons when cooking from scratch is not the answer. <button type="button" onClick={() => setView('recipe-methodology')} className="font-semibold text-dbd-accent hover:underline">How dinner information is created.</button></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Clutter-free and ad-free</strong>: no ads, sponsor blocks, long back stories, questionnaires, distracting food photography or unnecessary noise.</span>
              </li>
            </ul>
          </div>

          {/* Pricing Box card Panel */}
          <div className="bg-white border border-dbd-rule sm:rounded-xl px-4 py-4 sm:p-6 flex flex-col justify-start shadow-none sm:shadow-md relative overflow-hidden self-start">
            
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-dbd-accent block mb-1 select-none uppercase">
                The Full Account
              </span>

              {/* Pricing toggle wrapper - now inside the card */}
              <div className="flex justify-start mb-2.5">
                <div className="bg-transparent sm:bg-dbd-surface-2 p-0 sm:p-1 border-b sm:border border-dbd-rule/80 flex rounded-none sm:rounded-sm font-mono text-[9.5px] sm:text-[10px] h-[32px] items-stretch">
                  <button 
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-2.5 sm:px-3 flex items-center justify-center font-bold cursor-pointer transition-all rounded-none sm:rounded-sm ${billingPeriod === 'monthly' ? 'bg-white sm:shadow-sm text-dbd-accent' : 'text-dbd-ink-3 hover:text-dbd-ink'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setBillingPeriod('annual')}
                    className={`px-2.5 sm:px-3 flex items-center justify-center gap-1 font-bold cursor-pointer transition-all rounded-none sm:rounded-sm ${billingPeriod === 'annual' ? 'bg-white sm:shadow-sm text-dbd-accent' : 'text-dbd-ink-3 hover:text-dbd-ink'}`}
                  >
                    Annual <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1 py-0.5 rounded-sm">save 16%</span>
                  </button>
                </div>
              </div>
              
              <div className="mb-1 flex items-baseline select-none text-left h-[34px]">
                <span className="text-[30px] sm:text-[34px] font-bold text-dbd-ink font-mono tracking-tight leading-none">
                  {billingPeriod === 'monthly' ? '£2.99' : '£2.50'}
                </span>
                <span className="text-dbd-ink-3 text-[12px] font-semibold font-mono ml-1.5">/ month</span>
              </div>

              <div className="mb-3 min-h-[42px] flex flex-col justify-start">
                <p className="text-[11.5px] font-semibold text-dbd-ink-3 font-ibm-plex-mono select-none leading-relaxed">
                  {billingPeriod === 'monthly' ? 'Billed monthly. Cancel anytime.' : 'Billed annually in advance (£30.00). Cancel anytime.'}
                </p>
                <p className="text-[11.5px] font-semibold text-dbd-ink-3 font-ibm-plex-mono select-none leading-relaxed">
                  No credit card required for the free trial.
                </p>
              </div>

              {/* Conversion email signup box */}
              {hasAccess ? (
                <div className="space-y-3">
                  <div className="py-2 border-y border-emerald-100 bg-transparent sm:bg-emerald-50 sm:border sm:rounded-sm sm:p-3">
                    <p className="text-[11px] text-emerald-800 font-bold flex items-center gap-2">
                       <CheckIcon className="w-3.5 h-3.5" />
                       Account Active
                    </p>
                  </div>
                  <button 
                    onClick={() => handleStart()}
                    className="w-full bg-dbd-accent hover:bg-dbd-accent-mid text-white font-bold tracking-wider uppercase py-3 rounded-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-dbd-accent flex items-center justify-center gap-2 cursor-pointer text-[12px]"
                  >
                    Open App
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-1.5 font-ibm-plex-mono font-semibold text-[12px]">
                  <div className="relative">
                    <label htmlFor="trial-email-input" className="sr-only">Email address for free trial registration</label>
                    <input 
                      id="trial-email-input"
                      type="email" 
                      required
                      value={subscriptionEmail} 
                      onChange={(e) => setSubscriptionEmail(e.target.value)}
                      placeholder="you@email.co.uk" 
                      aria-label="Email address for free trial registration"
                      className="w-full px-3 py-2.5 border border-dbd-rule/80 text-dbd-ink rounded-sm focus:outline-none focus-border-dbd-accent focus-visible:ring-2 focus-visible:ring-dbd-accent bg-[#FAF8F5] text-[12px] placeholder:text-dbd-ink-3"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isEmailSubmitting || emailSuccess}
                    className="w-full bg-dbd-accent hover:bg-dbd-accent-mid text-white font-bold tracking-wider uppercase py-3 rounded-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-dbd-accent flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 text-[12px]"
                  >
                    {isEmailSubmitting ? (
                      <span>Registering...</span>
                    ) : emailSuccess ? (
                      <span className="flex items-center gap-1"><CheckIcon className="w-3.5 h-3.5 text-white" /> Done</span>
                    ) : (
                      <span>Start free trial</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 8. SEARCH-FOCUSED FAQ */}
      <section className="py-10 sm:py-14 px-6 sm:px-8 max-w-5xl mx-auto border-t border-dbd-rule/40">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.2em] text-dbd-accent uppercase block mb-5">
            Common Questions
          </span>
          <div className="divide-y divide-dbd-rule">
            {[
              {
                question: 'What is DinnerByDesign?',
                answer: 'DinnerByDesign is an ad-free UK dinner recipe finder. It helps you search, compare, save, schedule and shop for dinner ideas from one place.'
              },
              {
                question: 'Can I search by ingredients I already have?',
                answer: 'Yes. Search from ingredients in your fridge or cupboard, then use preferences to narrow results by diet, budget, time and cooking method.'
              },
              {
                question: 'Does it include supermarket ready-made options?',
                answer: 'Yes. Ready-made mode helps find convenient supermarket options and turns each result into a practical dinner kit with sides and simple upgrades.'
              },
              {
                question: 'Does it estimate shopping costs?',
                answer: 'Yes. DinnerByDesign estimates cost per portion and builds a grouped UK shopping list from your scheduled dinners.'
              },
              {
                question: 'Can DinnerByDesign plan dinners to a weekly budget?',
                answer: 'Yes. Choose your number of dinners, household size and weekly budget. DinnerByDesign prioritises suitable lower-cost options and ingredient reuse, then shows the combined estimated dinner cost against your target. Schedule your chosen dinners to generate the shopping list.'
              },
              {
                question: 'Is DinnerByDesign a video-based guided cooking app?',
                answer: 'No. DinnerByDesign is a search, planning and shopping-list app for dinner ideas. It is not a video-based guided cooking lesson app.'
              }
            ].map((item) => (
              <div key={item.question} className="py-4">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-dbd-ink">
                  {item.question}
                </h3>
                <p className="mt-1.5 text-[13px] sm:text-[14px] text-dbd-ink-2 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INDEPENDENCE CLAUSE & COGNIZANT LEGAL FOOTER */}
      <footer className="bg-[#FAF8F5] border-t border-dbd-rule pt-10 sm:pt-16 pb-12 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 select-none">
          
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <h5 className="font-sans text-[19px] font-bold tracking-tight leading-none select-none flex items-center justify-center">
              <span className="text-dbd-ink">Dinner</span>
              <span className="text-dbd-accent mx-[1px]">By</span>
              <span className="text-dbd-ink">Design</span>
            </h5>
            <p className="text-[12px] text-dbd-ink-3 font-semibold pt-1">
              Less searching. Better matches. Dinner, decided.
            </p>
            <p className="text-[11px] sm:text-[12px] text-dbd-ink-3 max-w-4xl mx-auto leading-relaxed pt-3">
              DinnerByDesign is an independent app and is not affiliated with, endorsed by, or partnered with any chef, restaurant, supermarket, or food brand mentioned on this platform. Names are used only as descriptive search filters. Recipes remain the property of their original publishers, with source attribution provided where available.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-[12px] text-dbd-ink-3 font-mono">
              <span>
                © 2026 DinnerByDesign. All rights reserved.
              </span>
              <span className="hidden sm:inline">·</span>
              <a 
                href="mailto:chef@dinnerbydesign.app" 
                className="font-bold text-dbd-accent hover:text-dbd-accent-mid transition-all"
              >
                chef@dinnerbydesign.app
              </a>
            </div>
          </div>

          {/* Privacy & Terms views trigger bar */}
          <div className="pt-4 border-t border-dbd-rule/40 max-w-lg mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-ibm-plex-mono text-[11px] font-semibold text-dbd-ink-3">
            <a href="/dinner-plans" className="hover:text-dbd-accent hover:underline">Affordable dinner plans</a>
            <a href="/recipes" className="hover:text-dbd-accent hover:underline">Recipes and cooking ideas</a>
            <a href="/food-costs" className="hover:text-dbd-accent hover:underline">Food-cost &amp; waste</a>
            <button
              onClick={() => setView('pricing-methodology')}
              className="hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none"
            >
              Pricing methodology
            </button>
            <button onClick={() => setView('food-safety')} className="hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Food safety</button>
            <button onClick={() => setView('recipe-methodology')} className="hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Recipe information</button>
            <button onClick={() => setView('nutrition-methodology')} className="hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Nutrition estimates</button>
            <button 
              onClick={() => setView('privacy')} 
              className="hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none"
            >
              Privacy & cookies
            </button>
            <button 
              onClick={() => setView('terms')} 
              className="hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none"
            >
              Terms of Service
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
};
