import {FieldImageContent} from './FieldImageContent';
import './listing-extra-details.css';

type Field = {
  key?: string;
  label?: string;
  type?: string;
  value?: string | number | boolean | null;
  show_on_detail?: boolean;
  show_on_card?: boolean;
  image_url?: string;
  image_align?: string;
  gallery?: {url:string;media_type:'image'|'video';title:string}[];
};

/**
 * Renders user-created fields as individually titled detail sections.
 * Existing listing-card badges are intentionally left unchanged.
 * Shared by Property, Construction, Civil, Interior and Lift detail pages.
 */
export function ListingExtraDetails({ fields, card = false }: { fields?: Field[]; card?: boolean }) {
  if (!Array.isArray(fields)) return null;

  const visible = fields.filter(
    (field) =>
      field &&
      typeof field.label === 'string' &&
      field.label.trim() &&
      (card ? field.show_on_card === true : field.show_on_detail !== false) &&
      ((field.value !== null && field.value !== undefined && field.value !== '' && !(field.type === 'checkbox' && field.value === false)) || (!card && (Boolean(field.image_url)||Boolean(field.gallery?.length))))
  );

  if (!visible.length) return null;

  if (card) {
    return (
      <div className="listing-extra-badges">
        {visible.slice(0, 4).map((field, index) => (
          <span key={field.key || index}>
            <b>{field.label}:</b> {field.type === 'checkbox' ? 'Yes' : String(field.value)}
          </span>
        ))}
      </div>
    );
  }

  return (
    <>
      {visible.map((field, index) => (
        <section
          className="listing-extra-section"
          aria-label={field.label!.trim()}
          key={field.key || index}
        >
          <FieldImageContent imageUrl={field.image_url} imageAlign={field.image_align} gallery={field.gallery} alt={field.label}>
            <h2>{field.label!.trim()}</h2>
            {field.value!==null&&field.value!==undefined&&field.value!==''&&<p className="listing-extra-value">{field.type === 'checkbox' ? (field.value?'Yes':'No') : String(field.value)}</p>}
          </FieldImageContent>
        </section>
      ))}
    </>
  );
}
