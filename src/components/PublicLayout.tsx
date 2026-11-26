// import { useState } from "react";
// import { NavLink, Outlet, useLocation } from "react-router-dom";
// import { Building2, Mail, Menu, Phone, X } from "lucide-react";
// import { useSite } from "../main";
// import { FoundationHomeHighlights } from "./FoundationHomeHighlights";

// // Foundation pages share the main navigation and its blue theme.
// // The API supplies only active, published, main-menu-enabled Foundation pages.
// export function PublicLayout() {
//   const {
//     organization: o,
//     custom_page_types: customTypes = [],
//     page_content: p = {},
//     foundation_navigation: foundationPages = [],
//   } = useSite();
//   const [open, setOpen] = useState(false);
//   const location = useLocation();
//   const f = o.features || {};
//   const visible = (slug: "home" | "about" | "contact" | "gallery") =>
//     p.page_visibility?.[slug] !== false;
//   const isFoundation = location.pathname.startsWith("/foundation");
//   const onCivil = [
//     "/civil-works",
//     "/interior-designs",
//     "/lift-designs",
//     "/services/",
//   ].some((path) => location.pathname.startsWith(path));
//   const services = [
//     f.properties && "Real estate",
//     f.civil_services && "Civil works",
//     f.construction_works && "Construction works",
//     f.interior_designs && "Interior design",
//     f.lift_designs && "Lift design",
//     f.home_services && "Property services",
//     f.foundation && "Charity & Foundation",
//   ]
//     .filter(Boolean)
//     .join(" · ");
//   return (
//     <>
//       <div className="top">
//         <span>{services || "Professional property solutions"}</span>
//         {onCivil || isFoundation ? (
//           <span>Explore our work · Send an inquiry</span>
//         ) : (
//           <span>
//             <Phone /> {o.phone} <Mail /> {o.email}
//           </span>
//         )}
//       </div>
//       <header className="org-public-header">
//         <NavLink className="brand" to="/">
//           <Building2 />
//           <b>
//             {o.name}
//             <small>{o.tagline}</small>
//           </b>
//         </NavLink>
//         <button
//           type="button"
//           className="menu"
//           aria-label="Toggle navigation"
//           aria-expanded={open}
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <X /> : <Menu />}
//         </button>
//         <nav
//           className={`org-primary-nav ${open ? "open" : ""}`}
//           aria-label="Main website navigation"
//           onClick={(event) => {
//             if ((event.target as HTMLElement).closest("a")) setOpen(false);
//           }}
//         >
//           {visible("home") && <NavLink to="/">Home</NavLink>}
//           {f.properties && <NavLink to="/properties">Properties</NavLink>}
//           {f.civil_services && <NavLink to="/civil-works">Civil Works</NavLink>}
//           {f.construction_works && (
//             <NavLink to="/construction-works">Construction Works</NavLink>
//           )}
//           {f.interior_designs && (
//             <NavLink to="/interior-designs">Interior Design</NavLink>
//           )}
//           {f.lift_designs && <NavLink to="/lift-designs">Lift Design</NavLink>}
//           {f.custom_pages &&
//             customTypes.map((page: any) => (
//               <NavLink key={page.id} to={`/services/${page.slug}`}>
//                 {page.name}
//               </NavLink>
//             ))}
//           {f.custom_content_pages &&
//             (p.custom_content_pages || [])
//               .filter((page: any) => page.published && page.show_in_nav)
//               .map((page: any) => (
//                 <NavLink key={page.id} to={`/pages/${page.slug}`}>
//                   {page.menu_label || page.title}
//                 </NavLink>
//               ))}
//           {f.foundation &&
//             (foundationPages as any[])
//               .filter(
//                 (page) => !["home", "about-us", "contact"].includes(page.slug),
//               )
//               .map((page) => (
//                 <NavLink
//                   key={`foundation-${page.slug}`}
//                   to={`/foundation/${page.slug}`}
//                   className="org-foundation-link"
//                 >
//                   {page.title}
//                 </NavLink>
//               ))}
//           {f.gallery && visible("gallery") && (
//             <NavLink to="/gallery">Gallery</NavLink>
//           )}
//           {f.about && visible("about") && <NavLink to="/about">About</NavLink>}
//           {f.contact && visible("contact") && (
//             <NavLink className="nav-cta" to="/contact">
//               Contact
//             </NavLink>
//           )}
//         </nav>
//       </header>
//       <main>
//         <Outlet />
//         {f.foundation && location.pathname === "/" && visible("home") && (
//           <FoundationHomeHighlights />
//         )}
//       </main>
//       <footer>
//         <div className="brand">
//           <Building2 />
//           <b>
//             {o.name}
//             <small>{o.tagline}</small>
//           </b>
//         </div>
//         <p>
//           {o.address}, {o.city}, {o.state}
//         </p>
//         <a href="/login">Admin login</a>
//       </footer>
//     </>
//   );
// }




// import { useState } from "react";
// import { NavLink, Outlet, useLocation } from "react-router-dom";
// import { Mail, Menu, MapPin, Phone, X } from "lucide-react";
// import { useSite } from "../main";
// import { FoundationHomeHighlights } from "./FoundationHomeHighlights";
// import bjpLogo from "../assets/bjp-logo.svg";
// import "./PublicLayout.css";

// export function PublicLayout() {
//   const {
//     organization: o,
//     custom_page_types: customTypes = [],
//     page_content: p = {},
//     foundation_navigation: foundationPages = [],
//   } = useSite();

//   const [open, setOpen] = useState(false);
//   const location = useLocation();

//   const f = o.features || {};

//   const visible = (slug: "home" | "about" | "contact" | "gallery") =>
//     p.page_visibility?.[slug] !== false;

//   const isFoundation = location.pathname.startsWith("/foundation");

//   const onCivil = [
//     "/civil-works",
//     "/interior-designs",
//     "/lift-designs",
//     "/services/",
//   ].some((path) => location.pathname.startsWith(path));

//   return (
//     <>
//       {/* ================= TOP BAR ================= */}
    
//       <div className="">
//         {/* Tricolor top border */}
//         <div className="top-tricolor">
//           <span className="top-saffron"></span>
//           <span className="top-white"></span>
//           <span className="top-green"></span>
//         </div>

//         <div className="top-content">
//           <span className="top-message">
          
//           </span>

//           {onCivil || isFoundation ? (
//             <span className="top-right-message">
              
//             </span>
//           ) : (
//             <div className="top-contact">
//               {o.phone && (
//                 <a href={`tel:${o.phone.replace(/\s/g, "")}`}>
//                   <Phone size={14} />
//                   <span>{o.phone}</span>
//                 </a>
//               )}

//               {o.email && (
//                 <a href={`mailto:${o.email}`}>
//                   <Mail size={14} />
//                   <span>{o.email}</span>
//                 </a>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ================= HEADER / NAVBAR ================= */}
//       <header className="org-public-header">
//         {/* BRAND */}
//         <NavLink
//           className="brand"
//           to="/"
//           onClick={() => setOpen(false)}
//         >
//           <img
//             src={bjpLogo}
//             alt="BJP Lotus Logo"
//             className="brand-logo"
//           />

//           <b className="brand-text">
//             {o.name}
//             <small>{o.tagline || "Public Service · Community Progress"}</small>
//           </b>
//         </NavLink>

//         {/* MOBILE MENU BUTTON */}
//         <button
//           type="button"
//           className="menu"
//           aria-label="Toggle navigation"
//           aria-expanded={open}
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <X /> : <Menu />}
//         </button>

//         {/* NAVIGATION LINKS */}
//         <nav
//           className={`org-primary-nav ${open ? "open" : ""}`}
//           aria-label="Main website navigation"
//           onClick={(event) => {
//             if ((event.target as HTMLElement).closest("a")) {
//               setOpen(false);
//             }
//           }}
//         >
//           {/* HOME */}
//           {visible("home") && <NavLink to="/">Home</NavLink>}

//           {/* PUBLIC SERVICE */}
//           {f.properties && (
//             <NavLink to="/properties">Public Services</NavLink>
//           )}

//           {/* COMMUNITY DEVELOPMENT */}
//           {f.civil_services && (
//             <NavLink to="/civil-works">Community Development</NavLink>
//           )}

//           {/* DEVELOPMENT WORK */}
//           {f.construction_works && (
//             <NavLink to="/construction-works">Development Works</NavLink>
//           )}

//           {/* INFRASTRUCTURE */}
//           {f.interior_designs && (
//             <NavLink to="/interior-designs">Infrastructure</NavLink>
//           )}

//           {/* WELFARE */}
//           {f.lift_designs && (
//             <NavLink to="/lift-designs">Welfare Initiatives</NavLink>
//           )}

//           {/* CUSTOM SERVICE PAGES */}
//           {f.custom_pages &&
//             customTypes.map((page: any) => (
//               <NavLink key={page.id} to={`/services/${page.slug}`}>
//                 {page.name}
//               </NavLink>
//             ))}

//           {/* CUSTOM CONTENT PAGES */}
//           {f.custom_content_pages &&
//             (p.custom_content_pages || [])
//               .filter((page: any) => page.published && page.show_in_nav)
//               .map((page: any) => (
//                 <NavLink key={page.id} to={`/pages/${page.slug}`}>
//                   {page.menu_label || page.title}
//                 </NavLink>
//               ))}

//           {/* FOUNDATION PAGES */}
//           {f.foundation &&
//             (foundationPages as any[])
//               .filter(
//                 (page) =>
//                   !["home", "about-us", "contact"].includes(page.slug),
//               )
//               .map((page) => (
//                 <NavLink
//                   key={`foundation-${page.slug}`}
//                   to={`/foundation/${page.slug}`}
//                   className="org-foundation-link"
//                 >
//                   {page.title}
//                 </NavLink>
//               ))}

//           {/* GALLERY */}
//           {f.gallery && visible("gallery") && (
//             <NavLink to="/gallery">Gallery</NavLink>
//           )}

//           {/* ABOUT */}
//           {f.about && visible("about") && (
//             <NavLink to="/about">About</NavLink>
//           )}

//           {/* CONTACT */}
//           {f.contact && visible("contact") && (
//             <NavLink className="nav-cta" to="/contact">
//               Contact Us
//             </NavLink>
//           )}
//         </nav>
//       </header>

//       {/* ================= MAIN CONTENT ================= */}
//       <main>
//         <Outlet />

//         {f.foundation && location.pathname === "/" && visible("home") && (
//           <FoundationHomeHighlights />
//         )}
//       </main>

//       {/* ================= FOOTER ================= */}
//       <footer className="public-footer">
//         <div className="footer-main">
//           {/* FOOTER BRAND */}
//           <div className="footer-brand">
//             <div className="footer-brand-top">
//               <img
//                 src={bjpLogo}
//                 alt="BJP Lotus Logo"
//                 className="footer-logo"
//               />

//               <div>
//                 <h3>{o.name}</h3>
//                 <span>
//                   {o.tagline || "Public Service · Community Progress"}
//                 </span>
//               </div>
//             </div>

//             <p className="footer-description">
//               Dedicated to serving people, listening to community concerns
//               and working towards development, welfare and a better future.
//             </p>
//           </div>

//           {/* QUICK LINKS */}
//           <div className="footer-links">
//             <h4>Quick Links</h4>

//             {visible("home") && <NavLink to="/">Home</NavLink>}

//             {f.gallery && visible("gallery") && (
//               <NavLink to="/gallery">Gallery</NavLink>
//             )}

//             {f.about && visible("about") && (
//               <NavLink to="/about">About</NavLink>
//             )}

//             {f.contact && visible("contact") && (
//               <NavLink to="/contact">Contact Us</NavLink>
//             )}
//           </div>

//           {/* CONTACT DETAILS */}
//           <div className="footer-contact">
//             <h4>Get In Touch</h4>

//             {o.phone && (
//               <a href={`tel:${o.phone.replace(/\s/g, "")}`}>
//                 <Phone size={16} />
//                 <span>{o.phone}</span>
//               </a>
//             )}

//             {o.email && (
//               <a href={`mailto:${o.email}`}>
//                 <Mail size={16} />
//                 <span>{o.email}</span>
//               </a>
//             )}

//             {(o.address || o.city || o.state) && (
//               <div className="footer-address">
//                 <MapPin size={16} />

//                 <span>
//                   {[o.address, o.city, o.state]
//                     .filter(Boolean)
//                     .join(", ")}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* FOOTER BOTTOM */}
//         <div className="footer-bottom">
//           <div className="footer-tricolor-line">
//             <span></span>
//             <span></span>
//             <span></span>
//           </div>

//           <div className="footer-bottom-content">
//             <span>
//               © {new Date().getFullYear()} {o.name}. All rights reserved.
//             </span>

//             <a href="/login">Admin Login</a>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// }

import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import {
  Mail,
  Menu,
  MapPin,
  Phone,
  X,
  ArrowUpRight,
} from "lucide-react";

import { useSite } from "../main";
import { FoundationHomeHighlights } from "./FoundationHomeHighlights";
import bjpLogo from "../assets/bjp-logo.svg";
import "./PublicLayout.css";

/* =========================================
   INSTAGRAM ICON
========================================= */

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/* =========================================
   PUBLIC WEBSITE LAYOUT
========================================= */

export function PublicLayout() {
  const {
    organization: o = {},
    custom_page_types: customTypes = [],
    page_content: p = {},
    foundation_navigation: foundationPages = [],
  } = useSite();

  const [open, setOpen] = useState(false);
  const location = useLocation();

  const f = o.features || {};

  const visible = (
    slug: "home" | "about" | "contact" | "gallery"
  ) => p.page_visibility?.[slug] !== false;

  /* =========================================
     CONTACT DETAILS FROM ORGANIZATION
  ========================================= */

  /* =========================================
   ORGANIZATION CONTACT DETAILS
========================================= */

const phone = "123456789";

const email = "user@gmail.com";

const address = "Hyderabad, Telangana";

/* =========================================
   INSTAGRAM PROFILE
========================================= */

const instagramHandle = "rajamplala9bjp";

const instagramUrl =
  `https://www.instagram.com/${instagramHandle}/`;

  /* =========================================
     FOOTER SERVICE LINKS
  ========================================= */

  const customServices = Array.isArray(customTypes)
    ? customTypes
    : [];

  const foundationLinks = Array.isArray(foundationPages)
    ? foundationPages
    : [];

  return (
    <>
      {/* =====================================
          MAIN NAVBAR
          Website starts directly here
      ====================================== */}

      <header className="org-public-header">

        {/* BRAND */}
        <NavLink
          className="brand"
          to="/"
          end
          onClick={() => setOpen(false)}
        >
          <img
            src={bjpLogo}
            alt="BJP Lotus Logo"
            className="brand-logo"
          />

          <b className="brand-text">
            {o.name || "Portfolio"}

            <small>
              {o.tagline || "Public Service · Community Progress"}
            </small>
          </b>
        </NavLink>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="menu"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* NAVIGATION LINKS */}
        <nav
          className={`org-primary-nav ${open ? "open" : ""}`}
          aria-label="Main website navigation"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) {
              setOpen(false);
            }
          }}
        >
          {/* HOME */}
          {visible("home") && (
            <NavLink to="/" end>
              Home
            </NavLink>
          )}

          {/* PUBLIC SERVICES */}
          {f.properties && (
            <NavLink to="/properties">
              Public Services
            </NavLink>
          )}

          {/* COMMUNITY DEVELOPMENT */}
          {f.civil_services && (
            <NavLink to="/civil-works">
              Community Development
            </NavLink>
          )}

          {/* DEVELOPMENT WORKS */}
          {f.construction_works && (
            <NavLink to="/construction-works">
              Development Works
            </NavLink>
          )}

          {/* INFRASTRUCTURE */}
          {f.interior_designs && (
            <NavLink to="/interior-designs">
              Infrastructure
            </NavLink>
          )}

          {/* WELFARE INITIATIVES */}
          {f.lift_designs && (
            <NavLink to="/lift-designs">
              Welfare Initiatives
            </NavLink>
          )}

          {/* ADMIN-CREATED PARTY SERVICES */}
          {f.custom_pages &&
            customServices.map((page: any) => (
              <NavLink
                key={page.id}
                to={`/services/${page.slug}`}
              >
                {page.name}
              </NavLink>
            ))}

          {/* ADMIN-CREATED CONTENT PAGES */}
          {f.custom_content_pages &&
            (p.custom_content_pages || [])
              .filter(
                (page: any) =>
                  page.published && page.show_in_nav
              )
              .map((page: any) => (
                <NavLink
                  key={page.id}
                  to={`/pages/${page.slug}`}
                >
                  {page.menu_label || page.title}
                </NavLink>
              ))}

          {/* FOUNDATION PAGES */}
          {f.foundation &&
            foundationLinks
              .filter(
                (page: any) =>
                  !["home", "about-us", "contact"].includes(
                    page.slug
                  )
              )
              .map((page: any) => (
                <NavLink
                  key={`foundation-${page.slug}`}
                  to={`/foundation/${page.slug}`}
                  className="org-foundation-link"
                >
                  {page.title}
                </NavLink>
              ))}

          {/* GALLERY */}
          {f.gallery && visible("gallery") && (
            <NavLink to="/gallery">
              Gallery
            </NavLink>
          )}

          {/* ABOUT */}
          {f.about && visible("about") && (
            <NavLink to="/about">
              About
            </NavLink>
          )}

          {/* CONTACT */}
          {f.contact && visible("contact") && (
            <NavLink className="nav-cta" to="/contact">
              Contact Us
            </NavLink>
          )}
        </nav>
      </header>

      {/* =====================================
          MAIN PAGE CONTENT
      ====================================== */}

      <main>
        <Outlet />

        {f.foundation &&
          location.pathname === "/" &&
          visible("home") && (
            <FoundationHomeHighlights />
          )}
      </main>

      {/* =====================================
          PROFESSIONAL FOOTER
      ====================================== */}

      <footer className="public-footer">
        <div className="footer-shell">

          {/* TRICOLOR TOP LINE */}
          <div className="footer-top-accent">
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* FOUR FOOTER COLUMNS */}
          <div className="footer-main">

            {/* COLUMN 1: ORGANIZATION */}
            <div className="footer-brand">

              <div className="footer-brand-top">
                <img
                  src={bjpLogo}
                  alt="BJP Lotus Logo"
                  className="footer-logo"
                />

                <div>
                  <h3>{o.name || "Portfolio"}</h3>

                  <span>
                    {o.tagline ||
                      "Public Service · Community Progress"}
                  </span>
                </div>
              </div>

              <p className="footer-description">
                Dedicated to serving people, listening to
                community concerns and working towards
                development, welfare and a better future.
              </p>

              <div className="footer-brand-note">
                <span className="footer-note-dot"></span>
                People First · Progress Together
              </div>

              {/* INSTAGRAM */}
              <a
                className="footer-instagram"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="footer-instagram-icon">
                  <InstagramIcon />
                </span>

                <span className="footer-instagram-text">
                  <small>Follow us on Instagram</small>
                  <b>@{instagramHandle}</b>
                </span>

                <ArrowUpRight size={18} />
              </a>
            </div>

            {/* COLUMN 2: QUICK LINKS */}
            <div className="footer-links">
              <h4>Explore</h4>
              <span className="footer-heading-line"></span>

              {visible("home") && (
                <NavLink to="/" end>
                  Home <ArrowUpRight size={14} />
                </NavLink>
              )}

              {f.about && visible("about") && (
                <NavLink to="/about">
                  About Us <ArrowUpRight size={14} />
                </NavLink>
              )}

              {f.gallery && visible("gallery") && (
                <NavLink to="/gallery">
                  Gallery <ArrowUpRight size={14} />
                </NavLink>
              )}

              {f.contact && visible("contact") && (
                <NavLink to="/contact">
                  Contact Us <ArrowUpRight size={14} />
                </NavLink>
              )}
            </div>

            {/* COLUMN 3: PARTY SERVICES */}
            <div className="footer-links footer-services">
              <h4>Our Initiatives</h4>
              <span className="footer-heading-line"></span>

              {f.custom_pages &&
                customServices.map((page: any) => (
                  <NavLink
                    key={page.id}
                    to={`/services/${page.slug}`}
                  >
                    {page.name}
                    <ArrowUpRight size={14} />
                  </NavLink>
                ))}

              {f.civil_services && (
                <NavLink to="/civil-works">
                  Community Development
                  <ArrowUpRight size={14} />
                </NavLink>
              )}

              {f.properties && (
                <NavLink to="/properties">
                  Public Services
                  <ArrowUpRight size={14} />
                </NavLink>
              )}

              {f.foundation &&
                foundationLinks
                  .filter(
                    (page: any) =>
                      !["home", "about-us", "contact"].includes(
                        page.slug
                      )
                  )
                  .map((page: any) => (
                    <NavLink
                      key={`footer-${page.slug}`}
                      to={`/foundation/${page.slug}`}
                    >
                      {page.title}
                      <ArrowUpRight size={14} />
                    </NavLink>
                  ))}
            </div>

            {/* COLUMN 4: CONTACT DETAILS */}
            <div className="footer-contact">
              <h4>Get In Touch</h4>
              <span className="footer-heading-line"></span>

              {phone && (
                <a
                  className="footer-contact-item"
                  href={`tel:${phone.replace(/\s/g, "")}`}
                >
                  <span className="footer-contact-icon">
                    <Phone size={17} />
                  </span>

                  <span className="footer-contact-text">
                    <small>Call Us</small>
                    <b>{phone}</b>
                  </span>
                </a>
              )}

              {email && (
                <a
                  className="footer-contact-item"
                  href={`mailto:${email}`}
                >
                  <span className="footer-contact-icon">
                    <Mail size={17} />
                  </span>

                  <span className="footer-contact-text">
                    <small>Email Us</small>
                    <b>{email}</b>
                  </span>
                </a>
              )}

              {address && (
                <div className="footer-contact-item">
                  <span className="footer-contact-icon">
                    <MapPin size={17} />
                  </span>

                  <span className="footer-contact-text">
                    <small>Our Location</small>
                    <b>{address}</b>
                  </span>
                </div>
              )}

              {!phone && !email && !address && (
                <p className="footer-no-contact">
                  Contact information will be updated soon.
                </p>
              )}
            </div>
          </div>

          {/* =====================================
              FOOTER COMMUNITY CONTACT BANNER
          ====================================== */}

          <div className="footer-community-cta">
            <div className="footer-community-copy">
              <span>CONNECT WITH US</span>

              <h3>
                Have a question, suggestion or community concern?
              </h3>

              <p>
                Reach out to share your thoughts, requests
                and community-related concerns.
              </p>
            </div>

            {f.contact && visible("contact") && (
              <NavLink
                to="/contact"
                className="footer-community-button"
              >
                Get In Touch
                <ArrowUpRight size={17} />
              </NavLink>
            )}
          </div>

          {/* =====================================
              FOOTER BOTTOM
          ====================================== */}

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <span>
                © {new Date().getFullYear()} {o.name || "Portfolio"}.
                {" "}All rights reserved.
              </span>

              <span className="footer-bottom-message">
                Public Service · Community Development · Progress
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
