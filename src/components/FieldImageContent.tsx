import {type ReactNode} from 'react';
import {mediaUrl} from '../api';
import type {FieldGalleryItem} from '../admin/FieldImageEditor';
import './field-image-content.css';
/** Side image supports left/right alignment. Field gallery is a separate responsive grid. */
export function FieldImageContent({imageUrl,imageAlign='right',gallery=[],alt='',children,className=''}:{imageUrl?:string;imageAlign?:string;gallery?:FieldGalleryItem[];alt?:string;children:ReactNode;className?:string}){
 const photos=Array.isArray(gallery)?gallery.filter(item=>item?.url&&['image','video'].includes(item.media_type)):[];
 return <div className={`field-content-block ${className}`}>
  {imageUrl?<div className={`field-image-content ${imageAlign==='left'?'field-image-left':'field-image-right'}`}><div className="field-image-copy">{children}</div><div className="field-image-picture"><img src={mediaUrl(imageUrl)} loading="lazy" alt={alt}/></div></div>:<>{children}</>}
  {photos.length>0&&<section className="field-public-gallery" aria-label={`${alt||'Custom field'} image and video gallery`}>
   <h3>Gallery</h3><div className="field-public-gallery-grid">{photos.map((item,i)=><figure key={`${item.url}-${i}`}>
    {item.media_type==='video'?<video src={mediaUrl(item.url)} preload="metadata" controls playsInline/>:<a href={mediaUrl(item.url)} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title||'gallery image'}`}><img src={mediaUrl(item.url)} alt={item.title||`${alt} photo ${i+1}`} loading="lazy"/></a>}
    {item.title&&<figcaption>{item.title}</figcaption>}
   </figure>)}</div>
  </section>}
 </div>;
}
