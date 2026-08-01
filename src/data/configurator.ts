import React from 'react';
import { 
  Monitor, 
  Layout, 
  Palette, 
  Zap, 
  Settings, 
  BarChart3, 
  Bot, 
  Globe, 
  Server 
} from 'lucide-react';

export interface Option {
  id: string;
  name: string;
  price: number;
  monthly?: boolean;
  desc?: string;
  category: string;
  required?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Store icon name as string for easier serialization/lookup if needed
  options: Option[];
  multiple?: boolean;
}

export const CONFIG_DATA: Category[] = [
  {
    id: 'base',
    name: '1. Website (Pflicht)',
    iconName: 'Monitor',
    options: [
      { 
        id: 'p_starter', 
        name: 'Standard Website', 
        price: 550, 
        category: 'base', 
        desc: 'Inklusive 4 Seiten: Startseite, Über uns, Kontakt, Impressum & Datenschutz' 
      },
    ],
  },
  {
    id: 'pages',
    name: '2. Seitenanzahl',
    iconName: 'Layout',
    options: [], 
  },
  {
    id: 'design',
    name: '3. Design & Branding',
    iconName: 'Palette',
    multiple: true,
    options: [
      { id: 'd_branding', name: 'Individuelles Branding', price: 150, category: 'design' },
      { id: 'd_ui', name: 'Premium UI Design', price: 250, category: 'design' },
      { id: 'd_dark', name: 'Dark Mode', price: 80, category: 'design' },
      { id: 'd_logo', name: 'Logo Design', price: 120, category: 'design' },
    ],
  },
  {
    id: 'animations',
    name: '4. Animationen',
    iconName: 'Zap',
    multiple: true,
    options: [
      { id: 'a_2d', name: '2D Animation', price: 80, category: 'animations' },
      { id: 'a_2d_custom', name: 'Individuelle 2D Animation', price: 200, category: 'animations' },
      { id: 'a_3d', name: '3D Animation', price: 180, category: 'animations' },
      { id: 'a_3d_custom', name: 'Individuelle 3D Animation', price: 299, category: 'animations' },
      { id: 'a_sound', name: 'Soundeffekte', price: 79, category: 'animations' },
    ],
  },
  {
    id: 'functions',
    name: '5. Funktionen',
    iconName: 'Settings',
    multiple: true,
    options: [
      { id: 'f_form', name: 'Kontaktformular', price: 0, category: 'functions', desc: 'Inklusive' },
      { id: 'f_maps', name: 'Google Maps', price: 25, category: 'functions' },
      { id: 'f_wa', name: 'WhatsApp Button', price: 30, category: 'functions' },
      { id: 'f_booking', name: 'Terminbuchung', price: 129, category: 'functions' },
      { id: 'f_news', name: 'Newsletter', price: 120, category: 'functions' },
      { id: 'f_blog', name: 'Blog', price: 150, category: 'functions' },
      { id: 'f_lang', name: 'Mehrsprachigkeit', price: 200, category: 'functions' },
      { id: 'f_cookie', name: 'Cookie Banner', price: 0, category: 'functions', desc: 'Inklusive' },
    ],
  },
  {
    id: 'marketing',
    name: '6. Marketing',
    iconName: 'BarChart3',
    multiple: true,
    options: [
      { id: 'm_rev', name: 'Google Bewertungen', price: 99, category: 'marketing' },
      { id: 'm_social', name: 'Social Media Verbindung', price: 70, category: 'marketing', monthly: true, desc: '70€ / Monat' },
      { id: 'm_insta', name: 'Instagram Feed', price: 70, category: 'marketing' },
      { id: 'm_fb', name: 'Facebook Feed', price: 70, category: 'marketing' },
      { id: 'm_seo_base', name: 'SEO Basis', price: 150, category: 'marketing' },
      { id: 'm_seo_premium', name: 'Premium SEO', price: 390, category: 'marketing' },
      { id: 'm_analytics', name: 'Google Analytics', price: 70, category: 'marketing' },
    ],
  },
  {
    id: 'ai',
    name: '7. KI & Automation',
    iconName: 'Bot',
    multiple: true,
    options: [
      { id: 'ai_bot', name: 'Chatbot Einrichtung', price: 299, category: 'ai' },
      { id: 'ai_data', name: 'Chatbot Datenpflege', price: 15, category: 'ai', desc: 'je Datensatz' },
      { id: 'ai_form', name: 'Kontaktformular-KI', price: 25, category: 'ai', monthly: true, desc: '25€ / Monat' },
      { id: 'ai_email', name: 'Email Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_sheets', name: 'Google Sheets Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_sm_auto', name: 'Social Media Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_crm', name: 'CRM Automation', price: 79, category: 'ai', monthly: true, desc: '79€ / Monat' },
      { id: 'ai_wa_auto', name: 'WhatsApp Automation', price: 79, category: 'ai', monthly: true, desc: '79€ / Monat' },
    ],
  },
  {
    id: 'maintenance',
    name: '8. Verwaltung',
    iconName: 'Globe',
    options: [
      { id: 'v_none', name: 'Keine', price: 0, category: 'maintenance' },
      { id: 'v_standard', name: 'Standard Verwaltung', price: 59, category: 'maintenance', monthly: true, desc: '59€ / Monat' },
      { id: 'v_komplett', name: 'Komplett Verwaltung', price: 99, category: 'maintenance', monthly: true, desc: '99€ / Monat' },
    ],
  },
  {
    id: 'hosting',
    name: '9. Domain & Hosting',
    iconName: 'Server',
    multiple: true,
    options: [
      { id: 'h_vercel', name: 'Vercel Subdomain', price: 0, category: 'hosting', desc: 'Kostenlos' },
      { id: 'h_de', name: '.de Domain', price: 0, category: 'hosting', desc: 'nach Anbieter' },
      { id: 'h_com', name: '.com Domain', price: 0, category: 'hosting', desc: 'nach Anbieter' },
      { id: 'h_setup', name: 'Hosting Einrichtung', price: 0, category: 'hosting', desc: 'Inklusive' },
    ],
  },
];
