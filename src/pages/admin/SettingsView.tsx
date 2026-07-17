import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BusinessSettings, BusinessHours, BlockedDate } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  
  const { register: registerSettings, handleSubmit: handleSettingsSubmit, reset: resetSettings } = useForm<BusinessSettings>();

  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  const fetchData = async () => {
    const [{ data: s }, { data: h }, { data: b }] = await Promise.all([
      supabase.from('business_settings').select('*').limit(1).single(),
      supabase.from('business_hours').select('*').order('weekday'),
      supabase.from('blocked_dates').select('*').order('blocked_date', { ascending: true })
    ]);
    
    if (s) {
      setSettings(s);
      resetSettings(s);
    }
    
    if (h) {
      // Ensure all 7 days exist in local state
      const allDays = Array.from({ length: 7 }, (_, i) => {
        const existing = h.find(hd => hd.weekday === i);
        return existing || { weekday: i, is_open: false, start_time: '09:00:00', end_time: '17:00:00', id: `temp-${i}` };
      });
      setHours(allDays as BusinessHours[]);
    }
    
    if (b) setBlockedDates(b);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSaveSettings = async (data: BusinessSettings) => {
    setIsSaving(true);
    if (settings?.id) {
      await supabase.from('business_settings').update(data).eq('id', settings.id);
    } else {
      await supabase.from('business_settings').insert(data);
    }
    setIsSaving(false);
    alert('Settings saved successfully');
    fetchData();
  };

  const handleHourChange = (index: number, field: keyof BusinessHours, value: any) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
  };

  const saveHours = async () => {
    setIsSaving(true);
    for (const h of hours) {
      if (h.id.toString().startsWith('temp-')) {
        const { id, ...rest } = h;
        await supabase.from('business_hours').insert(rest);
      } else {
        await supabase.from('business_hours').update({
          is_open: h.is_open,
          start_time: h.start_time,
          end_time: h.end_time
        }).eq('id', h.id);
      }
    }
    setIsSaving(false);
    alert('Business hours saved successfully');
    fetchData();
  };

  const addBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    
    await supabase.from('blocked_dates').insert({
      blocked_date: newBlockedDate,
      reason: newBlockedReason || null
    });
    
    setNewBlockedDate('');
    setNewBlockedReason('');
    fetchData();
  };

  const deleteBlockedDate = async (id: string) => {
    await supabase.from('blocked_dates').delete().eq('id', id);
    fetchData();
  };

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert(err.message || 'Failed to update password. Note: If you are logged in with emergency credentials, this action is restricted.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-gray-400">Manage your business profile and availability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Business Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>Company information visible to clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSettingsSubmit(onSaveSettings)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">Business Name</label>
                <Input {...registerSettings('business_name')} placeholder="Zetta Digital" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">Business Email</label>
                <Input type="email" {...registerSettings('business_email')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">Business Phone</label>
                <Input {...registerSettings('business_phone')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">Business Address</label>
                <Input {...registerSettings('business_address')} />
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Slot Interval (mins)</label>
                  <Input type="number" {...registerSettings('slot_interval_minutes', { valueAsNumber: true })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Booking Notice (hours)</label>
                  <Input type="number" {...registerSettings('booking_notice_hours', { valueAsNumber: true })} />
                </div>
              </div>
              <Button type="submit" isLoading={isSaving} className="mt-4">
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
              <CardDescription>Define your weekly availability.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hours.map((h, i) => (
                  <div key={h.weekday} className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg">
                    <div className="flex items-center w-32">
                      <input 
                        type="checkbox" 
                        checked={h.is_open} 
                        onChange={(e) => handleHourChange(i, 'is_open', e.target.checked)}
                        className="mr-3 rounded border-white/20 text-white focus:ring-neon-500/50"
                      />
                      <span className="text-sm font-medium">{daysOfWeek[h.weekday]}</span>
                    </div>
                    {h.is_open ? (
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="time" 
                          value={h.start_time} 
                          onChange={(e) => handleHourChange(i, 'start_time', e.target.value)}
                          className="w-32 h-8 text-sm"
                        />
                        <span className="text-gray-500">to</span>
                        <Input 
                          type="time" 
                          value={h.end_time} 
                          onChange={(e) => handleHourChange(i, 'end_time', e.target.value)}
                          className="w-32 h-8 text-sm"
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic px-4">Closed</div>
                    )}
                  </div>
                ))}
                <Button onClick={saveHours} isLoading={isSaving} className="w-full mt-4">
                  Save Hours
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blocked Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Blocked Dates</CardTitle>
              <CardDescription>Add specific dates when you are unavailable.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addBlockedDate} className="flex items-end gap-2 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-100 mb-1">Date</label>
                  <Input type="date" value={newBlockedDate} onChange={e => setNewBlockedDate(e.target.value)} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-100 mb-1">Reason (Optional)</label>
                  <Input value={newBlockedReason} onChange={e => setNewBlockedReason(e.target.value)} placeholder="e.g. Holiday" />
                </div>
                <Button type="submit">Add</Button>
              </form>

              <div className="space-y-2">
                {blockedDates.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No blocked dates.</p>
                ) : (
                  blockedDates.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                      <div>
                        <div className="font-medium text-sm text-white">{format(parseISO(b.blocked_date), 'MMM d, yyyy')}</div>
                        {b.reason && <div className="text-xs text-gray-400">{b.reason}</div>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteBlockedDate(b.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">New Password</label>
                  <Input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Confirm New Password</label>
                  <Input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                  />
                </div>
                <Button type="submit" isLoading={isChangingPassword} className="w-full">
                  Update Password
                </Button>
                <p className="text-[10px] text-gray-500 italic mt-2">
                  * Password changes only apply to real accounts. Emergency access credentials are fixed in system code.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
