import { Lexer } from '@aroleaf/parser';
import fs from 'node:fs/promises';
import path from 'node:path';

// const lexer = new Lexer({
//   separator: {
//     matches: ',',
//     discard: true,
//   },
//   parens_open: {
//     matches: '(',
//     discard: true,
//   },
//   parens_close: {
//     matches: ')',
//     discard: true,
//   },
//   string: {
//     matches: /'(?:\\.|[^'\\])*'/s,
//     then: t => t.value = t.value.slice(1,-1).replace(/\\([^])/g, sub => sub[1]),
//   },
//   number: {
//     matches: /-?(?:\d*\.)?\d+/,
//     then: t => t.value = +t.value,
//   },
//   whitespace: {
//     matches: /\s+/s,
//     discard: true,
//   },
// });

// async function loadSQL(filename, keys) {
//   const text = await fs.readFile(path.resolve('data/sql', filename), 'utf-8');
//   const insert = /VALUES *(.*);/i.exec(text)[1];
//   const values = lexer.parse(insert);

//   const items = [];
//   for (let i = 0; i < values.length; i += keys.length) {
//     items.push(Object.fromEntries(keys.map((key, j) => [key, values[i+(+j)].value])));
//   }
//   return items;
// }

// const stations = await loadSQL('project_web_station.sql', ['name', 'longitude', 'latitude', 'elevation']);
// const nearestLocations = await loadSQL('project_web_nearestlocation.sql', ['id', 'station_name', 'name', 'administrative_region1', 'administrative_region2', 'country_code', 'longitude', 'latitude']);
// const countries = await loadSQL('project_web_country.sql', ['country_code', 'country']);

// const stationByName = Object.fromEntries(stations.map(station => [station.name, station]));
// const countryNameByCode = Object.fromEntries(countries.map(country => [country.country_code, country.country]));

// for (const nearestLocation of nearestLocations) {
//   nearestLocation.country = countryNameByCode[nearestLocation.country_code];
//   stationByName[nearestLocation.station_name].nearest_location = nearestLocation;
// }

// await fs.writeFile(path.resolve('data/stations.json'), JSON.stringify(stationByName, null, 2));

// await fs.writeFile(path.resolve('data', 'geolocations.json'), JSON.stringify(, null, 2));
// await fs.writeFile(path.resolve('data', 'nearest_locations.json'), JSON.stringify(, null, 2));
// await fs.writeFile(path.resolve('data', 'countries.json'), JSON.stringify(, null, 2));


function binaryToMeasurement(buffer) {
  const KEYS = [ 'temperature', 'maxTemperature', 'minTemperature', 'dewpoint', 'SLP', 'STP', 'visibility', 'windspeed', 'maxSpeed', 'precipitation', 'snowDepth' ];
  const PRECISIONS = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1 ];

  return Object.fromEntries(KEYS.map((key, i) => [key, buffer.readInt16BE(i*2) / 10 ** PRECISIONS[i]]));
}

async function loadBinary(filename) {
  const STATION_OFFSET = 224000;
  const MEASUREMENT_SIZE = 26;
  const MEASUREMENT_POINTS = 366;

  const buffer = await fs.readFile(path.resolve('data/binary', filename));
  const arr = Array.from({ length: 8000 }, (_,i) => STATION_OFFSET + MEASUREMENT_SIZE * MEASUREMENT_POINTS * i).map(n => buffer.subarray(n, n + MEASUREMENT_SIZE * MEASUREMENT_POINTS)).map(binaryToMeasurement);
  return arr;
}

await fs.writeFile(path.resolve('data', 'measurements.json'), JSON.stringify(await loadBinary('full_stations_data.dat'), null, 2));