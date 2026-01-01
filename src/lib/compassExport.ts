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

// Generate KML from readings
export const generateKML = (readings: CompassReadingData[]): string => {
  const placemarks = readings
    .filter((r) => r.latitude && r.longitude)
    .map((reading) => {
      const name = `${reading.mode.replace('_', '/').toUpperCase()} Reading`;
      const strike = reading.strike !== null ? `Strike: ${reading.strike}°` : '';
      const dip = reading.dip !== null ? `Dip: ${reading.dip}°` : '';
      const trend = reading.trend !== null ? `Trend: ${reading.trend}°` : '';
      const plunge = reading.plunge !== null ? `Plunge: ${reading.plunge}°` : '';
      const bearing = reading.bearing !== null ? `Bearing: ${reading.bearing}°` : '';
      
      const measurements = [strike, dip, trend, plunge, bearing].filter(Boolean).join(', ');
      
      const description = [
        `<![CDATA[`,
        `<h3>${name}</h3>`,
        `<p><strong>Measurements:</strong> ${measurements}</p>`,
        `<p><strong>Azimuth:</strong> ${reading.azimuth}°</p>`,
        reading.lithology ? `<p><strong>Lithology:</strong> ${reading.lithology}</p>` : '',
        reading.structureType ? `<p><strong>Structure:</strong> ${reading.structureType}</p>` : '',
        reading.notes ? `<p><strong>Notes:</strong> ${reading.notes}</p>` : '',
        `<p><strong>Date:</strong> ${reading.timestamp.toLocaleString()}</p>`,
        `]]>`,
      ].filter(Boolean).join('\n');

      // KML style based on mode
      const styleId = reading.mode.includes('strike') ? 'strike-style' : 
                      reading.mode.includes('trend') ? 'trend-style' : 
                      reading.mode === 'bearing' ? 'bearing-style' : 'default-style';

      return `
    <Placemark>
      <name>${name}</name>
      <description>${description}</description>
      <styleUrl>#${styleId}</styleUrl>
      <TimeStamp>
        <when>${reading.timestamp.toISOString()}</when>
      </TimeStamp>
      <ExtendedData>
        <Data name="mode"><value>${reading.mode}</value></Data>
        ${reading.strike !== null ? `<Data name="strike"><value>${reading.strike}</value></Data>` : ''}
        ${reading.dip !== null ? `<Data name="dip"><value>${reading.dip}</value></Data>` : ''}
        ${reading.trend !== null ? `<Data name="trend"><value>${reading.trend}</value></Data>` : ''}
        ${reading.plunge !== null ? `<Data name="plunge"><value>${reading.plunge}</value></Data>` : ''}
        ${reading.bearing !== null ? `<Data name="bearing"><value>${reading.bearing}</value></Data>` : ''}
        <Data name="azimuth"><value>${reading.azimuth}</value></Data>
        ${reading.lithology ? `<Data name="lithology"><value>${reading.lithology}</value></Data>` : ''}
        ${reading.structureType ? `<Data name="structureType"><value>${reading.structureType}</value></Data>` : ''}
      </ExtendedData>
      <Point>
        <coordinates>${reading.longitude},${reading.latitude},0</coordinates>
      </Point>
    </Placemark>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>GeoSmart Compass Readings</name>
    <description>Geological compass readings exported from GeoSmart</description>
    
    <!-- Styles for different measurement types -->
    <Style id="strike-style">
      <IconStyle>
        <color>ff0000ff</color>
        <scale>1.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href>
        </Icon>
      </IconStyle>
      <LabelStyle>
        <color>ff0000ff</color>
      </LabelStyle>
    </Style>
    
    <Style id="trend-style">
      <IconStyle>
        <color>ff00ff00</color>
        <scale>1.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href>
        </Icon>
      </IconStyle>
      <LabelStyle>
        <color>ff00ff00</color>
      </LabelStyle>
    </Style>
    
    <Style id="bearing-style">
      <IconStyle>
        <color>ffff8800</color>
        <scale>1.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png</href>
        </Icon>
      </IconStyle>
      <LabelStyle>
        <color>ffff8800</color>
      </LabelStyle>
    </Style>
    
    <Style id="default-style">
      <IconStyle>
        <color>ff0088ff</color>
        <scale>1.0</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/blu-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    
    <Folder>
      <name>Compass Readings</name>
      <description>Total readings: ${readings.length}</description>
      ${placemarks}
    </Folder>
  </Document>
</kml>`;
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

export type ExportFormat = 'csv' | 'geojson' | 'kml' | 'txt';

export const EXPORT_FORMATS: { id: ExportFormat; label: string; description: string; extension: string }[] = [
  { id: 'csv', label: 'CSV', description: 'Spreadsheet compatible', extension: '.csv' },
  { id: 'geojson', label: 'GeoJSON', description: 'GIS standard format', extension: '.geojson' },
  { id: 'kml', label: 'KML', description: 'Google Earth compatible', extension: '.kml' },
  { id: 'txt', label: 'Text Report', description: 'Human-readable log', extension: '.txt' },
];

// Export all readings
export const exportReadings = (
  readings: CompassReadingData[],
  format: ExportFormat
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
        'application/geo+json'
      );
      break;
    case 'kml':
      downloadFile(
        generateKML(readings),
        `compass-readings-${timestamp}.kml`,
        'application/vnd.google-earth.kml+xml'
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
