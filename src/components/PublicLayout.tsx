
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

/* ORGANIZATION CONTACT DETAILS */

const phone = "9885434979";

const email = "Rajujampalasailaja@gmail.com";

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
