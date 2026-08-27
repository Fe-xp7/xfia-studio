import { useRef, useState } from 'react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { api } from '../services/api.js';

export function ImageUploader({multiple=false,onUploaded,label='Enviar imagem'}){
  const input=useRef(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const upload=async(event)=>{const files=[...event.target.files];if(!files.length)return;setBusy(true);setError('');try{const body=new FormData();files.forEach(file=>body.append('images',file));const result=await api('/uploads/images',{method:'POST',body});onUploaded(result.files.map(file=>file.url))}catch(e){setError(e.message)}finally{setBusy(false);event.target.value=''}};
  return <div className="image-uploader"><input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} onChange={upload}/><button type="button" onClick={()=>input.current?.click()} disabled={busy}>{busy?<LoaderCircle className="upload-spin"/>:<ImagePlus/>}{busy?'Enviando...':label}</button><small>JPG, PNG ou WebP · máximo 5 MB por imagem</small>{error&&<span>{error}</span>}</div>;
}
