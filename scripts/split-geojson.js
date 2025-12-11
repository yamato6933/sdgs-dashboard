//geojsonファイルを都道府県ごとに分割するのに使用

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const inputFile = path.join(dataDir, 'N03-20_200101.geojson');
const outputDir = path.join(dataDir, 'prefectures');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Reading GeoJSON file...');
const fileContent = fs.readFileSync(inputFile, 'utf-8');
const geoJson = JSON.parse(fileContent);

console.log(`Total features: ${geoJson.features.length}`);

// Group features by prefecture
const prefectureMap = {};
geoJson.features.forEach((feature) => {
  const prefecture = feature.properties?.N03_001;
  if (!prefecture) return;

  if (!prefectureMap[prefecture]) {
    prefectureMap[prefecture] = [];
  }
  prefectureMap[prefecture].push(feature);
});

console.log(`Found ${Object.keys(prefectureMap).length} prefectures`);

// Save each prefecture's GeoJSON
Object.entries(prefectureMap).forEach(([prefecture, features]) => {
  const prefectureGeoJson = {
    type: 'FeatureCollection',
    features: features,
  };

  const fileName = `${prefecture.replace(/[\/\\]/g, '_')}.geojson`;
  const filePath = path.join(outputDir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(prefectureGeoJson));
  console.log(`✓ ${prefecture}: ${features.length} features -> ${fileName}`);
});

console.log('\nDone! GeoJSON files have been split by prefecture.');
console.log(`Output directory: ${outputDir}`);
