import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const DICT = {
  de: {
    brand_name: "FROSTY KITCHEN",
    tagline: "Gefrorene Gerichte • Berlin",
    search_placeholder: "Suchen (z. B. ‚keto‘, ‚vegan‘)",
    tabs_all: "Alle",
    tabs_keto: "Keto",
    tabs_company: "Für Firmen",
    tabs_single: "Für eine Person",
    hero_title: "Gefrorene Mahlzeiten wie hausgemacht.",
    hero_sub: "Lieferung in Berlin. Auftauen → Aufwärmen → fertig. Es gibt Sets Keto, für Firmen und für eine Person.",
    hero_badge: "🚚 Lieferung in Berlin: Heute & Morgen Zeitfenster",
    not_found: "Nichts gefunden. Versuche eine andere Suche.",
    add_to_cart: "In den Warenkorb",
    quick_view: "Sofort ansehen",
    legal_imprint: "Impressum",
    legal_terms: "AGB",
    legal_privacy: "Datenschutz",
    contact_title: "Kontakt",
    cart_title: "Warenkorb",
    cart_empty: "Der Warenkorb ist leer.",
    quantity: "Menge:",
    subtotal: "Zwischensumme",
    checkout: "Zur Kasse",
    cookie_text: "Wir verwenden Cookies zur Verbesserung der Website und für Analysen. Details in Datenschutz.",
    cookie_only: "Nur notwendig",
    cookie_all: "Alle erlauben",
    categories_title: "Kategorien",
    brand_tagline2: "Gefrorene Gerichte, produziert in Berlin.",
  },
  en: {
    brand_name: "FROSTY KITCHEN",
    tagline: "Frozen meals • Berlin",
    search_placeholder: "Search (e.g. ‘keto’, ‘vegan’)",
    tabs_all: "All",
    tabs_keto: "Keto",
    tabs_company: "For companies",
    tabs_single: "For one person",
    hero_title: "Frozen meals, homemade quality.",
    hero_sub: "Delivery in Berlin. Defrost → reheat → done. Sets for Keto, companies and singles.",
    hero_badge: "🚚 Delivery in Berlin: Today & Tomorrow time slots",
    not_found: "Nothing found. Try a different query.",
    add_to_cart: "Add to cart",
    quick_view: "Quick view",
    legal_imprint: "Imprint",
    legal_terms: "Terms",
    legal_privacy: "Privacy",
    contact_title: "Contact",
    cart_title: "Cart",
    cart_empty: "Your cart is empty.",
    quantity: "Qty:",
    subtotal: "Subtotal",
    checkout: "Checkout",
    cookie_text: "We use cookies to improve the site and for analytics. See Privacy for details.",
    cookie_only: "Only necessary",
    cookie_all: "Allow all",
    categories_title: "Categories",
    brand_tagline2: "Frozen meals, made in Berlin.",
  },
  ru: {
    brand_name: "FROSTY KITCHEN",
    tagline: "Замороженные блюда • Берлин",
    search_placeholder: "Поиск (например, «кето», «веган»)",
    tabs_all: "Все",
    tabs_keto: "Кето",
    tabs_company: "Для компаний",
    tabs_single: "Для одного",
    hero_title: "Замороженная еда, как дома приготовленная.",
    hero_sub: "Доставка по Берлину. Разморозить → разогреть → готово. Есть наборы Кето, для компаний и для одного.",
    hero_badge: "🚚 Доставка в Берлине: окна Сегодня и Завтра",
    not_found: "Ничего не найдено. Попробуйте изменить запрос.",
    add_to_cart: "В корзину",
    quick_view: "Посмотреть",
    legal_imprint: "Импрессум",
    legal_terms: "Условия",
    legal_privacy: "Конфиденциальность",
    contact_title: "Контакты",
    cart_title: "Корзина",
    cart_empty: "Корзина пуста.",
    quantity: "Кол-во:",
    subtotal: "Итого",
    checkout: "Оформить",
    cookie_text: "Мы используем cookies для улучшения сайта и аналитики. Подробности в Политике.",
    cookie_only: "Только нужные",
    cookie_all: "Разрешить все",
    categories_title: "Категории",
    brand_tagline2: "Замороженные блюда, произведены в Берлине.",
  },
};

// по умолчанию — DE. сохраняем выбор в localStorage
const I18nContext = createContext({ t: (k) => k, lang: "de", setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("de");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && DICT[saved]) setLang(saved);
  }, []);

  const value = useMemo(() => ({
    lang,
    setLang: (l) => { if (DICT[l]) { localStorage.setItem("lang", l); setLang(l); } },
    t: (key) => (DICT[lang]?.[key] ?? key),
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
