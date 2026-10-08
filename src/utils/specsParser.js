/**
 * Helper utility to parse and format tool specifications.
 * Ensures only existing specifications are displayed, never invented.
 */

export function getToolSpecifications(tool) {
  if (!tool) return [];

  // 1. If tool already has structured specifications object
  if (tool.specifications && typeof tool.specifications === 'object') {
    const list = [];
    for (const [rawKey, rawVal] of Object.entries(tool.specifications)) {
      if (rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '') {
        // Format key into clean title case (e.g. "bladeSize" -> "Blade Size")
        const formattedKey = rawKey
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        list.push({
          key: formattedKey,
          value: String(rawVal).trim()
        });
      }
    }
    if (list.length > 0) return list;
  }

  // 2. Parse from tool.specs string if available
  const rawSpecs = tool.specs || '';
  if (!rawSpecs || typeof rawSpecs !== 'string' || !rawSpecs.trim()) {
    return [];
  }

  const list = [];

  // Check if string contains key-value pairs formatted as "Key: Value"
  // E.g. "Material: Steel\nWeight: 2 kg" or "Material: Steel; Weight: 2 kg"
  const lines = rawSpecs.split(/[\n;\r]+/).map(s => s.trim()).filter(Boolean);
  let hasExplicitKeys = false;

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 1 && colonIdx < 30) {
      const k = line.substring(0, colonIdx).trim();
      const v = line.substring(colonIdx + 1).trim();
      if (k && v) {
        list.push({ key: k, value: v });
        hasExplicitKeys = true;
      }
    }
  }

  if (hasExplicitKeys && list.length > 0) {
    return list;
  }

  // If comma separated specs like:
  // "Drop-forged carbon steel head, fiberglass shock-absorbing grip (Claw + 4kg Sledge)"
  // "800W motor, 3-mode (drilling, hammer, chiseling), SDS-Plus chuck, depth gauge"
  const segments = rawSpecs.split(/,\s*(?![^(]*\))/).map(s => s.trim()).filter(Boolean);
  
  for (const seg of segments) {
    // Look for common engineering prefixes / indicators
    const lower = seg.toLowerCase();
    
    if (lower.includes('motor') || lower.includes('watt') || lower.includes('hp') || /^\d+w\b/i.test(seg)) {
      list.push({ key: 'Power / Motor', value: seg });
    } else if (lower.includes('capacity') || lower.includes('drum') || /\d+\s*l\b/i.test(seg)) {
      list.push({ key: 'Capacity', value: seg });
    } else if (lower.includes('kg') || lower.includes('load') || lower.includes('weight')) {
      list.push({ key: 'Weight / Load', value: seg });
    } else if (lower.includes('steel') || lower.includes('aluminum') || lower.includes('alloy') || lower.includes('iron') || lower.includes('abs')) {
      list.push({ key: 'Material', value: seg });
    } else if (lower.includes('mode') || lower.includes('chuck') || lower.includes('blade') || lower.includes('rpm') || lower.includes('speed')) {
      list.push({ key: 'Mechanism', value: seg });
    } else if (lower.includes('accuracy') || lower.includes('range') || lower.includes('meter') || /\d+m\b/i.test(seg)) {
      list.push({ key: 'Range / Accuracy', value: seg });
    } else if (lower.includes('isi') || lower.includes('safety') || lower.includes('certified') || lower.includes('class')) {
      list.push({ key: 'Standard', value: seg });
    } else {
      list.push({ key: 'Feature', value: seg });
    }
  }

  return list;
}

/**
 * Returns a concise single-line specification summary for the compact tool card.
 * Rule: Maximum ONE line, 2-3 most relevant specs that actually exist for the tool,
 * never "N/A", joined with " • ".
 */
export function getOneLineSpecification(tool) {
  if (!tool) return '';

  const fullSpecs = getToolSpecifications(tool);
  if (!fullSpecs || fullSpecs.length === 0) {
    if (tool.specs && typeof tool.specs === 'string') {
      const parts = tool.specs.split(/[,;\n]/)
        .map(s => s.replace(/^[^:]+:\s*/, '').trim())
        .filter(s => s && !s.toLowerCase().includes('n/a'));
      return parts.slice(0, 3).join(' • ');
    }
    return '';
  }

  // Filter out any invalid or "N/A" values
  const validSpecs = fullSpecs.filter(item => {
    if (!item.value) return false;
    const val = String(item.value).trim().toLowerCase();
    return val !== 'n/a' && val !== 'na' && val !== 'none' && val !== 'null' && val !== 'undefined';
  });

  if (validSpecs.length === 0) return '';

  // Helper to simplify specification strings for compact one-line readability
  const cleanSpecValue = (key, raw) => {
    let s = String(raw).trim();
    // Remove "N/A"
    if (/^n\/?a$/i.test(s)) return null;

    // Remove redundant leading key names if they appear inside value
    s = s.replace(/^(material|weight|power|voltage|capacity|height|type|blade|modes?|range):\s*/i, '');

    // Common conciseness transforms
    s = s.replace(/Drop-Forged\s+/i, '')
         .replace(/6061-T6 Aircraft\s+/i, '')
         .replace(/Manganese Tempered\s+/i, 'Tempered ')
         .replace(/Seamless Pressed\s+/i, '')
         .replace(/\s*\(Dual Section\)/i, '')
         .replace(/\s*Safe Work Load/i, '')
         .replace(/\s*Quick Lock/i, '')
         .replace(/\s*\(Hammer\/Drill\/Chisel\)/i, '')
         .replace(/\s*Volume/i, '')
         .replace(/\s*Load Rating/i, '')
         .replace(/\s*Batch/i, '')
         .replace(/\s*Motor/i, '')
         .replace(/\s*Range$/i, '')
         .replace(/\s*Precision$/i, '');

    return s.trim() || null;
  };

  // Prioritize key engineering attributes:
  // Material, Weight / Load, Capacity, Height, Power, Modes/Chuck, Range, Type
  const prioritizedKeys = [
    'Material',
    'Power',
    'Capacity',
    'Weight',
    'Weight / Load',
    'Height',
    'Range',
    'Accuracy',
    'Blade',
    'Modes',
    'Chuck',
    'Engine',
    'Certification',
    'Type'
  ];

  const selectedValues = [];

  // Pick top matches from prioritized keys
  for (const pKey of prioritizedKeys) {
    if (selectedValues.length >= 3) break;
    const found = validSpecs.find(sp => sp.key.toLowerCase().includes(pKey.toLowerCase()));
    if (found) {
      const cleaned = cleanSpecValue(found.key, found.value);
      if (cleaned && !selectedValues.includes(cleaned)) {
        selectedValues.push(cleaned);
      }
    }
  }

  // If we have fewer than 2, fill from remaining valid specs
  if (selectedValues.length < 2) {
    for (const item of validSpecs) {
      if (selectedValues.length >= 3) break;
      const cleaned = cleanSpecValue(item.key, item.value);
      if (cleaned && !selectedValues.includes(cleaned)) {
        selectedValues.push(cleaned);
      }
    }
  }

  // Max 3 items, minimum 1
  return selectedValues.slice(0, 3).join(' • ');
}

