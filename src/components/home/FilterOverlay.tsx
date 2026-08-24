import React from 'react';
import { motion } from 'framer-motion';
import { CircleX, Check, ChevronDown, Sparkles, Info, Save, Search, Apple, Store, Clock, Utensils, Heart, ShieldAlert } from 'lucide-react';
import { NumberStepper } from '../ui/NumberStepper';
import { Tooltip } from '../ui/Tooltip';
import { DIETARY_TAXONOMY } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { PREFERRED_SOURCES } from '../../data/preferredSources';
import { dietaryRuleAllowsOffal } from '../../lib/offalPreference';
import { filterCookingFatsForDiet } from '../../lib/preferenceCompatibility';

interface FilterOverlayProps {
  onClose: () => void;
  onSave: () => void;
  onReset: () => void;
  source: 'cook' | 'ready-made';
  
  // State from HomeView
  maxCalories: string;
  setMaxCalories: (val: string) => void;
  maxTotalTime: string;
  handleTotalTimeChange: (val: string) => void;
  maxHeatingTime: string;
  setMaxHeatingTime: (val: string) => void;
  maxCostPerPortion: string;
  setMaxCostPerPortion: (val: string) => void;
  cuisines: string[];
  setCuisines: (val: string[]) => void;
  cookingMethods: string[];
  setCookingMethods: (val: string[]) => void;
  nutritiousChoice: boolean;
  setNutritiousChoice: (val: boolean) => void;
  highOmega3: boolean;
  setHighOmega3: (val: boolean) => void;
  highProtein: boolean;
  setHighProtein: (val: boolean) => void;
  includeOffal: boolean;
  setIncludeOffal: (val: boolean) => void;
  isSimple: boolean;
  setIsSimple: (val: boolean) => void;
  isLowCost: boolean;
  setIsLowCost: (val: boolean) => void;
  supermarkets: string[];
  setSupermarkets: (val: string[]) => void;
  dietaryRule: string;
  setDietaryRule: (val: any) => void;
  saladPreference: 'all' | 'main-only' | 'side-only' | 'none';
  setSaladPreference: (val: 'all' | 'main-only' | 'side-only' | 'none') => void;
  servings: string;
  setServings: (val: string) => void;
  allergies: string[];
  setAllergies: (val: string[]) => void;
  religiousEthical: string[];
  setReligiousEthical: (val: string[]) => void;
  cookingFats: string[];
  setCookingFats: (val: string[]) => void;
  preferredSourceIds: string[];
  setPreferredSourceIds: (val: string[]) => void;
  
  isDietaryRuleSuppressed?: boolean;
  suppressedPermanentKeys?: string[];
  clearSuppression?: () => void;
  
  excludeInputRef: React.RefObject<HTMLInputElement>;
  omitInputRef: React.RefObject<HTMLInputElement>;
  excludeIngredients: string[];
  setExcludeIngredients: (val: string[]) => void;
  omitIngredients: string[];
  setOmitIngredients: (val: string[]) => void;
}

export const FilterOverlay: React.FC<FilterOverlayProps> = (props) => {
  const {
    onClose, onSave, onReset, source,
    maxCalories, setMaxCalories,
    maxTotalTime, handleTotalTimeChange,
    maxHeatingTime, setMaxHeatingTime,
    maxCostPerPortion, setMaxCostPerPortion,
    cuisines, setCuisines,
    cookingMethods, setCookingMethods,
    nutritiousChoice, setNutritiousChoice,
    highOmega3, setHighOmega3,
    highProtein, setHighProtein,
    includeOffal, setIncludeOffal,
    isSimple, setIsSimple,
    isLowCost, setIsLowCost,
    supermarkets, setSupermarkets,
    dietaryRule, setDietaryRule,
    saladPreference, setSaladPreference,
    servings, setServings,
    allergies, setAllergies,
    religiousEthical, setReligiousEthical,
    cookingFats, setCookingFats,
    preferredSourceIds, setPreferredSourceIds,
    isDietaryRuleSuppressed, suppressedPermanentKeys, clearSuppression,
    excludeInputRef, omitInputRef,
    excludeIngredients, setExcludeIngredients,
    omitIngredients, setOmitIngredients
  } = props;

  const { savePreferences, profile, showToast } = useAuth();

  // Maintain isolated local states for all interactive filters
  const [localMaxCalories, setLocalMaxCalories] = React.useState(maxCalories);
  const [localMaxTotalTime, setLocalMaxTotalTime] = React.useState(maxTotalTime);
  const [localMaxHeatingTime, setLocalMaxHeatingTime] = React.useState(maxHeatingTime);
  const [localMaxCostPerPortion, setLocalMaxCostPerPortion] = React.useState(maxCostPerPortion);
  const [localCuisines, setLocalCuisines] = React.useState<string[]>(cuisines);
  const [localCookingMethods, setLocalCookingMethods] = React.useState<string[]>(cookingMethods);
  const [localNutritiousChoice, setLocalNutritiousChoice] = React.useState(nutritiousChoice);
  const [localHighOmega3, setLocalHighOmega3] = React.useState(highOmega3);
  const [localHighProtein, setLocalHighProtein] = React.useState(highProtein);
  const [localIncludeOffal, setLocalIncludeOffal] = React.useState(
    dietaryRuleAllowsOffal(dietaryRule) && includeOffal
  );
  const [localIsSimple, setLocalIsSimple] = React.useState(isSimple);
  const [localIsLowCost, setLocalIsLowCost] = React.useState(isLowCost);
  const [localSupermarkets, setLocalSupermarkets] = React.useState<string[]>(supermarkets);
  const [localDietaryRule, setLocalDietaryRule] = React.useState(dietaryRule);
  const [localSaladPreference, setLocalSaladPreference] = React.useState(saladPreference);
  const [localServings, setLocalServings] = React.useState(servings);
  const [localExcludeIngredients, setLocalExcludeIngredients] = React.useState<string[]>(excludeIngredients);
  const [localOmitIngredients, setLocalOmitIngredients] = React.useState<string[]>(omitIngredients);
  const [localAllergies, setLocalAllergies] = React.useState<string[]>(allergies);
  const [localReligiousEthical, setLocalReligiousEthical] = React.useState<string[]>(religiousEthical);
  const [localCookingFats, setLocalCookingFats] = React.useState<string[]>(
    filterCookingFatsForDiet(dietaryRule, cookingFats)
  );
  const [localPreferredSourceIds, setLocalPreferredSourceIds] = React.useState<string[]>(preferredSourceIds);

  const localOffalAllowed = dietaryRuleAllowsOffal(localDietaryRule);

  React.useEffect(() => {
    if (!localOffalAllowed && localIncludeOffal) setLocalIncludeOffal(false);
  }, [localOffalAllowed, localIncludeOffal]);

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    dietary: true,
    sources: source === 'ready-made',
    timeBudget: false,
    cooking: false,
    goals: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Apply inputs and states back to parent variables
  const commitLocalStatesToParent = (finalExclude: string[]) => {
    setMaxCalories(localMaxCalories);
    if (source === 'cook') {
      handleTotalTimeChange(localMaxTotalTime);
    } else {
      setMaxHeatingTime(localMaxHeatingTime);
    }
    setMaxCostPerPortion(localMaxCostPerPortion);
    setCuisines(localCuisines);
    setCookingMethods(localCookingMethods);
    setNutritiousChoice(localNutritiousChoice);
    setHighOmega3(localHighOmega3);
    setHighProtein(localHighProtein);
    setIncludeOffal(localIncludeOffal);
    setIsSimple(localIsSimple);
    setIsLowCost(localIsLowCost);
    setSupermarkets(localSupermarkets);
    setDietaryRule(localDietaryRule);
    setSaladPreference(localSaladPreference);
    setServings(localServings);
    setExcludeIngredients(finalExclude);
    setOmitIngredients(localOmitIngredients);
    setAllergies(localAllergies);
    setReligiousEthical(localReligiousEthical);
    setCookingFats(localCookingFats);
    setPreferredSourceIds(localPreferredSourceIds);
  };

  const handleApplyToThisSearch = () => {
    // Process final draft input from text field
    const excludeVal = excludeInputRef.current?.value.trim() || '';
    let finalExclude = [...localExcludeIngredients];
    if (excludeVal && !localExcludeIngredients.includes(excludeVal)) {
      finalExclude = [...localExcludeIngredients, excludeVal];
      setLocalExcludeIngredients(finalExclude);
      if (excludeInputRef.current) excludeInputRef.current.value = '';
    }

    commitLocalStatesToParent(finalExclude);
    onSave(); // Close and execute search with updated temp filter states
  };

  const handleSaveAsDefault = async () => {
    const excludeVal = excludeInputRef.current?.value.trim() || '';
    let finalExclude = [...localExcludeIngredients];
    if (excludeVal && !localExcludeIngredients.includes(excludeVal)) {
      finalExclude = [...localExcludeIngredients, excludeVal];
      setLocalExcludeIngredients(finalExclude);
      if (excludeInputRef.current) excludeInputRef.current.value = '';
    }

    commitLocalStatesToParent(finalExclude);

    const currentPrefs = profile?.preferences || {};
    const updatedPreferences: any = {
      ...currentPrefs,
      dietaryRule: localDietaryRule,
      saladPreference: localSaladPreference,
      allergies: localAllergies,
      nutritiousChoice: localNutritiousChoice,
      isSimple: localIsSimple,
      isLowCost: localIsLowCost,
      highOmega3: localHighOmega3,
      highProtein: localHighProtein,
      includeOffal: localIncludeOffal,
      servings: parseInt(localServings) || 2,
      calorieCeiling: localMaxCalories ? parseInt(localMaxCalories) : null,
      budgetLimit: localMaxCostPerPortion ? parseFloat(localMaxCostPerPortion) : null,
      exclusions: finalExclude,
      cuisinePreferences: localCuisines,
      religiousEthical: localReligiousEthical,
      cookingMethods: localCookingMethods,
      cookingFats: localCookingFats,
      readyToEatUnderMins: localMaxTotalTime ? parseInt(localMaxTotalTime) : (localMaxHeatingTime ? parseInt(localMaxHeatingTime) : null),
      preferredSupermarkets: localSupermarkets,
      preferredSourceIds: localPreferredSourceIds,
    };

    try {
      await savePreferences(updatedPreferences);
      showToast("Default preferences synchronized!");
      onSave();
    } catch (err) {
      showToast("Error updating default preferences.");
    }
  };

  const resetAllLocalFilters = (commitReset = true) => {
    setLocalMaxCalories('');
    setLocalMaxTotalTime('');
    setLocalMaxHeatingTime('');
    setLocalMaxCostPerPortion('');
    setLocalCuisines([]);
    setLocalCookingMethods([]);
    setLocalNutritiousChoice(false);
    setLocalHighOmega3(false);
    setLocalHighProtein(false);
    setLocalIncludeOffal(false);
    setLocalIsSimple(false);
    setLocalIsLowCost(false);
    setLocalSupermarkets([]);
    setLocalDietaryRule('none');
    setLocalSaladPreference('all');
    setLocalServings('2');
    setLocalExcludeIngredients([]);
    setLocalOmitIngredients([]);
    setLocalAllergies([]);
    setLocalReligiousEthical([]);
    setLocalCookingFats([]);
    setLocalPreferredSourceIds([]);

    if (excludeInputRef.current) excludeInputRef.current.value = '';
    if (omitInputRef.current) omitInputRef.current.value = '';
    
    if (commitReset) {
      onReset();
    }
  };

  const activePreferenceCount =
    (localDietaryRule !== 'none' ? 1 : 0) +
    (localSaladPreference !== 'all' ? 1 : 0) +
    localAllergies.length +
    localReligiousEthical.length +
    localExcludeIngredients.length +
    (source === 'cook' ? localPreferredSourceIds.length : localSupermarkets.length) +
    ((source === 'cook' ? localMaxTotalTime : localMaxHeatingTime) ? 1 : 0) +
    (localServings !== '2' ? 1 : 0) +
    (localMaxCalories ? 1 : 0) +
    (localMaxCostPerPortion ? 1 : 0) +
    localCuisines.length +
    localCookingMethods.length +
    localCookingFats.length +
    (localNutritiousChoice ? 1 : 0) +
    (localIsSimple ? 1 : 0) +
    (localIsLowCost ? 1 : 0) +
    (localHighOmega3 ? 1 : 0) +
    (localHighProtein ? 1 : 0) +
    (localIncludeOffal ? 1 : 0);

  return (
    <motion.div 
      id="filter-overlay-backdrop"
      key="filter-overlay-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/40 backdrop-blur-sm overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        id="filter-overlay-content"
        key="filter-overlay-content"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0, transition: { duration: 0.25 } }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-lg rounded-t-md sm:rounded-md shadow-xl overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-gray-950 tracking-normal">Recipe preferences</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded transition-colors shrink-0">
              <CircleX className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="text-[12.5px] mt-2 text-gray-500 leading-relaxed font-medium">
            Set your preferences once. Every search uses them — diet, allergies, budget, calories, portions, time, cooking method, nutrition goals, trusted sources, preferred supermarkets. Nothing gets retyped. A search that knows you're cooking for one and avoiding nuts won't ask twice. Revise any time. Override for a single search.
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-gray-400">
              {activePreferenceCount > 0
                ? `${activePreferenceCount} active preference${activePreferenceCount === 1 ? '' : 's'}`
                : 'No active preferences'}
            </span>
            {activePreferenceCount > 0 && (
              <button
                type="button"
                onClick={() => resetAllLocalFilters(false)}
                className="text-[10.5px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded border border-gray-100 bg-gray-50/70 px-3 py-2.5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
            <p className="text-[10.5px] font-medium leading-relaxed text-gray-500">
              <span className="font-bold text-gray-600">Why results can narrow:</span> allergies and diet rules exclude unsuitable ingredients, while budget, time and sourcing choices narrow the remaining recipes. If no suitable recipe appears, remove one preference or broaden a limit.
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-3 pb-0 overflow-y-auto space-y-2 flex-1 scrollbar-hide no-scrollbar">
          {/* Suppressed Filters Notification */}
          {(isDietaryRuleSuppressed || (suppressedPermanentKeys && suppressedPermanentKeys.length > 0)) && (
            <div className="p-2.5 bg-accent/5 border border-accent/10 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="p-1 bg-accent/10 rounded shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-[11.5px] text-accent font-bold leading-tight">
                  {isDietaryRuleSuppressed ? 'Dietary preferences paused' : 'Permanent preferences hidden'}
                </p>
                <p className="text-[10px] text-accent/70 font-medium">Standard rules (diet, allergies) are inactive for this search.</p>
              </div>
              {clearSuppression && (
                <button 
                  onClick={clearSuppression}
                  className="px-2 py-1 text-[10px] font-bold text-accent tracking-[0.04em] hover:underline bg-accent/10 rounded shrink-0"
                >
                  Restore
                </button>
              )}
            </div>
          )}

          {/* Collapsible Accordions and Filters */}
          <div className="space-y-3.5 pb-4">
            
            {/* Category 1: Dietary Essentials */}
            <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleSection('dietary')}
                className="w-full h-12 flex items-center justify-between px-4 bg-white hover:bg-gray-50/70 transition-colors text-left font-display outline-none select-none cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Apple className="w-4 h-4 text-gray-500" />
                  <span className="text-[12.5px] font-bold text-gray-800 tracking-[0.02em]">Diet, allergies & exclusions</span>
                  {(() => {
                    const cnt = (localDietaryRule !== 'none' ? 1 : 0) + 
                                  (localSaladPreference !== 'all' ? 1 : 0) + 
                                  localAllergies.length + 
                                  localReligiousEthical.length + 
                                  localExcludeIngredients.length +
                                  (localIncludeOffal ? 1 : 0);
                    return cnt > 0 ? (
                      <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">{cnt}</span>
                    ) : null;
                  })()}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    openSections.dietary ? 'rotate-180 text-gray-700' : ''
                  }`} 
                />
              </button>
              
              {openSections.dietary && (
                <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-3.5 bg-white animate-in fade-in duration-200">
                  {/* Dietary Preference */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Dietary preference</label>
                    <div className="relative mt-1">
                      <select 
                        value={localDietaryRule}
                        onChange={(e) => {
                          const nextDietaryRule = e.target.value as any;
                          setLocalDietaryRule(nextDietaryRule);
                          if (!dietaryRuleAllowsOffal(nextDietaryRule)) setLocalIncludeOffal(false);
                          setLocalCookingFats(currentFats => filterCookingFatsForDiet(nextDietaryRule, currentFats));
                        }}
                        className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium appearance-none"
                      >
                        {DIETARY_TAXONOMY.dietaryPreferences.options.map(opt => (
                          <option key={opt} value={opt}>{DIETARY_TAXONOMY.dietaryPreferences.labels[opt]}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Salad Preference */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Salad preference</label>
                    <div className="relative mt-1">
                      <select 
                        value={localSaladPreference}
                        onChange={(e) => setLocalSaladPreference(e.target.value as any)}
                        className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium appearance-none"
                      >
                        {Object.entries(DIETARY_TAXONOMY.saladPreferences.labels).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Safety Note */}
                  {localOffalAllowed && (
                    <label className="flex cursor-pointer items-start justify-between gap-4 rounded border border-gray-200 bg-gray-50/70 p-3">
                      <span className="min-w-0">
                        <span className="block text-[12px] font-bold text-gray-800">Include offal in suggestions</span>
                        <span className="mt-1 block text-[10.5px] leading-relaxed text-gray-500">Allows liver, kidney, heart and other offal to appear in ordinary searches and weekly plans.</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={localIncludeOffal}
                        onChange={(event) => setLocalIncludeOffal(event.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-dbd-accent"
                      />
                    </label>
                  )}

                  {/* Safety Note */}
                  <div className="bg-amber-50/40 border-l-2 border-amber-400 px-3 py-2.5 rounded-sm flex items-start gap-2.5">
                    <ShieldAlert size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[10.5px] text-amber-900/75 font-medium leading-relaxed">
                      We filter obvious conflicts from your selections, but cannot confirm allergy, medical, religious or other suitability. Check ingredients, packaging and cooking guidance before preparing or serving. <a href="/food-safety" className="font-semibold text-amber-900 hover:underline">Food safety</a>
                    </p>
                  </div>

                  {/* Allergies */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Allergies</label>
                    <div className="relative mt-1">
                      <select 
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !localAllergies.includes(val)) {
                            setLocalAllergies([...localAllergies, val]);
                          }
                        }}
                        className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium appearance-none"
                      >
                        <option value="">Add allergy...</option>
                        {DIETARY_TAXONOMY.allergies.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {localAllergies.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-2 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                        <span className="text-[10px] font-semibold text-gray-400 tracking-[0.02em] pl-0.5">Active allergies</span>
                        {localAllergies.map(item => (
                          <div key={item} className="flex items-center justify-between py-1.5 px-2.5 bg-red-50 text-red-700 border border-red-100 rounded text-[11px] font-medium animate-in fade-in zoom-in-95 duration-100">
                            {item}
                            <button type="button" onClick={() => setLocalAllergies(localAllergies.filter(i => i !== item))} className="hover:text-red-900 transition-colors p-0.5 cursor-pointer">
                              <CircleX size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Religious & Ethical */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Religious & ethical</label>
                    <div className="mt-1 space-y-1.5 rounded border border-gray-200 bg-gray-50/50 p-2.5">
                      {DIETARY_TAXONOMY.religiousEthical.options.map(opt => {
                        const checked = localReligiousEthical.includes(opt);
                        return (
                          <label key={opt} className="flex cursor-pointer items-start gap-2.5 rounded px-2 py-2 hover:bg-white">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => setLocalReligiousEthical(
                                checked
                                  ? localReligiousEthical.filter(item => item !== opt)
                                  : [...localReligiousEthical, opt]
                              )}
                              className="mt-0.5 h-4 w-4 shrink-0 accent-dbd-accent"
                            />
                            <span className="text-[11px] font-medium leading-relaxed text-gray-700">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Other Ingredients to Avoid */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Other ingredients to avoid</label>
                    <p className="text-[10.5px] leading-relaxed text-gray-400 pl-0.5">Use this for allergies or intolerances not listed above, or ingredients you simply do not want.</p>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input 
                          ref={excludeInputRef}
                          type="text"
                          placeholder="e.g. mushrooms, coriander, malt"
                          className="flex-1 h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = e.currentTarget.value.trim();
                              if (val && !localExcludeIngredients.includes(val)) {
                                setLocalExcludeIngredients([...localExcludeIngredients, val]);
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const val = excludeInputRef.current?.value.trim();
                            if (val && !localExcludeIngredients.includes(val)) {
                              setLocalExcludeIngredients([...localExcludeIngredients, val]);
                              if (excludeInputRef.current) excludeInputRef.current.value = '';
                            }
                          }}
                          className="px-4 h-11 bg-gray-100 text-gray-950 text-[12px] font-bold rounded hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      {localExcludeIngredients.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 bg-gray-50/50 p-2 rounded border border-gray-100">
                          {localExcludeIngredients.map(item => (
                            <span key={item} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-gray-100 border border-gray-200 text-[11px] font-semibold text-gray-700 rounded select-none animate-in fade-in zoom-in-95 duration-100">
                              {item}
                              <button type="button" onClick={() => setLocalExcludeIngredients(localExcludeIngredients.filter(i => i !== item))} className="hover:text-accent cursor-pointer">
                                <CircleX size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category 2: Sources & Stores */}
            <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleSection('sources')}
                className="w-full h-12 flex items-center justify-between px-4 bg-white hover:bg-gray-50/70 transition-colors text-left font-display outline-none select-none cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-gray-500" />
                  <span className="text-[12.5px] font-bold text-gray-800 tracking-[0.02em]">Sources & stores</span>
                  <Info className="w-3 h-3 text-gray-300 ml-0.5 select-none" />
                  {(() => {
                    const cnt = source === 'cook' ? localPreferredSourceIds.length : localSupermarkets.length;
                    return cnt > 0 ? (
                      <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">{cnt}</span>
                    ) : null;
                  })()}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    openSections.sources ? 'rotate-180 text-gray-700' : ''
                  }`} 
                />
              </button>
              
              {openSections.sources && (
                <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-3.5 bg-white animate-in fade-in duration-200">
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic pl-1 border-l-2 border-accent/20">
                    Your selected sources help shape recommendations and shopping links, but recipe searches may still include relevant results from other sources. <a href="/recipe-methodology" className="font-semibold text-dbd-accent not-italic hover:underline">Where recipes come from</a>
                  </p>
                  {source === 'cook' ? (
                    /* Trusted Sources */
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Trusted sources</label>
                        <span className="text-[9.5px] font-semibold text-accent bg-accent/5 px-2 py-0.5 rounded">Cook mode</span>
                      </div>
                      <div className="relative mt-1">
                        <select 
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !localPreferredSourceIds.includes(val)) {
                              setLocalPreferredSourceIds([...localPreferredSourceIds, val]);
                            }
                          }}
                          className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium appearance-none"
                        >
                          <option value="">Add trusted source...</option>
                          {PREFERRED_SOURCES.map(sourceOpt => (
                            <option key={sourceOpt.id} value={sourceOpt.id}>{sourceOpt.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {localPreferredSourceIds.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-2 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.02em] pl-0.5">Active trusted sources</span>
                          {localPreferredSourceIds.map(id => {
                            const sourceObj = PREFERRED_SOURCES.find(s => s.id === id);
                            const label = sourceObj ? sourceObj.label : id;
                            return (
                              <div key={id} className="flex items-center justify-between py-1.5 px-2.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-medium text-gray-700 animate-in fade-in zoom-in-95 duration-100">
                                {label}
                                <button type="button" onClick={() => setLocalPreferredSourceIds(localPreferredSourceIds.filter(i => i !== id))} className="hover:text-accent transition-colors p-0.5 cursor-pointer">
                                  <CircleX size={13} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Nearby Retailers */
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Nearby retailers</label>
                        <span className="text-[9.5px] font-semibold text-accent bg-accent/5 px-2 py-0.5 rounded">Ready-made mode</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed pl-0.5">
                        Choose the shops you can easily use. Ready-made results will prioritise these.
                      </p>
                      <div className="relative mt-1">
                        <select 
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !localSupermarkets.includes(val)) {
                              setLocalSupermarkets([...localSupermarkets, val]);
                            }
                          }}
                          className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium appearance-none"
                        >
                          <option value="">Add nearby retailer...</option>
                          {DIETARY_TAXONOMY.supermarkets.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {localSupermarkets.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-2 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.02em] pl-0.5">Your nearby retailers</span>
                          {localSupermarkets.map(item => (
                            <div key={item} className="flex items-center justify-between py-1.5 px-2.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-medium text-gray-700 animate-in fade-in zoom-in-95 duration-100">
                              {item}
                              <button type="button" onClick={() => setLocalSupermarkets(localSupermarkets.filter(i => i !== item))} className="hover:text-accent transition-colors p-0.5 cursor-pointer">
                                <CircleX size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category 3: Time, Portions & Budget */}
            <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleSection('timeBudget')}
                className="w-full h-12 flex items-center justify-between px-4 bg-white hover:bg-gray-50/70 transition-colors text-left font-display outline-none select-none cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-[12.5px] font-bold text-gray-800 tracking-[0.02em]">Time, portions & budget</span>
                  {(() => {
                    const readyTimeActive = (source === 'cook' ? localMaxTotalTime : localMaxHeatingTime) ? 1 : 0;
                    const portionsActive = localServings !== '2' ? 1 : 0;
                    const calActive = localMaxCalories ? 1 : 0;
                    const costActive = localMaxCostPerPortion ? 1 : 0;
                    const cnt = readyTimeActive + portionsActive + calActive + costActive;
                    return cnt > 0 ? (
                      <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">{cnt}</span>
                    ) : null;
                  })()}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    openSections.timeBudget ? 'rotate-180 text-gray-700' : ''
                  }`} 
                />
              </button>
              
              {openSections.timeBudget && (
                <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-3.5 bg-white animate-in fade-in duration-200">
                  {/* Portions Counter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 pl-0.5">
                      <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em]">Portions</label>
                      <a
                        href="/food-costs/portion-planning-and-food-waste"
                        className="text-[10px] font-semibold text-dbd-accent hover:underline"
                      >
                        Portion-planning guide
                      </a>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded border border-gray-200">
                      <span className="text-[13px] font-semibold text-gray-700">Adult portions</span>
                      <NumberStepper 
                        value={parseInt(localServings) || 2} 
                        onChange={(val) => setLocalServings(val.toString())} 
                        min={1} 
                        max={12} 
                      />
                    </div>
                  </div>

                  {/* Ready in under (Time) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Ready in under</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={source === 'cook' ? localMaxTotalTime : localMaxHeatingTime}
                        onChange={(e) => source === 'cook' ? setLocalMaxTotalTime(e.target.value) : setLocalMaxHeatingTime(e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-gray-400 font-semibold">mins</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Calories */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Max calories</label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={localMaxCalories}
                          onChange={(e) => setLocalMaxCalories(e.target.value)}
                          placeholder="e.g. 600"
                          className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400 uppercase">kcal</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 pl-0.5">
                        <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em]">Max cost per portion</label>
                        <a
                          href="/pricing-methodology"
                          className="text-[10px] font-semibold text-dbd-accent hover:underline"
                        >
                          How costs work
                        </a>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 font-bold">£</span>
                        <input 
                          type="number"
                          step="0.50"
                          value={localMaxCostPerPortion}
                          onChange={(e) => setLocalMaxCostPerPortion(e.target.value)}
                          placeholder="e.g. 5.00"
                          className="w-full h-11 pl-8 pr-4 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category 4: Cooking Preferences */}
            <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleSection('cooking')}
                className="w-full h-12 flex items-center justify-between px-4 bg-white hover:bg-gray-50/70 transition-colors text-left font-display outline-none select-none cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Utensils className="w-4 h-4 text-gray-500" />
                  <span className="text-[12.5px] font-bold text-gray-800 tracking-[0.02em]">Cooking preferences</span>
                  {(() => {
                    const cnt = localCuisines.length + localCookingMethods.length + localCookingFats.length;
                    return cnt > 0 ? (
                      <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">{cnt}</span>
                    ) : null;
                  })()}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    openSections.cooking ? 'rotate-180 text-gray-700' : ''
                  }`} 
                />
              </button>
              
              {openSections.cooking && (
                <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-3.5 bg-white animate-in fade-in duration-200">
                  {/* Cuisine Preferences */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Cuisine preferences</label>
                    <div className="relative mt-1">
                      <select 
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !localCuisines.includes(val)) {
                            setLocalCuisines([...localCuisines, val]);
                          }
                        }}
                        className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium appearance-none"
                      >
                        <option value="">Select cuisine...</option>
                        {DIETARY_TAXONOMY.cuisinePreferences.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {localCuisines.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-2 bg-gray-50/50 p-2.5 rounded border border-gray-100 font-display">
                        <span className="text-[10px] font-semibold text-gray-400 tracking-[0.02em] pl-0.5">Active cuisines</span>
                        {localCuisines.map(item => (
                          <div key={item} className="flex items-center justify-between py-1 px-2.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-medium text-gray-700 animate-in fade-in zoom-in-95 duration-100 font-sans">
                            {item}
                            <button type="button" onClick={() => setLocalCuisines(localCuisines.filter(i => i !== item))} className="hover:text-accent transition-colors p-0.5 cursor-pointer">
                              <CircleX size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cooking Methods */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Cooking methods</label>
                    <div className="relative mt-1">
                      <select 
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !localCookingMethods.includes(val)) {
                            setLocalCookingMethods([...localCookingMethods, val]);
                          }
                        }}
                        className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium appearance-none"
                      >
                        <option value="">Any method</option>
                        {[
                          'Air fryer', 'BBQ', 'One pot', 'Oven bake', 'Pan fried', 'Slow cooker', 'Stir fry', 'Tray bake'
                        ].map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {localCookingMethods.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-2 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                        <span className="text-[10px] font-semibold text-gray-400 tracking-[0.02em] pl-0.5">Active methods</span>
                        {localCookingMethods.map(item => (
                          <div key={item} className="flex items-center justify-between py-1 px-2.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-medium text-gray-700 animate-in fade-in zoom-in-95 duration-100">
                            {item}
                            <button type="button" onClick={() => setLocalCookingMethods(localCookingMethods.filter(i => i !== item))} className="hover:text-accent transition-colors p-0.5 cursor-pointer">
                              <CircleX size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cooking Fats */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-500 tracking-[0.02em] pl-0.5">Cooking fats</label>
                    <div className="relative mt-1">
                      <select 
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !localCookingFats.includes(val)) {
                            setLocalCookingFats([...localCookingFats, val]);
                          }
                        }}
                        className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 rounded text-[13px] outline-none focus:ring-2 focus:ring-accent/15 focus:border-gray-300 transition-all font-medium appearance-none"
                      >
                        <option value="">Any cooking fat</option>
                        {filterCookingFatsForDiet(localDietaryRule, DIETARY_TAXONOMY.cookingFats.options).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {localCookingFats.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-2 bg-gray-50/50 p-2.5 rounded border border-gray-100 font-display">
                        <span className="text-[10px] font-semibold text-gray-400 tracking-[0.02em] pl-0.5">Active cooking fats</span>
                        {localCookingFats.map(item => (
                          <div key={item} className="flex items-center justify-between py-1.5 px-2.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-medium text-gray-700 animate-in fade-in zoom-in-95 duration-100">
                            {item}
                            <button type="button" onClick={() => setLocalCookingFats(localCookingFats.filter(i => i !== item))} className="hover:text-accent transition-colors p-0.5 cursor-pointer">
                              <CircleX size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Category 5: Priorities */}
            <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleSection('goals')}
                className="w-full h-12 flex items-center justify-between px-4 bg-white hover:bg-gray-50/70 transition-colors text-left font-display outline-none select-none cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span className="text-[12.5px] font-bold text-gray-800 tracking-[0.02em]">Priorities</span>
                  {(() => {
                    const cnt = (localNutritiousChoice ? 1 : 0) + 
                                  (localIsSimple ? 1 : 0) + 
                                  (localIsLowCost ? 1 : 0) + 
                                  (localHighOmega3 ? 1 : 0) +
                                  (localHighProtein ? 1 : 0);
                    return cnt > 0 ? (
                      <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">{cnt}</span>
                    ) : null;
                  })()}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    openSections.goals ? 'rotate-180 text-gray-700' : ''
                  }`} 
                />
              </button>
              
              {openSections.goals && (
                <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-2.5 bg-white animate-in fade-in duration-200">
                  {[
                    { 
                      id: 'wholesome', 
                      label: 'Wholesome Recipes', 
                      active: localNutritiousChoice, 
                      toggle: () => setLocalNutritiousChoice(!localNutritiousChoice), 
                      tooltip: 'Prioritises recipes that are nutrient-dense and less processed as a default search preference.' 
                    },
                    { 
                      id: 'simple', 
                      label: 'Quick & Easy', 
                      active: localIsSimple, 
                      toggle: () => setLocalIsSimple(!localIsSimple), 
                      tooltip: 'Prioritises recipes with fewer ingredients and steps as a default search preference.' 
                    },
                    { 
                      id: 'low-cost', 
                      label: 'Low Cost', 
                      active: localIsLowCost, 
                      toggle: () => setLocalIsLowCost(!localIsLowCost), 
                      tooltip: 'Prioritises budget-friendly options based on typical market pricing.' 
                    },
                    { 
                      id: 'omega3', 
                      label: 'High Omega-3', 
                      active: localHighOmega3, 
                      toggle: () => setLocalHighOmega3(!localHighOmega3), 
                      tooltip: 'Prioritises heart-healthy ingredients rich in essential fatty acids (e.g. oily fish).' 
                    },
                    { 
                      id: 'protein', 
                      label: 'High Protein', 
                      active: localHighProtein, 
                      toggle: () => setLocalHighProtein(!localHighProtein), 
                      tooltip: 'Prioritises recipes with a higher protein-to-calorie ratio to support your nutrition goals.' 
                    }
                  ].map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-start justify-between p-3 bg-gray-50/70 border border-gray-100 rounded hover:border-gray-200 transition-colors gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-gray-800 leading-tight flex items-center gap-1.5">
                          {item.label}
                          <Tooltip text={item.tooltip} position="bottom" align="center">
                            <Info className="w-3.5 h-3.5 text-gray-300 hover:text-gray-400 cursor-help transition-colors font-semibold" />
                          </Tooltip>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium leading-normal mt-0.5">{item.tooltip}</p>
                      </div>
                      <button
                        type="button"
                        onClick={item.toggle}
                        className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors shrink-0 mt-0.5 cursor-pointer ${
                          item.active ? 'bg-accent' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                            item.active ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dual-Action Footer Buttons */}
        <div className="px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5 border-t border-gray-100 bg-white space-y-3 shrink-0 shadow-[0_-10px_24px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-2 gap-2.5">
            <button 
              type="button"
              onClick={handleApplyToThisSearch}
              className="min-h-12 px-3 py-3 bg-gray-900 hover:bg-black text-white rounded text-[11px] sm:text-[12px] font-bold tracking-[0.04em] leading-none whitespace-nowrap flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="sm:hidden">Apply</span>
              <span className="hidden sm:inline">Apply to this search</span>
            </button>
            <button 
              type="button"
              onClick={handleSaveAsDefault}
              className="min-h-12 px-3 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded text-[11px] sm:text-[12px] font-bold tracking-[0.04em] leading-none whitespace-nowrap flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span className="sm:hidden">Save default</span>
              <span className="hidden sm:inline">Save as my default</span>
            </button>
          </div>
          <button 
            type="button"
            onClick={() => resetAllLocalFilters()}
            className="w-full min-h-10 px-4 py-2.5 bg-white text-gray-400 hover:text-gray-700 text-[11px] font-bold tracking-[0.04em] leading-none text-center hover:bg-gray-50 transition-all rounded"
          >
            Clear preferences
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
