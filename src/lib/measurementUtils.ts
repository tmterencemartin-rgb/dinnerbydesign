/**
 * Utility for parsing and converting ingredient measurements
 * between Metric and Imperial units, using UK English standards and conventions.
 */

const numberRegexStr = `(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)`;

// Match strings with unit suffixes
const METRIC_REGEX = new RegExp(`(${numberRegexStr})\\s*(g|grams?|kg|kilograms?|ml|millilitres?|milliliters?|l|litres?|liters?)\\b`, 'gi');
const IMPERIAL_REGEX = new RegExp(`(${numberRegexStr})\\s*(oz|ounces?|lbs?|pounds?|fl\\.?\\s*oz\\.?|fluid\\s+ounces?|cups?)\\b`, 'gi');

/**
 * Parses numeric string supporting fractions (e.g. "1 1/2", "1/2", "1.5")
 */
export function parseNumber(str: string): number {
  str = str.trim();
  if (str.includes('/')) {
    const parts = str.split(/\s+/);
    if (parts.length === 2) {
      const whole = parseFloat(parts[0]);
      const fracParts = parts[1].split('/');
      return whole + (parseFloat(fracParts[0]) / parseFloat(fracParts[1]));
    } else {
      const fracParts = parts[0].split('/');
      return parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    }
  }
  return parseFloat(str);
}

/**
 * Formats a number elegantly based on whether it is imperial or metric.
 */
export function formatNumber(val: number, isImperial: boolean): string {
  if (!isImperial) {
    // Metric formatting
    if (val >= 10) {
      // Round to nearest 5 or 10 for neatness (e.g. 198g -> 200g)
      return (Math.round(val / 5) * 5).toString();
    }
    // E.g. 1.5kg, 0.5l
    return val.toFixed(1).replace(/\.0$/, '');
  } else {
    // Imperial formatting - round to nearest 0.25 (1/4)
    const roundedQuarter = Math.round(val * 4) / 4;
    if (roundedQuarter % 1 === 0) {
      return roundedQuarter.toString();
    }
    const whole = Math.floor(roundedQuarter);
    const frac = roundedQuarter % 1;
    let fracStr = '';
    if (frac === 0.25) fracStr = '¼';
    else if (frac === 0.5) fracStr = '½';
    else if (frac === 0.75) fracStr = '¾';
    else fracStr = frac.toString(); // fallback
    
    return whole > 0 ? `${whole} ${fracStr}` : fracStr;
  }
}

/**
 * Converts a recipe ingredient string to imperial units.
 * Finds metric units (g, kg, ml, l) and replaces them with imperial counterparts (oz, lb, fl oz, pints).
 */
export function convertToImperial(ingredientLine: string): string {
  return ingredientLine.replace(METRIC_REGEX, (match, numStr, unit) => {
    const val = parseNumber(numStr);
    if (isNaN(val)) return match;

    const lowerUnit = unit.toLowerCase();
    
    // Weight conversions
    if (lowerUnit === 'g' || lowerUnit === 'gram' || lowerUnit === 'grams') {
      const convertedVal = val * 0.035274;
      const nearestTenth = Math.round(convertedVal * 10) / 10;
      const nearestInt = Math.round(convertedVal);
      const formatted = Math.abs(convertedVal - nearestInt) <= 0.1 
        ? nearestInt.toString() 
        : nearestTenth.toFixed(1).replace(/\.0$/, '');
      const outputUnit = parseFloat(formatted) === 1 ? 'oz' : 'oz';
      return `${formatted} ${outputUnit}`;
    }
    if (lowerUnit === 'kg' || lowerUnit === 'kilogram' || lowerUnit === 'kilograms') {
      const convertedVal = val * 2.20462;
      const formatted = formatNumber(convertedVal, true);
      const outputUnit = parseFloat(formatted) === 1 ? 'lb' : 'lbs';
      return `${formatted} ${outputUnit}`;
    }

    // Volume conversions
    if (lowerUnit === 'ml' || lowerUnit.startsWith('millilit')) {
      // Smart cups conversions
      if (Math.abs(val - 250) < 15) return `1 cup`;
      if (Math.abs(val - 500) < 25) return `2 cups`;
      if (Math.abs(val - 125) < 10) return `½ cup`;
      if (Math.abs(val - 750) < 40) return `3 cups`;
      
      const convertedVal = val * 0.0351951; // UK fluid ounces
      const nearestTenth = Math.round(convertedVal * 10) / 10;
      const nearestInt = Math.round(convertedVal);
      const formatted = Math.abs(convertedVal - nearestInt) <= 0.1 
        ? nearestInt.toString() 
        : nearestTenth.toFixed(1).replace(/\.0$/, '');
      return `${formatted} fl oz`;
    }
    if (lowerUnit === 'l' || lowerUnit.startsWith('lit')) {
      const convertedVal = val * 1.75975; // UK pints
      const formatted = formatNumber(convertedVal, true);
      const outputUnit = parseFloat(formatted) === 1 ? 'pint' : 'pints';
      return `${formatted} ${outputUnit}`;
    }

    return match;
  });
}

/**
 * Converts a recipe ingredient string to metric units.
 * Finds imperial units (oz, lb, fl oz, cup) and replaces them with metric counterparts (g, kg, ml).
 */
export function convertToMetric(ingredientLine: string): string {
  return ingredientLine.replace(IMPERIAL_REGEX, (match, numStr, unit) => {
    const val = parseNumber(numStr);
    if (isNaN(val)) return match;

    const lowerUnit = unit.toLowerCase();

    // Weight conversions
    if (lowerUnit === 'oz' || lowerUnit.startsWith('ounc')) {
      const convertedVal = val * 28.349523;
      const formatted = formatNumber(convertedVal, false);
      return `${formatted}g`;
    }
    if (lowerUnit === 'lb' || lowerUnit === 'lbs' || lowerUnit.startsWith('pound')) {
      const grams = val * 453.59237;
      if (grams < 1000) {
        const formatted = formatNumber(grams, false);
        return `${formatted}g`;
      } else {
        const formatted = formatNumber(val * 0.45359237, false);
        return `${formatted}kg`;
      }
    }

    // Volume conversions
    if (lowerUnit.startsWith('fl') || lowerUnit.startsWith('fluid')) {
      const convertedVal = val * 28.413; // UK fluid ounces
      const formatted = formatNumber(convertedVal, false);
      return `${formatted}ml`;
    }
    if (lowerUnit.startsWith('cup')) {
      const convertedVal = val * 250;
      const formatted = formatNumber(convertedVal, false);
      return `${formatted}ml`;
    }

    return match;
  });
}

/**
 * Transforms an ingredient line dynamically to match target system ('metric' | 'imperial').
 */
export function convertIngredient(ingredientLine: string, targetSystem: 'metric' | 'imperial'): string {
  if (targetSystem === 'imperial') {
    return convertToImperial(ingredientLine);
  } else {
    return convertToMetric(ingredientLine);
  }
}
