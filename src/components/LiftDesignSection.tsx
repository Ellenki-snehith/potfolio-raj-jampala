import { MapPin, Users, Ruler } from 'lucide-react';
import { mediaUrl } from '../api';
import { ShowcaseCard, ShowcaseSection } from './HomeShowcase';

export default function LiftDesignSection({ designs = [] }: { designs?: any[] }) {
  const featured = (Array.isArray(designs) ? designs : []).filter((x) => x?.featured).slice(0, 6);
  return <ShowcaseSection id="home-lifts" eyebrow="LIFT DESIGN PROJECTS" title="A new level of lift design" description="Browse lift projects combining comfort, engineering and thoughtful aesthetics." tone="white" to="/lift-designs" actionLabel="View all lift designs" empty={!featured.length} emptyText="Explore our lift design projects and custom configurations.">
    {featured.map((x) => <ShowcaseCard key={x.id}
      to={`/lift-designs/${x.id}`}
      image={x.image_url ? mediaUrl(x.image_url) : undefined}
      title={x.title || 'Lift project'}
      badge={x.lift_type || 'Lift project'}
      category={[x.lift_type, x.location].filter(Boolean).join(' · ')}
      price={x.price || 'Custom quotation'}
      description={x.description}
      meta={[
        ...(x.lift_capacity ? [{ icon: <Users aria-hidden="true" />, label: String(x.lift_capacity) }] : []),
        ...(x.location ? [{ icon: <MapPin aria-hidden="true" />, label: x.location }] : []),
        ...(x.area ? [{ icon: <Ruler aria-hidden="true" />, label: String(x.area) }] : []),
      ]}
      action="Explore this lift"
    />)}
  </ShowcaseSection>;
}
