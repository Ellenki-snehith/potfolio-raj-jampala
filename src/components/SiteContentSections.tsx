import { MediaGalleryGrid } from './MediaGalleryGrid';
import { FieldImageContent } from './FieldImageContent';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../api';
import type { FieldGalleryItem } from '../admin/FieldImageEditor';

// All section styles live in this component. No external CSS file is required.
const CSS = String.raw`
/* Site-wide theme: navy, corporate blue, white and neutral gray. */
.site-builder-section,
.site-builder-section * { box-sizing: border-box; }

.site-builder-section {
  --sb-navy: #102b43;
  --sb-brand: #0b688b;
  --sb-ink: #142b3a;
  --sb-muted: #647385;
  --sb-border: #e3e9ee;
  /* Match the updated header/HeroSection/BlueprintSection gutters. */
  --sb-page-gutter: max(20px, 3.125%, calc(50% - 835px));
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  padding-block: clamp(52px, 5vw, 86px);
  background: #fff;
  color: var(--sb-ink);
  font-family: inherit;
}

.site-builder-section.site-builder-standard:nth-of-type(even) { background: #f6f7f9; }

.site-builder-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: clamp(24px, 4vw, 68px);
  width: 100%;
  max-width: none;
  margin-inline: auto;
  padding-inline: var(--sb-page-gutter);
}
.site-builder-has-image .site-builder-inner {
  grid-template-columns: minmax(0, .96fr) minmax(0, 1.04fr);
}
.site-builder-copy { min-width: 0; }
.site-builder-image { position: relative; min-width: 0; isolation: isolate; }
.site-builder-image > img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: clamp(280px, 32vw, 470px);
  object-fit: cover;
  border-radius: 19px;
  box-shadow: 0 22px 54px rgba(16, 43, 67, .16);
}
.site-builder-image::after {
  content: '';
  position: absolute;
  z-index: 0;
  inset: 17px -13px -13px 17px;
  border: 2px solid rgba(11, 104, 139, .27);
  border-radius: 21px;
  pointer-events: none;
}

/* Editorial headings and readable admin-managed content. */
.site-builder-category {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 7px 13px;
  border: 1px solid rgba(11, 104, 139, .18);
  border-radius: 999px;
  background: rgba(16, 43, 67, .055);
  color: var(--sb-navy);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .10em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
.site-builder-eyebrow {
  display: block;
  margin: 16px 0 0;
  color: var(--sb-brand);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .2em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
.site-builder-copy > h2 {
  max-width: 800px;
  margin: 13px 0 0;
  color: var(--sb-navy);
  font-size: clamp(30px, 3.45vw, 51px);
  font-weight: 850;
  letter-spacing: -.035em;
  line-height: 1.16;
  overflow-wrap: anywhere;
}
.site-builder-copy > .site-builder-body {
  max-width: 790px;
  margin: 18px 0 0;
  color: var(--sb-muted);
  font-size: clamp(14px, 1.1vw, 16px);
  line-height: 1.8;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

/* Custom fields are dynamic, retaining images, lists, yes/no values and galleries. */
.site-builder-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 26px;
}
.site-builder-field {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--sb-border);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 5px 20px rgba(16, 43, 67, .045);
  overflow-wrap: anywhere;
  transition: border-color .22s ease, transform .22s ease, box-shadow .22s ease;
}
.site-builder-field:hover {
  border-color: rgba(11, 104, 139, .4);
  box-shadow: 0 14px 32px rgba(16, 43, 67, .085);
  transform: translateY(-2px);
}
.site-builder-field h3 {
  margin: 0 0 8px;
  color: var(--sb-navy);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.45;
}
.site-builder-field p,
.site-builder-field li {
  margin: 0;
  color: var(--sb-muted);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.site-builder-field ul { display: grid; gap: 5px; margin: 0; padding-left: 17px; }
.site-builder-field img { max-width: 100%; height: auto; border-radius: 9px; }

/* CTA styles for internal and external URLs. */
.site-builder-gallery { min-width: 0; margin-top: 22px; }
.site-builder-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 100%;
  min-height: 48px;
  margin-top: 26px;
  padding: 12px 23px;
  border: 1px solid var(--sb-brand);
  border-radius: 10px;
  background: var(--sb-brand);
  color: #fff !important;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
  text-decoration: none !important;
  overflow-wrap: anywhere;
  box-shadow: 0 10px 24px rgba(16, 43, 67, .16);
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.site-builder-cta:hover {
  transform: translateY(-2px);
  background: var(--sb-navy);
  border-color: var(--sb-navy);
  box-shadow: 0 13px 30px rgba(16, 43, 67, .24);
}
.site-builder-cta:focus-visible {
  outline: 3px solid var(--sb-navy);
  outline-offset: 3px;
}

/* Alternate image/copy ordering. */
.site-builder-split { background: #f6f7f9; }
.site-builder-split.site-builder-has-image .site-builder-image { order: 2; }
.site-builder-split.site-builder-has-image .site-builder-copy { order: 1; }

/* Dark premium panel: deep navy, white typography, no teal or pale-blue accent. */
.site-builder-highlight {
  --sb-ink: #fff;
  --sb-muted: rgba(255, 255, 255, .82);
  --sb-border: rgba(16, 43, 67, .11);
  background: linear-gradient(117deg, #102b43 0%, #163c5c 58%, #0b354f 100%);
  color: #fff;
}
.site-builder-highlight::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, .04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .04) 1px, transparent 1px);
  background-size: 38px 38px;
  pointer-events: none;
}
.site-builder-highlight .site-builder-copy > h2 { color: #fff; }
.site-builder-highlight .site-builder-eyebrow { color: #fff; opacity: .85; }
.site-builder-highlight .site-builder-category {
  border-color: rgba(255, 255, 255, .3);
  background: rgba(255, 255, 255, .11);
  color: #fff;
}
.site-builder-highlight .site-builder-image::after { border-color: rgba(255, 255, 255, .35); }
.site-builder-highlight .site-builder-field { background: #fff; border-color: #e3e9ee; }
.site-builder-highlight .site-builder-field h3 { color: #102b43; }
.site-builder-highlight .site-builder-field p,
.site-builder-highlight .site-builder-field li { color: #647385; }
.site-builder-highlight .site-builder-cta {
  border-color: #fff;
  background: #fff;
  color: #102b43 !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .13);
}
.site-builder-highlight .site-builder-cta:hover {
  background: #eff1f4;
  border-color: #eff1f4;
  color: #102b43 !important;
}
.site-builder-highlight .site-builder-cta:focus-visible { outline-color: #fff; }

/* Spacious multi-column cards layout. */
.site-builder-cards { background: #f6f7f9; }
.site-builder-cards .site-builder-inner { align-items: start; }
.site-builder-cards:not(.site-builder-has-image) .site-builder-copy > h2,
.site-builder-cards:not(.site-builder-has-image) .site-builder-copy > .site-builder-body {
  max-width: 850px;
}
.site-builder-cards:not(.site-builder-has-image) .site-builder-fields {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.site-builder-cards .site-builder-field {
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 9px 26px rgba(16, 43, 67, .055);
}
.site-builder-cards .site-builder-field:hover {
  border-color: rgba(11, 104, 139, .45);
  box-shadow: 0 17px 38px rgba(16, 43, 67, .1);
}

@media (max-width: 960px) {
  .site-builder-inner { gap: 34px; }
  .site-builder-has-image .site-builder-inner { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .site-builder-fields { grid-template-columns: minmax(0, 1fr); }
  .site-builder-cards:not(.site-builder-has-image) .site-builder-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .site-builder-section { --sb-page-gutter: 16px; padding-block: 44px; }
  .site-builder-inner,
  .site-builder-has-image .site-builder-inner { grid-template-columns: minmax(0, 1fr); }
  .site-builder-inner { gap: 28px; }
  .site-builder-image > img { height: clamp(235px, 63vw, 370px); border-radius: 15px; }
  .site-builder-image::after { inset: 12px -8px -8px 12px; border-radius: 16px; }
  .site-builder-split.site-builder-has-image .site-builder-image,
  .site-builder-split.site-builder-has-image .site-builder-copy { order: initial; }
  .site-builder-copy > h2 { font-size: clamp(27px, 6vw, 36px); }
  .site-builder-fields,
  .site-builder-cards:not(.site-builder-has-image) .site-builder-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .site-builder-field,
  .site-builder-cards .site-builder-field { padding: 16px; }
}
@media (max-width: 440px) {
  .site-builder-fields,
  .site-builder-cards:not(.site-builder-has-image) .site-builder-fields {
    grid-template-columns: minmax(0, 1fr);
  }
  .site-builder-category { font-size: 10px; }
  .site-builder-cta { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .site-builder-section *,
  .site-builder-section *::before,
  .site-builder-section *::after { transition: none !important; animation: none !important; }
}
  /* ==========================================
   GLOBAL CREAM THEME FOR ADMIN ADDED SECTIONS
   ========================================== */

.site-builder-section {
  --sb-navy: #17243a;
  --sb-brand: #f58232;
  --sb-ink: #17243a;
  --sb-muted: #64748b;
  --sb-border: #eadfce;

  background: #fff5e8 !important;
  color: #17243a;
}

/* All normal section variants */
.site-builder-section.site-builder-standard,
.site-builder-section.site-builder-split,
.site-builder-section.site-builder-cards {
  background: #fff5e8 !important;
}

/* Remove the old alternating gray background */
.site-builder-section.site-builder-standard:nth-of-type(even) {
  background: #fff5e8 !important;
}

/* Main section content */
.site-builder-inner {
  color: #17243a;
}

/* Headings */
.site-builder-copy > h2 {
  color: #17243a !important;
}

/* Category labels */
.site-builder-category {
  background: rgba(245, 130, 50, 0.10) !important;
  border-color: rgba(245, 130, 50, 0.25) !important;
  color: #c96b22 !important;
}

/* Eyebrow text */
.site-builder-eyebrow {
  color: #f58232 !important;
}

/* Images */
.site-builder-image > img {
  box-shadow: 0 18px 45px rgba(23, 36, 58, 0.10);
}

.site-builder-image::after {
  border-color: rgba(245, 130, 50, 0.35) !important;
}

/* Admin-created field cards */
.site-builder-field {
  background: #ffffff !important;
  border-color: #eadfce !important;
  box-shadow: 0 5px 20px rgba(23, 36, 58, 0.04);
}

.site-builder-field h3 {
  color: #17243a !important;
}

.site-builder-field p,
.site-builder-field li {
  color: #64748b !important;
}

.site-builder-field:hover {
  border-color: #f58232 !important;
  box-shadow: 0 12px 28px rgba(23, 36, 58, 0.08);
}

/* CTA buttons */
.site-builder-cta {
  background: #f58232 !important;
  border-color: #f58232 !important;
  color: #ffffff !important;
}

.site-builder-cta:hover {
  background: #17243a !important;
  border-color: #17243a !important;
  color: #ffffff !important;
}

/* Cards layout */
.site-builder-cards .site-builder-field {
  background: #ffffff !important;
}

/* ==========================================
   SPECIAL HIGHLIGHT SECTION
   Navy background with saffron accent
   ========================================== */

.site-builder-highlight {
  background: linear-gradient(
    120deg,
    #17243a,
    #263b57
  ) !important;
}

.site-builder-highlight .site-builder-copy > h2 {
  color: #ffffff !important;
}

.site-builder-highlight .site-builder-eyebrow {
  color: #ffb366 !important;
}

.site-builder-highlight .site-builder-category {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
}

.site-builder-highlight .site-builder-field {
  background: #ffffff !important;
}

.site-builder-highlight .site-builder-cta {
  background: #f58232 !important;
  border-color: #f58232 !important;
  color: #ffffff !important;
}
 /* =========================================================
   FINAL SHARED WEBSITE ALIGNMENT
   Uses global style.css variables
========================================================= */

/* Full-width section backgrounds */

.site-builder-section {
  --sb-page-gutter: var(--site-page-gutter);

  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Shared centered content container */

.site-builder-inner {
  width: calc(
    100% -
    var(--sb-page-gutter) -
    var(--sb-page-gutter)
  );

  max-width: var(--site-content-width);

  margin-left: auto;
  margin-right: auto;

  padding-left: 0;
  padding-right: 0;

  box-sizing: border-box;
}

/* Keep all section content inside the container */

.site-builder-copy,
.site-builder-image,
.site-builder-fields,
.site-builder-gallery {
  min-width: 0;
  max-width: 100%;
}

/* Image and text layouts */

.site-builder-has-image .site-builder-inner {
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
}

/* Cards layout */

.site-builder-cards .site-builder-inner {
  align-items: start;
}

.site-builder-cards .site-builder-fields {
  width: 100%;
  max-width: 100%;
}

/* Highlight section */

.site-builder-highlight {
  width: 100%;
}

/* Tablet */

@media (max-width: 960px) {
  .site-builder-inner {
    width: calc(
      100% -
      var(--sb-page-gutter) -
      var(--sb-page-gutter)
    );
  }
}

/* Mobile */

@media (max-width: 700px) {
  .site-builder-section {
    --sb-page-gutter: var(--site-page-gutter);
    padding-block: 44px;
  }

  .site-builder-inner,
  .site-builder-has-image .site-builder-inner {
    width: calc(
      100% -
      var(--sb-page-gutter) -
      var(--sb-page-gutter)
    );

    grid-template-columns: minmax(0, 1fr);
  }
}

/* Small mobile */

@media (max-width: 440px) {
  .site-builder-inner {
    width: calc(
      100% -
      var(--sb-page-gutter) -
      var(--sb-page-gutter)
    );
  }
}
}
`;

export type PageCustomField = {
  id: string;
  name: string;
  type: 'text' | 'long_text' | 'number' | 'date' | 'yes_no' | 'list';
  value: string | string[];
  show: boolean;
  image_url?: string;
  image_align?: 'left' | 'right';
  gallery?: FieldGalleryItem[];
};

export type PageSection = {
  id: string;
  category: string;
  heading: string;
  eyebrow: string;
  body: string;
  image_url: string;
  button_label: string;
  button_url: string;
  layout: 'standard' | 'highlight' | 'split' | 'cards';
  published: boolean;
  fields: PageCustomField[];
  gallery?: FieldGalleryItem[];
};

export type PublishedPage = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  menu_label: string;
  published: boolean;
  show_in_nav: boolean;
  sections: PageSection[];
};

function safeLink(url: string): boolean {
  const value = (url || '').trim();
  return (value.startsWith('/') && !value.startsWith('//')) || value.startsWith('https://');
}

function hasFieldContent(field: PageCustomField): boolean {
  if (field.show === false) return false;
  const hasValue = Array.isArray(field.value)
    ? field.value.some((item) => String(item ?? '').trim().length > 0)
    : String(field.value ?? '').trim().length > 0;
  return Boolean(hasValue || field.image_url || field.gallery?.length);
}

export function SiteContentSections({ sections = [] }: { sections?: PageSection[] }) {
  const visibleSections = (Array.isArray(sections) ? sections : []).filter(
    (section) => section && section.published !== false
  );

  return <>
    <style>{CSS}</style>
    {visibleSections.map((section) => {
      const visibleFields = (Array.isArray(section.fields) ? section.fields : []).filter(hasFieldContent);
      const layout = ['standard', 'highlight', 'split', 'cards'].includes(section.layout)
        ? section.layout
        : 'standard';
      const buttonUrl = (section.button_url || '').trim();
      const showButton = Boolean(section.button_label && buttonUrl && safeLink(buttonUrl));
      const externalButton = buttonUrl.startsWith('https://');

      return (
        <section
          key={section.id}
          className={`site-builder-section site-builder-${layout}${section.image_url ? ' site-builder-has-image' : ''}`}
          aria-label={section.heading || section.category || 'Page content'}
        >
          <div className="site-builder-inner">
            {section.image_url && (
              <div className="site-builder-image">
                <img
                  src={mediaUrl(section.image_url)}
                  alt={section.heading || section.category || 'Page section image'}
                  loading="lazy"
                />
              </div>
            )}

            <div className="site-builder-copy">
              {section.category && <span className="site-builder-category">{section.category}</span>}
              {section.eyebrow && <span className="site-builder-eyebrow">{section.eyebrow}</span>}
              {section.heading && <h2>{section.heading}</h2>}
              {section.body && <p className="site-builder-body">{section.body}</p>}

              {visibleFields.length > 0 && (
                <div className="site-builder-fields">
                  {visibleFields.map((field) => (
                    <div className="site-builder-field" key={field.id}>
                      <FieldImageContent
                        imageUrl={field.image_url}
                        imageAlign={field.image_align}
                        gallery={field.gallery}
                        alt={field.name}
                      >
                        {field.name && <h3>{field.name}</h3>}
                        {field.type === 'yes_no' ? (
                          <p>
                            {String(field.value).toLowerCase() === 'true'
                              ? 'Yes'
                              : String(field.value).toLowerCase() === 'false'
                                ? 'No'
                                : String(field.value)}
                          </p>
                        ) : Array.isArray(field.value) ? (
                          <ul>{field.value.map((value, index) => <li key={index}>{value}</li>)}</ul>
                        ) : (
                          <p>{field.value}</p>
                        )}
                      </FieldImageContent>
                    </div>
                  ))}
                </div>
              )}

              {Array.isArray(section.gallery) && section.gallery.length > 0 && (
                <div className="site-builder-gallery">
                  <MediaGalleryGrid items={section.gallery} title={`${section.heading} — gallery`} />
                </div>
              )}

              {showButton && (externalButton ? (
                <a
                  className="site-builder-cta"
                  href={buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {section.button_label} <span aria-hidden="true">→</span>
                </a>
              ) : (
                <Link className="site-builder-cta" to={buttonUrl}>
                  {section.button_label} <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );
    })}
  </>;
}
