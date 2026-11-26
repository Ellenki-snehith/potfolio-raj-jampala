import { mediaUrl } from "../api";
import "./media-gallery-grid.css";
export type PublicGalleryItem = {
  id?: string;
  url: string;
  media_type: string;
  title?: string;
  original_name?: string;
  published?: boolean;
};
/** Independent photos/videos gallery; document downloads remain handled elsewhere. */
export function MediaGalleryGrid({
  items = [],
  title = "Photo & video gallery",
  showCaptions = true,
}: {
  items?: PublicGalleryItem[];
  title?: string;
  showCaptions?: boolean;
}) {
  const visible = items.filter(
    (item) =>
      item?.url &&
      item.published !== false &&
      (item.media_type === "image" || item.media_type === "video"),
  );
  if (!visible.length) return null;
  return (
    <section className="listing-gallery-section" aria-label={title}>
      <div className="listing-gallery-heading">
        <span>MEDIA GALLERY</span>
        <h2>{title}</h2>
        <p>
          {visible.filter((x) => x.media_type === "image").length} photos ·{" "}
          {visible.filter((x) => x.media_type === "video").length} videos
        </p>
      </div>
      <div className="listing-gallery-grid">
        {visible.map((item, index) => (
          <figure
            key={item.id || `${item.url}-${index}`}
            className="listing-gallery-tile"
          >
            {item.media_type === "video" ? (
              <video
                controls
                playsInline
                preload="metadata"
                src={mediaUrl(item.url)}
              />
            ) : (
              <a
                href={mediaUrl(item.url)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${item.title || "image"}`}
              >
                <img
                  src={mediaUrl(item.url)}
                  alt={item.title || `Gallery photo ${index + 1}`}
                  loading="lazy"
                />
              </a>
            )}
            {showCaptions && (
              <figcaption>
                {item.title ||
                  item.original_name ||
                  (item.media_type === "video"
                    ? "Project video"
                    : `Photo ${index + 1}`)}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
