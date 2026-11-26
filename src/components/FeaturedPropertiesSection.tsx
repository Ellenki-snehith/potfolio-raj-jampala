import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bath,
  BedDouble,
  Camera,
  Heart,
  MapPin,
  Maximize,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { ListingExtraDetails } from './ListingExtraDetails';
import { mediaUrl } from '../api';
import p1 from '../assets/p1.jpg';
import p2 from '../assets/p2.jpg';
import hero from '../assets/hero.jpg';
import { ShowcaseSection } from './HomeShowcase';

// Asset images are displayed only when the listing has no uploaded photo.
const fallbackImages = [p1, p2, hero];
const FAVORITES_KEY = 'urbannest:favorite-properties'; // Same key as Properties.tsx

/**
 * Horizontal, screenshot-style property cards.
 * The entire component and its responsive CSS live in this single TSX file.
 * Keeps the existing PropertyCard named export and FeaturedPropertiesSection default export.
 */
const PROPERTY_CSS = String.raw`
/* Blue / navy property card theme, matched to the site's header and hero. */
.ufp-card, .ufp-card * { box-sizing: border-box; }
.ufp-card {
  --ufp-navy: #102b43;
  --ufp-blue: #0b688b;
  --ufp-text: #203246;
  --ufp-muted: #647385;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  width: 100%;
  min-width: 0;
  min-height: 224px;
  overflow: hidden;
  border: 1px solid #dfe5ec;
  border-radius: 17px;
  background: #fff;
  color: var(--ufp-text);
  box-shadow: 0 3px 13px rgba(16, 43, 67, .035);
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.ufp-card:hover {
  border-color: #94abba;
  box-shadow: 0 12px 32px rgba(16,43,67,.11);
  transform: translateY(-2px);
}
.ufp-card a { text-decoration: none; }
.ufp-card a:focus-visible,
.ufp-card button:focus-visible { outline: 3px solid var(--ufp-blue); outline-offset: 3px; }
.ufp-card__visual { position: relative; min-height: 224px; min-width: 0; background: #e8ecf1; }
.ufp-card__image-link { position: absolute; inset: 0; display: block; overflow: hidden; }
.ufp-card__image { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .45s ease; }
.ufp-card:hover .ufp-card__image { transform: scale(1.045); }
.ufp-card__tag {
  position: absolute; top: 12px; left: 12px; max-width: calc(100% - 92px);
  border-radius: 100px; padding: 6px 13px;
  background: var(--ufp-blue); color: #fff; font-size: 10px; font-weight: 800;
  text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  pointer-events: none; box-shadow: 0 2px 7px rgba(0,0,0,.16);
}
.ufp-card__tag--standard { background: var(--ufp-navy); }
.ufp-card__favorite {
  position: absolute; right: 12px; top: 12px;
  display: grid; place-items: center; width: 37px; height: 37px;
  border: 1px solid rgba(224,232,240,.7); border-radius: 50%;
  background: rgba(255,255,255,.96); color: #66768a;
  cursor: pointer; box-shadow: 0 3px 9px rgba(0,0,0,.13);
  transition: transform .2s, color .2s;
}
.ufp-card__favorite:hover { transform: scale(1.08); color: var(--ufp-blue); }
.ufp-card__favorite[aria-pressed="true"] { color: #bb3750; }
.ufp-card__photo-count {
  position: absolute; bottom: 12px; left: 12px;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 9px; border-radius: 6px;
  background: rgba(16,43,67,.88); color: white;
  font-size: 11px; font-weight: 700; pointer-events: none;
}
.ufp-card__info { min-width: 0; display: flex; flex-direction: column; padding: 16px 17px 13px; }
.ufp-card__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.ufp-card__price { display: block; color: var(--ufp-navy); font-size: 21px; line-height: 1.3; font-weight: 850; letter-spacing: -.025em; }
.ufp-card__rate { display: block; margin-top: 1px; color: #718092; font-size: 12px; }
.ufp-card__negotiable { margin-top: 5px; color: var(--ufp-blue); font-size: 11px; font-weight: 700; white-space: nowrap; }
.ufp-card__title { display: inline-block; align-self: flex-start; margin: 7px 0 5px; color: var(--ufp-text); font-size: 16px; line-height: 1.35; font-weight: 800; overflow-wrap: anywhere; }
.ufp-card__title:hover { color: var(--ufp-blue); }
.ufp-card__location { display: flex; align-items: flex-start; gap: 7px; color: var(--ufp-muted); font-size: 13px; line-height: 1.45; }
.ufp-card__location svg { flex-shrink: 0; margin-top: 2px; color: var(--ufp-blue); }
.ufp-card__facts { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 19px; margin-top: 11px; }
.ufp-card__fact { display: inline-flex; align-items: center; gap: 7px; color: #374151; font-size: 12.5px; white-space: nowrap; }
.ufp-card__fact svg { color: #647385; }
.ufp-card__appreciation { display: flex; align-items: center; gap: 6px; margin-top: 10px; color: var(--ufp-blue); font-size: 12px; font-weight: 650; }
.ufp-card__description { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden; margin: 9px 0 0; color: #68798a; font-size: 12.5px; line-height: 1.45; }
.ufp-card__extras { color: #68798a; font-size: 12px; margin-top: 6px; }
.ufp-card__bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 11px; border-top: 1px solid #e4e9ef; min-height: 33px; }
.ufp-card__bottom-left { display: flex; align-items: center; gap: 6px 14px; flex-wrap: wrap; min-width: 0; }
.ufp-card__verified { display: inline-flex; align-items: center; gap: 6px; color: var(--ufp-blue); font-size: 12px; font-weight: 600; }
.ufp-card__category { display: inline-flex; align-items: center; gap: 5px; color: #657688; font-size: 12px; text-align: right; margin-left: auto; }
@media (max-width: 850px) {
  .ufp-card { grid-template-columns: 260px minmax(0, 1fr); }
  .ufp-card__visual { min-height: 250px; }
  .ufp-card__facts { column-gap: 12px; }
}
@media (max-width: 640px) {
  .ufp-card { grid-template-columns: minmax(0, 1fr); border-radius: 15px; }
  .ufp-card__visual { height: 210px; min-height: 0; }
  .ufp-card__info { padding: 15px; }
  .ufp-card__price { font-size: 20px; }
  .ufp-card__title { font-size: 15px; }
  .ufp-card__facts { gap: 8px 13px; }
  .ufp-card__bottom { margin-top: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .ufp-card, .ufp-card__image, .ufp-card__favorite { transition: none; }
}
`;

// ShowcaseSection is shared by other sections and normally uses 3 vertical columns.
// Override only the FEATURED PROPERTIES section to show full-width horizontal cards.
const SECTION_CSS = String.raw`
/*
 * Match the site's header + HeroSection horizontal gutters:
 * 1874px viewport => 102px on each side (1670px maximum content width).
 * Keep overrides inside #home-properties so other showcase sections are unchanged.
 */
#home-properties.unshow {
  --ufp-section-gutter: max(20px, 3.125vw, calc((100vw - 1670px) / 2));
  background: #f6f7f9;
  color: #102b43;
}
#home-properties.unshow .unshow__wrap {
  box-sizing: border-box;
  width: calc(100% - 2 * var(--ufp-section-gutter));
  max-width: none;
  margin-inline: auto;
  padding-inline: 0;
}
#home-properties.unshow .unshow__grid {
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}
/* Override accents from the shared ShowcaseSection, only for this section. */
#home-properties.unshow :is(.unshow__eyebrow, .unshow__kicker, .unshow__overline) {
  color: #0b688b;
}
#home-properties.unshow :is(.unshow__title, .unshow__heading) {
  color: #102b43;
}
#home-properties.unshow :is(.unshow__action, .unshow__more, .unshow__link) {
  color: #0b688b;
}
#home-properties.unshow :is(.unshow__action, .unshow__more, .unshow__link):hover {
  color: #102b43;
}
#home-properties.unshow :is(.unshow__action, .unshow__more, .unshow__link):focus-visible {
  outline: 3px solid #0b688b;
  outline-offset: 3px;
}
@media (max-width: 640px) {
  #home-properties.unshow { --ufp-section-gutter: 20px; }
}
@media (max-width: 390px) {
  #home-properties.unshow { --ufp-section-gutter: 16px; }
}
`;

type Listing = Record<string, any>;

function text(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

function isTrue(value: unknown): boolean {
  return value === true || value === 1 ||
    (typeof value === 'string' && /^(yes|true|1|registered|verified|approved)$/i.test(value.trim()));
}

function formatPrice(value: unknown): string {
  if (value == null || value === '') return 'Contact for price';
  const stringValue = text(value);
  const numeric = typeof value === 'number' ? value : /^\d+(\.\d+)?$/.test(stringValue) ? Number(stringValue) : NaN;
  if (!Number.isFinite(numeric)) return stringValue;
  if (numeric >= 10_000_000) return `₹${(numeric / 10_000_000).toFixed(2)} Cr`;
  if (numeric >= 100_000) return `₹${(numeric / 100_000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return `₹${numeric.toLocaleString('en-IN')}`;
}

function formatArea(value: unknown): string {
  const area = text(value);
  return /^\d[\d,.]*$/.test(area) ? `${Number(area.replace(/,/g, '')).toLocaleString('en-IN')} sq ft` : area;
}

function formatAppreciation(value: unknown): string {
  const appreciation = text(value);
  if (!appreciation) return '';
  if (/appreciation/i.test(appreciation)) return appreciation;
  if (/^\d+(\.\d+)?%?$/.test(appreciation)) return `${appreciation.replace(/%$/, '')}% p.a. appreciation`;
  return `${appreciation} appreciation`;
}

function getPhotoCount(x: Listing): number {
  if (Array.isArray(x.media)) {
    const count = x.media.filter((item: any) => {
      const type = text(item?.media_type ?? item?.type).toLowerCase();
      return !type || type === 'image' || type === 'photo';
    }).length;
    if (count) return count;
  }
  if (Array.isArray(x.images) && x.images.length) return x.images.length;
  return x.image_url ? 1 : 0;
}

function getImage(x: Listing, fallback?: string): string | undefined {
  if (x.image_url) return mediaUrl(x.image_url);
  const item = Array.isArray(x.media)
    ? x.media.find((m: any) => !['video', 'youtube'].includes(text(m?.media_type ?? m?.type).toLowerCase()))
    : undefined;
  const path = typeof item === 'string' ? item : item?.image_url ?? item?.url ?? item?.file_url;
  return path ? mediaUrl(path) : fallback;
}

function readFavorites(): string[] {
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

/** Can still be imported from pages/Home as before. */
export function PropertyCard({ x, fallbackImage }: { x: Listing; fallbackImage?: string }) {
  const id = text(x.id);
  const href = `/properties/${encodeURIComponent(id)}`;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const refresh = () => setFavorite(Boolean(id) && readFavorites().includes(id));
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [id]);

  function toggleFavorite() {
    if (!id) return;
    const current = readFavorites();
    const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    try { window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); }
    catch { /* Favorite still works on this page if browser storage is unavailable. */ }
    setFavorite(next.includes(id));
  }

  const premium = isTrue(x.premium) || isTrue(x.is_premium);
  const featured = isTrue(x.featured);
  const badge = premium ? 'PREMIUM' : featured ? 'FEATURED' : text(x.purpose || 'PROPERTY').toUpperCase();
  const bedrooms = x.bedrooms ?? x.beds;
  const bathrooms = x.bathrooms ?? x.baths;
  const bedroomLabel = bedrooms ? (/bhk/i.test(String(bedrooms)) ? text(bedrooms) : `${bedrooms} BHK`) : '';
  const area = formatArea(x.area ?? x.built_up_area ?? x.super_builtup_area);
  const location = [...new Set([x.location, x.city, x.pincode].map(text).filter(Boolean))].join(' · ');
  const appreciation = formatAppreciation(x.appreciation_rate ?? x.annual_appreciation ?? x.appreciation);
  const reraRegistered = isTrue(x.rera_registered) || isTrue(x.is_rera_registered) || isTrue(x.rera_approved) || isTrue(x.rera_status);
  const reraNumber = text(x.rera_number ?? x.rera_id);
  const verified = isTrue(x.verified);
  const negotiable = isTrue(x.negotiable) || isTrue(x.is_negotiable) || isTrue(x.price_negotiable);
  const photoCount = getPhotoCount(x);

  return <article className="ufp-card">
    <style>{PROPERTY_CSS}</style>
    <div className="ufp-card__visual">
      <Link className="ufp-card__image-link" to={href} aria-label={`View ${text(x.title) || 'property'}`}>
        <img className="ufp-card__image" src={getImage(x, fallbackImage)} alt={text(x.title) || 'Property image'} loading="lazy" decoding="async" />
      </Link>
      <span className={`ufp-card__tag ${premium || featured ? '' : 'ufp-card__tag--standard'}`}>{badge}</span>
      <button
        className="ufp-card__favorite"
        type="button"
        aria-label={favorite ? 'Remove property from saved' : 'Save property'}
        title={favorite ? 'Remove from saved' : 'Save property'}
        aria-pressed={favorite}
        onClick={toggleFavorite}
      >
        <Heart size={18} strokeWidth={1.9} fill={favorite ? 'currentColor' : 'none'} />
      </button>
      {photoCount > 0 && <span className="ufp-card__photo-count"><Camera size={13} />{photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>}
    </div>

    <div className="ufp-card__info">
      <div className="ufp-card__top">
        <div>
          <span className="ufp-card__price">{formatPrice(x.price)}</span>
          {x.price_per_sqft && <span className="ufp-card__rate">{text(x.price_per_sqft)}</span>}
        </div>
        {negotiable && <span className="ufp-card__negotiable">Negotiable</span>}
      </div>

      <Link className="ufp-card__title" to={href}>{text(x.title) || 'Property listing'}</Link>
      {location && <div className="ufp-card__location"><MapPin size={14} aria-hidden="true" /><span>{location}</span></div>}

      {(bedroomLabel || bathrooms || area) && <div className="ufp-card__facts">
        {bedroomLabel && <span className="ufp-card__fact"><BedDouble size={15} aria-hidden="true" />{bedroomLabel}</span>}
        {bathrooms && <span className="ufp-card__fact"><Bath size={15} aria-hidden="true" />{bathrooms} bath</span>}
        {area && <span className="ufp-card__fact"><Maximize size={15} aria-hidden="true" />{area}</span>}
      </div>}

      {appreciation && <div className="ufp-card__appreciation"><TrendingUp size={14} aria-hidden="true" />{appreciation}</div>}
      {x.description && <p className="ufp-card__description">{text(x.description)}</p>}
      {x.additional_fields && <div className="ufp-card__extras"><ListingExtraDetails fields={x.additional_fields} card /></div>}

      <div className="ufp-card__bottom">
        <div className="ufp-card__bottom-left">
          {(reraRegistered || reraNumber) && <span className="ufp-card__verified"><ShieldCheck size={15} aria-hidden="true" />{reraRegistered ? 'RERA registered' : `RERA: ${reraNumber}`}</span>}
          {verified && !reraRegistered && !reraNumber && <span className="ufp-card__verified"><ShieldCheck size={15} aria-hidden="true" />Verified listing</span>}
        </div>
        <span className="ufp-card__category">{text(x.property_type) || <><ArrowRight size={14} aria-hidden="true" /> Details</>}</span>
      </div>
    </div>
  </article>;
}

export default function FeaturedPropertiesSection({ properties = [] }: { properties?: Listing[] }) {
  const featured = (Array.isArray(properties) ? properties : [])
    .filter((item) => item && isTrue(item.featured))
    .slice(0, 6);

  return <>
    <style>{SECTION_CSS}</style>
    <ShowcaseSection
      id="home-properties"
      eyebrow="FEATURED LISTINGS"
      title="Properties that match real life"
      tone="soft"
      to="/properties"
      actionLabel="View all properties"
      empty={!featured.length}
      emptyText="View all properties to discover currently available listings."
    >
      {featured.map((item, index) => <PropertyCard
        key={item.id ?? index}
        x={item}
        fallbackImage={fallbackImages[index % fallbackImages.length]}
      />)}
    </ShowcaseSection>
  </>;
}
