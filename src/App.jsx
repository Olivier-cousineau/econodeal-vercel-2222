import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Tag,
  Bell,
  Mail,
  Globe2,
  CheckCircle2,
  Package,
  ShieldCheck,
} from "lucide-react";
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

/* ----------------------------- Démo data ----------------------------- */
const DEALS = [
  {
    id: "eb-001",
    title_fr: "Casque Bluetooth ANC",
    title_en: "Bluetooth ANC Headphones",
    img: "https://placehold.co/400x300?text=Casque",
    store: "Walmart",
    price: 79.99,
    regularPrice: 189.99,
    currency: "CAD",
  },
  {
    id: "eb-002",
    title_fr: "Montre intelligente fitness",
    title_en: "Smart Fitness Watch",
    img: "https://placehold.co/400x300?text=Montre",
    store: "BestBuy",
    price: 49.0,
    regularPrice: 129.0,
    currency: "CAD",
  },
  {
    id: "eb-003",
    title_fr: "Aspirateur sans fil 2-en-1",
    title_en: "Cordless 2-in-1 Vacuum",
    img: "https://placehold.co/400x300?text=Aspirateur",
    store: "Walmart",
    price: 98.0,
    regularPrice: 179.0,
    currency: "CAD",
  },
  {
    id: "eb-004",
    title_fr: "Perceuse 18V + 2 batteries",
    title_en: "18V Drill + 2 Batteries",
    img: "https://placehold.co/400x300?text=Perceuse",
    store: "HomeDepot",
    price: 129.0,
    regularPrice: 229.0,
    currency: "CAD",
  },
  {
    id: "eb-005",
    title_fr: "Compresseur d’air 6 gal.",
    title_en: "6 gal. Air Compressor",
    img: "https://placehold.co/400x300?text=Compresseur",
    store: "CanadianTire",
    price: 129.0,
    regularPrice: 229.0,
    currency: "CAD",
  },
];

/* ----------------------------- Composant App ----------------------------- */
export default function App() {
  const [lang, setLang] = useState("fr");
  const [currency, setCurrency] = useState("CAD");

  const toggleLang = () => setLang(lang === "fr" ? "en" : "fr");

  const formatPrice = (value) =>
    new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA", {
      style: "currency",
      currency,
    }).format(value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-green-600 text-white">
        <h1 className="text-2xl font-bold">EconoDeal</h1>
        <div className="flex gap-3">
          <button
            onClick={toggleLang}
            className="px-3 py-1 bg-white text-green-600 rounded shadow"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </div>
      </header>

      {/* Deals Démo */}
      <section className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          {lang === "fr" ? "Deals Démo" : "Demo Deals"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {DEALS.map((deal) => (
            <motion.div
              key={deal.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={deal.img || FALLBACK_IMG}
                alt={deal.title_fr}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">
                  {lang === "fr" ? deal.title_fr : deal.title_en}
                </h3>
                <p className="text-gray-500 text-sm">{deal.store}</p>
                <p className="text-green-600 font-bold">
                  {formatPrice(deal.price)}
                </p>
                <p className="text-gray-400 line-through">
                  {formatPrice(deal.regularPrice)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500 text-center">
          © 2025 EconoDeal – {lang === "fr" ? "Le meilleur outil pour économiser" : "The best tool to save"}
        </div>
      </footer>
    </div>
  );
}
