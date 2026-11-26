import {FieldImageEditor,type FieldImage} from './FieldImageEditor';
import React from 'react';

export type FoundationField = {
 key:string; label:string;kind:'text'|'textarea'|'number'|'date'|'datetime-local'|'url'|'select'|'list'|'boolean';
 group?:string;options?:string[];hint?:string;required?:boolean;
};
export type FoundationFieldValues=Record<string,string|string[]|boolean>;
type Props={schema:FoundationField[];values:FoundationFieldValues;onChange:(v:FoundationFieldValues)=>void;prefix?:string;media?:Record<string,FieldImage>;onMediaChange?:(v:Record<string,FieldImage>)=>void};

/** Fields are supplied by the backend for the selected Foundation page or record type. */
export function FoundationFieldEditor({schema,values,onChange,prefix='foundation',media={},onMediaChange}:Props){
 if(!schema?.length)return null;
 const groups=Array.from(new Set(schema.map(f=>f.group||'Details')));
 const set=(key:string,value:string|string[]|boolean)=>onChange({...values,[key]:value});
 return <div className="fd-schema-fields">
   {groups.map(group=><section className="fd-schema-group" key={group}>
     <div className="fd-schema-group-heading"><h3>{group}</h3><small>Fields customized for this page</small></div>
     <div className="fd-schema-grid">{schema.filter(f=>(f.group||'Details')===group).map(field=>{
       const v=values?.[field.key];const id=`${prefix}-${field.key}`;
       return <div className={`fd-schema-control ${['textarea','list'].includes(field.kind)?'fd-schema-wide':''}`} key={field.key}>
         {field.kind==='boolean'?<label className="fd-schema-checkbox" htmlFor={id}>
           <input id={id} type="checkbox" checked={v===true} onChange={e=>set(field.key,e.target.checked)}/>{field.label}
         </label>:<><label htmlFor={id}>{field.label}{field.required?' *':''}</label>
         {field.kind==='textarea'||field.kind==='list'?<textarea id={id} rows={field.kind==='list'?4:5}
           value={Array.isArray(v)?v.join('\n'):String(v??'')}
           placeholder={field.kind==='list'?'Enter one item per line':''}
           onChange={e=>set(field.key,field.kind==='list'?e.target.value.split('\n'):e.target.value)}/>
           :field.kind==='select'?<select id={id} value={String(v??'')} required={field.required} onChange={e=>set(field.key,e.target.value)}>
             <option value="">Select {field.label.toLowerCase()}</option>{(field.options||[]).map(o=><option key={o} value={o}>{o}</option>)}
           </select>:<input id={id} type={field.kind} required={field.required}
             value={typeof v==='string'?v:''} onChange={e=>set(field.key,e.target.value)}/>}
         </>}
         {field.hint&&<small>{field.hint}</small>}
         {onMediaChange&&<FieldImageEditor value={media[field.key]||{}} onChange={change=>onMediaChange({...media,[field.key]:{...(media[field.key]||{}),...change}})}/>}
       </div>})}</div>
   </section>)}
 </div>;
}
