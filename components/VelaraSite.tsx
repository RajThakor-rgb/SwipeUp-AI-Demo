"use client";

import { useRef, useState } from "react";
import styles from "./VelaraSite.module.css";

// Real, on-brand imagery. Grayscale fashion photos read as premium editorial and
// keep the palette cohesive. If an image is slow or unavailable, the component
// renders nothing and the gradient + monogram beneath it shows instead.
function Img({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setOk(false)}
    />
  );
}

const lf = (w: number, h: number, tags: string, lock: number) =>
  `https://loremflickr.com/g/${w}/${h}/${tags}?lock=${lock}`;

const IMG_TAGS = [
  "wool,coat",
  "cashmere,scarf,knit",
  "wool,sweater,knit",
  "trench,coat",
  "leather,handbag",
  "silk,blouse",
];
const productImg = (i: number) => lf(640, 800, IMG_TAGS[i % IMG_TAGS.length], i + 12);
const HERO_IMG = lf(1200, 1000, "fashion,editorial,model", 7);
const SUSTAIN_IMG = lf(900, 1000, "wool,fabric,textile", 9);
const NEWIN_HERO = lf(1280, 880, "fashion,editorial,autumn", 21);
const ABOUT_IMG = lf(1100, 820, "atelier,studio,fashion", 24);

type Product = {
  name: string;
  material: string;
  price: string;
  initials: string;
  tag: string;
  toneA: string;
  toneB: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Mayfair Wool Overcoat",
    material: "Certified British wool",
    price: "£780",
    initials: "MW",
    tag: "British wool",
    toneA: "#efe9dc",
    toneB: "#d8cab2",
  },
  {
    name: "Knightsbridge Cashmere Scarf",
    material: "Recycled cashmere",
    price: "£190",
    initials: "KC",
    tag: "Recycled",
    toneA: "#eee7da",
    toneB: "#cdbfa6",
  },
  {
    name: "The Aran Knit",
    material: "Organic merino",
    price: "£320",
    initials: "AK",
    tag: "Organic",
    toneA: "#e9eadf",
    toneB: "#c9d2bf",
  },
  {
    name: "Belgravia Trench",
    material: "Recycled cotton gabardine",
    price: "£640",
    initials: "BT",
    tag: "Recycled cotton",
    toneA: "#efe8da",
    toneB: "#d3c4a8",
  },
  {
    name: "Mayfair Leather Tote",
    material: "Vegetable-tanned leather",
    price: "£420",
    initials: "ML",
    tag: "Veg-tanned",
    toneA: "#e9ddc9",
    toneB: "#c2a47e",
  },
  {
    name: "Autumn Silk Shirt",
    material: "Peace silk",
    price: "£260",
    initials: "AS",
    tag: "Peace silk",
    toneA: "#f1ebde",
    toneB: "#dccdb1",
  },
];

// The three pieces presented as the season's newest arrivals.
const NEW_IN_INDICES = [0, 3, 5];
const NEW_IN_COPY: Record<number, string> = {
  0: "The overcoat we rebuild every autumn. Double-faced British wool, a clean A-line, and a collar that holds its shape when you turn it up.",
  3: "A modern trench in recycled cotton gabardine. Showerproof, unlined, and cut a touch longer this season for an easier line.",
  5: "Peace silk with a soft, fluid drape. The quiet anchor of the collection, made to be worn open or buttoned to the throat.",
};

type View =
  | "store"
  | "newin"
  | "sustainability"
  | "boutiques"
  | "about"
  | "checkout"
  | "confirmation";

const NAV_LINKS = [
  "New In",
  "The Autumn Collection",
  "Sustainability",
  "Boutiques",
  "About",
];

// Which view each nav tab opens. "The Autumn Collection" lives on the store home.
const NAV_VIEW: Record<string, View> = {
  "New In": "newin",
  "The Autumn Collection": "store",
  Sustainability: "sustainability",
  Boutiques: "boutiques",
  About: "about",
};

// Which nav tab is highlighted for the current view.
const ACTIVE_NAV: Partial<Record<View, string>> = {
  store: "The Autumn Collection",
  newin: "New In",
  sustainability: "Sustainability",
  boutiques: "Boutiques",
  about: "About",
};

// Footer links. Target is a view, or "collection" to land on the store grid.
type FooterTarget = View | "collection";
const FOOTER: { title: string; links: [string, FooterTarget][] }[] = [
  {
    title: "Shop",
    links: [
      ["New In", "newin"],
      ["The Autumn Collection", "collection"],
      ["Knitwear", "collection"],
      ["Outerwear", "collection"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "about"],
      ["Sustainability", "sustainability"],
      ["Boutiques", "boutiques"],
      ["Careers", "about"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Contact", "boutiques"],
      ["Shipping", "sustainability"],
      ["Repairs", "sustainability"],
      ["Returns", "boutiques"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "about"],
      ["Terms", "about"],
      ["Cookies", "about"],
      ["Modern Slavery", "sustainability"],
    ],
  },
];

const PROCESS: { n: string; title: string; img: string; body: string }[] = [
  {
    n: "01",
    title: "Source",
    img: lf(700, 560, "wool,sheep,field", 31),
    body: "We start at the fibre. Certified British wool, recycled cashmere and organic merino, traced back to named farms and mills before a single thread is spun.",
  },
  {
    n: "02",
    title: "Cut",
    img: lf(700, 560, "fabric,pattern,tailor", 32),
    body: "Patterns are nested by hand to take as little cloth as possible. Every offcut is logged, and the larger ones return as scarves, patch pockets and repair stock.",
  },
  {
    n: "03",
    title: "Make",
    img: lf(700, 560, "atelier,sewing,tailor", 33),
    body: "Each piece is sewn to order in small batches by a single maker, in workshops we visit and pay fairly. Nothing is produced on speculation, so nothing is wasted.",
  },
  {
    n: "04",
    title: "Finish",
    img: lf(700, 560, "garment,thread,detail", 34),
    body: "Seams are pressed, buttons are stitched with a spare, and a repair card goes in every box. Orders leave the studio in recycled wrap and travel carbon-neutral.",
  },
];

const MATERIALS: { name: string; img: string; body: string }[] = [
  {
    name: "Certified British wool",
    img: lf(560, 560, "wool,yarn,knit", 41),
    body: "Warm, hard-wearing and fully traceable, from flocks reared to RWS welfare standards.",
  },
  {
    name: "Recycled cashmere",
    img: lf(560, 560, "cashmere,knit,soft", 42),
    body: "Reclaimed and re-spun, with the softness of virgin cashmere and a fraction of the footprint.",
  },
  {
    name: "Organic merino",
    img: lf(560, 560, "merino,wool,knit", 43),
    body: "Fine, breathable and grown without synthetic inputs, certified organic from farm to yarn.",
  },
  {
    name: "Peace silk",
    img: lf(560, 560, "silk,fabric,drape", 44),
    body: "A fluid, lustrous silk reeled without harming the silkworm, dyed in low-impact baths.",
  },
];

const BOUTIQUES: {
  name: string;
  area: string;
  address: string[];
  hours: [string, string][];
  phone: string;
  roads: [string, string];
}[] = [
  {
    name: "Velara Mayfair",
    area: "Mayfair",
    address: ["18 Bruton Street", "Mayfair, London W1J 6QD"],
    hours: [
      ["Monday to Friday", "10:00 to 19:00"],
      ["Saturday", "10:00 to 18:00"],
      ["Sunday", "12:00 to 17:00"],
    ],
    phone: "+44 20 7100 0190",
    roads: ["Bruton Street", "New Bond Street"],
  },
  {
    name: "Velara Knightsbridge",
    area: "Knightsbridge",
    address: ["7 Beauchamp Place", "Knightsbridge, London SW3 1NQ"],
    hours: [
      ["Monday to Friday", "10:00 to 19:00"],
      ["Saturday", "10:00 to 18:00"],
      ["Sunday", "Closed"],
    ],
    phone: "+44 20 7100 0240",
    roads: ["Beauchamp Place", "Brompton Road"],
  },
];

function SearchGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      <circle cx="7.6" cy="7.6" r="5.4" />
      <line x1="11.6" y1="11.6" x2="16" y2="16" strokeLinecap="round" />
    </svg>
  );
}

function CartGlyph() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      <path
        d="M3 4.5h2l1.6 9.2a1.4 1.4 0 0 0 1.4 1.1h6.1a1.4 1.4 0 0 0 1.4-1.1l1.2-6.4H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.4" cy="17.4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.2" cy="17.4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LeafGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path
        d="M13 3C6 3 3 6.5 3 11c0 1 .3 2 .3 2S9 13 12 9c1.3-1.8 1-6 1-6Z"
        strokeLinejoin="round"
      />
      <path d="M4 12c2.5-3.5 5-5 7.5-6.5" strokeLinecap="round" />
    </svg>
  );
}

function SealGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <circle cx="8" cy="7" r="4.4" />
      <path d="M6 7l1.4 1.4L10.2 5.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11.2l-1 3.3 3-1.6 3 1.6-1-3.3" strokeLinejoin="round" />
    </svg>
  );
}

function HandGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M2.5 9.5l3-3 2 2 4-4 2 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 13h11" strokeLinecap="round" />
    </svg>
  );
}

function TruckGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M2 4.5h8v6H2z" strokeLinejoin="round" />
      <path d="M10 6.5h3l2 2.2v1.8h-5z" strokeLinejoin="round" />
      <circle cx="5" cy="12" r="1.3" />
      <circle cx="12.4" cy="12" r="1.3" />
    </svg>
  );
}

const TRUST: { glyph: JSX.Element; label: string }[] = [
  { glyph: <SealGlyph />, label: "Certified materials" },
  { glyph: <HandGlyph />, label: "Small-batch, made to order" },
  { glyph: <TruckGlyph />, label: "Carbon-neutral delivery" },
  { glyph: <LeafGlyph />, label: "Lifetime repairs" },
];

function ProductCard({
  p,
  i,
  onAdd,
}: {
  p: Product;
  i: number;
  onAdd: (name: string) => void;
}) {
  return (
    <article className={styles.card}>
      <div
        className={styles.cardImage}
        style={{
          background: `linear-gradient(150deg, ${p.toneA} 0%, ${p.toneB} 100%)`,
        }}
      >
        <span className={styles.cardMonogram} aria-hidden="true">
          {p.initials}
        </span>
        <Img src={productImg(i)} alt={p.name} className={styles.cardPhoto} />
        <span className={styles.cardTag}>{p.tag}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{p.name}</h3>
        <p className={styles.cardMaterial}>{p.material}</p>
        <div className={styles.cardFoot}>
          <span className={styles.cardPrice}>{p.price}</span>
          <button
            type="button"
            className={styles.btnAdd}
            onClick={() => onAdd(p.name)}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default function VelaraSite() {
  const [view, setView] = useState<View>("store");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollTop = () =>
    rootRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToId = (id: string) =>
    rootRef.current
      ?.querySelector(`#${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  // The in-component router. The wordmark and every tab route through here.
  const go = (next: View) => {
    setView(next);
    setCartOpen(false);
    scrollTop();
  };

  const goCollection = () => {
    setCartOpen(false);
    if (view === "store") {
      scrollToId("collection");
    } else {
      setView("store");
      requestAnimationFrame(() => scrollToId("collection"));
    }
  };

  const goNav = (label: string) => {
    const next = NAV_VIEW[label];
    if (next === "store") goCollection();
    else go(next);
  };

  const goFooter = (target: FooterTarget) => {
    if (target === "collection") goCollection();
    else go(target);
  };

  const filtered = query.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : PRODUCTS;

  const priceOf = (name: string) => {
    const found = PRODUCTS.find((x) => x.name === name);
    return found ? Number(found.price.replace(/[^0-9.]/g, "")) : 0;
  };
  const addToCart = (name: string) => {
    setCart((c) => ({ ...c, [name]: (c[name] ?? 0) + 1 }));
    setCartOpen(true);
  };
  const removeOne = (name: string) =>
    setCart((c) => {
      const next = { ...c };
      const q = (next[name] ?? 0) - 1;
      if (q <= 0) delete next[name];
      else next[name] = q;
      return next;
    });
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce(
    (a, [name, q]) => a + priceOf(name) * q,
    0,
  );
  const shipping = count === 0 || subtotal >= 250 ? 0 : 6;
  const total = subtotal + shipping;

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderNo("VEL-" + Math.floor(100000 + Math.random() * 900000));
    setView("confirmation");
    setCart({});
    scrollTop();
  };

  const activeNav = ACTIVE_NAV[view] ?? "";
  const showSearch = view === "store";
  const showCart = view !== "checkout" && view !== "confirmation";

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.disclaimer}>
        Demo store · not a real website. Built by SwipeUp AI Academy for this case.
      </div>

      {/* Sticky top nav */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <button
            type="button"
            className={styles.wordmark}
            aria-label="Velara home"
            onClick={() => go("store")}
          >
            VELARA
          </button>

          <nav className={styles.navLinks} aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                className={`${styles.navLink} ${
                  activeNav === link ? styles.navLinkActive : ""
                }`}
                onClick={() => goNav(link)}
              >
                {link}
              </button>
            ))}
          </nav>

          <div className={styles.navIcons}>
            {showSearch && searchOpen && (
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Search the collection"
                value={query}
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
            {showSearch && (
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Search"
                onClick={() => {
                  setSearchOpen((o) => !o);
                  if (searchOpen) setQuery("");
                }}
              >
                <SearchGlyph />
              </button>
            )}
            {showCart && (
              <div className={styles.cartWrap}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label="Cart"
                  onClick={() => setCartOpen((o) => !o)}
                >
                  <CartGlyph />
                  {count > 0 && <span className={styles.cartBadge}>{count}</span>}
                </button>
                {cartOpen && (
                  <div className={styles.cartPop}>
                    <div className={styles.cartPopHead}>Your bag</div>
                    {count === 0 ? (
                      <div className={styles.cartEmpty}>Your bag is empty.</div>
                    ) : (
                      <>
                        <div className={styles.cartItems}>
                          {Object.entries(cart).map(([name, q]) => (
                            <div key={name} className={styles.cartItem}>
                              <div className={styles.cartItemInfo}>
                                <span className={styles.cartItemName}>{name}</span>
                                <span className={styles.cartItemMeta}>
                                  £{priceOf(name)} · qty {q}
                                </span>
                              </div>
                              <button
                                type="button"
                                className={styles.cartRemove}
                                aria-label={`Remove one ${name}`}
                                onClick={() => removeOne(name)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className={styles.cartSubtotal}>
                          <span>Subtotal</span>
                          <span>£{subtotal.toLocaleString()}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.cartCheckout}
                          onClick={() => go("checkout")}
                        >
                          Checkout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {view === "store" && (
          <>
            {/* Hero */}
            <section id="top" className={styles.hero}>
              <Img src={HERO_IMG} alt="" className={styles.heroPhoto} />
              <div className={styles.heroMonogram} aria-hidden="true">
                V
              </div>
              <div className={styles.heroInner}>
                <span className={styles.eyebrow}>Autumn 2025</span>
                <h1 className={styles.heroTitle}>
                  Made to last.
                  <br />
                  Made to mean something.
                </h1>
                <p className={styles.heroSub}>
                  A small-batch autumn collection cut from certified, traceable
                  materials, designed in London and made to be worn for a
                  lifetime.
                </p>
                <div className={styles.heroActions}>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={goCollection}
                  >
                    Explore the collection
                  </button>
                  <button
                    type="button"
                    className={styles.textLink}
                    onClick={() => go("sustainability")}
                  >
                    Read our materials promise
                  </button>
                </div>
              </div>
            </section>

            {/* Trust strip */}
            <section className={styles.trust} aria-label="Our promises">
              {TRUST.map((item) => (
                <div key={item.label} className={styles.trustItem}>
                  <span className={styles.trustGlyph}>{item.glyph}</span>
                  <span className={styles.trustLabel}>{item.label}</span>
                </div>
              ))}
            </section>

            {/* New In teaser */}
            <section className={styles.newinTeaser}>
              <div className={styles.teaserHead}>
                <div>
                  <span className={styles.eyebrowDark}>Just arrived</span>
                  <h2 className={styles.sectionTitle}>New In</h2>
                </div>
                <button
                  type="button"
                  className={styles.textLinkDark}
                  onClick={() => go("newin")}
                >
                  View all new in
                </button>
              </div>
              <div className={styles.teaserGrid}>
                {NEW_IN_INDICES.map((idx, pos) => {
                  const p = PRODUCTS[idx];
                  return (
                    <article key={p.name} className={styles.teaserCard}>
                      <button
                        type="button"
                        className={styles.teaserMedia}
                        onClick={() => go("newin")}
                        style={{
                          background: `linear-gradient(150deg, ${p.toneA} 0%, ${p.toneB} 100%)`,
                        }}
                        aria-label={`See ${p.name} in New In`}
                      >
                        <span className={styles.teaserIndex}>
                          {String(pos + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.cardMonogram} aria-hidden="true">
                          {p.initials}
                        </span>
                        <Img
                          src={productImg(idx)}
                          alt={p.name}
                          className={styles.cardPhoto}
                        />
                      </button>
                      <div className={styles.teaserBody}>
                        <h3 className={styles.cardName}>{p.name}</h3>
                        <p className={styles.cardMaterial}>{p.material}</p>
                        <div className={styles.cardFoot}>
                          <span className={styles.cardPrice}>{p.price}</span>
                          <button
                            type="button"
                            className={styles.btnAdd}
                            onClick={() => addToCart(p.name)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Product grid */}
            <section id="collection" className={styles.collection}>
              <div className={styles.sectionHead}>
                <span className={styles.eyebrowDark}>Autumn 2025</span>
                <h2 className={styles.sectionTitle}>The Autumn Collection</h2>
                <p className={styles.sectionLede}>
                  Six considered pieces, each made to order in limited runs.
                </p>
              </div>

              {filtered.length === 0 ? (
                <p className={styles.noResults}>
                  No pieces match “{query}”. Try another search.
                </p>
              ) : null}

              <div className={styles.grid}>
                {filtered.map((p) => (
                  <ProductCard
                    key={p.name}
                    p={p}
                    i={PRODUCTS.indexOf(p)}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            </section>

            {/* Sustainability band */}
            <section className={styles.sustain}>
              <div className={styles.sustainText}>
                <span className={styles.eyebrowGreen}>Sustainability</span>
                <h2 className={styles.sustainTitle}>
                  Sustainability is not a campaign. It is how we cut every piece.
                </h2>
                <p className={styles.sustainBody}>
                  We work in small batches with certified mills, choosing
                  recycled and organic fibres before anything new. Every offcut
                  is accounted for, every garment is built to be repaired, and
                  every order leaves our studio carbon-neutral. Quiet decisions,
                  made one seam at a time.
                </p>
                <button
                  type="button"
                  className={styles.textLinkDark}
                  onClick={() => go("sustainability")}
                >
                  How we make things
                </button>
              </div>
              <div className={styles.sustainArt} aria-hidden="true">
                <Img src={SUSTAIN_IMG} alt="" className={styles.sustainPhoto} />
                <div className={styles.sustainArtMark}>V</div>
              </div>
            </section>

            {/* Newsletter */}
            <section id="newsletter" className={styles.newsletter}>
              <div className={styles.newsletterInner}>
                <h2 className={styles.newsletterTitle}>Join the Velara list</h2>
                <p className={styles.newsletterSub}>
                  Early access to collections, atelier notes and repair clinics.
                  No noise.
                </p>
                {subscribed ? (
                  <p className={styles.newsletterThanks}>
                    Thank you for joining the Velara list.
                  </p>
                ) : (
                  <form
                    className={styles.newsletterForm}
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubscribed(true);
                    }}
                  >
                    <input
                      type="email"
                      className={styles.newsletterInput}
                      placeholder="Your email address"
                      aria-label="Email address"
                      required
                    />
                    <button type="submit" className={styles.btnSubscribe}>
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </section>
          </>
        )}

        {view === "newin" && (
          <>
            <section className={styles.pageHero}>
              <Img src={NEWIN_HERO} alt="" className={styles.pageHeroPhoto} />
              <div className={styles.pageHeroInner}>
                <span className={styles.eyebrow}>Just arrived</span>
                <h1 className={styles.pageTitle}>New In</h1>
                <p className={styles.pageLede}>
                  The first pieces to leave the atelier this season. Cut in the
                  smallest runs we make, and the first to sell through.
                </p>
              </div>
            </section>

            <section className={styles.newinRows}>
              {NEW_IN_INDICES.map((idx, pos) => {
                const p = PRODUCTS[idx];
                return (
                  <article key={p.name} className={styles.newinRow}>
                    <div
                      className={styles.newinMedia}
                      style={{
                        background: `linear-gradient(150deg, ${p.toneA} 0%, ${p.toneB} 100%)`,
                      }}
                    >
                      <span className={styles.cardMonogram} aria-hidden="true">
                        {p.initials}
                      </span>
                      <Img
                        src={productImg(idx)}
                        alt={p.name}
                        className={styles.cardPhoto}
                      />
                      <span className={styles.cardTag}>{p.tag}</span>
                    </div>
                    <div className={styles.newinInfo}>
                      <span className={styles.newinIndex}>
                        New · {String(pos + 1).padStart(2, "0")}
                      </span>
                      <h2 className={styles.newinName}>{p.name}</h2>
                      <p className={styles.newinMaterial}>{p.material}</p>
                      <p className={styles.newinDesc}>{NEW_IN_COPY[idx]}</p>
                      <div className={styles.newinFoot}>
                        <span className={styles.newinPrice}>{p.price}</span>
                        <button
                          type="button"
                          className={styles.btnPrimary}
                          onClick={() => addToCart(p.name)}
                        >
                          Add to bag
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
              <div className={styles.newinCta}>
                <button
                  type="button"
                  className={styles.btnOutline}
                  onClick={goCollection}
                >
                  Shop the full collection
                </button>
              </div>
            </section>
          </>
        )}

        {view === "sustainability" && (
          <>
            <section className={styles.pageHero}>
              <Img src={SUSTAIN_IMG} alt="" className={styles.pageHeroPhoto} />
              <div className={styles.pageHeroInner}>
                <span className={styles.eyebrowGreen}>How we make things</span>
                <h1 className={styles.pageTitle}>
                  Made slowly, on purpose.
                </h1>
                <p className={styles.pageLede}>
                  Velara is built around a simple idea: make less, make it well,
                  and keep it in use for as long as possible. Here is how that
                  works, from the fibre to the repair card in the box.
                </p>
              </div>
            </section>

            <section className={styles.processSection}>
              <div className={styles.sectionHead}>
                <span className={styles.eyebrowGreen}>The process</span>
                <h2 className={styles.sectionTitle}>How we make things</h2>
                <p className={styles.sectionLede}>
                  Four steps, the same for every piece we cut.
                </p>
              </div>
              <div className={styles.processGrid}>
                {PROCESS.map((step) => (
                  <article key={step.n} className={styles.stepCard}>
                    <div className={styles.stepMedia}>
                      <Img
                        src={step.img}
                        alt={step.title}
                        className={styles.stepPhoto}
                      />
                      <span className={styles.stepNum}>{step.n}</span>
                    </div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepBody}>{step.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.materialsSection}>
              <div className={styles.sectionHead}>
                <span className={styles.eyebrowDark}>What we use</span>
                <h2 className={styles.sectionTitle}>The materials</h2>
                <p className={styles.sectionLede}>
                  Recycled and organic fibres first, always traceable.
                </p>
              </div>
              <div className={styles.materialsGrid}>
                {MATERIALS.map((m) => (
                  <article key={m.name} className={styles.materialCard}>
                    <div className={styles.materialMedia}>
                      <Img
                        src={m.img}
                        alt={m.name}
                        className={styles.materialPhoto}
                      />
                    </div>
                    <h3 className={styles.materialName}>{m.name}</h3>
                    <p className={styles.materialBody}>{m.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.repairBand}>
              <div className={styles.repairInner}>
                <span className={styles.repairGlyph}>
                  <LeafGlyph />
                </span>
                <span className={styles.eyebrowGreen}>Repair first</span>
                <h2 className={styles.repairTitle}>
                  We would rather mend it than sell you another.
                </h2>
                <p className={styles.repairBody}>
                  Every Velara piece comes with free repairs for life. Send us a
                  worn elbow, a lost button or a tired hem and we will put it
                  right and return it carbon-neutral. When a garment is finally
                  past wearing, we take it back to be re-spun. The most
                  sustainable thing we make is the one you already own.
                </p>
                <div className={styles.repairActions}>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={goCollection}
                  >
                    Shop the collection
                  </button>
                  <button
                    type="button"
                    className={styles.textLinkDark}
                    onClick={() => go("boutiques")}
                  >
                    Book a repair in a boutique
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {view === "boutiques" && (
          <>
            <section className={styles.pageHero}>
              <div className={styles.pageHeroInner}>
                <span className={styles.eyebrow}>Visit us</span>
                <h1 className={styles.pageTitle}>Boutiques</h1>
                <p className={styles.pageLede}>
                  Two London rooms where you can try the collection, book a
                  fitting, or bring a piece in for repair. Both are a short walk
                  from the underground.
                </p>
              </div>
            </section>

            <section className={styles.boutiques}>
              {BOUTIQUES.map((b) => (
                <article key={b.name} className={styles.boutiqueCard}>
                  <div className={styles.mapPanel} aria-hidden="true">
                    <div className={styles.mapGrid} />
                    <div className={styles.mapRoadH} />
                    <div className={styles.mapRoadV} />
                    <div className={styles.mapPark} />
                    <div className={styles.mapPin}>
                      <span className={styles.mapPinDot} />
                    </div>
                    <span className={styles.mapRoadLabel}>{b.roads[0]}</span>
                    <span className={styles.mapRoadLabel2}>{b.roads[1]}</span>
                  </div>
                  <div className={styles.boutiqueInfo}>
                    <span className={styles.eyebrowDark}>{b.area}</span>
                    <h2 className={styles.boutiqueName}>{b.name}</h2>
                    <address className={styles.boutiqueAddress}>
                      {b.address.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </address>
                    <div className={styles.boutiqueHours}>
                      <h3 className={styles.boutiqueHoursTitle}>Opening hours</h3>
                      {b.hours.map(([day, time]) => (
                        <div key={day} className={styles.hoursRow}>
                          <span>{day}</span>
                          <span>{time}</span>
                        </div>
                      ))}
                    </div>
                    <p className={styles.boutiquePhone}>{b.phone}</p>
                    <button
                      type="button"
                      className={styles.btnOutline}
                      onClick={goCollection}
                    >
                      Shop before you visit
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {view === "about" && (
          <>
            <section className={styles.pageHero}>
              <Img src={ABOUT_IMG} alt="" className={styles.pageHeroPhoto} />
              <div className={styles.pageHeroInner}>
                <span className={styles.eyebrow}>Our story</span>
                <h1 className={styles.pageTitle}>About Velara</h1>
                <p className={styles.pageLede}>
                  Founded in London in 2019, Velara is a small house making
                  sustainable luxury in limited runs. We set out to prove that
                  considered clothing could be beautiful, traceable and built to
                  last, with nothing made on speculation.
                </p>
              </div>
            </section>

            <section className={styles.aboutBody}>
              <div className={styles.aboutCols}>
                <div className={styles.aboutCol}>
                  <h2 className={styles.aboutColTitle}>The philosophy</h2>
                  <p className={styles.aboutColBody}>
                    We believe a wardrobe should grow slowly. Each season we cut
                    a tight collection of pieces meant to be worn for years, not
                    months, in colours and shapes that hold from one autumn to
                    the next. Quiet over loud, every time.
                  </p>
                </div>
                <div className={styles.aboutCol}>
                  <h2 className={styles.aboutColTitle}>How we work</h2>
                  <p className={styles.aboutColBody}>
                    Everything is made to order in small batches by makers we
                    know and pay fairly. We choose recycled and organic fibres
                    first, account for every offcut, and repair for life. It is a
                    slower way to build a label, and the only one we want.
                  </p>
                </div>
              </div>
              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>2019</span>
                  <span className={styles.statLabel}>Founded in London</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>2</span>
                  <span className={styles.statLabel}>London boutiques</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>100%</span>
                  <span className={styles.statLabel}>Made to order</span>
                </div>
              </div>
              <div className={styles.aboutCta}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={goCollection}
                >
                  Explore the collection
                </button>
                <button
                  type="button"
                  className={styles.textLinkDark}
                  onClick={() => go("sustainability")}
                >
                  How we make things
                </button>
              </div>
            </section>
          </>
        )}

        {view === "checkout" && (
          <section className={styles.checkout}>
            <div className={styles.checkoutHead}>
              <span className={styles.eyebrowDark}>Secure checkout</span>
              <h1 className={styles.pageTitle}>Checkout</h1>
            </div>

            {count === 0 ? (
              <div className={styles.checkoutEmpty}>
                <p className={styles.checkoutEmptyText}>
                  Your bag is empty. Add a piece to begin checkout.
                </p>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={goCollection}
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className={styles.checkoutGrid}>
                <form className={styles.checkoutForm} onSubmit={placeOrder}>
                  <fieldset className={styles.formGroup}>
                    <legend className={styles.formLegend}>Contact</legend>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Email</span>
                      <input
                        type="email"
                        className={styles.formInput}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                    </label>
                  </fieldset>

                  <fieldset className={styles.formGroup}>
                    <legend className={styles.formLegend}>Shipping address</legend>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Full name</span>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Full name"
                        autoComplete="name"
                        required
                      />
                    </label>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Address</span>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Address line"
                        autoComplete="address-line1"
                        required
                      />
                    </label>
                    <div className={styles.formRow}>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>City</span>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="City"
                          autoComplete="address-level2"
                          required
                        />
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>Postcode</span>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="Postcode"
                          autoComplete="postal-code"
                          required
                        />
                      </label>
                    </div>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Country</span>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Country"
                        autoComplete="country-name"
                        defaultValue="United Kingdom"
                        required
                      />
                    </label>
                  </fieldset>

                  <fieldset className={styles.formGroup}>
                    <legend className={styles.formLegend}>Payment</legend>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Card number</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className={styles.formInput}
                        placeholder="1234 5678 9012 3456"
                        autoComplete="cc-number"
                        required
                      />
                    </label>
                    <div className={styles.cardFields}>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>Expiry</span>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="MM/YY"
                          autoComplete="cc-exp"
                          required
                        />
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>CVC</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          className={styles.formInput}
                          placeholder="123"
                          autoComplete="cc-csc"
                          required
                        />
                      </label>
                    </div>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Name on card</span>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Name on card"
                        autoComplete="cc-name"
                        required
                      />
                    </label>
                    <p className={styles.demoNote}>
                      Demo checkout, no real payment is taken.
                    </p>
                  </fieldset>

                  <button type="submit" className={styles.placeOrder}>
                    Place order · £{total.toLocaleString()}
                  </button>
                  <button
                    type="button"
                    className={styles.backLink}
                    onClick={goCollection}
                  >
                    Back to store
                  </button>
                </form>

                <aside className={styles.orderSummary}>
                  <h2 className={styles.summaryTitle}>Order summary</h2>
                  <div className={styles.summaryItems}>
                    {Object.entries(cart).map(([name, q]) => (
                      <div key={name} className={styles.summaryItem}>
                        <div className={styles.summaryItemInfo}>
                          <span className={styles.summaryItemName}>{name}</span>
                          <span className={styles.summaryItemMeta}>Qty {q}</span>
                        </div>
                        <span className={styles.summaryItemPrice}>
                          £{(priceOf(name) * q).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.summaryTotals}>
                    <div className={styles.summaryLine}>
                      <span>Subtotal</span>
                      <span>£{subtotal.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryLine}>
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `£${shipping}`}</span>
                    </div>
                    <div className={styles.summaryNote}>
                      Free shipping on orders over £250.
                    </div>
                    <div className={styles.summaryTotal}>
                      <span>Total</span>
                      <span>£{total.toLocaleString()}</span>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </section>
        )}

        {view === "confirmation" && (
          <section className={styles.confirm}>
            <div className={styles.confirmCard}>
              <span className={styles.confirmCheck} aria-hidden="true">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <circle cx="17" cy="17" r="15" opacity="0.5" />
                  <path
                    d="M11 17.5l4 4 8-9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.eyebrowGreen}>Order confirmed</span>
              <h1 className={styles.confirmTitle}>Thank you for your order.</h1>
              <p className={styles.confirmBody}>
                Your pieces are now being prepared in our London atelier. We have
                emailed your receipt and will be in touch when your order ships,
                carbon-neutral, as always.
              </p>
              <div className={styles.orderNo}>
                <span className={styles.orderNoLabel}>Order number</span>
                <span className={styles.orderNoValue}>{orderNo}</span>
              </div>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => go("store")}
              >
                Continue shopping
              </button>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerCols}>
            <div className={styles.footerBrand}>
              <button
                type="button"
                className={styles.footerWordmark}
                onClick={() => go("store")}
                aria-label="Velara home"
              >
                VELARA
              </button>
              <p className={styles.footerTagline}>
                Sustainable luxury, made in limited runs.
              </p>
            </div>
            {FOOTER.map((col) => (
              <div className={styles.footerCol} key={col.title}>
                <h4 className={styles.footerColTitle}>{col.title}</h4>
                {col.links.map(([label, target]) => (
                  <button
                    type="button"
                    className={styles.footerLink}
                    key={label}
                    onClick={() => goFooter(target)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.footerBase}>
            <span>© Velara Ltd. Sustainable luxury, made to last.</span>
            <span className={styles.footerBaseRight}>London · Est. 2019</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
