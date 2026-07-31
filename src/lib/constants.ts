
import { 
  Layout, 
  Palette, 
  Layers, 
  Sparkles, 
  Box, 
  Settings, 
  ShieldCheck, 
  Calendar, 
  Share2, 
  MessageSquare 
} from 'lucide-react';

export interface ServiceOption {
  id: string;
  category: 'Basis' | 'Design' | 'Verwaltung' | 'Dienstleistung';
  title: string;
  simpleDesc: string;
  technicalDesc: string;
  price: number;
  monthlyPrice?: number;
  icon: any;
  benefit: string;
}

export const CALCULATOR_OPTIONS: ServiceOption[] = [
  // Basis
  {
    id: 'base_std',
    category: 'Basis',
    title: 'High-End Webdesign (Basis S/W)',
    simpleDesc: 'Minimalistisches, hochperformantes Design für einen zeitlosen, professionellen Auftritt.',
    technicalDesc: 'Minimalist Design & SEO Setup',
    price: 550,
    icon: Layout,
    benefit: 'Zeitlose Eleganz'
  },
  // Design
  {
    id: 'design_color',
    category: 'Design',
    title: 'Design Upgrade (Bunt)',
    simpleDesc: 'Vollfarbiges Design, perfekt auf Ihre Brand Identity abgestimmt.',
    technicalDesc: 'Full Color Brand Integration',
    price: 250,
    icon: Palette,
    benefit: 'Maximale Markenkraft'
  },
  {
    id: 'anim_2d',
    category: 'Design',
    title: 'Animation 2D (Basis)',
    simpleDesc: 'Flüssige Bewegungen für interaktive Web-Elemente.',
    technicalDesc: 'UI/UX Micro-Interactions',
    price: 80,
    icon: Layers,
    benefit: 'Höhere Interaktionsrate'
  },
  {
    id: 'anim_2d_custom',
    category: 'Design',
    title: 'Personalisierte 2D Animation',
    simpleDesc: 'Speziell für Sie erstellte 2D-Illustrationen und Icons.',
    technicalDesc: 'Custom SVG/Lottie Creation',
    price: 200,
    icon: Sparkles,
    benefit: '100% Einzigartig'
  },
  {
    id: 'anim_3d_custom',
    category: 'Design',
    title: 'Personalisierte 3D Animation',
    simpleDesc: 'Beeindruckende 3D-Effekte und Modelle Ihrer Produkte oder Visionen.',
    technicalDesc: 'WebGL & Three.js Integration',
    price: 299,
    icon: Box,
    benefit: 'Next-Gen Auftritt'
  },
  // Verwaltung
  {
    id: 'mgmt_std',
    category: 'Verwaltung',
    title: 'Standard-Verwaltung',
    simpleDesc: 'Dauerhafte Betreuung, Performance-Optimierung und höchste Sicherheit.',
    technicalDesc: 'Managed Hosting & Support',
    price: 59.99, // Moving monthly price to setup for invoice context if needed, or keeping it
    monthlyPrice: 59.99,
    icon: Settings,
    benefit: 'Sorglose Freiheit'
  },
  {
    id: 'mgmt_full',
    category: 'Verwaltung',
    title: 'Voll-Verwaltung',
    simpleDesc: 'Blitzschnelle Ladezeiten und Inhaltsaktualisierungen durch unsere Experten.',
    technicalDesc: 'Full Managed Services',
    price: 99.99,
    monthlyPrice: 99.99,
    icon: ShieldCheck,
    benefit: 'Maximaler Komfort'
  },
  // Dienstleistung / Automatisierung
  {
    id: 'addon_booking',
    category: 'Dienstleistung',
    title: 'Terminvereinbarung',
    simpleDesc: 'Intelligente Prozesse für nahtlose Terminbuchungen direkt auf Ihrer Website.',
    technicalDesc: 'Booking System Integration',
    price: 74.99,
    icon: Calendar,
    benefit: 'Automatisierter Vertrieb'
  },
  {
    id: 'addon_social',
    category: 'Dienstleistung',
    title: 'Social Media Connection',
    simpleDesc: 'Verknüpfung Ihrer Kanäle für eine konsistente digitale Präsenz.',
    technicalDesc: 'Social API Integration',
    price: 79,
    icon: Share2,
    benefit: 'Höhere Reichweite'
  },
  {
    id: 'addon_maps',
    category: 'Dienstleistung',
    title: 'Google Maps Bewertungen',
    simpleDesc: 'Review-Widget zur Stärkung des Markenvertrauens und SEO-Boost.',
    technicalDesc: 'Maps & Review Integration',
    price: 99,
    icon: MessageSquare,
    benefit: 'Vertrauens-Boost'
  }
];
