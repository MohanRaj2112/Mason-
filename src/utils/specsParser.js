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
