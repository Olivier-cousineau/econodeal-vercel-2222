import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Tag, Bell, Mail, Globe2, CheckCircle2, Package, ShieldCheck } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const FALLBACK_IMG = "https://placehold.co/800x600?text=EconoDeal";

/* ---------------- Démo data (avec quantité) ------------------ */
const DEALS = [
  { id: "eb-001", title_fr: "Casque Bluetooth ANC", title_en: "Bluetooth ANC Headphones", img: "https://placehold.co/400x300", price: "79.99 CAD", oldPrice: "189.99 CAD", store: "Walmart" },
  { id: "eb-002", title_fr: "Montre intelligente fitness", title_en: "Smart Fitness Watch", img: "https://placehold.co/400x300", price: "49.00 CAD", oldPrice: "129.00 CAD", store: "BestBuy" },
  { id: "eb-003", title_fr: "Aspirateur sans fil 2-en-1", title_en: "2-in-1 Cordless Vacuum", img: "https://placehold.co/400x300", price: "98.00 CAD", oldPrice: "179.00 CAD", store: "Walmart" },
];

/* ---------------- App Component ------------------ */
export default function App() {
  // États pour Best Buy
  const [bbDeals, setBbDeals] = useState([]);
  const [loadingBB, setLoadingBB] = useState(true);
  const [errorBB, setErrorBB] = useState(null);

  // Récupération des deals Best Buy
  useEffect(() => {
    async function fetchBestBuy() {
      try {
        setLoadingBB(true);
        const res = await fetch("/api/deals?q=tv&page=1&pageSize=5");
        if (!res.ok) throw new Error("Erreur API BestBuy");
        const data = await res.json();
        setBbDeals(data.products || []);
      } catch (err) {
        setErrorBB(err.message);
      } finally {
        setLoadingBB(false);
      }
    }
    fetchBestBuy();
  }, []);

  const buildSalesFor = (dealId) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={[]} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="m" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="units" name="Ventes" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      {/* Section Démo existante */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Deals Démo</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {DEALS.map((deal) => (
            <div key={deal.id} className="rounded-xl shadow p-4 bg-white">
              <img src={deal.img} alt={deal.title_fr} className="w-full h-40 object-cover rounded-md" />
              <h3 className="mt-2 font-semibold">{deal.title_fr}</h3>
              <p className="text-sm text-gray-500">{deal.store}</p>
              <p className="text-green-600 font-bold">{deal.price}</p>
              <p className="line-through text-gray-400">{deal.oldPrice}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Best Buy ================= */}
      <section id="bestbuy" className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">🔥 Liquidations Best Buy</h2>
        {loadingBB && <p>Chargement des liquidations...</p>}
        {errorBB && <p className="text-red-500">Erreur : {errorBB}</p>}
        <div className="grid md:grid-cols-3 gap-6">
          {bbDeals.map((p) => (
            <div key={p.sku} className="rounded-xl shadow p-4 bg-white">
              <img
                src={p.image || FALLBACK_IMG}
                alt={p.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p className="text-green-600 font-bold">${p.salePrice}</p>
              <p className="line-through text-gray-400">${p.regularPrice}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm"
              >
                Voir sur Best Buy
              </a>
            </div>
          ))}
        </div>
      </section>
      {/* =============== /Best Buy ================== */}

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500">
          © 2025 EconoDeal – Tous droits réservés
        </div>
      </footer>
    </div>
  );
}
