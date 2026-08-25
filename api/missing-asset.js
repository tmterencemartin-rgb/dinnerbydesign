export default function handler(_req, res) {
  res.status(404).json({ error: 'Asset not found' });
}
