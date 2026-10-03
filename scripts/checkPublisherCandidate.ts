import { checkCandidate } from '../src/lib/publisherCandidateCheck';

// Usage: npx tsx scripts/checkPublisherCandidate.ts <host> <recipe-url> <recipe-url> <recipe-url> [...]
// Example: npx tsx scripts/checkPublisherCandidate.ts www.example.co.uk https://www.example.co.uk/recipes/a ...
const [host, ...samples] = process.argv.slice(2);
if (!host || samples.length === 0) {
  console.error('Usage: tsx scripts/checkPublisherCandidate.ts <host> <recipe-url> [<recipe-url> ...]');
  process.exit(2);
}

checkCandidate(host.replace(/^https?:\/\//, '').replace(/\/.*$/, ''), samples).then(report => {
  console.log(`Candidate: ${report.host}`);
  console.log(`Verdict:   ${report.verdict.toUpperCase()}`);
  console.log(`robots.txt read: ${report.robots.fetched ? 'yes' : 'no'}`);
  console.log(`Content leans: ${report.content.lean} · UK terms: ${report.content.uk.join(', ') || 'none'} · other terms: ${report.content.nonUk.join(', ') || 'none'}`);
  report.pages.forEach(page => {
    console.log(`\n${page.url}`);
    console.log(`  status ${page.status} · same host: ${page.sameHost} · recipe evidence: ${page.evidence} · sign-in wording: ${page.paywall ? 'yes' : 'no'}`);
    if (page.notes.length) console.log(`  Notes: ${page.notes.join('; ')}`);
    console.log(`  UK signals: ${page.ukSignals.join(', ') || 'none'}`);
    if (page.problems.length) console.log(`  Problems: ${page.problems.join('; ')}`);
  });
  if (report.reasons.length) console.log(`\nReasons:\n- ${report.reasons.join('\n- ')}`);
  console.log('\nThis is evidence for a decision. It does not approve a site.');
  process.exit(report.verdict === 'fail' ? 1 : 0);
});
