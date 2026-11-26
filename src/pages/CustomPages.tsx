// import { MediaGalleryGrid } from "../components/MediaGalleryGrid";
// import { FieldImageContent } from "../components/FieldImageContent";
// import { useEffect, useMemo, useState, type FormEvent } from "react";
// import { Link, useParams } from "react-router-dom";
// import { ArrowLeft, ArrowRight,  Building2, MapPin, MessageSquare,} from "lucide-react";
// import { mediaUrl, sendInquiry } from "../api";
// import { useSite } from "../main";
// import "./custom-pages.css";

// const defaultSections = [
//   {
//     source: "description",
//     title: "About this service",
//     style: "paragraph",
//     visible: true,
//   },
//   {
//     source: "custom_details",
//     title: "Our completed work",
//     style: "paragraph",
//     visible: true,
//   },
//   {
//     source: "scope_of_work",
//     title: "Scope of work",
//     style: "bullets",
//     visible: true,
//   },
//   {
//     source: "materials",
//     title: "Materials & workmanship",
//     style: "paragraph",
//     visible: true,
//   },
//   {
//     source: "process",
//     title: "Working process",
//     style: "paragraph",
//     visible: true,
//   },
//   {
//     source: "highlights",
//     title: "Project highlights",
//     style: "bullets",
//     visible: true,
//   },
// ];
// const split = (v: any) =>
//   String(v ?? "")
//     .split(/\n|;|,/)
//     .map((x) => x.trim())
//     .filter(Boolean);
// const format = (v: any) =>
//   typeof v === "boolean" ? (v ? "Yes" : "No") : String(v ?? "");
// const labels: any = {
//   location: "Location",
//   category: "Category",
//   price_label: "Starting price",
//   completed_projects: "Completed projects",
//   years_experience: "Years of experience",
// };
// const extraFields = (
//   item: any,
//   type: any,
//   where: "show_on_card" | "show_on_detail",
// ) =>
//   (type.field_definitions || []).filter(
//     (f: any) =>
//       f[where] &&
//       item.custom_fields?.[f.key] !== undefined &&
//       item.custom_fields?.[f.key] !== "" &&
//       item.custom_fields?.[f.key] !== null,
//   );
// const ownFields = (item: any, where: "show_on_card" | "show_on_detail") =>
//   (Array.isArray(item.additional_fields) ? item.additional_fields : []).filter(
//     (f: any) =>
//       f?.label &&
//       f[where] !== false &&
//       (where === "show_on_detail" || f.show_on_card === true) &&
//       ((f.value !== "" && f.value !== null && f.value !== undefined) ||
//         (where === "show_on_detail" && (!!f.image_url || !!f.gallery?.length))),
//   );
// const sectionValue = (item: any, source: string) =>
//   source.startsWith("custom:")
//     ? item.custom_fields?.[source.slice(7)]
//     : item[source];

// export function CustomPages() {
//   const { typeSlug } = useParams();
//   const { custom_page_types: types = [], custom_page_entries: items = [] } =
//     useSite();
//   const type = types.find((t: any) => t.slug === typeSlug);
//   const [query, setQuery] = useState(""),
//     [category, setCategory] = useState("All");
//   useEffect(() => {
//     setQuery("");
//     setCategory("All");
//   }, [typeSlug]);
//   const categories = useMemo(
//     () =>
//       Array.from(
//         new Set(
//           items
//             .filter((item: any) => item.page_type_id === type?.id)
//             .map((item: any) => String(item.category || ""))
//             .filter(Boolean),
//         ),
//       ) as string[],
//     [items, type],
//   );
//   const shown = useMemo(
//     () =>
//       items.filter(
//         (item: any) =>
//           item.page_type_id === type?.id &&
//           (category === "All" || item.category === category) &&
//           `${item.name} ${item.location} ${item.category} ${item.description} ${Object.values(item.custom_fields || {}).join(" ")} ${(item.additional_fields || []).map((f: any) => f.value).join(" ")}`
//             .toLowerCase()
//             .includes(query.toLowerCase()),
//       ),
//     [type, items, query, category],
//   );
//   if (!type)
//     return (
//       <div className="custom-page-wrap">
//         <h1>Page unavailable</h1>
//         <p>This category is not enabled or published.</p>
//       </div>
//     );
//   return (
//     <div className="custom-page-wrap">
//       <div className="custom-hero">
//         <span>PROJECTS & SERVICES</span>
//         <h1>{type.hero_title || type.name}</h1>
//         <p>
//           {type.hero_description ||
//             type.description ||
//             "Explore projects, view specifications, and request a quotation."}
//         </p>
//       </div>
//       <div className="custom-toolbar">
//         <b>
//           {shown.length} listing{shown.length === 1 ? "" : "s"}
//         </b>
//         {type.show_search !== false && (
//           <input
//             aria-label="Search listings"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder={`Search ${type.name.toLowerCase()}…`}
//           />
//         )}
//       </div>
//       {type.show_category_filter !== false && categories.length > 0 && (
//         <nav
//           aria-label="Filter listings by category"
//           className="custom-categories"
//         >
//           {["All", ...categories].map((label) => (
//             <button
//               type="button"
//               className={category === label ? "selected" : ""}
//               onClick={() => setCategory(label)}
//               key={label}
//             >
//               {label}
//             </button>
//           ))}
//         </nav>
//       )}
//       <div
//         className={
//           "custom-grid " + (type.listing_layout === "compact" ? "compact" : "")
//         }
//       >
//         {shown.map((item: any) => (
//           <article className="custom-card" key={item.id}>
//             <Link
//               to={`/services/${type.slug}/${item.slug}`}
//               className="custom-card-picture"
//             >
//               {item.image_url ? (
//                 <img
//                   src={mediaUrl(item.image_url)}
//                   alt={item.name}
//                   loading="lazy"
//                 />
//               ) : (
//                 <Building2 />
//               )}
//             </Link>
//             <div>
//               <h2>{item.name}</h2>
//               <p>{item.short_description || item.description}</p>
//               <div className="custom-card-facts">
//                 {(
//                   type.card_fields || ["location", "category", "price_label"]
//                 ).map((key: string) =>
//                   item[key] ? (
//                     <span key={key}>
//                       <b>{labels[key] || key}:</b> {item[key]}
//                       {key === "years_experience" ? " years" : ""}
//                     </span>
//                   ) : null,
//                 )}
//                 {extraFields(item, type, "show_on_card").map((f: any) => (
//                   <span key={f.key}>
//                     <b>{f.label}:</b> {format(item.custom_fields[f.key])}
//                   </span>
//                 ))}
//                 {ownFields(item, "show_on_card").map((f: any) => (
//                   <span key={f.key}>
//                     <b>{f.label}:</b> {format(f.value)}
//                   </span>
//                 ))}
//               </div>
//               <Link
//                 className="custom-link"
//                 to={`/services/${type.slug}/${item.slug}`}
//               >
//                 View full details <ArrowRight size={17} />
//               </Link>
//             </div>
//           </article>
//         ))}
//       </div>
//       {!shown.length && (
//         <div className="custom-empty">
//           No published listings match your search or category.
//         </div>
//       )}
//     </div>
//   );
// }

// export function CustomPageDetail() {
//   const { typeSlug, itemSlug } = useParams();
//   const { custom_page_types: types = [], custom_page_entries: items = [] } =
//     useSite();
//   const type = types.find((t: any) => t.slug === typeSlug);
//   const item = items.find(
//     (x: any) => x.slug === itemSlug && x.page_type_id === type?.id,
//   );
//   const [chosen, setChosen] = useState<any>(null),
//     [open, setOpen] = useState(false),
//     [name, setName] = useState(""),
//     [phone, setPhone] = useState(""),
//     [email, setEmail] = useState(""),
//     [budget, setBudget] = useState(""),
//     [preferredCallback, setPreferredCallback] = useState(""),
//     [visit, setVisit] = useState(""),
//     [message, setMessage] = useState(""),
//     [feedback, setFeedback] = useState(""),
//     [busy, setBusy] = useState(false);
//   useEffect(() => {
//     setChosen(null);
//     setOpen(false);
//   }, [itemSlug, typeSlug]);
//   if (!type || !item)
//     return (
//       <div className="custom-page-wrap">
//         <h1>Page unavailable</h1>
//         <Link to="/">Return home</Link>
//       </div>
//     );
//   const photos = (item.media || []).filter(
//       (m: any) => m.media_type === "image",
//     ),
//     videos = (item.media || []).filter((m: any) => m.media_type === "video"),
//     docs = (item.media || []).filter(
//       (m: any) => !["image", "video"].includes(m.media_type),
//     ),
//     cover = chosen || photos.find((x: any) => x.is_cover) || photos[0];
//   const inquiryFields = type.inquiry_fields || {
//     email: true,
//     budget: true,
//     preferred_callback: true,
//     visit_preference: true,
//     message: true,
//   };
//   const visible = (key: string) => inquiryFields[key] !== false;
//   const submit = async (e: FormEvent) => {
//     e.preventDefault();
//     setBusy(true);
//     setFeedback("");
//     try {
//       await sendInquiry({
//         custom_page_entry_id: item.id,
//         name,
//         phone,
//         ...(visible("email") ? { email } : {}),
//         ...(visible("budget") ? { budget } : {}),
//         ...(visible("preferred_callback")
//           ? { preferred_callback: preferredCallback }
//           : {}),
//         ...(visible("visit_preference") ? { visit_preference: visit } : {}),
//         ...(visible("message") ? { message } : {}),
//         requirement_type: `${type.name} inquiry`,
//       });
//       setFeedback("Thank you. Your request has been sent to the organization.");
//       setName("");
//       setPhone("");
//       setEmail("");
//       setBudget("");
//       setMessage("");
//       setPreferredCallback("");
//       setVisit("");
//     } catch (e: any) {
//       setFeedback(e.message || "Could not submit inquiry.");
//     } finally {
//       setBusy(false);
//     }
//   };
//   const specs = [
//     ...(type.card_fields || ["category", "location", "price_label"])
//       .filter((key: string) => item[key])
//       .map((key: string) => ({ label: labels[key] || key, value: item[key] })),
//     ...extraFields(item, type, "show_on_detail").map((f: any) => ({
//       label: f.label,
//       value: format(item.custom_fields[f.key]),
//       key: f.key,
//       image_url: item.custom_field_media?.[f.key]?.image_url,
//       image_align: item.custom_field_media?.[f.key]?.image_align,
//       gallery: item.custom_field_media?.[f.key]?.gallery,
//     })),
//   ];
//   const sections = (type.detail_sections || defaultSections).filter(
//     (sec: any) =>
//       sec.visible !== false &&
//       sectionValue(item, sec.source) !== undefined &&
//       sectionValue(item, sec.source) !== null &&
//       sectionValue(item, sec.source) !== "",
//   );
//   return (
//     <div className="custom-page-wrap">
//       <Link className="custom-back" to={`/services/${type.slug}`}>
//         <ArrowLeft size={17} /> All {type.name}
//       </Link>
//       <div className="custom-heading">
//         <small>
//           {type.name}
//           {item.category ? " · " + item.category : ""}
//         </small>
//         <h1>{item.name}</h1>
//         <p>{item.short_description || item.description}</p>
//         <div className="custom-meta">
//           {item.location && (
//             <span>
//               <MapPin size={16} />
//               {item.location}
//             </span>
//           )}
//           {item.price_label && <strong>{item.price_label}</strong>}
//         </div>
//         <button type="button" onClick={() => setOpen(true)}>
//           <MessageSquare size={17} />
//           {item.call_to_action || "Request a quotation"}
//         </button>
//       </div>
//       <div
//         className={
//           "custom-detail-grid " + (type.detail_layout === "wide" ? "wide" : "")
//         }
//       >
//         <div>
//           <div className="custom-main-img">
//             {cover ? (
//               <img src={mediaUrl(cover.url)} alt={item.name} />
//             ) : item.image_url ? (
//               <img src={mediaUrl(item.image_url)} alt={item.name} />
//             ) : (
//               <Building2 />
//             )}
//           </div>
//           {photos.length > 0 && (
//             <div className="custom-thumbs">
//               {photos.map((p: any) => (
//                 <button
//                   type="button"
//                   key={p.id}
//                   className={cover?.id === p.id ? "selected" : ""}
//                   onClick={() => setChosen(p)}
//                 >
//                   <img src={mediaUrl(p.url)} alt={p.title || item.name} />
//                 </button>
//               ))}
//             </div>
//           )}
//           <MediaGalleryGrid
//             items={item.media || []}
//             title="Service gallery — photos & videos"
//           />
//           {specs.length > 0 && (
//             <section className="custom-content-section">
//               <h2>Project specifications</h2>
//               <div className="custom-specifications">
//                 {specs.map((spec: any, index: number) => (
//                   <div
//                     key={spec.key || index}
//                     className={spec.image_url ? "custom-spec-with-image" : ""}
//                   >
//                     <FieldImageContent
//                       imageUrl={spec.image_url}
//                       imageAlign={spec.image_align}
//                       gallery={spec.gallery}
//                       alt={spec.label}
//                     >
//                       <b>{spec.label}</b>
//                       <p>
//                         {spec.value}
//                         {spec.label === "Years of experience" ? " years" : ""}
//                       </p>
//                     </FieldImageContent>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}
//           {ownFields(item, "show_on_detail").length > 0 && (
//             <section className="custom-content-section">
//               <h2>Additional project details</h2>
//               <div className="custom-specifications custom-user-fields">
//                 {ownFields(item, "show_on_detail")
//                   .filter((f: any) => f.type !== "textarea")
//                   .map((f: any) => (
//                     <div key={f.key}>
//                       <FieldImageContent
//                         imageUrl={f.image_url}
//                         imageAlign={f.image_align}
//                         gallery={f.gallery}
//                         alt={f.label}
//                       >
//                         <b>{f.label}</b>
//                         <p>{format(f.value)}</p>
//                       </FieldImageContent>
//                     </div>
//                   ))}
//               </div>
//               {ownFields(item, "show_on_detail")
//                 .filter((f: any) => f.type === "textarea")
//                 .map((f: any) => (
//                   <div className="custom-long-field" key={f.key}>
//                     <FieldImageContent
//                       imageUrl={f.image_url}
//                       imageAlign={f.image_align}
//                       gallery={f.gallery}
//                       alt={f.label}
//                     >
//                       <h3>{f.label}</h3>
//                       <p>{format(f.value)}</p>
//                     </FieldImageContent>
//                   </div>
//                 ))}
//             </section>
//           )}
//           {sections.map((sec: any, index: number) => {
//             const value = sectionValue(item, sec.source);
//             return (
//               <section
//                 className="custom-content-section"
//                 key={`${sec.source}-${index}`}
//               >
//                 <FieldImageContent
//                   imageUrl={
//                     sec.source.startsWith("custom:")
//                       ? item.custom_field_media?.[sec.source.slice(7)]
//                           ?.image_url
//                       : undefined
//                   }
//                   imageAlign={
//                     sec.source.startsWith("custom:")
//                       ? item.custom_field_media?.[sec.source.slice(7)]
//                           ?.image_align
//                       : undefined
//                   }
//                   gallery={
//                     sec.source.startsWith("custom:")
//                       ? item.custom_field_media?.[sec.source.slice(7)]?.gallery
//                       : undefined
//                   }
//                   alt={sec.title}
//                 >
//                   <h2>{sec.title}</h2>
//                   {sec.style === "bullets" ? (
//                     <ul>
//                       {split(value).map((line: string, i: number) => (
//                         <li key={i}>{line}</li>
//                       ))}
//                     </ul>
//                   ) : sec.style === "specifications" ? (
//                     <div className="custom-specifications">
//                       {split(value).map((line: string, i: number) => (
//                         <div key={i}>{line}</div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p>{format(value)}</p>
//                   )}
//                 </FieldImageContent>
//               </section>
//             );
//           })}
//           {videos.length > 0 && (
//             <section className="custom-content-section">
//               <h2>Project videos</h2>
//               <div className="custom-videos">
//                 {videos.map((video: any) => (
//                   <div key={video.id}>
//                     <video
//                       controls
//                       preload="metadata"
//                       src={mediaUrl(video.url)}
//                     />
//                     <p>{video.title}</p>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}
//           {docs.length > 0 && (
//             <section className="custom-content-section">
//               <h2>Documents & brochures</h2>
//               {docs.map((m: any) => (
//                 <p key={m.id}>
//                   <a href={mediaUrl(m.url)} target="_blank" rel="noreferrer">
//                     {m.title || m.original_name} ↗
//                   </a>
//                 </p>
//               ))}
//             </section>
//           )}
//         </div>
//         <aside className="custom-inquiry-aside">
//           <h2>{type.inquiry_heading || "Interested in this service?"}</h2>
//           <p>
//             Share your requirements with the organization to request a callback
//             or site visit.
//           </p>
//           <button type="button" onClick={() => setOpen(true)}>
//             Send an inquiry <ArrowRight size={17} />
//           </button>
//         </aside>
//       </div>
//       {open && (
//         <div
//           className="custom-modal-backdrop"
//           onMouseDown={(e) => {
//             if (e.target === e.currentTarget) setOpen(false);
//           }}
//         >
//           <div
//             className="custom-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-label={`Inquiry for ${item.name}`}
//           >
//             <button
//               className="custom-close"
//               type="button"
//               aria-label="Close inquiry"
//               onClick={() => setOpen(false)}
//             >
//               ×
//             </button>
//             <h2>Inquire about {item.name}</h2>
//             <p>
//               Only the organization admin receives your details. We don't
//               display direct contact details publicly.
//             </p>
//             <form onSubmit={submit}>
//               <label>
//                 Your name *
//                 <input
//                   required
//                   maxLength={120}
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </label>
//               <label>
//                 Phone number *
//                 <input
//                   required
//                   type="tel"
//                   maxLength={25}
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//               </label>
//               {visible("email") && (
//                 <label>
//                   Email (optional)
//                   <input
//                     type="email"
//                     maxLength={200}
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </label>
//               )}
//               {visible("budget") && (
//                 <label>
//                   Budget (optional)
//                   <input
//                     maxLength={120}
//                     value={budget}
//                     onChange={(e) => setBudget(e.target.value)}
//                   />
//                 </label>
//               )}
//               {visible("preferred_callback") && (
//                 <label>
//                   Preferred callback time
//                   <input
//                     maxLength={120}
//                     value={preferredCallback}
//                     onChange={(e) => setPreferredCallback(e.target.value)}
//                   />
//                 </label>
//               )}
//               {visible("visit_preference") && (
//                 <label>
//                   Site visit preference
//                   <input
//                     maxLength={120}
//                     value={visit}
//                     onChange={(e) => setVisit(e.target.value)}
//                   />
//                 </label>
//               )}
//               {visible("message") && (
//                 <label>
//                   Describe your requirements
//                   <textarea
//                     maxLength={3000}
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                   />
//                 </label>
//               )}
//               <button type="submit" disabled={busy}>
//                 {busy ? "Sending…" : "Submit inquiry"}
//               </button>
//               {feedback && <p role="status">{feedback}</p>}
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import { MediaGalleryGrid } from "../components/MediaGalleryGrid";
import { FieldImageContent } from "../components/FieldImageContent";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MessageSquare,
} from "lucide-react";
import { mediaUrl, sendInquiry } from "../api";
import { useSite } from "../main";
import "./custom-pages.css";

const format = (value: any) =>
  typeof value === "boolean" ? (value ? "Yes" : "No") : String(value ?? "");

/* Admin-defined custom fields */
const extraFields = (
  item: any,
  type: any,
  where: "show_on_card" | "show_on_detail",
) =>
  (Array.isArray(type.field_definitions) ? type.field_definitions : []).filter(
    (field: any) =>
      field[where] === true &&
      item.custom_fields?.[field.key] !== undefined &&
      item.custom_fields?.[field.key] !== null &&
      item.custom_fields?.[field.key] !== "",
  );

/* Additional fields entered for an individual listing */
const ownFields = (item: any, where: "show_on_card" | "show_on_detail") =>
  (Array.isArray(item.additional_fields) ? item.additional_fields : []).filter(
    (field: any) =>
      field?.label &&
      field[where] !== false &&
      (where === "show_on_detail" || field.show_on_card === true) &&
      ((field.value !== "" &&
        field.value !== null &&
        field.value !== undefined) ||
        (where === "show_on_detail" &&
          (!!field.image_url || !!field.gallery?.length))),
  );

/* =========================================
   PARTY SERVICES LISTING PAGE
========================================= */

export function CustomPages() {
  const { typeSlug } = useParams();

  const {
    custom_page_types: types = [],
    custom_page_entries: items = [],
  } = useSite();

  const type = types.find((entry: any) => entry.slug === typeSlug);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setQuery("");
    setCategory("All");
  }, [typeSlug]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .filter((item: any) => item.page_type_id === type?.id)
            .map((item: any) => String(item.category || ""))
            .filter(Boolean),
        ),
      ) as string[],
    [items, type],
  );

  const shown = useMemo(
    () =>
      items.filter(
        (item: any) =>
          item.page_type_id === type?.id &&
          (category === "All" || item.category === category) &&
          `${item.name || ""} ${item.location || ""} ${item.category || ""} ${item.description || ""} ${Object.values(item.custom_fields || {}).join(" ")} ${(item.additional_fields || []).map((field: any) => field.value).join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [type, items, query, category],
  );

  if (!type) {
    return (
      <div className="custom-page-wrap">
        <h1>Page unavailable</h1>
        <p>This category is not enabled or published.</p>
      </div>
    );
  }

  return (
    <div className="custom-page-wrap">
      <div className="custom-hero">
        <span>PUBLIC SERVICE &amp; COMMUNITY INITIATIVES</span>

        <h1>{type.hero_title || type.name}</h1>

        <p>
          {type.hero_description ||
            type.description ||
            "Explore community initiatives, activities and public-service work."}
        </p>
      </div>

      <div className="custom-toolbar">
        <b>
          {shown.length} listing{shown.length === 1 ? "" : "s"}
        </b>

        {type.show_search !== false && (
          <input
            aria-label="Search listings"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${type.name.toLowerCase()}…`}
          />
        )}
      </div>

      {type.show_category_filter !== false && categories.length > 0 && (
        <nav
          aria-label="Filter listings by category"
          className="custom-categories"
        >
          {["All", ...categories].map((label) => (
            <button
              type="button"
              className={category === label ? "selected" : ""}
              onClick={() => setCategory(label)}
              key={label}
            >
              {label}
            </button>
          ))}
        </nav>
      )}

      <div
        className={
          "custom-grid " + (type.listing_layout === "compact" ? "compact" : "")
        }
      >
        {shown.map((item: any) => {
          const cardCustomFields = extraFields(item, type, "show_on_card");
          const cardAdditionalFields = ownFields(item, "show_on_card");

          return (
            <article className="custom-card" key={item.id}>
              <Link
                to={`/services/${type.slug}/${item.slug}`}
                className="custom-card-picture"
              >
                {item.image_url ? (
                  <img
                    src={mediaUrl(item.image_url)}
                    alt={item.name}
                    loading="lazy"
                  />
                ) : (
                  <Building2 />
                )}
              </Link>

              <div>
                <h2>{item.name}</h2>

                {(item.short_description || item.description) && (
                  <p>{item.short_description || item.description}</p>
                )}

                {(cardCustomFields.length > 0 ||
                  cardAdditionalFields.length > 0) && (
                  <div className="custom-card-facts">
                    {cardCustomFields.map((field: any) => (
                      <span key={field.key}>
                        <b>{field.label}:</b>{" "}
                        {format(item.custom_fields[field.key])}
                      </span>
                    ))}

                    {cardAdditionalFields.map((field: any) => (
                      <span key={field.key}>
                        <b>{field.label}:</b> {format(field.value)}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  className="custom-link"
                  to={`/services/${type.slug}/${item.slug}`}
                >
                  View full details <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {!shown.length && (
        <div className="custom-empty">
          No published listings match your search or category.
        </div>
      )}
    </div>
  );
}

/* =========================================
   INDIVIDUAL PARTY SERVICE DETAIL PAGE
========================================= */

export function CustomPageDetail() {
  const { typeSlug, itemSlug } = useParams();

  const {
    custom_page_types: types = [],
    custom_page_entries: items = [],
  } = useSite();

  const type = types.find((entry: any) => entry.slug === typeSlug);

  const item = items.find(
    (entry: any) =>
      entry.slug === itemSlug && entry.page_type_id === type?.id,
  );

  const [chosen, setChosen] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setChosen(null);
    setOpen(false);
  }, [itemSlug, typeSlug]);

  if (!type || !item) {
    return (
      <div className="custom-page-wrap">
        <h1>Page unavailable</h1>
        <Link to="/">Return home</Link>
      </div>
    );
  }

  /* Uploaded media */
  const photos = (item.media || []).filter(
    (media: any) => media.media_type === "image",
  );

  const docs = (item.media || []).filter(
    (media: any) => !["image", "video"].includes(media.media_type),
  );

  const cover =
    chosen || photos.find((photo: any) => photo.is_cover) || photos[0];

  /* Only Admin-created custom fields */
  const detailCustomFields = extraFields(item, type, "show_on_detail");

  const detailAdditionalFields = ownFields(item, "show_on_detail");

  /* Optional contact fields */
  const inquiryFields = type.inquiry_fields || {};

  const showEmail = inquiryFields.email !== false;
  const showMessage = inquiryFields.message !== false;

  /* Contact form submission */
  const submit = async (event: FormEvent) => {
    event.preventDefault();

    setBusy(true);
    setFeedback("");

    try {
      await sendInquiry({
        custom_page_entry_id: item.id,
        name,
        phone,
        ...(showEmail ? { email } : {}),
        ...(showMessage ? { message } : {}),
        requirement_type: `${type.name} inquiry`,
      });

      setFeedback(
        "Thank you. Your message has been sent to the organization.",
      );

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      setFeedback(error.message || "Could not submit your message.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="custom-page-wrap">
      <Link className="custom-back" to={`/services/${type.slug}`}>
        <ArrowLeft size={17} /> All {type.name}
      </Link>

      {/* Service heading */}
      <div className="custom-heading">
        <small>{type.name}</small>

        <h1>{item.name}</h1>

        {(item.short_description || item.description) && (
          <p>{item.short_description || item.description}</p>
        )}

        <button type="button" onClick={() => setOpen(true)}>
          <MessageSquare size={17} /> Contact Us
        </button>
      </div>

      <div
        className={
          "custom-detail-grid " + (type.detail_layout === "wide" ? "wide" : "")
        }
      >
        <div>
          {/* Main image */}
          <div className="custom-main-img">
            {cover ? (
              <img src={mediaUrl(cover.url)} alt={item.name} />
            ) : item.image_url ? (
              <img src={mediaUrl(item.image_url)} alt={item.name} />
            ) : (
              <Building2 />
            )}
          </div>

          {/* Image thumbnails */}
          {photos.length > 0 && (
            <div className="custom-thumbs">
              {photos.map((photo: any) => (
                <button
                  type="button"
                  key={photo.id || photo.url}
                  className={cover?.id === photo.id ? "selected" : ""}
                  onClick={() => setChosen(photo)}
                  aria-label={`Show ${photo.title || "service image"}`}
                >
                  <img
                    src={mediaUrl(photo.url)}
                    alt={photo.title || item.name}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Admin custom fields */}
          {detailCustomFields.length > 0 && (
            <section className="custom-content-section">
              <h2>More Information</h2>

              <div className="custom-specifications custom-user-fields">
                {detailCustomFields.map((field: any) => {
                  const fieldMedia =
                    item.custom_field_media?.[field.key] || {};

                  return (
                    <div key={field.key}>
                      <FieldImageContent
                        imageUrl={fieldMedia.image_url}
                        imageAlign={fieldMedia.image_align}
                        gallery={fieldMedia.gallery}
                        alt={field.label}
                      >
                        <b>{field.label}</b>
                        <p>{format(item.custom_fields?.[field.key])}</p>
                      </FieldImageContent>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Additional Admin-created fields */}
          {detailAdditionalFields.length > 0 && (
            <section className="custom-content-section">
              <h2>Additional Details</h2>

              <div className="custom-specifications custom-user-fields">
                {detailAdditionalFields
                  .filter((field: any) => field.type !== "textarea")
                  .map((field: any) => (
                    <div key={field.key}>
                      <FieldImageContent
                        imageUrl={field.image_url}
                        imageAlign={field.image_align}
                        gallery={field.gallery}
                        alt={field.label}
                      >
                        <b>{field.label}</b>
                        <p>{format(field.value)}</p>
                      </FieldImageContent>
                    </div>
                  ))}
              </div>

              {detailAdditionalFields
                .filter((field: any) => field.type === "textarea")
                .map((field: any) => (
                  <div className="custom-long-field" key={field.key}>
                    <FieldImageContent
                      imageUrl={field.image_url}
                      imageAlign={field.image_align}
                      gallery={field.gallery}
                      alt={field.label}
                    >
                      <h3>{field.label}</h3>
                      <p>{format(field.value)}</p>
                    </FieldImageContent>
                  </div>
                ))}
            </section>
          )}

          {/* Uploaded photos and videos */}
          <MediaGalleryGrid
            items={item.media || []}
            title="Photos & Videos"
          />

          {/* Uploaded documents */}
          {docs.length > 0 && (
            <section className="custom-content-section">
              <h2>Documents</h2>

              {docs.map((media: any) => (
                <p key={media.id || media.url}>
                  <a
                    href={mediaUrl(media.url)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {media.title || media.original_name || "Open document"} ↗
                  </a>
                </p>
              ))}
            </section>
          )}
        </div>

        {/* Public-service contact card */}
        <aside className="custom-inquiry-aside">
          <h2>Would you like to connect?</h2>

          <p>
            Have a question, suggestion or message? Get in touch with the team.
          </p>

          <button type="button" onClick={() => setOpen(true)}>
            Send a message <ArrowRight size={17} />
          </button>
        </aside>
      </div>

      {/* Contact form */}
      {open && (
        <div
          className="custom-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            className="custom-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Contact about ${item.name}`}
          >
            <button
              className="custom-close"
              type="button"
              aria-label="Close contact form"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            <h2>Send a Message</h2>

            <p>
              Share your question or suggestion. The organization will receive
              your details.
            </p>

            <form onSubmit={submit}>
              <label>
                Your name *
                <input
                  required
                  maxLength={120}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>

              <label>
                Phone number *
                <input
                  required
                  type="tel"
                  maxLength={25}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>

              {showEmail && (
                <label>
                  Email (optional)
                  <input
                    type="email"
                    maxLength={200}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
              )}

              {showMessage && (
                <label>
                  Your message (optional)
                  <textarea
                    maxLength={3000}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </label>
              )}

              <button type="submit" disabled={busy}>
                {busy ? "Sending…" : "Submit message"}
              </button>

              {feedback && <p role="status">{feedback}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
