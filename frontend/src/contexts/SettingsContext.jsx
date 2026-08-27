import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const fallback={systemName:'XFia Studio',companyName:'XFia Studio',logoUrl:'',defaultCreationFee:500,defaultMonthlyFee:50};
const SettingsContext=createContext({settings:fallback,integrations:{},refresh:async()=>{}});

export function SettingsProvider({children}){
  const{admin}=useAuth();const[settings,setSettings]=useState(fallback),[integrations,setIntegrations]=useState({});
  const refresh=useCallback(async()=>{if(!admin)return;const data=await api('/settings');setSettings({...fallback,...data.settings});setIntegrations(data.integrations||{});return data;},[admin]);
  useEffect(()=>{refresh().catch(()=>{});},[refresh]);
  return <SettingsContext.Provider value={{settings,integrations,refresh,setSettings}}>{children}</SettingsContext.Provider>;
}
export const useSettings=()=>useContext(SettingsContext);
