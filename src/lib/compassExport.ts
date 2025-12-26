import { CompassReadingData } from '../components/compass/CompassReading';

// Generate CSV content from readings
export const generateCSV = (readings: CompassReadingData[]): string => {
  const headers = [
    'ID',
    'Mode',
    'Strike',
    'Dip',
    'Trend',
    'Plunge',
    'Bearing',
    'Azimuth',
    'Latitude',
    'Longitude',
    'Lithology',
    'Structure Type',
    'Notes',
    'Date',
    'Time',
  ];

  const rows = readings.map((reading) => [
    reading.id || '',
    reading.mode,
    reading.strike?.toString() || '',
    reading.dip?.toString() || '',
    reading.trend?.toString() || '',
    reading.plunge?.toString() || '',
    reading.bearing?.toString() || '',
    reading.azimuth.toString(),
    reading.latitude?.toString() || '',
    reading.longitude?.toString() || '',
    reading.lithology || '',
    reading.structureType || '',
    `"${reading.notes.replace(/"/g, '""')}"`,
    reading.timestamp.toLocaleDateString(),
    reading.timestamp.toLocaleTimeString(),
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

// Generate GeoJSON from readings
export const generateGeoJSON = (readings: CompassReadingData[]): string => {
  const features = readings
    .filter((r) => r.latitude && r.longitude)
    .map((reading) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [reading.longitude, reading.latitude],
      },
      properties: {
        id: reading.id,
        mode: reading.mode,
        strike: reading.strike,
        dip: reading.dip,
        trend: reading.trend,
        plunge: reading.plunge,
        bearing: reading.bearing,
        azimuth: reading.azimuth,
        lithology: reading.lithology,
        structureType: reading.structureType,
        notes: reading.notes,
        timestamp: reading.timestamp.toISOString(),
        photos: reading.photos,
      },
    }));

  return JSON.stringify(
    {
      type: 'FeatureCollection',
      features,
    },
    null,
    2
  );
};

// Generate simple PDF-style text report
export const generateTextReport = (readings: CompassReadingData[]): string => {
  const lines: string[] = [
    '═══════════════════════════════════════════════════',
    '           GEOLOGICAL COMPASS FIELD LOG',
    '═══════════════════════════════════════════════════',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    `Total Readings: ${readings.length}`,
    '',
    '───────────────────────────────────────────────────',
  ];

  readings.forEach((reading, index) => {
    lines.push('');
    lines.push(`READING #${index + 1}`);
    lines.push(`  Mode: ${reading.mode.replace('_', ' & ').toUpperCase()}`);
    
    if (reading.strike !== null) lines.push(`  Strike: ${reading.strike}°`);
    if (reading.dip !== null) lines.push(`  Dip: ${reading.dip}°`);
    if (reading.trend !== null) lines.push(`  Trend: ${reading.trend}°`);
    if (reading.plunge !== null) lines.push(`  Plunge: ${reading.plunge}°`);
    if (reading.bearing !== null) lines.push(`  Bearing: ${reading.bearing}°`);
    
    lines.push(`  Azimuth: ${reading.azimuth}°`);
    
    if (reading.latitude && reading.longitude) {
      lines.push(`  Location: ${reading.latitude.toFixed(6)}°, ${reading.longitude.toFixed(6)}°`);
    }
    
    lines.push(`  Date/Time: ${reading.timestamp.toLocaleString()}`);
    
    if (reading.lithology) lines.push(`  Lithology: ${reading.lithology}`);
    if (reading.structureType) lines.push(`  Structure: ${reading.structureType}`);
    if (reading.notes) lines.push(`  Notes: ${reading.notes}`);
    if (reading.photos.length > 0) lines.push(`  Photos: ${reading.photos.length} attached`);
    
    lines.push('───────────────────────────────────────────────────');
  });

  // Summary statistics
  if (readings.length > 0) {
    lines.push('');
    lines.push('SUMMARY STATISTICS');
    lines.push('');
    
    const strikes = readings.filter(r => r.strike !== null).map(r => r.strike!);
    const dips = readings.filter(r => r.dip !== null).map(r => r.dip!);
    
    if (strikes.length > 0) {
      const avgStrike = strikes.reduce((a, b) => a + b, 0) / strikes.length;
      lines.push(`  Average Strike: ${avgStrike.toFixed(1)}°`);
    }
    
    if (dips.length > 0) {
      const avgDip = dips.reduce((a, b) => a + b, 0) / dips.length;
      const minDip = Math.min(...dips);
      const maxDip = Math.max(...dips);
      lines.push(`  Average Dip: ${avgDip.toFixed(1)}°`);
      lines.push(`  Dip Range: ${minDip}° - ${maxDip}°`);
    }
    
    // Count lithologies
    const lithologies = readings.reduce((acc, r) => {
      if (r.lithology) {
        acc[r.lithology] = (acc[r.lithology] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    if (Object.keys(lithologies).length > 0) {
      lines.push('');
      lines.push('  Lithologies:');
      Object.entries(lithologies).forEach(([lit, count]) => {
        lines.push(`    - ${lit}: ${count}`);
      });
    }
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════════');
  lines.push('     Generated by GeoSmart Brunton Compass Module');
  lines.push('═══════════════════════════════════════════════════');

  return lines.join('\n');
};

// Download file utility
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export all readings
export const exportReadings = (
  readings: CompassReadingData[],
  format: 'csv' | 'geojson' | 'txt'
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  switch (format) {
    case 'csv':
      downloadFile(
        generateCSV(readings),
        `compass-readings-${timestamp}.csv`,
        'text/csv'
      );
      break;
    case 'geojson':
      downloadFile(
        generateGeoJSON(readings),
        `compass-readings-${timestamp}.geojson`,
        'application/json'
      );
      break;
    case 'txt':
      downloadFile(
        generateTextReport(readings),
        `field-log-${timestamp}.txt`,
        'text/plain'
      );
      break;
  }
};
