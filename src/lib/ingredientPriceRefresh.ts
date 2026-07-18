import { CatalogueUnit } from '../services/groceryService';

const ALLOWED_UNITS = new Set<CatalogueUnit>(['g', 'kg', 'ml', 'l', 'each']);
const MAX_FEED_ITEMS = 400;

export interface LicensedIngredientPriceFeedItem {
  ingredientKey: string;
  aliases: string[];
  productLabel: string;
  retailer: string;
  packPrice: number;
  packQuantity: number;
  packUnit: CatalogueUnit;
  sourceUrl: string;
  observedAt: string;
  feedId?: string;
}

function requireText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`${field} must be a non-empty string of at most ${maxLength} characters.`);
  }
  return value.trim();
}

function requirePositiveNumber(value: unknown, field: string, maximum: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > maximum) {
    throw new Error(`${field} must be a positive number no greater than ${maximum}.`);
  }
  return value;
}

function requireHttpsUrl(value: unknown, field: string): string {
  const text = requireText(value, field, 2_000);
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    throw new Error(`${field} must be a valid URL.`);
  }
  if (url.protocol !== 'https:') throw new Error(`${field} must use HTTPS.`);
  return url.toString();
}

function normaliseObservedAt(value: unknown): string {
  const text = requireText(value, 'observedAt', 50);
  const timestamp = Date.parse(text);
  if (!Number.isFinite(timestamp)) throw new Error('observedAt must be a valid date or timestamp.');
  if (timestamp > Date.now() + 86_400_000) throw new Error('observedAt cannot be in the future.');
  return new Date(timestamp).toISOString();
}

export function parseLicensedIngredientPriceFeed(payload: unknown): LicensedIngredientPriceFeedItem[] {
  const rawItems = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { items?: unknown }).items)
      ? (payload as { items: unknown[] }).items
      : null;

  if (!rawItems) throw new Error('The licensed price feed must be an array or an object containing an items array.');
  if (rawItems.length > MAX_FEED_ITEMS) throw new Error(`The licensed price feed cannot contain more than ${MAX_FEED_ITEMS} items.`);

  const seen = new Set<string>();
  return rawItems.map((rawItem, index) => {
    if (!rawItem || typeof rawItem !== 'object') throw new Error(`Item ${index + 1} must be an object.`);
    const item = rawItem as Record<string, unknown>;
    const ingredientKey = requireText(item.ingredientKey, `Item ${index + 1} ingredientKey`, 100).toLowerCase();
    if (!/^[a-z0-9][a-z0-9 '&-]*$/.test(ingredientKey)) throw new Error(`Item ${index + 1} has an invalid ingredientKey.`);
    if (seen.has(ingredientKey)) throw new Error(`The feed contains duplicate ingredientKey: ${ingredientKey}.`);
    seen.add(ingredientKey);

    const aliases = item.aliases === undefined ? [] : item.aliases;
    if (!Array.isArray(aliases) || aliases.length > 30 || aliases.some(alias => typeof alias !== 'string')) {
      throw new Error(`Item ${index + 1} aliases must be an array of at most 30 strings.`);
    }

    const packUnit = requireText(item.packUnit, `Item ${index + 1} packUnit`, 10) as CatalogueUnit;
    if (!ALLOWED_UNITS.has(packUnit)) throw new Error(`Item ${index + 1} has an unsupported packUnit.`);

    return {
      ingredientKey,
      aliases: aliases.map(alias => alias.trim().toLowerCase()).filter(Boolean),
      productLabel: requireText(item.productLabel, `Item ${index + 1} productLabel`, 200),
      retailer: requireText(item.retailer, `Item ${index + 1} retailer`, 100),
      packPrice: requirePositiveNumber(item.packPrice, `Item ${index + 1} packPrice`, 1_000),
      packQuantity: requirePositiveNumber(item.packQuantity, `Item ${index + 1} packQuantity`, 100_000),
      packUnit,
      sourceUrl: requireHttpsUrl(item.sourceUrl, `Item ${index + 1} sourceUrl`),
      observedAt: normaliseObservedAt(item.observedAt),
      feedId: typeof item.feedId === 'string' && item.feedId.trim() ? item.feedId.trim().slice(0, 200) : undefined,
    };
  });
}

export function catalogueEntryMatchesFeedItem(
  current: {
    productLabel?: unknown;
    retailer?: unknown;
    packPrice?: unknown;
    packQuantity?: unknown;
    packUnit?: unknown;
    sourceUrl?: unknown;
  } | undefined,
  incoming: LicensedIngredientPriceFeedItem
): boolean {
  if (!current) return false;
  return current.productLabel === incoming.productLabel &&
    current.retailer === incoming.retailer &&
    current.packPrice === incoming.packPrice &&
    current.packQuantity === incoming.packQuantity &&
    current.packUnit === incoming.packUnit &&
    current.sourceUrl === incoming.sourceUrl;
}

export function ingredientPriceDocumentId(ingredientKey: string): string {
  return ingredientKey.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
