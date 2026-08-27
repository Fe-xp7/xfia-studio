import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublishButton } from '../components/PublishButton.jsx';
import { api } from '../services/api.js';
import { SiteEditorPage } from './SiteEditorPage.jsx';

export function PublishedSiteEditorPage(){
  const{id}=useParams();const[site,setSite]=useState(null);
  const load=useCallback(()=>{api(`/sites/${id}`).then(setSite).catch(()=>{});},[id]);useEffect(()=>{load();},[load]);
  return <div className="published-editor-wrapper"><SiteEditorPage/>{site&&<div className="editor-publish-floating"><PublishButton site={site} onPublished={setSite}/></div>}</div>;
}
