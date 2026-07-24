export function migrateLocalStorage() {
  const oldPrefix = 'viktor_labs_';
  const newPrefix = 'viktor_labs_';
  
  const keysToMigrate = [
    'appointments',
    'services',
    'site_config',
    'business_settings',
    'business_hours',
    'blocked_dates',
    'enabled_languages'
  ];

  let migratedCount = 0;

  keysToMigrate.forEach(key => {
    const oldKey = `${oldPrefix}${key}`;
    const newKey = `${newPrefix}${key}`;
    
    const value = localStorage.getItem(oldKey);
    if (value !== null) {
      // Move to new key if it doesn't exist or we want to overwrite
      // For rebranding, we usually want to overwrite once to transition
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, value);
        migratedCount++;
      }
      // Optional: remove old key
      // localStorage.removeItem(oldKey);
    }
  });

  if (migratedCount > 0) {
    console.log(`Successfully migrated ${migratedCount} localStorage keys to Viktor Labs.`);
  }
}
