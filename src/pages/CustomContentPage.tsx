import {Link,useParams} from 'react-router-dom';
import {useSite} from '../main';
import {SiteContentSections, type PublishedPage} from '../components/SiteContentSections';

export function CustomContentPage(){
  const {slug}=useParams();
  const {organization,page_content}=useSite();
  const pages:PublishedPage[]=organization.features?.custom_content_pages?(page_content?.custom_content_pages||[]):[];
  const page=pages.find(p=>p.slug===slug&&p.published!==false);
  if(!page)return <div className="state"><h1>Page unavailable</h1><p>This page is not published.</p><Link to="/">Back to home</Link></div>;
  return <><section className="page-hero"><span>{organization.name}</span><h1>{page.title}</h1>{page.subtitle&&<p>{page.subtitle}</p>}</section><SiteContentSections sections={page.sections}/></>;
}
