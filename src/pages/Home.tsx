
import { useSite } from '../main';
import { SiteContentSections } from '../components/SiteContentSections';
import HeroSection from '../components/HeroSection';
import ContactCTA from '../components/ContactCTA';
import HomePortfolioSections from '../components/HomePortfolioSections';

// Preserve existing exports
export { PropertyCard } from '../components/FeaturedPropertiesSection';
export { Title } from '../components/HomeShowcase';

export function Home() {
  const site = useSite();

  const organization = site.organization || {};
  const pageContent = site.page_content || {};
  const features = organization.features || {};

  // Admin-created Home sections
  const homeSections = pageContent.page_sections?.home || [];

  // Party Services data from backend
  const customPageTypes = Array.isArray(site.custom_page_types)
    ? site.custom_page_types
    : [];

  const customPageEntries = Array.isArray(site.custom_page_entries)
    ? site.custom_page_entries
    : [];

  return (
    <>
      {/* HERO SECTION */}
      <HeroSection
        title={
          pageContent.home_title ||
          organization.name ||
          'Serving the People'
        }
        subtitle={
          pageContent.home_subtitle ||
          organization.about ||
          'Dedicated to public service and the development of our community.'
        }
      />

      {/* PORTFOLIO:
          Statistics → Quote → Dynamic Party Services
          → Focus Areas → Journey
      */}
      <HomePortfolioSections
        customPageTypes={
          features.custom_pages ? customPageTypes : []
        }
        customPageEntries={
          features.custom_pages ? customPageEntries : []
        }
      />

      {/* ADMIN-CREATED HOME CONTENT */}
      <SiteContentSections sections={homeSections} />

      {/* CONTACT CTA */}
      {features.contact && <ContactCTA />}
    </>
  );
}
