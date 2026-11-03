import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata:Metadata={title:'SewaJelas — Ruang Latihan',description:'Latih asisten hunianmu. Percakapan yang nyaman, kebutuhan yang lebih jelas.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg',apple:'/icon-192.png'},appleWebApp:{capable:true,statusBarStyle:'default',title:'SewaJelas'}};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#f8f7f2'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>;}
