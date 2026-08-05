import {
  Home, Building2, Hammer, Wrench, ClipboardCheck, Siren,
  CloudLightning, FileCheck2, Layers, Grid3x3, Square, Settings2,
} from 'lucide-react'

// The backend stores each service's icon as a plain string (set via the
// admin's icon picker), not a component — this maps that name back to
// the actual Lucide component for rendering. Falls back to Home for any
// unrecognized/missing name so a bad value never crashes the page.
export const SERVICE_ICONS = {
  Home, Building2, Hammer, Wrench, ClipboardCheck, Siren,
  CloudLightning, FileCheck2, Layers, Grid3x3, Square, Settings2,
}

export function getServiceIcon(name) {
  return SERVICE_ICONS[name] || Home
}
