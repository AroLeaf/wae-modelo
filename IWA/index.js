import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';

import stations from './data/stations.json' with { type: 'json' };
import users from './data/ users.json' with { type: 'json' };
import JWT from './jwt.js';

const COUNTRY_CODE_MEXICO = 'MX';
const COUNTRY_CODES_MIDDLE_AMERICA = ['MX', 'GT', 'CU', 'HT', 'DO', 'HN', 'NI', 'SV', 'CR', 'PA', 'JM', 'PR', 'BZ', 'BS'];

function randomFloat(min, max) {
  return Math.random() * (max-min) + min;
}


const jwt = new JWT(process.env.JWT_SECRET);

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
  const user = jwt.verify(request.headers.authorization);
  if (!user) return response.code(401).send('you need to be logged in to receive data');

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
  const user = jwt.verify(request.headers.authorization);
  if (!user) return response.code(401).send('you need to be logged in to receive data');

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
    case '0': return Object.values(stations)
      .filter(station => station.nearest_location.country_code === COUNTRY_CODE_MEXICO)
      .map(createMeasurement);
    
    case '1': return Object.values(stations)
      .filter(station => COUNTRY_CODES_MIDDLE_AMERICA.includes(station.nearest_location.country_code))
      .map(createMeasurement).sort((a, b) => b.temperature - a.temperature)
      .slice(0, 10);
    
    default: return response.code(404).send('unknown query');
  }
});


fastify.post('/auth/login', async (request, response) => {
  const { name, password } = request.body || {};
  if (!name || !password) return response.code(400).send('name and/or password missing');

  const user = { ...users.find(u => u.name === name) };
  if (!user || user.password !== password) return response.code(404).send('user not found');

  delete user.password;
  response.send(jwt.sign(user));
});


fastify.get('/users', async (request, response) => {
  const user = jwt.verify(request.headers.authorization);
  if (!user) return response.code(401).send('you need to be logged in to view users');

  return users.map(u => {
    const sanitized = {...u};
    if (!user.admin) delete sanitized.password;
    return sanitized;
  });
});

fastify.get('/users/:name', async (request, response) => {
  const user = jwt.verify(request.headers.authorization);
  if (!user) return response.code(401).send('you need to be logged in to view users');

  const found = users.find(u => u.name === request.query.name);
  const sanitized = { ...found };
  if (!user.admin) delete sanitized.password;

  return sanitized;
});

fastify.post('/users', async (request, response) => {
  const user = jwt.verify(request.headers.authorization);
  if (!user) return response.code(401).send('you need to be an admin to create users');
  if (!user.admin) return response.code(403).send('you need to be an admin to create users');

  if (!request.body.name || !request.body.password) return response.code(400).send('name and/or password missing');
  
  users.push(request.body);

  return response.code(201).send();
});

fastify.patch('/users/:name', async (request, response) => {
  const user = jwt.verify(request.headers.authorization);
  if (!user) return response.code(401).send('you need to be an admin to modify users');
  if (!user.admin) return response.code(403).send('you need to be an admin to modify users');

  const found = users.find(u => u.name === request.params.name);
  if (!found) return response.code(404).send('user not found');

  Object.assign(found, request.body);

  return found;
});

fastify.delete('/users/:name', async (request, response) => {
  const user = jwt.verify(request.headers.authorization);
  if (!user) return response.code(401).send('you need to be an admin to delete users');
  if (!user.admin) return response.code(403).send('you need to be an admin to delete users');

  const idx = users.findIndex(u => u.name === request.query.name);
  if (idx < 0) return response.code(404).send('user not found');
  
  users.splice(idx, 1);

  return response.code(204);
});


fastify.listen({
  port: process.env.PORT,
});