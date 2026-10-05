import { supabase } from './supabase.js';

// Loads data center projects. Tries Supabase first, then falls back to the
// bundled sample file so the app still runs without database credentials.
export async function loadProjects() {
  if (supabase) {
    const { data, error } = await supabase
      .from('student_projects')
      .select('id, name, county, city, status, lat, lon, announced_at')
      .order('name');

    if (!error) return { projects: data, source: 'supabase' };
    console.warn('Supabase query failed, using sample data:', error.message);
  }

  const response = await fetch('/sample-projects.json');
  return { projects: await response.json(), source: 'sample' };
}
