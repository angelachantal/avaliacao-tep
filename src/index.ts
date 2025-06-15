import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import projectRoutes from './routes/projectRoutes'; 

// Criação de uma instância do Fastify.
// A instância server é usada para definir rotas, middlewares e iniciar o servidor.
const server: FastifyInstance = Fastify({
    logger: true,   // Habilita o log de requisições e respostas. O servidor passa a registrar automaticamente no console informações sobre requisições recebidas, respostas enviadas, erros e mensagens de depuração, facilitando o monitoramento e a identificação de problemas.
});

// Criação da rota Health Check - verificar se o servidor está funcionando.
server.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: "It's working!" };
});

// Registro das rotas do projeto - o Fastify executará a função projectRoutes, que foi importada.
server.register(projectRoutes);


// Iniciar o servidor
const start = async () => {
    try {
        await server.listen({ port: 3000, host: '0.0.0.0' });
        server.log.info(`Sever listening on ${JSON.stringify(server.server.address())}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1); 
    }
    };
start();
