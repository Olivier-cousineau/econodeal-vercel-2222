export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize") || 100), 100);

    const base = "https://api.bestbuy.com/v1/products";
    const filter = q ? `(onSale=true&search=${encodeURIComponent(q)})` : `(onSale=true)`;
    const url =
      `${base}${filter}?apiKey=${process.env.BESTBUY_API_KEY}&format=json` +
      `&show=sku,name,regularPrice,salePrice,image,url,onSale` +
      `&page=${page}&pageSize=${pageSize}`;

    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) {
      const detail = await r.text();
      return new Response(JSON.stringify({ error: `Upstream ${r.status}`, detail }), { status: 500 });
    }
    const data = await r.json();
    return Response.json(data);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
