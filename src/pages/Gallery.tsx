// import { useState } from "react";
// import { Images } from "lucide-react";
// import { useSite } from "../main";
// import { MediaGalleryGrid } from "../components/MediaGalleryGrid";
// import { FieldImageContent } from "../components/FieldImageContent";
// import "./gallery.css";

// type Filter = "all" | "image" | "video";
// export function Gallery() {
//   const { gallery = {} } = useSite();
//   const [filter, setFilter] = useState<Filter>("all");
//   const media = Array.isArray(gallery?.items) ? gallery.items : [];
//   const fields = Array.isArray(gallery?.fields) ? gallery.fields : [];
//   const shown = media.filter(
//     (item: any) => filter === "all" || item.media_type === filter,
//   );
//   return (
//     <div className="site-standalone-gallery">
//       <header className="site-standalone-gallery-hero">
//         <span>
//           <Images size={16} /> OUR WORK & MOMENTS
//         </span>
//         <h1>{gallery?.title || "Our Gallery"}</h1>
//         {gallery?.description && <p>{gallery.description}</p>}
//       </header>
//       <div className="site-standalone-gallery-content">
//         {fields
//           .filter((f: any) => f.show !== false)
//           .map((f: any, i: number) => (
//             <section className="site-standalone-gallery-field" key={f.id || i}>
//               <FieldImageContent
//                 imageUrl={f.image_url}
//                 imageAlign={f.image_align}
//                 gallery={f.gallery}
//                 alt={f.name}
//               >
//                 <h2>{f.name}</h2>
//                 {f.type === "yes_no" ? (
//                   <p>
//                     {String(f.value).toLowerCase() === "true"
//                       ? "Yes"
//                       : String(f.value).toLowerCase() === "false"
//                         ? "No"
//                         : String(f.value)}
//                   </p>
//                 ) : Array.isArray(f.value) ? (
//                   <ul>
//                     {f.value.map((value: string, j: number) => (
//                       <li key={j}>{value}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>{f.value}</p>
//                 )}
//               </FieldImageContent>
//             </section>
//           ))}
//         <div className="site-standalone-gallery-tools">
//           <h2>Photos & Videos</h2>
//           <div
//             className="site-standalone-gallery-filters"
//             aria-label="Filter gallery media"
//           >
//             <button
//               aria-pressed={filter === "all"}
//               onClick={() => setFilter("all")}
//             >
//               All ({media.length})
//             </button>
//             <button
//               aria-pressed={filter === "image"}
//               onClick={() => setFilter("image")}
//             >
//               Photos (
//               {media.filter((x: any) => x.media_type === "image").length})
//             </button>
//             <button
//               aria-pressed={filter === "video"}
//               onClick={() => setFilter("video")}
//             >
//               Videos (
//               {media.filter((x: any) => x.media_type === "video").length})
//             </button>
//           </div>
//         </div>
//         {shown.length ? (
//           <MediaGalleryGrid
//             items={shown}
//             title="Photo & video gallery"
//             showCaptions={false}
//           />
//         ) : (
//           <div className="site-standalone-gallery-empty">
//             {media.length
//               ? "No items match this filter."
//               : "Gallery photos and videos will appear here soon."}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Images } from "lucide-react";
import { useSite } from "../main";
import { MediaGalleryGrid } from "../components/MediaGalleryGrid";
import { FieldImageContent } from "../components/FieldImageContent";
import "./gallery.css";

type Filter = "all" | "image" | "video";

export function Gallery() {
  const { gallery = {} } = useSite();

  const [filter, setFilter] = useState<Filter>("all");

  const media = Array.isArray(gallery?.items) ? gallery.items : [];
  const fields = Array.isArray(gallery?.fields) ? gallery.fields : [];

  const shown = media.filter(
    (item: any) => filter === "all" || item.media_type === filter,
  );

  return (
    <div className="site-standalone-gallery">

      {/* HERO SECTION */}
      <header className="site-standalone-gallery-hero">
        <span>
          <Images size={16} />
          PEOPLE • PROGRESS • ACTION
        </span>

        <h1>{gallery?.title || "Moments of Public Service"}</h1>

        {gallery?.description && <p>{gallery.description}</p>}
      </header>

      {/* GALLERY CONTENT */}
      <div className="site-standalone-gallery-content">

        {/* BACKEND DYNAMIC FIELDS */}
        {fields
          .filter((f: any) => f.show !== false)
          .map((f: any, i: number) => (
            <section
              className="site-standalone-gallery-field"
              key={f.id || i}
            >
              <FieldImageContent
                imageUrl={f.image_url}
                imageAlign={f.image_align}
                gallery={f.gallery}
                alt={f.name}
              >
                <h2>{f.name}</h2>

                {f.type === "yes_no" ? (
                  <p>
                    {String(f.value).toLowerCase() === "true"
                      ? "Yes"
                      : String(f.value).toLowerCase() === "false"
                        ? "No"
                        : String(f.value)}
                  </p>
                ) : Array.isArray(f.value) ? (
                  <ul>
                    {f.value.map((value: string, j: number) => (
                      <li key={j}>{value}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{f.value}</p>
                )}
              </FieldImageContent>
            </section>
          ))}

        {/* GALLERY TOOLBAR */}
        <div className="site-standalone-gallery-tools">
          <h2>Our Work & Moments</h2>

          <div
            className="site-standalone-gallery-filters"
            aria-label="Filter gallery media"
          >
            <button
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All ({media.length})
            </button>

            <button
              aria-pressed={filter === "image"}
              onClick={() => setFilter("image")}
            >
              Photos (
              {media.filter((x: any) => x.media_type === "image").length})
            </button>

            <button
              aria-pressed={filter === "video"}
              onClick={() => setFilter("video")}
            >
              Videos (
              {media.filter((x: any) => x.media_type === "video").length})
            </button>
          </div>
        </div>

        {/* MEDIA GALLERY */}
        {shown.length ? (
          <MediaGalleryGrid
            items={shown}
            title="Moments of Service"
            showCaptions={false}
          />
        ) : (
          <div className="site-standalone-gallery-empty">
            {media.length
              ? "No media available in this category."
              : "Community photos and videos will be added here soon."}
          </div>
        )}
      </div>
    </div>
  );
}