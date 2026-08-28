import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { CompaniesPage } from './pages/CompaniesPage.jsx';
import { CompanyFormPage } from './pages/CompanyFormPage.jsx';
import { CompanyDetailPage } from './pages/CompanyDetailPage.jsx';
import { TemplatesPage } from './pages/TemplatesPage.jsx';
import { ComingSoonPage } from './pages/ComingSoonPage.jsx';
import { SitesPage } from './pages/SitesPage.jsx';
import { PublishedSiteEditorPage } from './pages/PublishedSiteEditorPage.jsx';
import { PublicPreviewPage } from './pages/PublicPreviewPage.jsx';
import { ClientsPage } from './pages/ClientsPage.jsx';
import { SubscriptionsPage } from './pages/SubscriptionsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { SettingsProvider } from './contexts/SettingsContext.jsx';
import { PublicSiteGeneratorPage } from './pages/PublicSiteGeneratorPage.jsx';
import { getTenantHostname } from './services/api.js';

export default function App() {
  const tenantHostname=getTenantHostname();
  if(tenantHostname)return <BrowserRouter><Routes><Route path="*" element={<PublicPreviewPage hostname={tenantHostname}/>}/></Routes></BrowserRouter>;
  return <BrowserRouter><AuthProvider><SettingsProvider><Routes>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/preview/:slug" element={<PublicPreviewPage/>}/>
    <Route path="/criar-site" element={<PublicSiteGeneratorPage/>}/>
    <Route element={<ProtectedRoute/>}><Route element={<AdminLayout/>}>
      <Route index element={<DashboardPage/>}/>
      <Route path="empresas" element={<CompaniesPage/>}/>
      <Route path="empresas/nova" element={<CompanyFormPage/>}/>
      <Route path="empresas/:id" element={<CompanyDetailPage/>}/>
      <Route path="empresas/:id/editar" element={<CompanyFormPage/>}/>
      <Route path="templates" element={<TemplatesPage/>}/>
      <Route path="sites" element={<SitesPage/>}/>
      <Route path="sites/:id" element={<PublishedSiteEditorPage/>}/>
      <Route path="clientes" element={<ClientsPage/>}/>
      <Route path="mensalidades" element={<SubscriptionsPage/>}/>
      <Route path="configuracoes" element={<SettingsPage/>}/>
    </Route></Route>
    <Route path="*" element={<ComingSoonPage title="Página não encontrada" stage="—"/>}/>
  </Routes></SettingsProvider></AuthProvider></BrowserRouter>;
}
