import { useEffect, useState } from 'react';
import MapView from './MapView.jsx';
import { loadProjects } from './lib/loadProjects.js';
import { STATUS_COLORS } from './statusColors.js';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [source, setSource] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadProjects().then(({ projects, source }) => {
      setProjects(projects);
      setSource(source);
    });
  }, []);

  if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="setup-message">
        Add <code>VITE_MAPBOX_ACCESS_TOKEN</code> to <code>.env.local</code> and restart <code>npm run dev</code>.
      </div>
    );
  }

  const selected = projects.find((p) => p.id === selectedId);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Texas Data Centers</h1>
        <p className="source">
          {source === 'supabase' && 'Live data from Supabase'}
          {source === 'sample' && 'Sample data (no Supabase keys set)'}
          {!source && 'Loading…'}
          {source && ` · ${projects.length} projects`}
        </p>

        {selected && (
          <div className="detail">
            <h2>{selected.name}</h2>
            <p>{[selected.city, selected.county && `${selected.county} County`].filter(Boolean).join(', ')}</p>
            <p>Status: {selected.status}</p>
            {selected.announced_at && <p>Announced: {selected.announced_at}</p>}
          </div>
        )}

        <ul className="project-list">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                className={p.id === selectedId ? 'active' : ''}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="dot" style={{ background: STATUS_COLORS[p.status] || STATUS_COLORS.unknown }} />
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <MapView projects={projects} selectedId={selectedId} onSelect={setSelectedId} />
    </div>
  );
}
