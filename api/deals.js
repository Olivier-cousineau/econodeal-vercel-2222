// api/deals.js  (Vercel Serverless Function pour un projet Vite)
export default async function handler(req, res) {
  try {
    const q = (req.query.q || "").trim();
    const page = Number(req.query.page || 1);
    const pageSize = Math.min(Number(req.query.pageSize || 50), 100);

    const base = "https://api.bestbuy.com/v1/products";
    const filter = q ? `(onSale=true&search=${encodeURIComponent(q)})` : `(onSale=true)`;
    const url =
      `${base}${filter}?apiKey=${process.env.BESTBUY_API_KEY}&format=json` +
      `&show=sku,name,regularPrice,salePrice,image,url,onSale` +
      `&page=${page}&pageSize=${pageSize}`;

    const r = await fetch(url);
    if (!r.ok) {
      const detail = await r.text();
      return res.status(500).json({ error: `Upstream ${r.status}`, detail });
    }
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
