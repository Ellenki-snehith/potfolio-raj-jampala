import {FieldImageEditor} from './FieldImageEditor';
import {ArrowDown,ArrowUp,Plus,Trash2} from 'lucide-react';
import './additional-fields.css';
export type AdditionalField={key:string;label:string;type:'text'|'textarea'|'number'|'select'|'date'|'checkbox';value:string|number|boolean;options:string[];show_on_card:boolean;show_on_detail:boolean;image_url?:string;image_align?:'left'|'right';gallery?:import('./FieldImageEditor').FieldGalleryItem[]};
export const newAdditionalField=():AdditionalField=>({key:`f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,9)}`,label:'',type:'text',value:'',options:[],show_on_card:false,show_on_detail:true,image_url:'',image_align:'right'});
const TYPES=[['text','Short text'],['textarea','Long description'],['number','Number'],['select','Dropdown'],['date','Date'],['checkbox','Yes / No']] as const;
export function AdditionalFieldsEditor({fields,onChange}:{fields:AdditionalField[];onChange:(fields:AdditionalField[])=>void}){
 const rows=Array.isArray(fields)?fields:[];
 const edit=(idx:number,patch:Partial<AdditionalField>)=>onChange(rows.map((x,i)=>i===idx?{...x,...patch}:x));
 const remove=(idx:number)=>onChange(rows.filter((_,i)=>i!==idx));
 const move=(idx:number,delta:number)=>{const pos=idx+delta;if(pos<0||pos>=rows.length)return;const next=[...rows];[next[idx],next[pos]]=[next[pos],next[idx]];onChange(next)};
 return <fieldset className="existing-custom-fields"><legend>Custom fields for this listing</legend><p className="existing-field-intro">Add your own details to this property, construction, civil service, interior or lift listing. Up to 30 fields; fields marked for display will appear on its public details page.</p>
 {rows.map((f,i)=><div className="existing-field-row" key={f.key}>
  <div className="existing-field-row-head"><b>Custom field {i+1}</b><div><button type="button" title="Move up" disabled={i===0} onClick={()=>move(i,-1)}><ArrowUp size={15}/></button><button type="button" title="Move down" disabled={i===rows.length-1} onClick={()=>move(i,1)}><ArrowDown size={15}/></button><button type="button" title="Remove field" className="remove" onClick={()=>remove(i)}><Trash2 size={15}/></button></div></div>
  <div className="existing-field-columns"><label>Field name *<input required maxLength={100} placeholder="e.g. Warranty period" value={f.label} onChange={e=>edit(i,{label:e.target.value})}/></label>
  <label>Field type<select value={f.type} onChange={e=>{const t=e.target.value as AdditionalField['type'];edit(i,{type:t,value:t==='checkbox'?false:'',options:t==='select'?['Standard','Premium']:[]})}}>{TYPES.map(([type,label])=><option key={type} value={type}>{label}</option>)}</select></label></div>
  {f.type==='select'&&<label>Dropdown options (one per line)<textarea rows={2} value={(f.options||[]).join('\n')} onChange={e=>{const options=e.target.value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,40);edit(i,{options,value:options.includes(String(f.value))?f.value:''})}}/></label>}
  <label>Field value{f.type==='textarea'?<textarea rows={3} maxLength={5000} value={String(f.value??'')} onChange={e=>edit(i,{value:e.target.value})}/>:f.type==='select'?<select value={String(f.value??'')} onChange={e=>edit(i,{value:e.target.value})}><option value="">Select value</option>{(f.options||[]).map(o=><option key={o}>{o}</option>)}</select>:f.type==='checkbox'?<span className="existing-checkbox-value"><input type="checkbox" checked={f.value===true} onChange={e=>edit(i,{value:e.target.checked})}/> Yes</span>:<input type={f.type==='number'?'number':f.type==='date'?'date':'text'} maxLength={f.type==='text'?500:undefined} value={String(f.value??'')} onChange={e=>edit(i,{value:f.type==='number'?(e.target.value===''?'':Number(e.target.value)):e.target.value})}/>}</label>
  <FieldImageEditor value={f} onChange={change=>edit(i,change)}/>
  <div className="existing-field-display"><label><input type="checkbox" checked={f.show_on_detail!==false} onChange={e=>edit(i,{show_on_detail:e.target.checked})}/> Show on details page</label><label><input type="checkbox" checked={f.show_on_card===true} onChange={e=>edit(i,{show_on_card:e.target.checked})}/> Show on listing card</label></div>
 </div>)}
 <button className="existing-field-add" type="button" disabled={rows.length>=30} onClick={()=>onChange([...rows,newAdditionalField()])}><Plus size={17}/> Add custom field</button>
 <p className="existing-field-intro">The fields belong only to this listing. Removing a field removes it from the public page when you save; gallery and inquiries remain unchanged.</p>
 </fieldset>
}
