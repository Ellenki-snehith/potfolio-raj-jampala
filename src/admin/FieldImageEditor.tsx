import {useState} from 'react';
import {ImagePlus, Trash2, ArrowUp, ArrowDown, Film} from 'lucide-react';
import {uploadImage, uploadFieldMedia, mediaUrl} from '../api';
import './field-images.css';

export type FieldGalleryItem={url:string;media_type:'image'|'video';title:string};
export type FieldImage={image_url?:string;image_align?:'left'|'right';gallery?:FieldGalleryItem[]};
const LIMIT=24;

/** Side image and a separate multi-image/video gallery for every custom field. */
export function FieldImageEditor({value,onChange,galleryOnly=false}:{value:FieldImage;onChange:(change:FieldImage)=>void;galleryOnly?:boolean}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const items=Array.isArray(value.gallery)?value.gallery:[];
 const update=(patch:FieldImage)=>onChange(patch);
 const uploadCover=async(file?:File)=>{
  if(!file)return;
  if(!file.type.startsWith('image/')){setMessage('Please choose an image.');return;}
  setBusy(true);setMessage('');
  try{const data=new FormData();data.append('file',file);const result:any=await uploadImage(data);update({image_url:result.url});}
  catch(e:any){setMessage(e?.message||'Image upload failed');}finally{setBusy(false);}
 };
 const uploadGallery=async(files:FileList|null)=>{
  if(!files?.length)return;
  if(items.length+files.length>LIMIT){setMessage(`Maximum ${LIMIT} gallery files per field.`);return;}
  setBusy(true);setMessage('');const accepted:FieldGalleryItem[]=[];
  try{
   for(const file of Array.from(files)){
    if(!file.type.startsWith('image/')&&!file.type.startsWith('video/'))throw new Error(`${file.name}: images/videos only`);
    const data=new FormData();data.append('file',file);
    const result:any=await uploadFieldMedia(data);
    accepted.push({url:result.url,media_type:result.media_type,title:result.title||file.name});
   }
  }catch(e:any){setMessage(e?.message||'Some uploads failed');}
  finally{
   if(accepted.length)update({gallery:[...items,...accepted]});
   setBusy(false);
  }
 };
 const move=(index:number,shift:number)=>{const dst=index+shift;if(dst<0||dst>=items.length)return;const next=[...items];[next[index],next[dst]]=[next[dst],next[index]];update({gallery:next});};
 return <div className="field-image-editor">
  {!galleryOnly&&<><div className="field-image-editor-heading">Image beside this custom field (optional)</div>
  <div className="field-image-editor-actions">
   <label className="field-image-upload"><ImagePlus size={16}/>{busy?'Uploading…':'Add / change side image'}<input type="file" accept="image/*" disabled={busy} onChange={e=>{void uploadCover(e.target.files?.[0]);e.target.value='';}}/></label>
   <label className="field-image-alignment">Image position<select value={value.image_align||'right'} onChange={e=>update({image_align:e.target.value as 'left'|'right'})}><option value="left">Left of content</option><option value="right">Right of content</option></select></label>
   {value.image_url&&<button type="button" className="field-image-remove" onClick={()=>update({image_url:''})}><Trash2 size={15}/> Remove side image</button>}
  </div>
  {value.image_url&&<img className="field-image-thumb" src={mediaUrl(value.image_url)} alt="Custom field side image"/>}
  </>}
  <div className="field-gallery-editor">
   <div className="field-image-editor-heading"><Film size={17}/> Separate gallery — multiple photos & videos</div>
   <p>Images are shown in a grid below the field on your website. Videos can be played directly. Up to {LIMIT} items.</p>
   <label className="field-image-upload"><ImagePlus size={16}/>{busy?'Uploading…':`Add photos / videos (${items.length}/${LIMIT})`}
    <input type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime" disabled={busy||items.length>=LIMIT} onChange={e=>{void uploadGallery(e.target.files);e.target.value='';}}/>
   </label>
   {items.length>0&&<div className="field-gallery-admin-grid">{items.map((item,index)=><div className="field-gallery-admin-card" key={`${item.url}-${index}`}>
    {item.media_type==='video'?<video src={mediaUrl(item.url)} preload="metadata" controls/>:<img src={mediaUrl(item.url)} loading="lazy" alt={item.title||`Gallery image ${index+1}`}/>}
    <input aria-label={`Gallery item ${index+1} title`} value={item.title||''} maxLength={150} onChange={e=>update({gallery:items.map((m,i)=>i===index?{...m,title:e.target.value}:m)})}/>
    <div className="field-gallery-tools"><button type="button" aria-label="Move media left" disabled={index===0} onClick={()=>move(index,-1)}><ArrowUp size={14}/></button>
    <button type="button" aria-label="Move media right" disabled={index===items.length-1} onClick={()=>move(index,1)}><ArrowDown size={14}/></button>
    <button type="button" aria-label="Remove media" onClick={()=>update({gallery:items.filter((_,i)=>i!==index)})}><Trash2 size={14}/></button></div>
   </div>)}</div>}
  </div>
  {message&&<p className="field-image-error" role="alert">{message}</p>}
  <small>Save the listing or page after uploading. Uploaded photos and videos appear in a responsive grid.</small>
 </div>;
}
