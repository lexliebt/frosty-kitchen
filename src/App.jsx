import React, { useMemo, useState } from "react";
import { useI18n } from "./i18n.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const CATALOG = [
    { id: "k1", name: "Keto Lachs & Brokkoli", description: "Lachsfilet, Brokkoli, Zitronenbutter – low carb, high fat.", price: 8.9, category: "keto", weightGrams: 350, keto: true, servings: 1, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop", tags: ["glutenfrei", "low-carb"] },
    { id: "k2", name: "Keto Beef Chili", description: "Rindfleisch-Chili ohne Bohnen, Zucchini & Paprika.", price: 7.5, category: "keto", weightGrams: 400, keto: true, servings: 1, image: "https://images.unsplash.com/photo-1604908176997-4316222a8aab?q=80&w=1200&auto=format&fit=crop", tags: ["milkfrei", "ohne Zuckerzusatz"] },
    { id: "c1", name: "Office Box: Hähnchen + Reis + Gemüse (10 Portionen)", description: "Großpack für Teams. Vorportioniert in 10×300g. Perfekt für Firmenküche oder Events.", price: 59.0, category: "company", weightGrams: 3000, servings: 10, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop", tags: ["meal-prep", "büro"] },
    { id: "c2", name: "Party Tray: Beef Stroganoff (8 Portionen)", description: "Klassiker, cremig & herzhaft. Schnell erhitzt, servierfertig.", price: 49.0, category: "company", weightGrams: 2800, servings: 8, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop", tags: ["event", "familie"] },
    { id: "s1", name: "Hausgemachte Köttbullar + Kartoffelpüree", description: "Komфортgericht zum Aufwärmen, 1 Portion.", price: 6.9, category: "single", weightGrams: 380, servings: 1, image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop", tags: ["familienrezept"] },
    { id: "s2", name: "Auberginen-Tomaten-Ragout (vegan)", description: "Mediterran, tiefgefroren, 1 Portion.", price: 5.9, category: "single", weightGrams: 360, servings: 1, image: "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=1200&auto=format&fit=crop", tags: ["vegan", "laktosefrei"] },
];

const formatEUR = (v) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(v);
const classNames = (...c) => c.filter(Boolean).join(" ");

export default function App() {
    const { t } = useI18n();
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [cartOpen, setCartOpen] = useState(false);
    const [cart, setCart] = useState([]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return CATALOG.filter((p) => {
            const byCat = activeCategory === "all" || p.category === activeCategory;
            const byQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.tags || []).some((t) => t.toLowerCase().includes(q));
            return byCat && byQuery;
        });
    }, [activeCategory, search]);

    const itemsCount = cart.reduce((s, it) => s + it.qty, 0);
    const subtotal = cart.reduce((s, it) => s + it.product.price * it.qty, 0);

    const addToCart = (product) => {
        setCart((prev) => {
            const idx = prev.findIndex((ci) => ci.product.id === product.id);
            if (idx === -1) return [...prev, { product, qty: 1 }];
            const copy = [...prev];
            copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
            return copy;
        });
    };

    const updateQty = (id, qty) => {
        setCart((prev) => prev.map((ci) => (ci.product.id === id ? { ...ci, qty } : ci)).filter((ci) => ci.qty > 0));
    };

    const removeItem = (id) => setCart((prev) => prev.filter((ci) => ci.product.id !== id));
    const checkout = () => alert("Demo-Checkout. Stripe/PayPal подключим позже.");

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            {/* HEADER */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100">🥶</span>
                        <div className="leading-tight">
                            <div className="font-bold text-lg">{t("brand_name")}</div>
                            <div className="text-xs text-neutral-500">{t("tagline")}</div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-6">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("search_placeholder")}
                            className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <button onClick={() => setCartOpen(true)} className="relative rounded-xl border border-neutral-300 px-3 py-2 hover:bg-neutral-50" aria-label="open cart">
                            🛒
                            {itemsCount > 0 && <span className="absolute -top-2 -right-2 text-xs bg-emerald-600 text-white rounded-full px-2 py-0.5">{itemsCount}</span>}
                        </button>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 pb-3">
                    <div className="flex gap-2">
                        {[
                            { key: "all", label: t("tabs_all") },
                            { key: "keto", label: t("tabs_keto") },
                            { key: "company", label: t("tabs_company") },
                            { key: "single", label: t("tabs_single") },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveCategory(tab.key)}
                                className={classNames(
                                    "px-3 py-1.5 rounded-xl border",
                                    activeCategory === tab.key
                                        ? "bg-emerald-600 text-white border-emerald-600"
                                        : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="md:hidden mt-3">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("search_placeholder")}
                            className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="bg-gradient-to-br from-emerald-50 to-white border-b border-neutral-200">
                <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{t("hero_title")}</h1>
                        <p className="mt-3 text-neutral-700">{t("hero_sub")}</p>
                        <ul className="mt-4 text-sm text-neutral-600 list-disc list-inside space-y-1">
                            <li>Preis inkl. MwSt. • Keine versteckten Gebühren</li>
                            <li>Schockgefростет für frischen Geschmack</li>
                            <li>Wiederverwertbare Verpackung</li>
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm ring-1 ring-neutral-200">
                            <img src="https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1600&auto=format&fit=crop" alt="Frozen meals assortment" className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-white shadow rounded-2xl px-4 py-2 text-sm">{t("hero_badge")}</div>
                    </div>
                </div>
            </section>

            {/* MAIN */}
            <main className="mx-auto max-w-7xl px-4 py-8">
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🍽️</div>
                        <p className="text-neutral-600">{t("not_found")}</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((p) => (
                            <article key={p.id} className="group rounded-3xl overflow-hidden bg-white border border-neutral-200 hover:shadow-md transition-shadow">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-semibold text-lg leading-snug">{p.name}</h3>
                                        <div className="whitespace-nowrap font-bold">{formatEUR(p.price)}</div>
                                    </div>
                                    <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{p.description}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {p.keto && <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Keto</span>}
                                        {(p.tags || []).map((t) => (
                                            <span key={t} className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">{t}</span>
                                        ))}
                                        {p.weightGrams && <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">{p.weightGrams} g</span>}
                                        <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">{p.servings} Portion{p.servings > 1 ? "en" : ""}</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <button onClick={() => addToCart(p)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700">
                                            <span>{t("add_to_cart")}</span>
                                        </button>
                                        <button onClick={() => { addToCart(p); setCartOpen(true); }} className="text-sm text-emerald-700 hover:underline">{t("quick_view")}</button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* FOOTER */}
            <footer className="border-t border-neutral-200">
                <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
                    <div>
                        <div className="font-semibold mb-2">{t("brand_name")}</div>
                        <p className="text-neutral-600">{t("brand_tagline2")}</p>
                    </div>
                    <div>
                        <div className="font-semibold mb-2">{t("categories_title")}</div>
                        <ul className="space-y-1 text-neutral-600">
                            <li><button onClick={() => setActiveCategory("keto")} className="hover:underline">{t("tabs_keto")}</button></li>
                            <li><button onClick={() => setActiveCategory("company")} className="hover:underline">{t("tabs_company")}</button></li>
                            <li><button onClick={() => setActiveCategory("single")} className="hover:underline">{t("tabs_single")}</button></li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold mb-2">Rechtliches</div>
                        <ul className="space-y-1 text-neutral-600">
                            <li>{t("legal_imprint")}</li>
                            <li>{t("legal_terms")}</li>
                            <li>{t("legal_privacy")}</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold mb-2">{t("contact_title")}</div>
                        <p className="text-neutral-600">Berlin, Deutschland</p>
                        <p className="text-neutral-600">📞 +49 ••• •• ••</p>
                        <p className="text-neutral-600">✉️ hello@frosty.kitchen</p>
                    </div>
                </div>
            </footer>

            {/* CART */}
            {cartOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setCartOpen(false)} aria-label="Overlay" />
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                            <div className="font-semibold text-lg">{t("cart_title")}</div>
                            <button onClick={() => setCartOpen(false)} className="rounded-lg border px-3 py-1 hover:bg-neutral-50" aria-label="close cart">✕</button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {cart.length === 0 ? (
                                <p className="text-neutral-600">{t("cart_empty")}</p>
                            ) : (
                                <ul className="space-y-4">
                                    {cart.map((ci) => (
                                        <li key={ci.product.id} className="flex gap-3">
                                            <img src={ci.product.image} alt={ci.product.name} className="h-16 w-16 rounded-xl object-cover border" />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="font-medium">{ci.product.name}</div>
                                                        <div className="text-sm text-neutral-600">{formatEUR(ci.product.price)}</div>
                                                    </div>
                                                    <button onClick={() => removeItem(ci.product.id)} className="text-sm text-neutral-500 hover:text-neutral-800">Entfernen</button>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <label className="text-sm text-neutral-600">{t("quantity")}</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={ci.qty}
                                                        onChange={(e) => updateQty(ci.product.id, Math.max(1, Number(e.target.value)))}
                                                        className="w-20 rounded-lg border border-neutral-300 px-2 py-1"
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="border-t border-neutral-200 p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-700">{t("subtotal")}</span>
                                <span className="font-semibold">{formatEUR(subtotal)}</span>
                            </div>
                            <p className="text-xs text-neutral-500">Preise inkl. gesetzlicher MwSt. Versandkosten werden im Checkout berechnet.</p>
                            <button onClick={checkout} className="w-full mt-2 rounded-xl bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 font-medium">{t("checkout")}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* COOKIES */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-2xl w-[calc(100%-2rem)] bg-white border border-neutral-200 shadow-lg rounded-2xl p-4 flex items-start gap-3">
                <div className="text-2xl">🍪</div>
                <div className="text-sm text-neutral-700">{t("cookie_text")}</div>
                <div className="ml-auto flex gap-2">
                    <button className="rounded-xl border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50">{t("cookie_only")}</button>
                    <button className="rounded-xl bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700">{t("cookie_all")}</button>
                </div>
            </div>
        </div>
    );
}
