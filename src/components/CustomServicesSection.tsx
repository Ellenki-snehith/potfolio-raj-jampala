// import { MapPin } from 'lucide-react';
// import { mediaUrl } from '../api';
// import { ShowcaseCard, ShowcaseSection } from './HomeShowcase';

// export default function CustomServicesSection({ types = [], entries = [] }: { types?: any[]; entries?: any[] }) {
//   return <>
//     {(Array.isArray(types) ? types : []).map((type) => {
//       const featured = (Array.isArray(entries) ? entries : []).filter((x) => String(x.page_type_id) === String(type.id) && x.featured).slice(0, 6);
//       return <ShowcaseSection key={type.id} id={`home-custom-${type.slug}`} eyebrow="CUSTOM SERVICES" title={type.hero_title || type.name} tone="soft" to={`/services/${type.slug}`} actionLabel={`Explore ${type.name}`} empty={!featured.length} emptyText={`Explore our ${type.name} services and projects.`}>
//         {featured.map((x) => <ShowcaseCard key={x.id}
//           to={`/services/${type.slug}/${x.slug}`}
//           title={x.name || 'Service'}
//           image={x.image_url ? mediaUrl(x.image_url) : undefined}
//           badge={x.category || type.name}
//           category={[x.category || type.name, x.location].filter(Boolean).join(' · ')}
//           price={x.price_label || 'Request quotation'}
//           description={x.short_description || x.description}
//           meta={x.location ? [{ label: x.location, icon: <MapPin aria-hidden="true" /> }] : []}
//           action="View service details"
//         />)}
//       </ShowcaseSection>;
//     })}
//   </>;
// }
//------------------------------------------------------------------------------------------
// import { Link } from "react-router-dom";
// import { mediaUrl } from "../api";
// import "./custom-services-home.css";

// type Props = {
//   types?: any[];
//   entries?: any[];
// };

// export default function CustomServicesSection({
//   types = [],
//   entries = [],
// }: Props) {
//   const pageTypes = Array.isArray(types) ? types : [];
//   const pageEntries = Array.isArray(entries) ? entries : [];

//   return (
//     <>
//       {pageTypes.map((type) => {
//         // Only show listings marked Featured on home page
//         const featured = pageEntries
//           .filter(
//             (entry) =>
//               String(entry.page_type_id) === String(type.id) &&
//               entry.featured,
//           )
//           .slice(0, 6);

//         if (featured.length === 0) return null;

//         return (
//           <section
//             className="home-custom-services"
//             id={`home-custom-${type.slug}`}
//             key={type.id}
//           >
//             {/* Heading */}
//             <div className="home-custom-services-heading">
//               <div>
//                 <span className="home-custom-services-eyebrow">
//                   PEOPLE • PROGRESS • ACTION
//                 </span>

//                 <h2>{type.hero_title || type.name}</h2>

//                 <p>
//                   {type.hero_description ||
//                     type.description ||
//                     "Connecting with people and working towards positive change."}
//                 </p>
//               </div>

//               <Link
//                 to={`/services/${type.slug}`}
//                 className="home-custom-services-explore"
//               >
//                 Explore {type.name}
//                 <span>→</span>
//               </Link>
//             </div>

//             {/* Dynamic cards */}
//             <div className="home-custom-services-grid">
//               {featured.map((entry) => {
//                 const coverImage =
//                   entry.image_url ||
//                   entry.media?.find(
//                     (media: any) =>
//                       media.media_type === "image" && media.is_cover,
//                   )?.url ||
//                   entry.media?.find(
//                     (media: any) => media.media_type === "image",
//                   )?.url;

//                 return (
//                   <Link
//                     key={entry.id}
//                     to={`/services/${type.slug}/${entry.slug}`}
//                     className="home-custom-service-card"
//                     aria-label={`View details: ${entry.name}`}
//                   >
//                     {coverImage ? (
//                       <img
//                         src={mediaUrl(coverImage)}
//                         alt={entry.name || "Community initiative"}
//                         loading="lazy"
//                       />
//                     ) : (
//                       <div className="home-custom-service-placeholder" />
//                     )}

//                     <div className="home-custom-service-overlay" />

//                     <div className="home-custom-service-content">
//                       <span className="home-custom-service-tag">
//                         {entry.category || type.name}
//                       </span>

//                       <h3>{entry.name}</h3>

//                       {(entry.short_description ||
//                         entry.description) && (
//                         <p>
//                           {entry.short_description || entry.description}
//                         </p>
//                       )}
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </section>
//         );
//       })}
//     </>
//   );
// }
//----------------------------------------------------------------------------------------------------------------------

import { Link } from "react-router-dom";
import { mediaUrl } from "../api";
import "./custom-services-home.css";

type Props = {
  types?: any[];
  entries?: any[];
};

export default function CustomServicesSection({
  types = [],
  entries = [],
}: Props) {
  const pageTypes = Array.isArray(types) ? types : [];
  const pageEntries = Array.isArray(entries) ? entries : [];

  return (
    <>
      {pageTypes.map((type) => {
        // Get published and featured listings from Admin Panel
        const featured = pageEntries
          .filter(
            (entry) =>
              String(entry.page_type_id) === String(type.id) &&
              entry.featured &&
              entry.published !== false,
          )
          .slice(0, 6);

        // Hide the section if no featured listings are available
        if (featured.length === 0) {
          return null;
        }

        return (
          <section
            className="home-custom-services"
            id={`home-custom-${type.slug}`}
            key={type.id}
          >
            {/* SECTION HEADING */}
            <div className="home-custom-services-heading">
              <div>
                <span className="home-custom-services-eyebrow">
                  COMMUNITY • DEVELOPMENT • PUBLIC SERVICE
                </span>

                <h2>Initiatives that make a difference</h2>

                <p>
                  Connecting with people through community activities,
                  educational programmes and public-service initiatives.
                </p>
              </div>

              <Link
                to={`/services/${type.slug}`}
                className="home-custom-services-explore"
              >
                Explore all initiatives
                <span>→</span>
              </Link>
            </div>

            {/* DYNAMIC SERVICE CARDS */}
            <div className="home-custom-services-grid">
              {featured.map((entry) => {
                // Get uploaded media safely
                const media = Array.isArray(entry.media)
                  ? entry.media
                  : [];

                // Find the cover image from Admin Panel
                const coverImage =
                  entry.image_url ||
                  media.find(
                    (image: any) =>
                      image.media_type === "image" &&
                      image.is_cover === true,
                  )?.url ||
                  media.find(
                    (image: any) => image.media_type === "image",
                  )?.url;

                return (
                  <Link
                    key={entry.id}
                    to={`/services/${type.slug}/${entry.slug}`}
                    className="home-custom-service-card"
                    aria-label={`View details: ${entry.name || "Community initiative"}`}
                  >
                    {/* ADMIN-UPLOADED COVER IMAGE */}
                    {coverImage ? (
                      <img
                        src={mediaUrl(coverImage)}
                        alt={entry.name || "Community initiative"}
                        loading="lazy"
                      />
                    ) : (
                      <div className="home-custom-service-placeholder" />
                    )}

                    {/* DARK IMAGE OVERLAY */}
                    <div className="home-custom-service-overlay" />

                    {/* CATEGORY AND TITLE ONLY */}
                    <div className="home-custom-service-content">
                      <span className="home-custom-service-tag">
                        {entry.category || "Community"}
                      </span>

                      <h3>{entry.name || "Community Initiative"}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
