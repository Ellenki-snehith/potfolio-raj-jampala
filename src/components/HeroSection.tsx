// import { useEffect, useMemo, useState, type FormEvent } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ArrowRight, MapPin, Search, ShieldCheck, Star } from 'lucide-react';
// // import heroImage from '../assets/hero_new.png';
// import heroImage from '../assets/image.png';
// type HeroSectionProps = {
//   eyebrow?: string;
//   title?: string | null;
//   subtitle?: string | null;
//   showPropertySearch?: boolean;
//   showContactButton?: boolean;
//   /** Optional VERIFIED figures, e.g. reviewRating="4.9", reviewCount="600+". */
//   reviewRating?: string | number | null;
//   reviewCount?: string | number | null;
// };

// // All styles are kept in this single component file; no external CSS import needed.
// const HERO_STYLES = String.raw`
// /* Scoped hero styles; does not depend on Tailwind or the existing .hero class. */
// .unhero,
// .unhero * { box-sizing: border-box; }

// .unhero {
//   /* Sophisticated navy + corporate blue palette to match the site header. */
//   --unhero-navy: #102b43;
//   --unhero-primary: #0b688b;
//   /*
//    * Use the SAME centered desktop shell as the navigation.
//    * Screenshots: ~54px inset on 1728px screens and ~102px on 1874px screens.
//    * 1670px is the header's approximate max content width; unlike a capped
//    * viewport gutter, this keeps both sides aligned on wide monitors.
//    * Both the hero content and the floating badge use this single value.
//    */
//   --unhero-page-gutter: max(20px, 3.125%, calc(50% - 835px));
//   position: relative;
//   isolation: isolate;
//   width: 100%;
//   height: 92vh;
//   min-height: 640px;
//   overflow: hidden;
//   background: var(--unhero-navy);
//   color: #fff;
//   font-family: inherit;
// }

// .unhero__background {
//   position: absolute;
//   z-index: -2;
//   inset: -85px 0;
//   will-change: transform;
//   pointer-events: none;
// }

// .unhero__image {
//   display: block;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   object-position: center center;
//   animation: unhero-kenburns 22s ease-in-out infinite alternate;
//   transform-origin: center center;
// }

// .unhero__overlay {
//   position: absolute;
//   z-index: -1;
//   inset: 0;
//   background: linear-gradient(90deg, rgba(8, 29, 49, .93) 0%, rgba(8, 29, 49, .78) 41%, rgba(8, 29, 49, .40) 73%, rgba(8, 29, 49, .24) 100%);
//   pointer-events: none;
// }

// .unhero__container {
//   display: flex;
//   align-items: center;
//   /* Keep the background full-bleed, but align the CONTENT with the header. */
//   width: 100%;
//   height: 100%;
//   margin-inline: auto;
//   padding: 48px var(--unhero-page-gutter);
// }

// .unhero__content { width: min(100%, 850px); }

// .unhero__eyebrow {
//   margin: 0;
//   font-size: 12px;
//   font-weight: 800;
//   letter-spacing: .3em;
//   line-height: 1.6;
//   text-transform: uppercase;
//   color: rgba(255, 255, 255, .90);
// }

// .unhero__title {
//   max-width: 780px;
//   margin: 20px 0 0;
//   color: #fff;
//   font-size: clamp(48px, 6vw, 76px);
//   font-weight: 800;
//   line-height: 1.05;
//   letter-spacing: -.045em;
// }

// .unhero__title-line { display: block; }
// .unhero__title-line--accent { color: #fff; }

// .unhero__subtitle {
//   width: min(100%, 580px);
//   margin: 24px 0 0;
//   font-size: 18px;
//   font-weight: 400;
//   line-height: 1.65;
//   color: rgba(255,255,255,.86);
// }

// .unhero__search {
//   display: flex;
//   align-items: stretch;
//   width: min(100%, 850px);
//   margin-top: 40px;
//   padding: 8px;
//   border-radius: 12px;
//   background: #fff;
//   box-shadow: 0 24px 56px rgba(0,0,0,.3);
//   color: #17344d;
// }

// .unhero__location {
//   display: flex;
//   align-items: center;
//   flex: 1 1 40%;
//   min-width: 165px;
//   gap: 8px;
//   padding: 0 16px;
// }

// .unhero__location svg { flex: 0 0 auto; color: var(--unhero-primary); }

// .unhero__location input {
//   display: block;
//   width: 100%;
//   min-width: 0;
//   height: 48px;
//   border: none;
//   outline: none;
//   background: transparent;
//   color: #17344d;
//   font: inherit;
//   font-size: 14px;
// }

// .unhero__location input::placeholder { color: #74879a; opacity: 1; }

// .unhero__select-wrap {
//   display: flex;
//   align-items: center;
//   flex: 0 1 155px;
//   min-width: 106px;
//   padding: 0 12px;
//   border-left: 1px solid #e1e5e9;
// }

// .unhero__select-wrap select {
//   width: 100%;
//   min-width: 0;
//   height: 48px;
//   padding-right: 10px;
//   border: 0;
//   outline: 0;
//   background: transparent;
//   color: #17344d;
//   font: inherit;
//   font-size: 14px;
//   cursor: pointer;
// }

// .unhero__search-button,
// .unhero__contact-button {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   gap: 9px;
//   flex: 0 0 auto;
//   min-height: 48px;
//   padding: 0 24px;
//   border: 0;
//   border-radius: 8px;
//   background: var(--unhero-primary);
//   color: #fff;
//   font: inherit;
//   font-size: 14px;
//   font-weight: 800;
//   text-decoration: none;
//   cursor: pointer;
//   transition: filter .2s ease, transform .2s ease;
// }

// .unhero__search-button:hover,
// .unhero__contact-button:hover { filter: brightness(1.1); }
// .unhero__search-button:active,
// .unhero__contact-button:active { transform: scale(.98); }

// .unhero__search :is(input, select, button):focus-visible,
// .unhero__contact-button:focus-visible {
//   outline: 3px solid var(--unhero-primary);
//   outline-offset: 2px;
// }

// .unhero__fallback-actions { margin-top: 38px; }
// .unhero__fallback-actions .unhero__contact-button { min-height: 52px; }

// .unhero__proof {
//   position: absolute;
//   right: var(--unhero-page-gutter);
//   bottom: 64px;
//   width: max-content;
//   max-width: 310px;
//   padding: 20px;
//   border-radius: 16px;
//   background: #fff;
//   box-shadow: 0 16px 42px rgba(0,0,0,.24);
//   color: #17344d;
//   animation: unhero-float 5s ease-in-out infinite;
// }

// .unhero__proof-head { display: flex; align-items: center; gap: 12px; }
// .unhero__proof-head strong { font-size: 14px; font-weight: 800; }
// .unhero__stars { display: flex; gap: 0; color: var(--unhero-primary); }
// .unhero__proof-shield { color: var(--unhero-primary); }
// .unhero__proof p { margin: 8px 0 0; font-size: 12px; color: #697e91; }

// .unhero__sr-only {
//   position: absolute;
//   width: 1px;
//   height: 1px;
//   padding: 0;
//   margin: -1px;
//   overflow: hidden;
//   clip: rect(0, 0, 0, 0);
//   white-space: nowrap;
//   border: 0;
// }

// .unhero__rise { animation: unhero-rise .75s ease both; }
// .unhero__rise--second { animation-delay: .15s; }
// .unhero__rise--third { animation-delay: .30s; }
// .unhero__rise--fourth { animation-delay: .45s; }

// @keyframes unhero-rise {
//   from { opacity: 0; transform: translateY(26px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// @keyframes unhero-kenburns {
//   from { transform: scale(1.02); }
//   to { transform: scale(1.12); }
// }
// @keyframes unhero-float {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
// }

// @media (min-width: 1024px) {
//   .unhero__content { padding-bottom: 16px; }
// }

// @media (max-width: 1023px) {
//   .unhero__proof { display: none; }
//   .unhero__content { width: min(100%, 850px); }
// }

// @media (max-width: 767px) {
//   .unhero { height: auto; min-height: 680px; }
//   .unhero__container { min-height: 680px; padding: 75px 20px 70px; }
//   .unhero__overlay { background: linear-gradient(90deg, rgba(8,29,49,.92), rgba(8,29,49,.65)); }
//   .unhero__title { font-size: clamp(40px, 9vw, 58px); }
//   .unhero__subtitle { font-size: 16px; }
//   .unhero__search { flex-wrap: wrap; gap: 0; padding: 8px; margin-top: 30px; }
//   .unhero__location { flex: 1 1 100%; padding: 0 12px; border-bottom: 1px solid #e1e5e9; }
//   .unhero__select-wrap { flex: 1 1 50%; min-width: 0; padding: 0 10px; border-left: 0; }
//   .unhero__select-wrap + .unhero__select-wrap { border-left: 1px solid #e1e5e9; }
//   .unhero__search-button { flex: 1 1 100%; margin-top: 7px; }
// }

// @media (max-width: 390px) {
//   .unhero__container { padding-inline: 16px; }
//   .unhero__eyebrow { font-size: 10px; letter-spacing: .22em; }
//   .unhero__title { font-size: 38px; }
//   .unhero__search-button { min-height: 46px; }
// }

// @media (prefers-reduced-motion: reduce) {
//   .unhero__image, .unhero__proof, .unhero__rise { animation: none !important; }
//   .unhero__background { transform: none !important; }
//   .unhero__search-button, .unhero__contact-button { transition: none; }
// }
// `;

// const DEFAULT_TITLE = 'Find property.\nBuild better.\nLive confidently.';
// const DEFAULT_SUBTITLE =
//   'One trusted team for real estate, civil works and essential property services.';

// /** Respect explicit line breaks; format the reference title as three lines. */
// function getHeadingLines(title?: string | null): string[] {
//   const value = title?.trim() || DEFAULT_TITLE;
//   const explicitLines = value
//     .split(/\r?\n|\|/)
//     .map((part) => part.trim())
//     .filter(Boolean);
//   if (explicitLines.length > 1) return explicitLines;

//   // Split an admin-managed title that happens to contain three sentences.
//   const sentences = value.match(/[^.!?]+[.!?]?/g)?.map((part) => part.trim()).filter(Boolean);
//   return sentences?.length === 3 ? sentences : [value];
// }

// export default function HeroSection({
//   eyebrow = 'REAL ESTATE & CIVIL SOLUTIONS',
//   title,
//   subtitle,
//   showPropertySearch = true,
//   showContactButton = true,
//   reviewRating,
//   reviewCount,
// }: HeroSectionProps) {
//   const navigate = useNavigate();
//   const [scrollOffset, setScrollOffset] = useState(0);
//   const [location, setLocation] = useState('');
//   const [propertyType, setPropertyType] = useState('Apartment');
//   const [purpose, setPurpose] = useState('Sale');
//   const titleLines = useMemo(() => getHeadingLines(title), [title]);
//   const hasReviewData = reviewRating != null && reviewCount != null;

//   useEffect(() => {
//     let scheduled = false;
//     const update = () => {
//       if (scheduled) return;
//       scheduled = true;
//       window.requestAnimationFrame(() => {
//         setScrollOffset(Math.min(window.scrollY * 0.3, 260));
//         scheduled = false;
//       });
//     };
//     update();
//     window.addEventListener('scroll', update, { passive: true });
//     return () => window.removeEventListener('scroll', update);
//   }, []);

//   function handlePropertySearch(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const params = new URLSearchParams();
//     if (location.trim()) params.set('location', location.trim());
//     params.set('property_type', propertyType);
//     params.set('purpose', purpose);
//     navigate(`/properties?${params.toString()}`);
//   }

//   return (
//     <section className="unhero" aria-label="Real estate and construction services">
//       <style>{HERO_STYLES}</style>
//       <div
//         className="unhero__background"
//         style={{ transform: `translate3d(0, ${scrollOffset}px, 0)` }}
//         aria-hidden="true"
//       >
//         <img
//           src={heroImage}
//           alt=""
//           className="unhero__image"
//           fetchPriority="high"
//           decoding="async"
//         />
//       </div>
//       <div className="unhero__overlay" aria-hidden="true" />

//       <div className="unhero__container">
//         <div className="unhero__content">
//           <p className="unhero__eyebrow unhero__rise">{eyebrow}</p>
//           <h1 className="unhero__title unhero__rise unhero__rise--second">
//             {titleLines.map((line, index) => (
//               <span
//                 key={`${line}-${index}`}
//                 className={`unhero__title-line${index === titleLines.length - 1 ? ' unhero__title-line--accent' : ''}`}
//               >
//                 {line}
//               </span>
//             ))}
//           </h1>
//           <p className="unhero__subtitle unhero__rise unhero__rise--third">
//             {subtitle?.trim() || DEFAULT_SUBTITLE}
//           </p>

//           {showPropertySearch ? (
//             <form
//               className="unhero__search unhero__rise unhero__rise--fourth"
//               onSubmit={handlePropertySearch}
//               role="search"
//               aria-label="Search available properties"
//             >
//               <label className="unhero__location">
//                 <MapPin size={18} strokeWidth={2} aria-hidden="true" />
//                 <span className="unhero__sr-only">Preferred location</span>
//                 <input
//                   value={location}
//                   onChange={(event) => setLocation(event.target.value)}
//                   placeholder="Location — e.g. Gachibowli"
//                   autoComplete="off"
//                 />
//               </label>
//               <label className="unhero__select-wrap">
//                 <span className="unhero__sr-only">Property type</span>
//                 <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
//                   <option value="Apartment">Apartment</option>
//                   <option value="Villa">Villa</option>
//                   <option value="Plot">Plot</option>
//                 </select>
//               </label>
//               <label className="unhero__select-wrap">
//                 <span className="unhero__sr-only">Buy or rent</span>
//                 <select value={purpose} onChange={(event) => setPurpose(event.target.value)}>
//                   <option value="Sale">Buy</option>
//                   <option value="Rent">Rent</option>
//                 </select>
//               </label>
//               <button className="unhero__search-button" type="submit">
//                 <Search size={18} strokeWidth={2.25} aria-hidden="true" />
//                 Search
//               </button>
//             </form>
//           ) : showContactButton ? (
//             <div className="unhero__fallback-actions unhero__rise unhero__rise--fourth">
//               <Link className="unhero__contact-button" to="/contact">
//                 Talk to our team <ArrowRight size={19} aria-hidden="true" />
//               </Link>
//             </div>
//           ) : null}
//         </div>
//       </div>

//       <aside className="unhero__proof" aria-label="About our services">
//         {hasReviewData ? (
//           <>
//             <div className="unhero__proof-head">
//               <div className="unhero__stars" aria-label="Five star graphic">
//                 {Array.from({ length: 5 }, (_, index) => (
//                   <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
//                 ))}
//               </div>
//               <strong>{reviewRating} / 5</strong>
//             </div>
//             <p>from {reviewCount} happy families</p>
//           </>
//         ) : (
//           <>
//             <div className="unhero__proof-head">
//               <ShieldCheck size={22} strokeWidth={2} className="unhero__proof-shield" aria-hidden="true" />
//               <strong>Property & civil expertise</strong>
//             </div>
//             <p>Serving Hyderabad and surrounding areas</p>
//           </>
//         )}
//       </aside>
//     </section>
//   );
// }


// import React from 'react';
// import './hero-section.css';
// import heroImage from '../assets/image.png';

// interface HeroSectionProps {
//   title?: string;
//   subtitle?: string;
// }

// export default function HeroSection({
//   title,
//   subtitle,
// }: HeroSectionProps) {
//   return (
//     <section
//       className="politician-hero"
//       style={{
//         backgroundImage: `linear-gradient(90deg, rgba(15, 27, 45, 0.92) 0%, rgba(15, 27, 45, 0.72) 48%, rgba(15, 27, 45, 0.20) 100%), url("${heroImage}")`,
//       }}
//     >
//       <div className="politician-hero-content">
//         <span className="politician-hero-eyebrow">
//           PUBLIC SERVICE • LEADERSHIP • DEVELOPMENT
//         </span>

//         <h1>{title || 'Serving the People'}</h1>

//         <p>
//           {subtitle ||
//             'Dedicated to public service, development, and building a better future for our community.'}
//         </p>

//         <div className="politician-hero-buttons">
//           <a href="/about" className="politician-primary-button">
//             Know More
//           </a>

//           <a href="/contact" className="politician-secondary-button">
//             Contact
//           </a>
//         </div>
//       </div>

//       <div className="politician-hero-bottom-line">
//         <span className="saffron-line"></span>
//         <span className="white-line"></span>
//         <span className="green-line"></span>
//       </div>
//     </section>
//   );
// }



import './hero-section.css';

import heroImage from '../assets/image.png';
import mobileHeroImage from '../assets/mobile.png';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export default function HeroSection({
  title,
  subtitle,
}: HeroSectionProps) {
  return (
    <section className="politician-hero">

      {/* RESPONSIVE HERO BACKGROUND IMAGE */}
      <picture className="politician-hero-picture">

        {/* Mobile image */}
        <source
          media="(max-width: 767px)"
          srcSet={mobileHeroImage}
        />

        {/* Laptop and tablet image */}
        <img
          src={heroImage}
          alt=""
          className="politician-hero-image"
        />

      </picture>

      {/* DARK OVERLAY */}
      <div className="politician-hero-overlay"></div>

      {/* HERO CONTENT */}
      <div className="politician-hero-content">

        <span className="politician-hero-eyebrow">
          PUBLIC SERVICE • LEADERSHIP • DEVELOPMENT
        </span>

        <h1>{title || 'Serving the People'}</h1>

        <p>
          {subtitle ||
            'Dedicated to public service, development, and building a better future for our community.'}
        </p>

        <div className="politician-hero-buttons">

          <a href="/about" className="politician-primary-button">
            Know More
          </a>

          <a href="/contact" className="politician-secondary-button">
            Contact
          </a>

        </div>
      </div>

      {/* TRICOLOR BOTTOM LINE */}
      <div className="politician-hero-bottom-line">
        <span className="saffron-line"></span>
        <span className="white-line"></span>
        <span className="green-line"></span>
      </div>

    </section>
  );
}
