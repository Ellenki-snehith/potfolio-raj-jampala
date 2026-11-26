import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Camera,
  Heart,
  MapPin,
  Maximize,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  X,
} from 'lucide-react';
import { useSite } from '../main';
import { mediaUrl } from '../api';
import fallbackPropertyImage from '../assets/p1.jpg';

/**
 * Properties listing page – all styles are embedded in this TSX file.
 * Replace src/pages/Properties.tsx with this file. No other files are required.
 *
 * Reads the SAME records as the existing page from useSite().properties.
 * Accepts the HeroSection URL parameters: location, property_type, purpose.
 * Extra badges such as RERA/appreciation are shown ONLY when present in data.
 */

const CSS = String.raw`
/* Matches HeroSection, BlueprintSection and FeaturedPropertiesSection */
.up-listings {
  --up-navy: #102b43;
  --up-blue: #0b688b;
  --up-ink: #142b3a;
  --up-muted: #677786;
  --up-border: #e0e6ec;
  --up-bg: #f6f7f9;
  /* Use exactly the same responsive side gutter as the homepage sections. */
  --up-page-gutter: max(20px, 3.125%, calc(50% - 835px));
  color: var(--up-ink);
  background: #fff;
  min-height: 100vh;
  font-family: inherit;
}
.up-listings, .up-listings * { box-sizing: border-box; }
.up-listings button, .up-listings input, .up-listings select { font: inherit; }
.up-listings button { cursor: pointer; }
.up-listings a { text-decoration: none; }

/* Full-width content layout: no conflicting 1360px/560px max-width caps. */
.up-listings__container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--up-page-gutter);
}
.up-listings__hero {
  background: linear-gradient(115deg, #f4f5f7 0%, #fff 78%);
  border-bottom: 1px solid var(--up-border);
  padding: 54px 0 37px;
}
.up-listings__eyebrow {
  display: block;
  color: var(--up-blue);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .19em;
}
.up-listings__hero h1 {
  color: var(--up-navy);
  font-size: clamp(29px, 3.5vw, 43px);
  line-height: 1.12;
  letter-spacing: -.035em;
  margin: 12px 0 10px;
  font-weight: 850;
}
.up-listings__hero p { margin: 0; color: var(--up-muted); font-size: 15px; line-height: 1.6; }
.up-listings__body { padding: 30px 0 72px; }
.up-listings__toolbar { display: flex; gap: 12px; flex-wrap: wrap; align-items: stretch; margin-bottom: 32px; }
.up-listings__search {
  display: flex; align-items: center; gap: 11px;
  flex: 1 1 300px; min-width: 0;
  border: 1px solid var(--up-border); border-radius: 12px;
  padding: 0 15px; min-height: 49px;
  background: #fff; color: var(--up-blue);
  transition: border-color .2s, box-shadow .2s;
}
.up-listings__search:focus-within,
.up-listings__select-wrap:focus-within {
  border-color: var(--up-blue);
  box-shadow: 0 0 0 3px rgba(11,104,139,.10);
}
.up-listings__search input {
  flex: 1; min-width: 0; height: 47px; border: 0; outline: 0;
  background: transparent; color: var(--up-ink); font-size: 14px;
}
.up-listings__search input::placeholder { color: #8994a3; }
.up-listings__clear {
  display: grid; place-items: center; border: 0;
  color: var(--up-muted); background: transparent; padding: 4px;
}
.up-listings__clear:hover { color: var(--up-navy); }
.up-listings__select-wrap {
  display: flex; align-items: center; gap: 9px; min-height: 49px;
  border: 1px solid var(--up-border); border-radius: 12px;
  background: #fff; padding: 0 13px; color: var(--up-blue);
  transition: border-color .2s, box-shadow .2s;
}
.up-listings__select-wrap select {
  border: 0; background: #fff; color: var(--up-navy);
  padding: 12px 12px 12px 0; outline: 0;
  max-width: 190px; font-size: 14px;
}
.up-listings__heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 19px; }
.up-listings__heading h2 {
  margin: 6px 0 0; color: var(--up-navy);
  font-size: clamp(23px, 2.5vw, 29px);
  letter-spacing: -.035em; line-height: 1.2; font-weight: 800;
}
.up-listings__count { color: var(--up-muted); font-size: 13px; white-space: nowrap; padding-bottom: 4px; }
.up-listings__items { display: grid; gap: 16px; }

/* Property cards: retain original layout and behavior, update only theme. */
.up-card {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  min-height: 224px;
  border-radius: 17px;
  background: #fff;
  border: 1px solid var(--up-border);
  overflow: hidden;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}
.up-card:hover {
  border-color: rgba(11,104,139,.38);
  box-shadow: 0 12px 32px rgba(16,43,67,.09);
  transform: translateY(-2px);
}
.up-card__visual { position: relative; min-width: 0; min-height: 224px; background: #e7eaee; }
.up-card__image-link { display: block; position: absolute; inset: 0; overflow: hidden; }
.up-card__image { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .45s ease; }
.up-card:hover .up-card__image { transform: scale(1.045); }
.up-card__tag {
  position: absolute; left: 12px; top: 12px;
  padding: 6px 13px; border-radius: 999px;
  font-size: 10px; font-weight: 800; letter-spacing: .02em;
  background: var(--up-blue); color: #fff;
  box-shadow: 0 2px 7px rgba(0,0,0,.16);
  pointer-events: none;
}
.up-card__tag--standard { background: var(--up-navy); }
.up-card__favorite {
  position: absolute; top: 12px; right: 12px;
  display: grid; place-items: center;
  height: 37px; width: 37px; border-radius: 50%;
  background: rgba(255,255,255,.96); color: #7b8896;
  border: 1px solid rgba(224,232,240,.7);
  box-shadow: 0 3px 9px rgba(0,0,0,.13);
  transition: transform .2s, color .2s;
}
.up-card__favorite:hover { transform: scale(1.08); color: var(--up-blue); }
/* Red is retained only as a meaningful saved/favorite state. */
.up-card__favorite[aria-pressed="true"] { color: #d43d59; }
.up-card__photo-count {
  position: absolute; bottom: 12px; left: 12px;
  display: inline-flex; align-items: center; gap: 6px;
  border-radius: 6px; padding: 6px 9px;
  color: #fff; background: rgba(16,43,67,.82);
  font-size: 11px; font-weight: 650; pointer-events: none;
}
.up-card__info {
  display: flex; flex-direction: column;
  min-width: 0; padding: 16px 17px 13px 17px;
}
.up-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.up-card__price { display: block; color: var(--up-blue); font-size: 21px; font-weight: 850; line-height: 1.3; letter-spacing: -.025em; }
.up-card__rate { display: block; color: #818894; font-size: 12px; margin-top: 1px; }
.up-card__negotiable { color: var(--up-blue); font-size: 11px; font-weight: 700; margin-top: 5px; white-space: nowrap; }
.up-card__title { display: inline-block; margin: 7px 0 5px; font-size: 16px; font-weight: 800; line-height: 1.35; color: var(--up-navy); }
.up-card__title:hover { color: var(--up-blue); }
.up-card__location { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--up-muted); line-height: 1.45; }
.up-card__location svg { flex: none; color: var(--up-blue); }
.up-card__facts { display: flex; flex-wrap: wrap; column-gap: 19px; row-gap: 8px; align-items: center; margin-top: 11px; }
.up-card__fact { display: inline-flex; align-items: center; gap: 7px; color: #374151; font-size: 12.5px; white-space: nowrap; }
.up-card__fact svg { color: #727e89; }
.up-card__appreciation { display: flex; align-items: center; gap: 6px; color: var(--up-blue); font-size: 12px; font-weight: 650; margin-top: 10px; }
.up-card__description {
  margin: 9px 0 0; color: var(--up-muted); font-size: 12.5px; line-height: 1.45;
  overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;
}
.up-card__bottom {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  border-top: 1px solid #e9eaed; margin-top: auto; padding-top: 11px;
  min-height: 32px;
}
.up-card__bottom-left { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 14px; min-width: 0; }
.up-card__verified { color: var(--up-blue); font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
.up-card__category { color: var(--up-muted); font-size: 12px; margin-left: auto; text-align: right; }
.up-card__empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; text-align: center; min-height: 250px;
  border: 1px dashed #cbd5dd; border-radius: 16px; background: var(--up-bg);
  padding: 35px 16px;
}
.up-card__empty svg { color: var(--up-blue); }
.up-card__empty h3 { margin: 4px 0 0; color: var(--up-navy); font-size: 18px; }
.up-card__empty p { margin: 0; color: var(--up-muted); font-size: 14px; }
.up-card__reset {
  display: flex; align-items: center; gap: 6px; margin-top: 10px;
  border: 0; border-radius: 9px; padding: 10px 15px;
  color: #fff; background: var(--up-blue); font-weight: 750;
}
.up-card__reset:hover { background: var(--up-navy); }
.up-listings a:focus-visible,
.up-listings button:focus-visible,
.up-listings select:focus-visible { outline: 3px solid var(--up-blue); outline-offset: 3px; }

@media (max-width: 850px) {
  .up-card { grid-template-columns: 260px minmax(0,1fr); }
  .up-card__visual { min-height: 250px; }
  .up-card__facts { column-gap: 12px; }
}
@media (max-width: 640px) {
  .up-listings__hero { padding: 36px 0 30px; }
  .up-listings__body { padding: 22px 0 45px; }
  .up-listings__toolbar { gap: 10px; margin-bottom: 24px; }
  .up-listings__search { flex-basis: 100%; }
  .up-listings__select-wrap { flex: 1; min-width: 0; }
  .up-listings__select-wrap select { width: 100%; max-width: none; min-width: 0; }
  .up-listings__heading { align-items: center; flex-wrap: wrap; gap: 8px 20px; }
  .up-listings__count { font-size: 12px; white-space: normal; }
  .up-card { grid-template-columns: 1fr; border-radius: 15px; }
  .up-card__visual { height: 205px; min-height: 0; }
  .up-card__info { padding: 15px; }
  .up-card__title { margin-top: 7px; font-size: 15px; }
  .up-card__price { font-size: 20px; }
  .up-card__facts { gap: 8px 13px; }
  .up-card__bottom { margin-top: 14px; }
}
@media (max-width: 480px) {
  .up-listings { --up-page-gutter: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .up-card, .up-card__image, .up-card__favorite,
  .up-listings__search, .up-listings__select-wrap { transition: none; }
}
`;

type Listing = Record<string, any>;
const FAVORITES_KEY = 'urbannest:favorite-properties';

function truthy(value: unknown): boolean {
  return value === true || value === 1 ||
    (typeof value === 'string' && /^(yes|true|1|registered|verified|approved)$/i.test(value.trim()));
}

function asText(value: unknown): string {
  return value === null || value === undefined ? '' : String(value).trim();
}

function displayPrice(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Contact for price';
  const str = asText(value);
  const numeric = typeof value === 'number' ? value : /^\d+(\.\d+)?$/.test(str) ? Number(str) : NaN;
  if (!Number.isFinite(numeric)) return str;
  if (numeric >= 10_000_000) return `₹${(numeric / 10_000_000).toFixed(2)} Cr`;
  if (numeric >= 100_000) return `₹${(numeric / 100_000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return `₹${numeric.toLocaleString('en-IN')}`;
}

function displayArea(raw: unknown): string {
  const area = asText(raw);
  if (!area) return '';
  if (/^\d[\d,.]*$/.test(area)) return `${Number(area.replaceAll(',', '')).toLocaleString('en-IN')} sq ft`;
  return area;
}

function displayAppreciation(raw: unknown): string {
  const value = asText(raw);
  if (!value) return '';
  if (/appreciation/i.test(value)) return value;
  if (/^\d+(\.\d+)?%?$/.test(value)) return `${value.replace(/%$/, '')}% p.a. appreciation`;
  return `${value} appreciation`;
}

function getPhotoCount(x: Listing): number {
  if (Array.isArray(x.media)) {
    const photos = x.media.filter((m: any) => {
      const type = asText(m?.media_type ?? m?.type).toLowerCase();
      return !type || type === 'image' || type === 'photo';
    }).length;
    if (photos) return photos;
  }
  if (Array.isArray(x.images) && x.images.length) return x.images.length;
  return x.image_url ? 1 : 0;
}

function getImage(x: Listing): string {
  if (x.image_url) return mediaUrl(x.image_url);
  const firstPhoto = Array.isArray(x.media)
    ? x.media.find((m: any) => !['video', 'youtube'].includes(asText(m?.media_type ?? m?.type).toLowerCase()))
    : undefined;
  const path = typeof firstPhoto === 'string' ? firstPhoto : firstPhoto?.image_url ?? firstPhoto?.url ?? firstPhoto?.file_url;
  return path ? mediaUrl(path) : fallbackPropertyImage;
}

function initialFilters(search: string) {
  const params = new URLSearchParams(search);
  const incoming = asText(params.get('purpose'));
  const purpose = /^(buy|sale|sell|for sale)$/i.test(incoming)
    ? 'Sale'
    : /^(rent|rental|for rent)$/i.test(incoming)
      ? 'Rent'
      : /^lease$/i.test(incoming)
        ? 'Lease'
        : 'All';
  return {
    query: params.get('location') || params.get('q') || params.get('query') || '',
    purpose,
    propertyType: params.get('property_type') || 'All',
  };
}

function HorizontalPropertyCard({
  listing: x,
  favorite,
  onToggleFavorite,
}: {
  listing: Listing;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  const href = `/properties/${encodeURIComponent(asText(x.id))}`;
  const photoCount = getPhotoCount(x);
  const bedrooms = x.bedrooms ?? x.beds;
  const bathrooms = x.bathrooms ?? x.baths;
  const area = displayArea(x.area ?? x.built_up_area ?? x.super_builtup_area);
  const appreciation = displayAppreciation(x.appreciation_rate ?? x.annual_appreciation ?? x.appreciation);
  const reraRegistered = truthy(x.rera_registered) || truthy(x.is_rera_registered) || truthy(x.rera_approved) || truthy(x.rera_status);
  const reraNumber = asText(x.rera_number ?? x.rera_id);
  const isNegotiable = truthy(x.negotiable) || truthy(x.is_negotiable) || truthy(x.price_negotiable);
  const premium = truthy(x.premium) || truthy(x.is_premium);
  const badge = premium ? 'PREMIUM' : truthy(x.featured) ? 'FEATURED' : asText(x.purpose || 'PROPERTY').toUpperCase();
  const location = [x.location, x.city, x.pincode].filter((part, index, values) => part && (index === 0 || String(part) !== String(values[0]))).map(asText).join(' · ');
  const bedroomLabel = bedrooms ? (/bhk/i.test(String(bedrooms)) ? asText(bedrooms) : `${bedrooms} BHK`) : '';

  return <article className="up-card">
    <div className="up-card__visual">
      <Link to={href} className="up-card__image-link" aria-label={`View ${x.title || 'property'}`}>
        <img className="up-card__image" src={getImage(x)} alt={asText(x.title) || 'Property image'} loading="lazy" />
      </Link>
      <span className={`up-card__tag ${premium || truthy(x.featured) ? '' : 'up-card__tag--standard'}`}>{badge}</span>
      <button
        type="button"
        className="up-card__favorite"
        aria-label={favorite ? 'Remove property from saved' : 'Save property'}
        aria-pressed={favorite}
        title={favorite ? 'Remove from saved' : 'Save property'}
        onClick={onToggleFavorite}
      >
        <Heart size={18} fill={favorite ? 'currentColor' : 'none'} strokeWidth={1.9} />
      </button>
      {photoCount > 0 && <span className="up-card__photo-count"><Camera size={13} />{photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>}
    </div>

    <div className="up-card__info">
      <div className="up-card__top">
        <div>
          <span className="up-card__price">{displayPrice(x.price)}</span>
          {x.price_per_sqft && <span className="up-card__rate">{asText(x.price_per_sqft)}</span>}
        </div>
        {isNegotiable && <span className="up-card__negotiable">Negotiable</span>}
      </div>

      <Link to={href} className="up-card__title">{asText(x.title) || 'Property listing'}</Link>
      {location && <div className="up-card__location"><MapPin size={14} aria-hidden="true" /><span>{location}</span></div>}

      {(bedroomLabel || bathrooms || area) && <div className="up-card__facts">
        {bedroomLabel && <span className="up-card__fact"><BedDouble size={15} />{bedroomLabel}</span>}
        {bathrooms && <span className="up-card__fact"><Bath size={15} />{bathrooms} {String(bathrooms) === '1' ? 'bath' : 'bath'}</span>}
        {area && <span className="up-card__fact"><Maximize size={15} />{area}</span>}
      </div>}
      {appreciation && <div className="up-card__appreciation"><TrendingUp size={14} />{appreciation}</div>}
      {x.description && <p className="up-card__description">{x.description}</p>}

      <div className="up-card__bottom">
        <div className="up-card__bottom-left">
          {(reraRegistered || reraNumber) && <span className="up-card__verified"><ShieldCheck size={15} />{reraRegistered ? 'RERA registered' : `RERA: ${reraNumber}`}</span>}
          {truthy(x.verified) && !reraRegistered && !reraNumber && <span className="up-card__verified"><ShieldCheck size={15} />Verified listing</span>}
        </div>
        <span className="up-card__category">{asText(x.property_type) || <><ArrowRight size={14} aria-hidden="true" /> Details</>}</span>
      </div>
    </div>
  </article>;
}

export function Properties() {
  const site = useSite();
  const properties: Listing[] = Array.isArray(site?.properties) ? site.properties : [];
  const location = useLocation();
  const [query, setQuery] = useState(() => initialFilters(location.search).query);
  const [purpose, setPurpose] = useState(() => initialFilters(location.search).purpose);
  const [propertyType, setPropertyType] = useState(() => initialFilters(location.search).propertyType);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Search buttons in the homepage hero navigate here with URL parameters.
  useEffect(() => {
    const filters = initialFilters(location.search);
    setQuery(filters.query);
    setPurpose(filters.purpose);
    setPropertyType(filters.propertyType);
  }, [location.search]);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
      if (Array.isArray(saved)) setFavorites(saved.map(String));
    } catch { /* Browsers with storage disabled still support in-page favorites. */ }
  }, []);

  const types = useMemo(() => {
    const values = properties.map(x => asText(x.property_type)).filter(Boolean);
    const unique = [...new Set(values)];
    if (propertyType !== 'All' && !unique.some(t => t.toLowerCase() === propertyType.toLowerCase())) unique.unshift(propertyType);
    return unique;
  }, [properties, propertyType]);

  const items = useMemo(() => properties.filter(x => {
    const q = query.toLowerCase().trim();
    const haystack = [x.title, x.location, x.city, x.pincode, x.property_type, x.description].map(asText).join(' ').toLowerCase();
    const actualPurpose = asText(x.purpose).toLowerCase();
    const purposeMatches = purpose === 'All' ||
      (purpose === 'Sale' && /^(sale|sell|buy|for sale)$/.test(actualPurpose)) ||
      (purpose === 'Rent' && /^(rent|rental|for rent)$/.test(actualPurpose)) ||
      (purpose === 'Lease' && actualPurpose.includes('lease'));
    const typeMatches = propertyType === 'All' || asText(x.property_type).toLowerCase().includes(propertyType.toLowerCase());
    return purposeMatches && typeMatches && (!q || haystack.includes(q));
  }), [properties, purpose, propertyType, query]);

  const toggleFavorite = (id: string) => {
    setFavorites(previous => {
      const updated = previous.includes(id) ? previous.filter(v => v !== id) : [...previous, id];
      try { window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)); } catch { /* Ignore unavailable storage. */ }
      return updated;
    });
  };

  const resetFilters = () => { setQuery(''); setPurpose('All'); setPropertyType('All'); };

  return <main className="up-listings">
    <style>{CSS}</style>

    <section className="up-listings__hero">
      <div className="up-listings__container">
        <span className="up-listings__eyebrow">PROPERTY MARKETPLACE</span>
        <h1>Find your next property</h1>
        <p>Explore verified listings from your trusted local organization.</p>
      </div>
    </section>

    <section className="up-listings__body">
      <div className="up-listings__container">
        <div className="up-listings__toolbar" role="search" aria-label="Filter properties">
          <label className="up-listings__search">
            <Search size={18} aria-hidden="true" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by title, location or type" aria-label="Search properties" />
            {query && <button className="up-listings__clear" type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
          </label>
          <label className="up-listings__select-wrap">
            <SlidersHorizontal size={17} aria-hidden="true" />
            <select value={purpose} onChange={e => setPurpose(e.target.value)} aria-label="Filter by purpose">
              <option value="All">Buy / Rent / Lease</option>
              <option value="Sale">Buy</option>
              <option value="Rent">Rent</option>
              <option value="Lease">Lease</option>
            </select>
          </label>
          <label className="up-listings__select-wrap">
            <Building2 size={17} aria-hidden="true" />
            <select value={propertyType} onChange={e => setPropertyType(e.target.value)} aria-label="Filter by property type">
              <option value="All">All property types</option>
              {types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
        </div>

        <div className="up-listings__heading">
          <div>
            <span className="up-listings__eyebrow">{items.length} {items.length === 1 ? 'LISTING' : 'LISTINGS'}</span>
            <h2>Available properties</h2>
          </div>
          <span className="up-listings__count">Showing {items.length} of {properties.length} properties</span>
        </div>

        <div className="up-listings__items">
          {items.map((x, index) => <HorizontalPropertyCard
            key={x.id ?? index}
            listing={x}
            favorite={favorites.includes(String(x.id))}
            onToggleFavorite={() => toggleFavorite(String(x.id))}
          />)}
          {!items.length && <div className="up-card__empty">
            <Search size={31} aria-hidden="true" />
            <h3>No matching properties found</h3>
            <p>Try another location, property type or listing purpose.</p>
            <button type="button" className="up-card__reset" onClick={resetFilters}>Clear filters <ArrowRight size={16} /></button>
          </div>}
        </div>
      </div>
    </section>
  </main>;
}
