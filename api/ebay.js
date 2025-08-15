export default async function handler(req, res) {
  try {
    const { q = "electronics", limit = 8, env = "PROD" } = req.query || {};
    const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID;
    const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
    if (!EBAY_CLIENT_ID || !EBAY_CLIENT_SECRET) {
      return res.status(500).json({ error: "Missing EBAY_CLIENT_ID/EBAY_CLIENT_SECRET" });
    }

    const isProd = String(env).toUpperCase() === "PROD";
    const tokenUrl = isProd
      ? "https://api.ebay.com/identity/v1/oauth2/token"
      : "https://api.sandbox.ebay.com/identity/v1/oauth2/token";
    const apiBase = isProd ? "https://api.ebay.com" : "https://api.sandbox.ebay.com";

    const basicAuth = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString("base64");
    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "https://api.ebay.com/oauth/api_scope",
      }),
    });

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      return res.status(500).json({ error: "Token error", details: txt });
    }
    const { access_token } = await tokenRes.json();

    const url = new URL(`${apiBase}/buy/browse/v1/item_summary/search`);
    url.searchParams.set("q", q);
    url.searchParams.set("limit", String(limit));

    const browseRes = await fetch(url, { headers: { Authorization: `Bearer ${access_token}` } });
    if (!browseRes.ok) {
      const txt = await browseRes.text();
      return res.status(500).json({ error: "Browse error", details: txt });
    }

    const data = await browseRes.json();
    const items = (data.itemSummaries || []).map((it) => ({
      id: it.itemId,
      title: it.title,
      image: it.image?.imageUrl || it.thumbnailImages?.[0]?.imageUrl || "",
      price: it.price?.value ? Number(it.price.value) : null,
      currency: it.price?.currency || "USD",
      link: it.itemWebUrl,
      store: "eBay",
      qty: typeof it.estimatedAvailableQuantity === "number" ? it.estimatedAvailableQuantity : null,
    }));

    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
}
