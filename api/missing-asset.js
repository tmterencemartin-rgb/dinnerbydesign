export default function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(404).json({ error: 'Asset not found' });
}
