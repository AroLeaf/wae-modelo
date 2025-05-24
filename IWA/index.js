import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';

const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: false,
});

fastify.register(FastifyCors);