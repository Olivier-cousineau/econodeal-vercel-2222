import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Tag, Bell, Mail, Globe2, CheckCircle2, Package, ShieldCheck, LineChart as LineChartIcon, Wallet } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend,
} from "recharts";

const FALLBACK_IMG = "https://placehold.co/800x600?text=EconoDeal";

/* -------------------- Démo data (avec quantité) -------------------- */
const DEALS = [
  { id: "eb-001", title_fr: "Casque Bluetooth ANC", title_en: "Bluetooth ANC Headphones", img: "https://placehold.co/1200x800/28a745/FFF?text=Deal+1", price: 79.99, oldPrice: 189.99, store: "eBay", link: "https://www.ebay.ca/sch/i.html?_nkw=bluetooth+headphones+anc&_sop=10", badge: "-58%", qty: 23 },
  { id: "eb-002", title_fr: "Montre intelligente fitness", title_en: "Smart Fitness Watch", img: "https://placehold.co/1200x800/17a2b8/FFF?text=Deal+2", price: 49.0, oldPrice: 129.0, store: "eBay", link: "https://www.ebay.ca/sch/i.html?_nkw=smartwatch+fitness+deal&_sop=10", badge: "-62%", qty: 11 },
  { id: "wm-001", title_fr: "Aspirateur sans fil 2-en-1", title_en: "Cordless Vacuum 2-in-1", img: "https://placehold.co/1200x800/009688/FFF?text=Walmart+1", price: 98.0, oldPrice: 179.0, store: "Walmart", link: "https://www.walmart.ca/search?q=cordless+vacuum+clearance", badge: "-45%", qty: 8 },
  { id: "wm-002", title_fr: "Air Fryer 5L (acier)", title_en: "Air Fryer 5L (Steel)", img: "https://placehold.co/1200x800/26c6da/000?text=Walmart+2", price: 59.0, oldPrice: 119.0, store: "Walmart", link: "https://www.walmart.ca/search?q=air+fryer+clearance", badge: "-50%", qty: 17 },
  { id: "hd-001", title_fr: "Perceuse 18V + 2 batteries", title_en: "18V Drill + 2 Batteries", img: "https://placehold.co/1200x800/ff6f00/FFF?text=HomeDepot+1", price: 129.0, oldPrice: 229.0, store: "Home Depot", link: "https://www.homedepot.ca/search?q=drill+clearance", badge: "-44%", qty: 5 },
  { id: "ct-001", title_fr: "Compresseur d’air 6 gal.", title_en: "6 Gal. Air Compressor", img: "https://placehold.co/1200x800/c62828/FFF?text=CanadianTire+1", price: 129.0, oldPrice: 229.0, store: "Canadian Tire", link: "https://www.canadiantire.ca/en/search.html?searchBy=keyword&q=clearance%20air%20compressor", badge: "-44%", qty: 14 },
  { id: "bb-001", title_fr: "Écran 32\" 4K UHD", title_en: "32\" 4K UHD Monitor", img: "https://placehold.co/1200x800/283593/FFF?text=BestBuy+1", price: 279.0, oldPrice: 449.0, store: "Best Buy", link: "https://www.bestbuy.ca/en-ca/search?search=clearance%204k%20monitor", badge: "-38%", qty: 9 },
];

const STORE_OPTIONS = [
  { value: "all", label_fr: "Tous les magasins", label_en: "All stores" },
  { value: "walmart", label_fr: "Walmart", label_en: "Walmart" },
  { value: "canadian tire", label_fr: "Canadian Tire", label_en: "Canadian Tire" },
  { value: "home depot", label_fr: "Home Depot", label_en: "Home Depot" },
  { value: "best buy", label_fr: "Best Buy", label_en: "Best Buy" },
  { value: "ebay", label_fr: "eBay", label_en: "eBay" },
];

/* -------------------- Démo Keepa (sections publiques) -------------------- */
const PRICE_HISTORY = [
  { d: "J-90", price: 129 }, { d: "J-80", price: 119 }, { d: "J-70", price: 99 },
  { d: "J-60", price: 109 }, { d: "J-50", price: 95 }, { d: "J-40", price: 89 },
  { d: "J-30", price: 99 }, { d: "J-20", price: 89 }, { d: "J-10", price: 79 }, { d: "J-0", price: 84 },
];
const AMAZON_SALES = [
  { m: "Jan", units: 220 }, { m: "Fév", units: 280 }, { m: "Mar", units: 260 },
  { m: "Avr", units: 300 }, { m: "Mai", units: 340 }, { m: "Juin", units: 310 },
];

/* --------- Contenu & libellés --------- */
const LANG = {
  fr: {
    slogan: "Le meilleur outil pour dénicher, revendre et économiser.",
    ctaSecondary: "Voir des spéciaux (démo)",
    heroTitle: "EconoDeal",
    heroSub: "Liquidations en temps réel • Par magasin • Par SKU",
    sectionDeals: "Spéciaux (démo)",
    storeFilterLabel: "Magasins",
    badgeDemo: "Démo",
    salesLegend: "Ventes par mois (est.)",
    qty: "Qté",
    close: "Fermer",
    seeOnEbay: "Voir sur eBay",
    /* Nouveaux libellés — À propos */
    aboutTitle: "À propos d’EconoDeal",
    aboutP1: "EconoDeal centralise les liquidations des grands détaillants (Walmart, Best Buy, Canadian Tire, Home Depot…) et des marketplaces comme eBay.",
    aboutP2: "Objectif : vous faire gagner du temps et augmenter vos marges en trouvant rapidement les meilleurs rabais, avec visibilité par magasin, SKU et disponibilité.",
    aboutBul1: "• Agrégation multi-magasins en temps réel",
    aboutBul2: "• Filtres par magasin, catégorie et prix",
    aboutBul3: "• Alerte courriel (SKU/produit) et suivi d’historique",
    aboutBul4: "• Conversion CAD↔USD intégrée",
    /* Nouveaux libellés — Investisseurs */
    investorsTitle: "Espace investisseurs",
    investorsP1: "Phase 1 : démonstrateur eBay + vitrines retailers (Canada). Phase 2 : intégrations élargies (USA), alertes avancées et plans B2B.",
    investorsP2: "Modèle de revenus : abonnement mensuel (freemium → pro), partenariats marchands et offres de datas.",
    investorsKPIs: "Indicateurs clés (prévisionnels)",
    investorsK1: "• ARPU cible (12 mois) : 12–20 $/mois",
    investorsK2: "• Conversion free→paid : 4–8 %",
    investorsK3: "• Rétention 3 mois : > 55 %",
    investorsCTA: "Rejoindre la liste d’attente",
    footer: "© " + new Date().getFullYear() + " EconoDeal. Tous droits réservés.",
    langSwitch: "EN",
  },
  en: {
    slogan: "The best tool to find, resell and save.",
    ctaSecondary: "See specials (demo)",
    heroTitle: "EconoDeal",
    heroSub: "Real-time clearances • By store • By SKU",
    sectionDeals: "Specials (demo)",
    storeFilterLabel: "Stores",
    badgeDemo: "Demo",
    salesLegend: "Monthly sales (est.)",
    qty: "Qty",
    close: "Close",
    seeOnEbay: "View on eBay",
    /* About */
    aboutTitle: "About EconoDeal",
    aboutP1: "EconoDeal centralizes clearances from major retailers (Walmart, Best Buy, Canadian Tire, Home Depot…) and marketplaces like eBay.",
    aboutP2: "Goal: save you time and boost margins by surfacing the best deals fast, with visibility by store, SKU and availability.",
    aboutBul1: "• Multi-store aggregation in real time",
    aboutBul2: "• Filters by store, category and price",
    aboutBul3: "• Email alerts (SKU/product) and history tracking",
    aboutBul4: "• Built-in CAD↔USD conversion",
    /* Investors */
    investorsTitle: "Investor section",
    investorsP1: "Phase 1: eBay demo + retailer showcases (Canada). Phase 2: broader integrations (US), advanced alerts and B2B plans.",
    investorsP2: "Revenue model: monthly subscription (freemium → pro), merchant partnerships and data offerings.",
    investorsKPIs: "Key metrics (forecast)",
    investorsK1: "• Target ARPU (12 months): $12–$20/mo",
    investorsK2: "• Free→paid conversion: 4–8%",
    investorsK3: "• 3-month retention: > 55%",
    investorsCTA: "Join the waitlist",
    footer: "© " + new Date().getFullYear() + " EconoDeal. All rights reserved.",
    langSwitch: "FR",
  },
};

export default function App() {
  const [lang, setLang] = useState("fr");
  const T = useMemo(() => (lang === "fr" ? LANG.fr : LANG.en), [lang]);

  const [storeValue, setStoreValue] = useState("all");
  const [currency, setCurrency] = useState("CAD");
  const [usdCad, setUsdCad] = useState(null);

  // eBay live
  const [ebayItems, setEbayItems] = useState([]);
  const [loadingEbay, setLoadingEbay] = useState(false);
  const [errorEbay, setErrorEbay] = useState("");

  // MODALE
  const [selected, setSelected] = useState(null); // { deal, sales, avg }

  /* ---- Taux USD→CAD ---- */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("https://api.frankfurter.app/latest?from=USD&to=CAD");
        const j = await r.json();
        if (j?.rates?.CAD) setUsdCad(j.rates.CAD);
      } catch {}
    })();
  }, []);

  const convert = (n, from = "CAD") => {
    if (n == null) return null;
    if (!usdCad) return n;
    if (from === currency) return n;
    if (from === "USD" && currency === "CAD") return n * usdCad;
    if (from === "CAD" && currency === "USD") return n / usdCad;
    return n;
  };
  const fmt = (n) =>
    n == null ? "N/A" : n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---- eBay live quand magasin=eBay ---- */
  useEffect(() => {
    const go = async () => {
      if (storeValue !== "ebay") return;
      try {
        setLoadingEbay(true);
        setErrorEbay("");
        const r = await fetch(`/api/ebay?q=electronics&limit=12&env=PROD`);
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "API error");
        setEbayItems(j.items || []);
      } catch (e) {
        setErrorEbay(e.message);
      } finally {
        setLoadingEbay(false);
      }
    };
    go();
  }, [storeValue]);

  /* ---- Génération ventes “type Keepa” pour la modale ---- */
  const buildSalesFor = (dealId) => {
    const base = 180 + (dealId?.toString().charCodeAt(dealId.toString().length - 1) % 80 || 0);
    const months = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
    return months.map((m, i) => ({ m, units: Math.round(base + Math.sin(i/2)*40 + (i%3===0?20:0)) }));
  };
  const averageSales = (arr) => Math.round(arr.reduce((s, x) => s + x.units, 0) / arr.length);

  const openDealModal = (deal) => {
    const sales = buildSalesFor(deal.id || deal.title || "x");
    setSelected({ deal, sales, avg: averageSales(sales) });
  };
  const closeModal = () => setSelected(null);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-sm">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-xl font-bold">EconoDeal</p>
              <p className="text-xs text-slate-500">{T.slogan}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {usdCad && (
              <span className="hidden md:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-100 border">
                USD→CAD: 1 → {fmt(usdCad)}
              </span>
            )}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs px-2 py-1 rounded-full border bg-white"
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
            </select>
            <button onClick={() => setLang(l => l === "fr" ? "en" : "fr")} className="text-sm px-3 py-1 rounded-full border hover:bg-slate-50">
              {T.langSwitch}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {T.heroTitle}
            </motion.h1>
            <p className="mt-3 text-lg text-slate-600">{T.heroSub}</p>
            <div className="mt-5">
              <a href="#deals" className="px-5 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                {T.ctaSecondary}
              </a>
            </div>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> SKU & disponibilité par magasin</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Alertes email personnalisées</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Canada → USA</li>
            </ul>
          </div>

          {/* mini vitrine */}
          <div className="rounded-3xl bg-white shadow p-4 border">
            <div className="grid grid-cols-3 gap-3">
              {DEALS.slice(0, 6).map((d) => (
                <button key={d.id} onClick={() => openDealModal(d)} className="rounded-xl overflow-hidden border text-left">
                  <img src={d.img} alt="deal" className="h-28 w-full object-cover" loading="lazy" onError={(e)=>{e.currentTarget.src = FALLBACK_IMG}}/>
                  <div className="p-2 text-xs">
                    <p className="font-medium line-clamp-1">{lang === "fr" ? d.title_fr : d.title_en}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-semibold">{fmt(convert(d.price,'CAD'))} {currency}</span>
                      <span className="text-slate-400 line-through">{fmt(convert(d.oldPrice,'CAD'))} {currency}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deals */}
      <section id="deals" className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">{T.sectionDeals}</h2>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm text-slate-600" htmlFor="storeSel">{T.storeFilterLabel}</label>
          <select id="storeSel" value={storeValue} onChange={(e)=> setStoreValue(e.target.value)} className="text-sm px-3 py-2 rounded-lg border bg-white hover:bg-slate-50">
            {STORE_OPTIONS.map((o)=> (<option key={o.value} value={o.value}>{lang==='fr'? o.label_fr : o.label_en}</option>))}
          </select>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border">{T.badgeDemo}</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeValue === "ebay" ? (
            loadingEbay ? (
              <div className="col-span-full text-center text-slate-600">Chargement eBay…</div>
            ) : errorEbay ? (
              <div className="col-span-full text-center text-red-600">Erreur eBay: {errorEbay}</div>
            ) : (ebayItems.length ? (
              ebayItems.map((it) => (
                <button
                  key={it.id}
                  onClick={() =>
                    openDealModal({
                      id: it.id, title_fr: it.title, title_en: it.title,
                      img: it.image || FALLBACK_IMG, price: it.price ?? 0, oldPrice: 0,
                      store: "eBay", link: it.link, qty: it.qty
                    })
                  }
                  className="group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition text-left"
                >
                  <div className="relative">
                    <img src={it.image || FALLBACK_IMG} alt={it.title} className="h-48 w-full object-cover" loading="lazy" onError={(e)=>{e.currentTarget.src = FALLBACK_IMG}}/>
                    {typeof it.qty === "number" && (
                      <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/70 text-white flex items-center gap-1">
                        <Package className="h-3 w-3" /> {T.qty}: {it.qty}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold line-clamp-2 group-hover:underline">{it.title}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      {it.price ? (
                        <span className="text-lg font-bold">{fmt(convert(it.price, it.currency || "USD"))} {currency}</span>
                      ) : (
                        <span className="text-slate-500 text-sm">Prix N/A</span>
                      )}
                    </div>
                    <span className="mt-2 inline-block text-xs text-slate-500">eBay</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-600">Aucun résultat eBay.</div>
            ))
          ) : (
            DEALS.filter(d => storeValue==='all' || d.store.toLowerCase()===storeValue).map((d) => (
              <button key={d.id} onClick={() => openDealModal(d)} className="group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition text-left">
                <div className="relative">
                  <img src={d.img} alt={d.title_fr} className="h-48 w-full object-cover" loading="lazy" onError={(e)=>{e.currentTarget.src = FALLBACK_IMG}}/>
                  <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/70 text-white">{d.badge}</span>
                  <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-white/90 border flex items-center gap-1">
                    <Package className="h-3 w-3" /> {T.qty}: {d.qty ?? "—"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-semibold line-clamp-2 group-hover:underline">{lang === "fr" ? d.title_fr : d.title_en}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold">{fmt(convert(d.price, "CAD"))} {currency}</span>
                    <span className="text-slate-400 line-through">{fmt(convert(d.oldPrice, "CAD"))} {currency}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">{d.store}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* MODALE : ventes + moyenne + lien eBay */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-3">
                <img src={selected.deal.img || FALLBACK_IMG} onError={(e)=>{e.currentTarget.src = FALLBACK_IMG}} alt="deal" className="h-14 w-20 object-cover rounded-md" />
                <div>
                  <h3 className="font-semibold leading-tight">{lang==="fr" ? selected.deal.title_fr : selected.deal.title_en}</h3>
                  <p className="text-sm text-slate-500">{selected.deal.store}</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-600 hover:text-slate-800 px-3 py-1 rounded-lg border">{T.close}</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-5">
              <div>
                <h4 className="font-medium mb-2">Amazon (démo) — {T.salesLegend}</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selected.sales} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="m" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="units" name={T.salesLegend} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">{lang==="fr" ? "Moyenne / mois" : "Average per month"}</h4>
                <div className="rounded-xl border p-5 bg-emerald-50">
                  <p className="text-5xl font-extrabold text-emerald-700">{selected.avg}</p>
                  <p className="text-slate-600 mt-1">{lang==="fr" ? "unités / mois (estimation)" : "units / month (estimate)"}</p>
                </div>
                <a href={selected.deal.link} target="_blank" rel="noreferrer" className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                  {T.seeOnEbay}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* À propos d’EconoDeal */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">{T.aboutTitle}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border">{T.badgeDemo}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <p className="text-slate-700">{T.aboutP1}</p>
            <p className="mt-3 text-slate-700">{T.aboutP2}</p>
            <ul className="mt-4 space-y-2 text-slate-700">
              <li>{T.aboutBul1}</li>
              <li>{T.aboutBul2}</li>
              <li>{T.aboutBul3}</li>
              <li>{T.aboutBul4}</li>
            </ul>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-5 bg-white shadow-sm flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-medium">Qualité des données</p>
                <p className="text-sm text-slate-600">Contrôles anti-duplication, fallback images, quantités quand disponibles.</p>
              </div>
            </div>
            <div className="rounded-2xl border p-5 bg-white shadow-sm flex items-start gap-3">
              <LineChartIcon className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-medium">Insights rapides</p>
                <p className="text-sm text-slate-600">Graphiques de ventes (démo) et conversions CAD↔USD intégrées.</p>
              </div>
            </div>
            <div className="rounded-2xl border p-5 bg-white shadow-sm flex items-start gap-3">
              <Bell className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-medium">Alertes</p>
                <p className="text-sm text-slate-600">Avertis-toi par courriel sur un SKU, un magasin ou un niveau de prix.</p>
              </div>
            </div>
            <div className="rounded-2xl border p-5 bg-white shadow-sm flex items-start gap-3">
              <Wallet className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-medium">Pensé pour la revente</p>
                <p className="text-sm text-slate-600">Repère vite les marges & occupe-toi de l’achat — on s’occupe du tri.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espace investisseurs */}
      <section id="investors" className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{T.investorsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <p className="text-slate-700">{T.investorsP1}</p>
            <p className="mt-3 text-slate-700">{T.investorsP2}</p>
          </div>
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <p className="font-medium mb-2">{T.investorsKPIs}</p>
            <ul className="space-y-2 text-slate-700">
              <li>{T.investorsK1}</li>
              <li>{T.investorsK2}</li>
              <li>{T.investorsK3}</li>
            </ul>
            <a href="#deals" className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">{T.investorsCTA}</a>
          </div>
        </div>
      </section>

      {/* Keepa public (inchangé) */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <h3 className="text-xl font-semibold mb-2">Vue type Keepa</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h4 className="font-medium mb-2">Historique de prix (90 jours)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PRICE_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="d" /><YAxis /><Tooltip />
                  <Line type="monotone" dataKey="price" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h4 className="font-medium mb-2">Ventes Amazon / mois (est.)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AMAZON_SALES}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="units" name={T.salesLegend} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
{/* ================= Best Buy ================= */}
<section id="bestbuy" className="mx-auto max-w-6xl px-4 py-10">
  <h2 className="text-2xl font-bold mb-4">Liquidations Best Buy</h2>

  <div className="grid gap-2 mb-3 grid-cols-1 sm:grid-cols-[1fr_140px_180px_auto]">
    <input
      className="border rounded px-3 py-2"
      placeholder="Recherche (tv, laptop, samsung)…"
      value={bbQuery}
      onChange={(e) => setBbQuery(e.target.value)}
    />
    <select
      className="border rounded px-3 py-2"
      value={bbMinPct}
      onChange={(e) => setBbMinPct(parseInt(e.target.value, 10))}
    >
      <option value={40}>≥ 40%</option>
      <option value={50}>≥ 50%</option>
      <option value={60}>≥ 60%</option>
      <option value={70}>≥ 70%</option>
    </select>
    <select
      className="border rounded px-3 py-2"
      value={bbSort}
      onChange={(e) => setBbSort(e.target.value)}
    >
      <option value="discount">% rabais (desc)</option>
      <option value="priceAsc">Prix (croissant)</option>
      <option value="priceDesc">Prix (décroissant)</option>
    </select>
    <button className="bg-indigo-600 text-white rounded px-4 py-2" onClick={loadBestBuyDeals}>
      Charger
    </button>
  </div>

  <div className="text-slate-600 mb-4">{bbStatus}</div>

  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {bbLoading
      ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-56 rounded-lg bg-slate-200 animate-pulse" />
        ))
      : bbItems.map((p) => (
          <div key={p.sku} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
            <div className="aspect-[16/10] grid place-items-center bg-slate-50">
              {p.image && (
                <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
              )}
            </div>
            <div className="p-3">
              <div className="font-semibold mb-2 line-clamp-2">{p.name}</div>
              <div className="flex items-baseline gap-2">
                <span className="line-through text-slate-400">{fmt(p.regularPrice)}</span>
                <span className="font-bold text-emerald-600">{fmt(p.salePrice)}</span>
                <span className="ml-auto text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  -{pctOff(p.regularPrice, p.salePrice)}%
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">SKU: {p.sku}</div>
              <div className="flex gap-2 mt-3">
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center rounded-lg border border-indigo-200 bg-indigo-600 text-white px-3 py-2"
                  >
                    Voir chez Best Buy
                  </a>
                )}
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(p.name || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-lg border px-3 py-2"
                >
                  Comparer
                </a>
              </div>
            </div>
          </div>
        ))}
  </div>
</section>
{/* =============== /Best Buy ================== */}

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500">{T.footer}</div>
      </footer>
    </div>
  );
}
