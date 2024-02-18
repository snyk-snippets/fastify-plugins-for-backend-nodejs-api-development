// Import Fastify using ESM syntax
import Fastify from "fastify";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const fastify = Fastify({
  logger: logger,
});

fastify.register(import("@fastify/env"), {
  dotenv: true,
  schema: {
    type: "object",
    required: ["PORT"],
    properties: {
      PORT: {
        type: "string",
        default: 3000,
      },
    },
  },
});

fastify.register(import("@fastify/cors"), {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

fastify.register(import("@fastify/swagger"), {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Test swagger",
      description: "testing the fastify swagger api",
      version: "0.1.0",
    },
    host: "localhost",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  exposeRoute: true,
});

fastify.register(import("@fastify/swagger-ui"));

const helloRoute = async (fastify, options) => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            hello: { type: "string" },
          },
        },
      },
    },
    handler: async (request, reply) => {
      return { hello: "world" };
    },
  });
};

fastify.register(helloRoute);

async function startServer() {
  try {
    // wait for all plugins to run
    await fastify.ready();
    // Start the server
    const address = await fastify.listen({
      port: fastify.config.PORT,
      host: "localhost",
    });

    // Log the server start information using the address returned by Fastify
    // Fastify will already log the server start information by default
    // But here is an example of how you can log the server start information
    // fastify.log.info(`Server starting up at ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
