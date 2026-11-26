// import { useSite } from '../main';
// import { SiteContentSections } from '../components/SiteContentSections';
// import HeroSection from '../components/HeroSection';
// import HomeServicesStrip from '../components/HomeServicesStrip';
// import LocationsMarquee from '../components/LocationsMarquee';
// import SiteStats from '../components/SiteStats';
// import FeaturedPropertiesSection from '../components/FeaturedPropertiesSection';
// import BlueprintSection from '../components/BlueprintSection';
// import ConstructionWorksSection from '../components/ConstructionWorksSection';
// import CivilServicesSection from '../components/CivilServicesSection';
// import InteriorDesignSection from '../components/InteriorDesignSection';
// import LiftDesignSection from '../components/LiftDesignSection';
// import CustomServicesSection from '../components/CustomServicesSection';
// import ContactCTA from '../components/ContactCTA';

// // Preserve these named exports: other pages may import them from pages/Home.
// export { PropertyCard } from '../components/FeaturedPropertiesSection';
// export { Title } from '../components/HomeShowcase';

// /** Homepage is now an orchestrator. Each visual component owns its CSS in its TSX file. */
// export function Home() {
//   const site = useSite();
//   // Organization and page content are admin-managed JSON objects.
//   const o: any = site.organization || {};
//   const p: any = site.page_content || {};
//   const features: Record<string, any> = o.features || {};

//   const properties = Array.isArray(site.properties) ? site.properties : [];
//   const constructionWorks = Array.isArray(site.construction_works) ? site.construction_works : [];
//   const interiorDesigns = Array.isArray(site.interior_designs) ? site.interior_designs : [];
//   const liftDesigns = Array.isArray(site.lift_designs) ? site.lift_designs : [];
//   const civilServices = Array.isArray(site.civil_services) ? site.civil_services : [];
//   const customPageTypes = Array.isArray(site.custom_page_types) ? site.custom_page_types : [];
//   const customPageEntries = Array.isArray(site.custom_page_entries) ? site.custom_page_entries : [];

//   const locations = [
//     ...(features.properties ? properties : []),
//     ...(features.construction_works ? constructionWorks : []),
//     ...(features.interior_designs ? interiorDesigns : []),
//   ].map((item: any) => item?.location).filter(Boolean);

//   return <>
//     <HeroSection
//       eyebrow={features.civil_services ? 'REAL ESTATE & CIVIL SOLUTIONS' : 'PROFESSIONAL PROPERTY SOLUTIONS'}
//       title={p.home_title || o.tagline || 'Find property.\nBuild better.\nLive confidently.'}
//       subtitle={p.home_subtitle || o.about || 'One trusted team for real estate, civil works and essential property services.'}
//       showPropertySearch={Boolean(features.properties)}
//       showContactButton={Boolean(features.contact)}
//       reviewRating={o.review_rating}
//       reviewCount={o.review_count}
//     />

//     {/* Existing admin-configured home sections are unchanged. */}
//     <SiteContentSections sections={p.page_sections?.home || []} />

//     <LocationsMarquee locations={locations} />
//     {features.home_services && <HomeServicesStrip services={p.home_services || []} />}
//     <SiteStats
//       properties={features.properties ? properties.length : 0}
//       construction={features.construction_works ? constructionWorks.length : 0}
//       interiors={features.interior_designs ? interiorDesigns.length : 0}
//       civilServices={features.civil_services ? civilServices.length : 0}
//     />

//     {features.properties && <FeaturedPropertiesSection properties={properties} />}
//     {(features.properties || features.construction_works || features.civil_services || features.interior_designs || features.lift_designs) &&
//       <BlueprintSection features={features} />}
//     {features.construction_works && <ConstructionWorksSection projects={constructionWorks} />}
//     {features.civil_services && <CivilServicesSection services={civilServices} />}
//     {features.interior_designs && <InteriorDesignSection designs={interiorDesigns} />}
//     {features.lift_designs && <LiftDesignSection designs={liftDesigns} />}
//     {features.custom_pages && <CustomServicesSection types={customPageTypes} entries={customPageEntries} />}
//     {features.contact && <ContactCTA />}
//   </>;
// }


// import { useSite } from '../main';
// import { SiteContentSections } from '../components/SiteContentSections';
// import HeroSection from '../components/HeroSection';
// import ContactCTA from '../components/ContactCTA';

// // Preserve existing exports
// export { PropertyCard } from '../components/FeaturedPropertiesSection';
// export { Title } from '../components/HomeShowcase';

// export function Home() {
//   const site = useSite();

//   const organization = site.organization || {};
//   const pageContent = site.page_content || {};
//   const features = organization.features || {};

//   // Admin-created home sections
//   const homeSections = pageContent.page_sections?.home || [];

//   return (
//     <>
//       {/* HERO SECTION */}
//       <HeroSection
//         title={
//           pageContent.home_title ||
//           organization.name ||
//           'Serving the People'
//         }
//         subtitle={
//           pageContent.home_subtitle ||
//           organization.about ||
//           'Dedicated to public service and the development of our community.'
//         }
//       />

//       {/* DYNAMIC ADMIN-CREATED HOME SECTIONS */}
//       <SiteContentSections sections={homeSections} />

//       {/* CONTACT SECTION */}
//       {features.contact && <ContactCTA />}
//     </>
//   );
// }

//------------------------------------------------------------------------------------------SECOND----------------------------------------------------------------------------------
// import { useSite } from '../main';
// import { SiteContentSections } from '../components/SiteContentSections';
// import HeroSection from '../components/HeroSection';
// import ContactCTA from '../components/ContactCTA';
// import HomePortfolioSections from '../components/HomePortfolioSections';

// // Preserve existing exports
// export { PropertyCard } from '../components/FeaturedPropertiesSection';
// export { Title } from '../components/HomeShowcase';

// export function Home() {
//   const site = useSite();

//   const organization = site.organization || {};
//   const pageContent = site.page_content || {};
//   const features = organization.features || {};

//   // Admin-created Home sections
//   const homeSections = pageContent.page_sections?.home || [];

//   return (
//     <>
//       {/* EXISTING HERO */}
//       <HeroSection
//         title={
//           pageContent.home_title ||
//           organization.name ||
//           'Serving the People'
//         }
//         subtitle={
//           pageContent.home_subtitle ||
//           organization.about ||
//           'Dedicated to public service and the development of our community.'
//         }
//       />

//       {/* NEW HOME PAGE DESIGN */}
//       <HomePortfolioSections />

//       {/* EXISTING ADMIN-CREATED HOME SECTIONS */}
//       <SiteContentSections sections={homeSections} />

//       {/* EXISTING CONTACT SECTION */}
//       {features.contact && <ContactCTA />}
//     </>
//   );
// }

//----------------------------------------------------------THIRD----------------------------------------

// import { useSite } from '../main';
// import { SiteContentSections } from '../components/SiteContentSections';
// import HeroSection from '../components/HeroSection';
// import ContactCTA from '../components/ContactCTA';
// import HomePortfolioSections from '../components/HomePortfolioSections';
// import CustomServicesSection from '../components/CustomServicesSection';

// // Preserve existing exports
// export { PropertyCard } from '../components/FeaturedPropertiesSection';
// export { Title } from '../components/HomeShowcase';

// export function Home() {
//   const site = useSite();

//   const organization = site.organization || {};
//   const pageContent = site.page_content || {};
//   const features = organization.features || {};

//   // Admin-created Home sections
//   const homeSections = pageContent.page_sections?.home || [];

//   // Dynamic data from backend
//   const customPageTypes = Array.isArray(site.custom_page_types)
//     ? site.custom_page_types
//     : [];

//   const customPageEntries = Array.isArray(site.custom_page_entries)
//     ? site.custom_page_entries
//     : [];

//   return (
//     <>
//       {/* HERO */}
//       <HeroSection
//         title={
//           pageContent.home_title ||
//           organization.name ||
//           'Serving the People'
//         }
//         subtitle={
//           pageContent.home_subtitle ||
//           organization.about ||
//           'Dedicated to public service and the development of our community.'
//         }
//       />

//       {/* YOUR EXISTING HOME PORTFOLIO DESIGN */}
//       <HomePortfolioSections />

//       {/* ADMIN-CREATED HOME CONTENT */}
//       <SiteContentSections sections={homeSections} />

//       {/* DYNAMIC PARTY SERVICES */}
//       {features.custom_pages && (
//         <CustomServicesSection
//           types={customPageTypes}
//           entries={customPageEntries}
//         />
//       )}

//       {/* CONTACT CTA */}
//       {features.contact && <ContactCTA />}
//     </>
//   );
// }
//----------------------------------------------------------4--------------------------------

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
