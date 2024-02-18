// Import Fastify using ESM syntax
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

// Defining a route
fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

async function startServer() {
  try {
    // Start the server
    const address = await fastify.listen({
      port: 3000,
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
