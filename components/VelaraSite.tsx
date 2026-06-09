"use client";

import { useState } from "react";
import styles from "./VelaraSite.module.css";

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

const NAV_LINKS = [
  "New In",
  "The Autumn Collection",
  "Sustainability",
  "Boutiques",
  "About",
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

export default function VelaraSite() {
  const [cart, setCart] = useState(0);
  const [activeNav, setActiveNav] = useState("The Autumn Collection");

  const addToCart = () => setCart((c) => c + 1);

  return (
    <div className={styles.root}>
      {/* Sticky top nav */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a className={styles.wordmark} href="#" aria-label="Velara home">
            VELARA
          </a>

          <nav className={styles.navLinks} aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                className={`${styles.navLink} ${
                  activeNav === link ? styles.navLinkActive : ""
                }`}
                onClick={() => setActiveNav(link)}
              >
                {link}
              </button>
            ))}
          </nav>

          <div className={styles.navIcons}>
            <button type="button" className={styles.iconBtn} aria-label="Search">
              <SearchGlyph />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Cart">
              <CartGlyph />
              {cart > 0 && <span className={styles.cartBadge}>{cart}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
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
              materials — designed in London, made to be worn for a lifetime.
            </p>
            <div className={styles.heroActions}>
              <button type="button" className={styles.btnPrimary}>
                Explore the collection
              </button>
              <a href="#" className={styles.textLink}>
                Read our materials promise
              </a>
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

        {/* Product grid */}
        <section className={styles.collection}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrowDark}>Autumn 2025</span>
            <h2 className={styles.sectionTitle}>The Autumn Collection</h2>
            <p className={styles.sectionLede}>
              Six considered pieces, each made to order in limited runs.
            </p>
          </div>

          <div className={styles.grid}>
            {PRODUCTS.map((p) => (
              <article key={p.name} className={styles.card}>
                <div
                  className={styles.cardImage}
                  style={{
                    background: `linear-gradient(150deg, ${p.toneA} 0%, ${p.toneB} 100%)`,
                  }}
                >
                  <span className={styles.cardMonogram} aria-hidden="true">
                    {p.initials}
                  </span>
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
                      onClick={addToCart}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </article>
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
              We work in small batches with certified mills, choosing recycled
              and organic fibres before anything new. Every offcut is accounted
              for, every garment is built to be repaired, and every order leaves
              our studio carbon-neutral. Quiet decisions, made one seam at a
              time.
            </p>
            <a href="#" className={styles.textLinkDark}>
              How we make things
            </a>
          </div>
          <div className={styles.sustainArt} aria-hidden="true">
            <div className={styles.sustainArtMark}>V</div>
          </div>
        </section>

        {/* Newsletter */}
        <section className={styles.newsletter}>
          <div className={styles.newsletterInner}>
            <h2 className={styles.newsletterTitle}>Join the Velara list</h2>
            <p className={styles.newsletterSub}>
              Early access to collections, atelier notes and repair clinics. No
              noise.
            </p>
            <form
              className={styles.newsletterForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                className={styles.newsletterInput}
                placeholder="Your email address"
                aria-label="Email address"
              />
              <button type="submit" className={styles.btnSubscribe}>
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerCols}>
            <div className={styles.footerBrand}>
              <span className={styles.footerWordmark}>VELARA</span>
              <p className={styles.footerTagline}>
                Sustainable luxury, made in limited runs.
              </p>
            </div>
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Shop</h4>
              <a href="#">New In</a>
              <a href="#">The Autumn Collection</a>
              <a href="#">Knitwear</a>
              <a href="#">Outerwear</a>
            </div>
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Company</h4>
              <a href="#">About</a>
              <a href="#">Sustainability</a>
              <a href="#">Boutiques</a>
              <a href="#">Careers</a>
            </div>
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Help</h4>
              <a href="#">Contact</a>
              <a href="#">Shipping</a>
              <a href="#">Repairs</a>
              <a href="#">Returns</a>
            </div>
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
              <a href="#">Modern Slavery</a>
            </div>
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
