import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';

import stations from './data/stations.json' with { type: 'json' };

const COUNTRY_CODE_MEXICO = 'MX';
const COUNTRY_CODES_MIDDLE_AMERICA = ['MX', 'GT', 'CU', 'HT', 'DO', 'HN', 'NI', 'SV', 'CR', 'PA', 'JM', 'PR', 'BZ', 'BS'];

function randomFloat(min, max) {
  return Math.random() * (max-min) + min;
}


const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: false,
});

fastify.register(FastifyCors);


fastify.get('/stations', () => {
  return Object.values(stations);
});

fastify.get('/stations/:name', request => {
  return stations[request.params.name];
});


fastify.get('/queries/:company/', (request, response) => {
  if (request.params.company !== 'WAE') return response.code(404).send('unknown company');
  return [{
    id: 0,
    name: 'mexico-all',
    description: 'Returns data for all stations in Mexico',
  }, {
    id: 0,
    name: 'middle-america-top-10',
    description: 'Returns data for the top 10 Stations in Middle America',
  }];
});

fastify.get('/queries/:company/:query', (request, response) => {
  if (request.params.company !== 'WAE') return response.code(404).send('unknown company');

  function createMeasurement(station) { return {
    station: station.name,
    timestamp: Date.now(),
    temperature: randomFloat(0, 50),
    dewpoint_temperature: randomFloat(0, 50),
    air_pressure_station: randomFloat(0.858, 1.07061436),
    air_pressure_sea_level: randomFloat(0.858, 1.07061436),
    visibility: randomFloat(0.001, 100),
    wind_speed: randomFloat(0, 407),
    percipation: randomFloat(0, 1),
    snow_depth: randomFloat(0, 11.82),
    cloud_cover: randomFloat(0, 1),
    wind_direction: randomFloat(0, 360),
  }}

  switch (request.params.query) {
    case '0':
    case 'mexico-all': return Object.values(stations)
      .filter(station => station.nearest_location.country_code === COUNTRY_CODE_MEXICO)
      .map(createMeasurement);
    
    case '1':
    case 'middle-america-top-10': return Object.values(stations)
      .filter(station => COUNTRY_CODES_MIDDLE_AMERICA.includes(station.nearest_location.country_code))
      .map(createMeasurement).sort((a, b) => b.temperature - a.temperature)
      .slice(0, 10);
    
    default: return response.code(404).send('unknown query');
  }
});


fastify.listen({
  port: 3000,
});