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
  created_at: string;
};

export type AdminUser = {
  id: string;
  user_id: string;
  created_at: string;
};
