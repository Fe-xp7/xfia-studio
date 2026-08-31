import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRoutes } from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { uploadsDirectory } from './services/storage/localStorage.js';
import { AppError } from './utils/AppError.js';

export const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({origin(origin,callback){
  if(!origin)return callback(null,true);
  const normalized=origin.replace(/\/$/,'');
  if(env.clientUrls.includes(normalized)||normalized===env.publicSiteUrl)return callback(null,true);
  try{
    const url=new URL(normalized),base=env.publicSiteBaseDomain.split(':')[0];
    const isTenant=url.hostname.endsWith(`.${base}`)&&url.hostname.slice(0,-base.length-1).length>0;
    const allowedProtocol=process.env.NODE_ENV==='production'?url.protocol==='https:':['http:','https:'].includes(url.protocol);
    if(isTenant&&allowedProtocol)return callback(null,true);
  }catch{}
  callback(new AppError('Origem não autorizada pelo CORS.',403));
},credentials:false}));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadsDirectory, { maxAge:'7d', immutable:true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);
