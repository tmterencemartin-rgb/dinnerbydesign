import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { safeStorage } from '../../lib/storage';
import { Wordmark } from '../Wordmark';
import { WhyDinnerByDesignComparison } from '../WhyDinnerByDesignComparison';
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

const READY_MADE_SANDBOX_TAGS = [
  'Indian',
  'Spare ribs',
  'Chinese',
  'Moussaka',
  'Microwave',
  'Lasagne',
  'Fish Pie',
  'Chilli con carne',
  'Meatballs',
  'Scampi',
  'Mac & Cheese',
  'Greek salad'
];

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
  const [sandboxQuery, setSandboxQuery] = useState('Leftover chicken');
  const [sandboxSource, setSandboxSource] = useState<'cook' | 'ready-made'>('cook');
  const [isSandboxSearching, setIsSandboxSearching] = useState(false);
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Predefined datasets for the interactive sandbox mockup
  const mockCookData: Record<string, { title: string; meta: string; source: string }[]> = {
    'Leftover chicken': [
      { title: 'Leftover chicken pasta bake', meta: '35 min · serves 4 · ~£4.80', source: 'BBC Food' },
      { title: 'Leftover chicken fried rice', meta: '25 min · serves 4 · ~£3.60', source: 'Good Food' },
      { title: 'Leftover chicken and vegetable curry', meta: '30 min · serves 4 · ~£4.20', source: 'Jamie Oliver' }
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
    'Indian': [
      { title: 'Tesco Chicken Tikka Masala', meta: '10 min · serves 1 · ~£3.50', source: 'Tesco' },
      { title: 'Sainsbury’s Vegetable Tikka Masala', meta: '8 min · serves 1 · ~£3.00', source: "Sainsbury's" },
      { title: 'M&S Dal Makhani', meta: '5 min · serves 1 · ~£4.50', source: 'Marks & Spencer' }
    ],
    'Spare ribs': [
      { title: 'Tesco BBQ Pork Ribs', meta: '30 min · serves 2 · ~£5.50', source: 'Tesco' },
      { title: 'Waitrose Sticky Spare Ribs', meta: '25 min · serves 2 · ~£7.00', source: 'Waitrose' },
      { title: 'M&S Korean BBQ Pork Ribs', meta: '30 min · serves 2 · ~£8.00', source: 'Marks & Spencer' }
    ],
    'Chinese': [
      { title: 'Tesco Sweet & Sour Chicken', meta: '8 min · serves 1 · ~£3.50', source: 'Tesco' },
      { title: 'Sainsbury’s Chow Mein', meta: '7 min · serves 1 · ~£3.00', source: "Sainsbury's" },
      { title: 'M&S Hoisin Duck', meta: '12 min · serves 2 · ~£7.00', source: 'Marks & Spencer' }
    ],
    'Moussaka': [
      { title: 'Sainsbury’s Beef Moussaka', meta: '35 min · serves 1 · ~£3.50', source: "Sainsbury's" },
      { title: 'Tesco Vegetarian Moussaka', meta: '35 min · serves 1 · ~£3.00', source: 'Tesco' },
      { title: 'M&S Aubergine Moussaka', meta: '30 min · serves 2 · ~£7.50', source: 'Marks & Spencer' }
    ],
    'Microwave': [
      { title: 'Tesco Chicken Tikka Masala', meta: '5 min · serves 1 · ~£3.50', source: 'Tesco' },
      { title: 'Sainsbury’s Macaroni Cheese', meta: '4 min · serves 1 · ~£2.00', source: "Sainsbury's" },
      { title: 'Waitrose Thai Green Curry', meta: '5 min · serves 1 · ~£5.00', source: 'Waitrose' }
    ],
    'Lasagne': [
      { title: 'Tesco Finest Beef Lasagne', meta: '40 min · serves 2 · ~£6.50', source: 'Tesco' },
      { title: 'Sainsbury’s Vegetable Lasagne', meta: '35 min · serves 1 · ~£3.20', source: "Sainsbury's" },
      { title: 'M&S Lasagne Al Forno', meta: '35 min · serves 2 · ~£8.00', source: 'Marks & Spencer' }
    ],
    'Fish Pie': [
      { title: 'Tesco Creamy Fish Pie', meta: '40 min · serves 2 · ~£5.50', source: 'Tesco' },
      { title: 'Waitrose Fish Pie', meta: '35 min · serves 2 · ~£7.00', source: 'Waitrose' },
      { title: 'M&S Luxury Fish Pie', meta: '35 min · serves 2 · ~£9.00', source: 'Marks & Spencer' }
    ],
    'Chilli con carne': [
      { title: 'Tesco Chilli Con Carne', meta: '8 min · serves 1 · ~£3.50', source: 'Tesco' },
      { title: 'Sainsbury’s Beef Chilli', meta: '7 min · serves 1 · ~£3.00', source: "Sainsbury's" },
      { title: 'M&S Three Bean Chilli', meta: '5 min · serves 1 · ~£4.50', source: 'Marks & Spencer' }
    ],
    'Meatballs': [
      { title: 'Tesco Swedish Meatballs', meta: '20 min · serves 2 · ~£4.50', source: 'Tesco' },
      { title: 'Sainsbury’s Italian Meatballs', meta: '20 min · serves 2 · ~£4.00', source: "Sainsbury's" },
      { title: 'M&S Beef Meatballs', meta: '15 min · serves 2 · ~£6.00', source: 'Marks & Spencer' }
    ],
    'Scampi': [
      { title: 'Tesco Wholetail Scampi', meta: '20 min · serves 2 · ~£4.00', source: 'Tesco' },
      { title: 'Sainsbury’s Breaded Scampi', meta: '20 min · serves 2 · ~£4.50', source: "Sainsbury's" },
      { title: 'Waitrose Breaded Scampi', meta: '20 min · serves 2 · ~£6.00', source: 'Waitrose' }
    ],
    'Mac & Cheese': [
      { title: 'Tesco Macaroni Cheese', meta: '25 min · serves 1 · ~£2.00', source: 'Tesco' },
      { title: 'Sainsbury’s Macaroni Cheese', meta: '25 min · serves 1 · ~£2.00', source: "Sainsbury's" },
      { title: 'M&S Macaroni Cheese', meta: '25 min · serves 1 · ~£4.50', source: 'Marks & Spencer' }
    ],
    'Greek salad': [
      { title: 'M&S Greek Salad', meta: 'Ready to eat · serves 1 · ~£4.00', source: 'Marks & Spencer' },
      { title: 'Tesco Greek Salad Bowl', meta: 'Ready to eat · serves 1 · ~£3.00', source: 'Tesco' },
      { title: 'Waitrose Greek Salad', meta: 'Ready to eat · serves 1 · ~£4.50', source: 'Waitrose' }
    ],
    'Leftover chicken': [
      { title: 'M&S cooked chicken pieces', meta: 'Ready to eat · serves 2 · ~£5.00', source: 'Marks & Spencer' },
      { title: 'Waitrose roast chicken slices', meta: 'Ready to eat · serves 2 · ~£4.50', source: 'Waitrose' },
      { title: 'Tesco cooked chicken breast pieces', meta: 'Ready to eat · serves 2 · ~£4.00', source: 'Tesco' }
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
    setSandboxQuery(source === 'ready-made' ? READY_MADE_SANDBOX_TAGS[0] : 'Leftover chicken');
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
    ? (mockCookData[sandboxQuery] || mockCookData['Leftover chicken'])
    : (mockReadyMadeData[sandboxQuery] || mockReadyMadeData['Leftover chicken']);

  return (
    <div className="native-scroll-root flex flex-col bg-dbd-surface hover:scrollbar-hide min-h-screen text-dbd-ink font-sans selection:bg-dbd-accent selection:text-white antialiased">
      
      {/* 1. STICKY PREMIUM NAVIGATION BAR */}
      <nav id="top-nav" className="app-header border-b border-dbd-rule/50 sticky top-0 z-50 bg-dbd-surface pt-[calc(1rem+env(safe-area-inset-top))] pb-0 transition-colors duration-250">
        <div className="w-full max-w-6xl mx-auto px-6 flex min-h-[62px] items-center justify-between mb-3">
          
          {/* Logo Brand Group */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex flex-col items-start text-left font-sans">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={logoVariants}
                whileHover={{ scale: 1.035, rotate: -0.3 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="origin-left"
              >
                <Wordmark className="text-[29.33px]" />
              </motion.div>
              <span className="mt-1 ml-[28.75px] block w-[calc(100%-28.75px)] whitespace-nowrap text-center text-[7.5px] font-medium tracking-[0.035em] text-dbd-ink-3 opacity-80">
                Less searching. More relevant dinners.
              </span>
            </div>
          </div>

          {/* Desktop Direct Links */}
          <div className="hidden lg:flex items-center gap-6 font-ibm-plex-mono text-[12px] font-semibold text-dbd-ink-2">
            <a
              href="#why-different"
              className="hover:text-dbd-accent tracking-tight transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
            >
              Why DinnerByDesign
            </a>
            <a
              href="#how-it-works"
              className="hover:text-dbd-accent tracking-tight transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
            >
              How it works
            </a>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="hover:text-dbd-accent tracking-tight transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
            >
              Pricing
            </button>
            <a
              href="/guides"
              className="hover:text-dbd-accent tracking-tight transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
            >
              Explore
            </a>
            <button
              onClick={handleSignIn}
              className="ml-1 border border-dbd-rule hover:border-dbd-accent hover:text-dbd-accent px-3 py-2 rounded-sm tracking-tight transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent"
            >
              {user && !user.isAnonymous ? 'Account' : 'Sign in'}
            </button>
          </div>

          {/* Mobile Menu Action button */}
          <div className="lg:hidden flex items-center">
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
              className="absolute top-full left-0 w-full bg-dbd-surface border-b border-dbd-rule shadow-xl py-6 px-6 flex flex-col gap-4 font-ibm-plex-mono font-semibold text-[13px] lg:hidden"
            >
              <a
                href="#why-different"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-dbd-accent py-2 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
              >
                Why DinnerByDesign
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-dbd-accent py-2 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
              >
                How it works
              </a>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="hover:text-dbd-accent py-2 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
              >
                Pricing
              </button>
              <a
                href="/guides"
                className="hover:text-dbd-accent py-2 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dbd-accent rounded-sm px-1"
              >
                Explore public resources
              </a>
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
      <section className="relative order-1 px-6 max-w-5xl mx-auto pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-dbd-ink font-sans leading-[1.15] tracking-tight mb-6 max-w-4xl mx-auto">
          <span className="sm:hidden">Make the weekly shop<br />go further.</span>
          <span className="hidden sm:inline">Make the weekly shop go further.</span>
        </h1>
        <div className="text-[14px] sm:text-[18px] text-dbd-ink-2 max-w-3xl leading-relaxed mx-auto font-sans font-normal mb-10 space-y-5">
          <p>
            DinnerByDesign helps you plan varied dinners around what you already have. Reuse ingredients across the week, and see estimated shopping costs before you buy.
          </p>
          <p>
            Set your preferences once, and every search works from them automatically — diet, allergies, budget, calories, portions, time, cooking method, nutrition goals, trusted sources and preferred supermarkets, without retyping any of it. That's what makes results precise rather than generic: a search that already knows you're cooking for one and avoiding nuts doesn't need to be told twice. Revise your preferences any time, or override them for a single search.
          </p>
          <p className="font-semibold text-dbd-ink">
            Less searching. More relevant dinners.
          </p>
        </div>

        {/* Action button grouping */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-md mx-auto">
          <a
            id="hero-start-trial-btn"
            href="/?view=home"
            onClick={() => safeStorage.setItem('dbd_has_started', 'true')}
            className="w-full sm:w-auto bg-dbd-accent hover:bg-dbd-accent-mid text-white font-ibm-plex-mono text-[13px] font-semibold tracking-wider uppercase px-8 py-4 rounded-sm transition-all cursor-pointer shadow-md"
          >
            Try a free search
          </a>
          <button 
            onClick={() => scrollToSection('interactive-sandbox')}
            className="w-full sm:w-auto bg-transparent border border-transparent hover:border-dbd-rule hover:text-dbd-accent text-dbd-ink-2 font-ibm-plex-mono text-[13px] font-semibold tracking-wider uppercase px-4 py-3 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            See how it works <ArrowDownIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-4 text-[12px] font-medium text-dbd-ink-3">
          Get three free searches, no account required.
        </p>
      </section>

      {/* 3. INTERACTIVE BROWSER PREVIEW SANDBOX */}
      <section id="interactive-sandbox" className="order-2 pt-0 pb-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-5 text-[11px] font-ibm-plex-mono font-bold uppercase tracking-[0.2em] text-dbd-accent-mid select-none">
            — See It Work —
          </div>

          {/* Browser frame decoration */}
          <div className="border border-dbd-rule rounded-xl bg-white shadow-lg overflow-hidden">
            
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
            <div className="p-3 sm:p-8 bg-[#FAF8F5] text-left">
              <div className="relative">
                <div className="lg:pr-72">

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
                <div className="flex flex-wrap gap-x-3 gap-y-2 sm:gap-2">
                  {(sandboxSource === 'ready-made'
                    ? READY_MADE_SANDBOX_TAGS
                    : ['Leftover chicken', 'Minced Beef', 'Spaghetti', 'Jamie Oliver', 'Air Fryer', 'Lobster', 'Plaice', 'Vegetarian', 'Pork bones', 'Less than £2.50']
                  ).map((tag, index) => (
                    <button
                      key={tag}
                      onClick={() => selectSandboxTag(tag)}
                      className={`inline-flex text-[11px] sm:text-[12px] font-mono px-0 py-0 sm:px-3 sm:py-2 border-0 sm:border rounded-none sm:rounded-sm underline underline-offset-2 sm:no-underline transition-all cursor-pointer ${sandboxQuery === tag ? 'text-dbd-accent font-bold sm:bg-dbd-accent/10 sm:border-dbd-accent' : 'text-dbd-accent sm:bg-white sm:border-dbd-rule/80 sm:text-dbd-ink-2 hover:text-dbd-accent-mid sm:hover:border-dbd-ink sm:hover:text-dbd-ink'}`}
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
                    <>
                      <span className="sm:hidden">{currentResultList.length} matches</span>
                      <span className="hidden sm:inline">{currentResultList.length} recipes • verified in 0.54s</span>
                    </>
                  )}
                </span>
                  </div>

                  {/* Recipe List sandbox render */}
                  <div className="max-w-2xl mx-auto relative min-h-[108px] sm:min-h-[220px]">
                    {isSandboxSearching ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-xs select-none">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-dbd-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-[11px] text-dbd-ink-3 font-mono">Costing ingredients & verifying links...</p>
                    </div>
                      </div>
                    ) : null}

                    <div className="bg-white rounded border border-dbd-rule shadow-[0_1px_4px_rgba(0,0,0,0.025)] overflow-hidden">
                      {currentResultList.map((recipe, index) => (
                        <div
                          key={index}
                          onClick={() => handleStart(sandboxQuery)}
                          className={`group/card p-3 sm:p-4 relative overflow-visible cursor-pointer hover:bg-dbd-surface/40 transition-colors duration-200 ${index < currentResultList.length - 1 ? 'border-b border-dbd-rule/70' : ''}`}
                        >
                          <div className="flex flex-col gap-0.5 items-start">
                            <h4 className="text-[14px] sm:text-[16px] font-semibold text-gray-900 group-hover/card:text-dbd-accent transition-colors leading-tight tracking-tight text-left">
                              {recipe.title}
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium leading-tight font-ibm-plex-mono text-left">
                              {recipe.meta}
                            </p>
                            <span className="inline-flex w-fit shrink-0 mt-0.5 text-[8.5px] sm:text-[9px] font-ibm-plex-mono font-semibold uppercase tracking-wider leading-none text-dbd-ink-3 bg-dbd-surface px-2 py-1 border border-dbd-rule rounded-sm group-hover/card:border-dbd-accent group-hover/card:text-dbd-accent group-hover/card:bg-dbd-accent-light transition-all">
                              from {recipe.source}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="mt-5 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:w-64 border border-dbd-rule bg-white p-4 shadow-sm" aria-label="Preferences preview">
                  <div className="flex items-center justify-between gap-3 border-b border-dbd-rule/70 pb-3">
                    <h3 className="font-ibm-plex-mono text-[12px] font-bold uppercase tracking-[0.14em] text-dbd-ink">Preferences</h3>
                    <span className="text-[9px] font-ibm-plex-mono font-bold uppercase tracking-wider text-dbd-accent">Applied</span>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-dbd-ink-3">Your preferences shape every search.</p>
                  <div className="mt-3 space-y-2">
                    {['Vegetarian', 'No nuts', 'Under 30 mins', '£2.50 pp'].map((preference) => (
                      <div key={preference} className="flex items-center gap-2 border border-dbd-rule/70 bg-dbd-surface px-2.5 py-2 text-[10.5px] font-ibm-plex-mono font-semibold uppercase tracking-wide text-dbd-ink-2">
                        <CheckIcon className="h-3.5 w-3.5 shrink-0 text-dbd-accent" />
                        {preference}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-dbd-ink-3">Further options include: calorie counts, wholesome recipes, preferred supermarket, preferred cooking methods, budget management, high Omega-3, gluten-free and more.</p>
                </aside>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. WHY DINNERBYDESIGN */}
      <section id="why-different" className="order-4 py-6 sm:py-14 px-6 sm:px-8 max-w-5xl mx-auto border-t border-dbd-rule/40 scroll-mt-nav">
        <div className="max-w-3xl text-left">
          <h3 className="text-3xl sm:text-4xl font-sans font-bold text-dbd-ink leading-[1.15] mb-3 sm:mb-6">
            Why DinnerByDesign?
          </h3>
          <p className="text-[15px] sm:text-[17px] text-dbd-ink-2 leading-relaxed font-sans font-normal">
            A general LLM can suggest a recipe. DinnerByDesign carries that search into the decisions that follow, without repeated prompting or manual organisation.
          </p>
          <WhyDinnerByDesignComparison compact onTryFreeSearch={() => { window.location.href = '/?view=home'; }} />
        </div>
        <div className="mt-10 max-w-prose text-left select-none sm:mt-14">
          <h4 className="text-xl sm:text-2xl font-sans font-bold text-dbd-ink leading-[1.15] mb-3 sm:mb-5">
            Why I built it
          </h4>
          <p className="text-[15px] sm:text-[17px] text-dbd-ink-2 leading-relaxed font-sans font-normal">
            I live on my own, which means smaller portions, odd quantities and a lot of ingredients I can't use up before they go off. As food prices keep rising, I found myself doing what most people do, on their own or with a family to feed: looking for cheaper options, trying to make ingredients stretch further, and still throwing away more than I'd like. I built DinnerByDesign to help me deal with those problems, and to help anyone else managing some version of the same thing.
          </p>
          <p className="mt-3 sm:mt-5 text-[15px] sm:text-[17px] text-dbd-ink-2 leading-relaxed font-sans font-normal">
            My app starts with what you already have, points you towards practical recipes from established sources, and helps you plan dinners with cost and waste in mind.
          </p>
          <p className="mt-4 sm:mt-6 text-[13px] font-ibm-plex-mono font-semibold text-dbd-accent">
            Terence, Head chef
          </p>
        </div>
      </section>

      {/* WEEKLY SHOP SECTION */}
      <section className="order-5 py-6 sm:py-14 px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="max-w-prose text-left select-none">
          <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.2em] text-dbd-accent uppercase block mb-3">
            MADE FOR THE WEEKLY SHOP
          </span>
          <h3 className="text-3xl sm:text-4xl font-sans font-bold text-dbd-ink leading-[1.15]">
            Inexpensive cooking. Not uninteresting cooking.
          </h3>
          <p className="mt-3 sm:mt-6 text-[15px] sm:text-[17px] text-dbd-ink-2 leading-relaxed font-sans font-normal">
            For many households, the weekly shop is one of the largest regular costs — and keeping them down usually means buying the same basic ingredients: mince, sausages, chicken, fish fingers, tinned and frozen staples. DinnerByDesign works with that, not around it: finding different ways to cook the same shopping list, including recipes from cuisines where cheap, everyday ingredients are already the tradition, not a workaround.
          </p>
        </div>
      </section>

      {false && (
      <section className="order-6 py-6 sm:py-14 px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-10 items-start">
          <div className="md:col-span-5 select-none">
            <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.2em] text-dbd-accent uppercase block mb-3">
              Built Around Your Kitchen
            </span>
            <h3 className="text-3xl sm:text-4xl font-sans font-bold text-dbd-ink leading-[1.15]">
              Built around the way you cook.
            </h3>
          </div>

          <div className="md:col-span-7">
            <p className="text-[15px] sm:text-[17px] text-dbd-ink-2 leading-relaxed mb-4 sm:mb-8 max-w-prose select-none">
              Set one or more of the 18 filters once, or adjust per search. DinnerByDesign pinpoints and shortlists recipes that fit your diet, budget, cooking method and time.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 sm:gap-y-5 gap-x-5 sm:gap-x-8 text-[11.5px] sm:text-[13px] font-mono font-bold text-dbd-ink-3 uppercase tracking-wider select-none">
              <div className="flex items-center gap-2.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />Diet & health</div>
              <div className="flex items-center gap-2.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />Cost</div>
              <div className="flex items-center gap-2.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />Time & effort</div>
              <div className="flex items-center gap-2.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />Cooking methods</div>
              <div className="flex items-center gap-2.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />Servings & style</div>
              <div className="flex items-center gap-2.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-dbd-accent rounded-full shrink-0" />Sourcing</div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 6. THREE TABS FEATURE EXPLAINER GRID */}
      <section id="how-it-works" className="order-3 py-6 sm:py-14 bg-[#F4F1EA] border-t border-dbd-rule/40 scroll-mt-nav px-6 sm:px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-4 sm:mb-8 select-none">
            <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.2em] text-dbd-accent uppercase block mb-3">
              How It Works
            </span>
            <h3 className="text-3xl sm:text-4xl font-sans font-bold text-dbd-ink">
              <span className="sm:hidden">Three tabs;<br />search, schedule, shop.</span>
              <span className="hidden sm:inline">Three tabs. Search, schedule, shop.</span>
            </h3>
          </div>

          <div className="divide-y divide-dbd-rule/70 border-y border-dbd-rule/70 sm:grid sm:grid-cols-3 sm:divide-y-0 sm:border-y-0 sm:gap-6">
            
            {/* Tab Card 1 */}
            <div className="py-3 sm:bg-white sm:border sm:border-dbd-rule sm:rounded-xl sm:p-6 lg:sm:p-8 sm:flex sm:flex-col sm:justify-between sm:shadow-xs sm:select-none sm:hover:scale-[1.01] sm:transition-all">
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
            <div className="py-3 sm:bg-white sm:border sm:border-dbd-rule sm:rounded-xl sm:p-6 lg:sm:p-8 sm:flex sm:flex-col sm:justify-between sm:shadow-xs sm:select-none sm:hover:scale-[1.01] sm:transition-all">
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
            <div className="py-3 sm:bg-white sm:border sm:border-dbd-rule sm:rounded-xl sm:p-6 lg:sm:p-8 sm:flex sm:flex-col sm:justify-between sm:shadow-xs sm:select-none sm:hover:scale-[1.01] sm:transition-all">
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
      <section id="pricing" className="order-7 py-6 sm:py-16 px-6 sm:px-8 max-w-5xl mx-auto scroll-mt-nav">
        
        <div className="text-center mb-5 sm:mb-10 select-none">
          <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.25em] text-dbd-accent uppercase block mb-3">
            It's all about you.
          </span>
          <h3 className="text-3xl sm:text-4xl font-sans font-bold text-dbd-ink">
            Create an account when DinnerByDesign earns it.
          </h3>
          <p className="mt-2 sm:mt-3 text-dbd-ink-2 font-medium text-[15px] max-w-xl mx-auto">
            Free searches give you three tries without an account. Save, schedule and build a shopping list in this browser, then sign up to keep it across devices and continue searching.
          </p>
        </div>

        {/* Features Checklist column vs Subscription card panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 items-start">
          
          {/* Checklist left */}
          <div className="flex flex-col justify-center space-y-2.5 sm:space-y-4 w-full">
            
            <ul className="space-y-2.5 sm:space-y-4 font-sans text-[13.5px] sm:text-[14px] text-dbd-ink-2 select-none">
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
                <span><strong>Fast, focused results</strong>: get tailored dinner ideas in seconds.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Compare cost and nutrition</strong>: see estimated cost-per-portion, calories and nutritional breakdowns for each dinner, and compare cost, time, source, servings and ingredients side by side. <button type="button" onClick={() => setView('nutrition-methodology')} className="font-semibold text-dbd-accent hover:underline">How nutrition is estimated.</button></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-dbd-accent shrink-0 mt-0.5" />
                <span><strong>Budget-aware weekly planning</strong>: set a weekly target, build a week of dinners and see their combined estimated cost before scheduling. <button type="button" onClick={() => setView('pricing-methodology')} className="font-semibold text-dbd-accent hover:underline">See how prices are calculated.</button></span>
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
                <span><strong>Clutter-free and ad-free</strong>: no ads, sponsor blocks, lengthy back stories, questionnaires, distracting food photography or unnecessary noise.</span>
              </li>
            </ul>
          </div>

          {/* Pricing Box card Panel */}
          <div className="order-first sm:order-none bg-white border border-dbd-rule sm:rounded-xl px-4 py-4 sm:p-6 flex flex-col justify-start shadow-none sm:shadow-md relative overflow-hidden self-start">
            
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
                  Billed monthly. Cancel anytime. Pay annually to save 16%.
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
      <section className="order-8 py-6 sm:py-14 px-6 sm:px-8 max-w-5xl mx-auto border-t border-dbd-rule/40">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] font-ibm-plex-mono font-bold tracking-[0.2em] text-dbd-accent uppercase block mb-3 sm:mb-5">
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
                answer: 'Yes. Each shopping list shows an estimated cost, with items grouped so you can work through them more easily and ingredients combined across scheduled dinners where the app can scale them sensibly.'
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
              <div key={item.question} className="py-2.5 sm:py-4">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-dbd-ink">
                  {item.question}
                </h3>
                <p className="mt-1 text-[13px] sm:text-[14px] text-dbd-ink-2 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INDEPENDENCE CLAUSE & COGNIZANT LEGAL FOOTER */}
      <footer className="order-9 bg-[#FAF8F5] border-t border-dbd-rule pt-4 sm:pt-6 pb-4 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-2 sm:space-y-4 select-none">
          
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <h5 className="font-sans text-[19px] font-bold tracking-tight leading-none select-none flex items-center justify-center">
              <span className="text-dbd-ink">Dinner</span>
              <span className="text-dbd-accent mx-[1px]">By</span>
              <span className="text-dbd-ink">Design</span>
            </h5>
            <p className="text-[12px] text-dbd-ink-3 font-semibold pt-1">
              Less searching. More relevant dinners.
            </p>
            <p className="text-[11px] sm:text-[12px] text-dbd-ink-3 max-w-4xl mx-auto leading-relaxed pt-2 sm:pt-3">
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
                href="mailto:terence@dinnerbydesign.app"
                aria-label="Contact DinnerByDesign"
                className="font-bold text-dbd-accent hover:text-dbd-accent-mid transition-all"
              >
                terence@dinnerbydesign.app
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="mx-auto grid max-w-lg grid-cols-3 gap-x-3 gap-y-2 border-t border-dbd-rule/40 pt-3 sm:pt-4 text-left font-ibm-plex-mono text-[10.5px] font-semibold leading-4 text-dbd-ink-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:gap-y-2 sm:text-[11px]">
            <div className="min-w-0 sm:contents">
              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-dbd-ink-3/70 sm:hidden">Guides</p>
              <div className="flex flex-col gap-1.5 sm:contents">
                <a href="/dinner-plans" className="hover:text-dbd-accent hover:underline">Affordable dinner plans</a>
                <a href="/recipes" className="hover:text-dbd-accent hover:underline">Recipes and cooking ideas</a>
                <a href="/food-costs" className="hover:text-dbd-accent hover:underline">Food-cost &amp; waste</a>
                <a href="/why-dinnerbydesign" className="hover:text-dbd-accent hover:underline">Why DinnerByDesign?</a>
              </div>
            </div>
            <div className="min-w-0 sm:contents">
              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-dbd-ink-3/70 sm:hidden">Information</p>
              <div className="flex flex-col items-start gap-1.5 sm:contents">
                <button onClick={() => setView('pricing-methodology')} className="text-left hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Pricing methodology</button>
                <button onClick={() => setView('food-safety')} className="text-left hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Food safety</button>
                <button onClick={() => setView('recipe-methodology')} className="text-left hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Recipe information</button>
                <button onClick={() => setView('nutrition-methodology')} className="text-left hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Nutrition estimates</button>
              </div>
            </div>
            <div className="min-w-0 sm:contents">
              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-dbd-ink-3/70 sm:hidden">Legal</p>
              <div className="flex flex-col items-start gap-1.5 sm:contents">
                <button onClick={() => setView('privacy')} className="text-left hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Privacy & cookies</button>
                <button onClick={() => setView('terms')} className="text-left hover:text-dbd-accent hover:underline cursor-pointer focus:outline-none">Terms of Service</button>
              </div>
            </div>
          </nav>

        </div>
      </footer>

    </div>
  );
};
