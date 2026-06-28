import React from 'react';
import { UserPreferences } from '../types';
import { DIETARY_TAXONOMY, DIETARY_EXCLUSION_MAP } from '../constants';
import { AlertCircle, Info, ShieldAlert } from 'lucide-react';

export const renderErrorMessage = (msg: string | null) => {
  if (!msg) return null;
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error) {
      const lowerError = parsed.error.toLowerCase();
      if (lowerError.includes('permission-denied') || lowerError.includes('permission') || lowerError.includes('insufficient')) {
        return "Access denied. Please ensure you are signed in correctly.";
      }
      if (lowerError.includes('unavailable') || lowerError.includes('offline')) {
        return "Connection issue detected. Reconnecting...";
      }
      if (lowerError.includes('quota') || lowerError.includes('resource_exhausted')) {
        if (lowerError.includes('credits') || lowerError.includes('billing')) {
          return "Daily limit reached. Please check your account settings.";
        }
        return "Daily limit reached. Please try again tomorrow.";
      }
      if (lowerError.includes('resend_restriction') || lowerError.includes('restriction')) {
        return "Delivery restricted: Please manually copy these details if your email address isn't verified yet.";
      }
      return "A database or AI service hiccup occurred. We're on it.";
    }
    
    // Check if the raw string contains the credit error
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes('credits') || lowerMsg.includes('billing')) {
      return "Daily limit reached. Please check your account settings.";
    }
  } catch (e) {
    if (msg?.toLowerCase().includes('failed to fetch user profile')) {
      return "We couldn't retrieve your account settings. Please try refreshing or signing in again.";
    }
    return msg;
  }
};

export const getContradictionWarning = (
  input: string,
  preferences: UserPreferences | null,
  isDietaryRuleSuppressed: boolean,
  disableRule: () => void,
  activeCriteria: any[] = []
) => {
  if (!input.trim()) return null;
  
  const lowerInput = input.toLowerCase();
  
  const getColors = (type: 'note' | 'hard' | 'conflict') => {
    if (type === 'conflict') return { text: '#8C4A43', emphasised: '#632E29', bg: '#FDF2F0', border: '#F5E1DE', icon: <ShieldAlert className="w-4 h-4" /> };
    if (type === 'hard') return { text: '#5E554A', emphasised: '#3D362E', bg: '#F0EDE8', border: '#D9D2C7', icon: <AlertCircle className="w-4 h-4" /> };
    return { text: '#5E554A', emphasised: '#3D362E', bg: '#F7F5F1', border: '#E5E0D8', icon: <Info className="w-4 h-4" /> };
  };

  const Emphasised = ({ children, type }: { children: React.ReactNode, type: 'note' | 'hard' | 'conflict' }) => (
    <span style={{ color: getColors(type).emphasised, fontWeight: 600 }}>{children}</span>
  );

  // 1. Dietary Rule Checks (Permanent & Temporary)
  const dietCriteria = activeCriteria.find(c => c.type === 'dietaryRule' || c.type === 'tempDietaryRule');
  const dietRule = dietCriteria?.value || preferences?.dietaryRule || 'none';

  if (dietRule !== 'none' && !isDietaryRuleSuppressed) {
    const prefLabel = DIETARY_TAXONOMY.dietaryPreferences.labels[dietRule as keyof typeof DIETARY_TAXONOMY.dietaryPreferences.labels];
    
    // Meat keywords
    const redMeat = ['pork', 'beef', 'lamb', 'steak', 'bacon', 'ham', 'sausage', 'gammon', 'venison', 'mutton', 'meatballs', 'burger'];
    const poultry = ['chicken', 'turkey', 'duck', 'goose', 'quail'];
    const fish = ['fish', 'seafood', 'salmon', 'tuna', 'prawn', 'shrimp', 'crab', 'lobster', 'cod', 'haddock', 'hake', 'mackerel', 'trout', 'seabass', 'sea bass', 'anchovy', 'anchovies'];
    const dairy = ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'dairy', 'egg'];

    let found: string[] = [];
    if (dietRule === 'vegan') {
      found = [...redMeat, ...poultry, ...fish, ...dairy].filter(k => lowerInput.includes(k));
    } else if (dietRule === 'vegetarian') {
      found = [...redMeat, ...poultry, ...fish].filter(k => lowerInput.includes(k));
    } else if (dietRule === 'pescatarian') {
      found = [...redMeat, ...poultry].filter(k => lowerInput.includes(k));
    }

    if (found.length > 0) {
      return {
        type: 'hard' as const,
        colors: getColors('hard'),
        content: (
          <div className="flex gap-2.5 items-start">
            <div className="mt-0.5 shrink-0 opacity-70 cursor-help" title="Conflict detected">{getColors('hard').icon}</div>
            <p>
              Your preference excludes <Emphasised type="hard">{found[0]}</Emphasised>.
            </p>
          </div>
        )
      };
    }
  }

  // 2. Allergy & Exclusion Checks
  const activeExclusions = activeCriteria.filter(c => c.type === 'allergy' || c.type === 'profileExclusion' || c.type === 'exclusion' || c.type === 'excludeIngredient');
  
  for (const crit of activeExclusions) {
    const exclusionValue = crit.value.toLowerCase();
    const exclusionLabel = crit.label.replace(/^No\s+/, '');
    
    // Check if the input contains the excluded item
    if (lowerInput.includes(exclusionValue)) {
      return {
        type: 'conflict' as const,
        colors: getColors('conflict'),
        content: (
          <div className="flex gap-2.5 items-start">
            <div className="mt-0.5 shrink-0 opacity-80">{getColors('conflict').icon}</div>
            <p>
              Friendly reminder: you have a filter for <Emphasised type="conflict">no {exclusionLabel}</Emphasised> active, which would hide these results.
            </p>
          </div>
        )
      };
    }

    // Check mapping (e.g. if exclude "Milk / Dairy", checking for "cheese")
    for (const [category, keywords] of Object.entries(DIETARY_EXCLUSION_MAP)) {
      if (exclusionLabel.toLowerCase() === category.toLowerCase() || exclusionValue === category.toLowerCase()) {
        const found = keywords.filter(k => lowerInput.includes(k));
        if (found.length > 0) {
          return {
            type: 'conflict' as const,
            colors: getColors('conflict'),
            content: (
              <div className="flex gap-2.5 items-start">
                <div className="mt-0.5 shrink-0 opacity-80">{getColors('conflict').icon}</div>
                <p>
                  Heads up: <Emphasised type="conflict">{found[0]}</Emphasised> is covered by your <Emphasised type="conflict">No {category}</Emphasised> filter.
                </p>
              </div>
            )
          };
        }
      }
    }
  }

  // 3. Salad Preference Check
  const saladCriteria = activeCriteria.find(c => c.type === 'saladPreference' || c.type === 'profileSaladPref');
  const saladPref = saladCriteria?.value || preferences?.saladPreference || 'all';

  if (saladPref === 'none' && lowerInput.includes('salad')) {
    return {
      type: 'hard' as const,
      colors: getColors('hard'),
      content: (
        <div className="flex gap-2.5 items-start">
          <div className="mt-0.5 shrink-0 opacity-70">{getColors('hard').icon}</div>
          <p>
            Wait, your settings are set to <Emphasised type="hard">Exclude all salads</Emphasised>. You might want to update that first.
          </p>
        </div>
      )
    };
  }

  return null;
};
