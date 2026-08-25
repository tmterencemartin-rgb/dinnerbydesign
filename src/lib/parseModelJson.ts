export const parseModelJson = (text: string): any => {
  const trimmed = String(text || '').trim();
  if (!trimmed) throw new Error('Empty model response');

  const candidates = [trimmed];
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) candidates.push(fenced[1].trim());

  const objectStart = trimmed.indexOf('{');
  const objectEnd = trimmed.lastIndexOf('}');
  if (objectStart >= 0 && objectEnd > objectStart) {
    candidates.push(trimmed.slice(objectStart, objectEnd + 1));
  }

  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (error) {
      lastError = error;
    }

    // Occasionally the provider emits an ellipsis placeholder for an array
    // despite the JSON response schema. Treat that placeholder as no items so
    // the bounded repair pass can request complete grounded results.
    const repaired = candidate.replace(
      /("(?:items|rationales)"\s*:\s*)\[\s*(?:\.\.\.|…)\s*\]/g,
      '$1[]'
    ).replace(
      /("(?:items|rationales)"\s*:\s*)\.\.\.(?=\s*[,}])/g,
      '$1[]'
    );
    if (repaired !== candidate) {
      try {
        return JSON.parse(repaired);
      } catch (error) {
        lastError = error;
      }
    }

    // If the provider truncated the response immediately after the
    // placeholder, keep the search repair path alive with an empty array.
    if (/"items"\s*:\s*(?:\.\.\.|…|\[\s*(?:\.\.\.|…))/i.test(candidate)) {
      return { items: [] };
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Invalid model JSON');
};
