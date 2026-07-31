export type Service = {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  features: string; // JSON string of features per language
  process: string;  // JSON string of process steps per language
  tech: string;     // JSON string of technologies
  faqs: string;     // JSON string of FAQs per language
  created_at: string;
};

export type Appointment = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  created_at: string;
  services?: Service;
};

export type BusinessHours = {
  id: string;
  weekday: number; // 0 (Sunday) to 6 (Saturday)
  is_open: boolean;
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
};

export type BlockedDate = {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string | null;
  created_at: string;
};

export type BusinessSettings = {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  enabled_languages: string; // Comma-separated language codes, e.g., "en,de"
  booking_phone_required: boolean;
  booking_phone_visible: boolean;
  booking_email_required: boolean;
  booking_email_visible: boolean;
  iban?: string;
  bic?: string;
  bank_name?: string;
  tax_id?: string;
  vat_id?: string;
  website?: string;
  created_at: string;
};

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
};

export type Invoice = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  service_date: string;
  due_date_days: number;
  due_date: string;
  customer_company: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_street: string;
  customer_zip: string;
  customer_city: string;
  customer_country: string;
  items: InvoiceItem[];
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  notes: string;
  created_at: string;
};

export type Contract = {
  id: string;
  contract_number: string;
  contract_date: string;
  start_date: string;
  end_date?: string;
  contract_type: string;
  project_name: string;
  customer_company: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_street: string;
  customer_zip: string;
  customer_city: string;
  customer_country: string;
  description: string;
  scope: string;
  responsibilities: string;
  timeline: string;
  deliverables: string;
  payment_terms: string;
  cancellation_terms: string;
  warranty: string;
  other_agreements: string;
  total_price?: number;
  hourly_rate?: number;
  estimated_hours?: number;
  payment_interval: 'one-time' | 'monthly' | 'yearly';
  currency: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  created_at: string;
};

export type AdminUser = {
  id: string;
  user_id: string;
  created_at: string;
};
