'use client';
import { useEffect,useRef,useState } from 'react';
import { Copy,MoreHorizontal,Share2,TextSelect,X } from 'lucide-react';

export function MessageActions({text,notify}:{text:string;notify:(message:string)=>void}){
 const [panel,setPanel]=useState<'menu'|'select'|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);const selection=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{if(panel){dialog.current?.showModal();if(panel==='select')selection.current?.focus();}else dialog.current?.close();},[panel]);
 async function copy(){
  try{
   if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
   else{
    const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';
    // The active dialog is the only interactive subtree when open.
    (dialog.current?.open?dialog.current:document.body).appendChild(input);input.select();
    const ok=document.execCommand('copy');input.remove();if(!ok)throw new Error('clipboard');
   }
   notify('Pesan disalin.');setPanel(null);
  }catch{setPanel('select');notify('Pilih teks lalu gunakan Salin di perangkatmu.');}
 }
 async function share(){
  if(!navigator.share){await copy();return;}
  try{await navigator.share({text});setPanel(null);}catch(e){if((e as Error).name!=='AbortError')notify('Belum bisa dibagikan. Gunakan Salin atau pilih teks.');}
 }
 return <>
  <button onClick={()=>void copy()} aria-label="Salin pesan"><Copy size={14}/><span>Salin</span></button>
  <button onClick={()=>setPanel('menu')} aria-label="Opsi pesan" aria-haspopup="dialog"><MoreHorizontal size={17}/></button>
  <dialog ref={dialog} className="modal message-action-dialog" aria-label={panel==='select'?'Pilih teks pesan':'Opsi pesan'} onCancel={()=>setPanel(null)} onClick={e=>{if(e.target===e.currentTarget)setPanel(null);}}>
   <div className="modal-head"><h2>{panel==='select'?'Pilih teks':'Opsi pesan'}</h2><button className="icon-button" aria-label="Tutup opsi pesan" onClick={()=>setPanel(null)}><X size={20}/></button></div>
   {panel==='menu'?<div className="message-action-list"><button onClick={()=>void copy()}><Copy size={20}/> Salin pesan</button><button onClick={()=>setPanel('select')}><TextSelect size={20}/> Pilih teks</button><button onClick={()=>void share()}><Share2 size={20}/> {typeof navigator!=='undefined'&&typeof navigator.share==='function'?'Bagikan pesan':'Salin untuk dibagikan'}</button></div>:<><p className="modal-intro">Tekan lama atau geser untuk memilih bagian yang ingin disalin.</p><textarea ref={selection} className="selectable-message" aria-label="Teks pesan" value={text} readOnly rows={9}/><div className="modal-actions"><button className="secondary-button" onClick={()=>selection.current?.select()}>Pilih semua</button><button className="primary-button" onClick={()=>void copy()}>Salin seluruh pesan</button></div></>}
  </dialog>
 </>;
}
