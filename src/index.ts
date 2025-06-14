import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {randomUUID} from 'crypto';        // Gera identificadores únicos. É uma alternativa ao cuid    

// Tipo Project
interface Project{
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    priority: number;
    status: string[]; 
}

// Banco de dados em memória
let projects: Project[] = [];

// Interface para parâmetros de rota (id do projeto)
interface ProjectParams {
    projectId: string;
}

// Interface para o corpo de requisição (POST e PUT)
// Campos obrigatórios para POST (para criar)
// Partial<Project> para PUT (pra atualizar)
// ID e data de criação não podem ser alterados 
interface createProjectBody{
    title: string;
    description: string;
    priority: number;
    status: string[]; 
};

// Criação de uma instância do Fastify.
// A instância server é usada para definir rotas, middlewares e iniciar o servidor.
const server: FastifyInstance = Fastify({
    logger: true,   // Habilita o log de requisições e respostas. O servidor passa a registrar automaticamente no console informações sobre requisições recebidas, respostas enviadas, erros e mensagens de depuração, facilitando o monitoramento e a identificação de problemas.
});

// Criação da rota Health Check - verificar se o servidor está funcionando.
server.get('/health', async (request: FastifyRequest, reply: FastifyRReply) => {
    return { message: "It's working!"};
});

