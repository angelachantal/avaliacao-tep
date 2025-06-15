"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const crypto_1 = require("crypto"); // Gera identificadores únicos. É uma alternativa ao cuid    
;
// Banco de dados em memória
let projects = [];
;
;
// Criação de uma instância do Fastify.
// A instância server é usada para definir rotas, middlewares e iniciar o servidor.
const server = (0, fastify_1.default)({
    logger: true, // Habilita o log de requisições e respostas. O servidor passa a registrar automaticamente no console informações sobre requisições recebidas, respostas enviadas, erros e mensagens de depuração, facilitando o monitoramento e a identificação de problemas.
});
// Criação da rota Health Check - verificar se o servidor está funcionando.
server.get('/health', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { message: "It's working!" };
}));
// Listar todos os projetos (com filtro de paginação) ======= Falta configurar a paginação
// Endpoint: GET /projects
server.get('/projects', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return projects;
}));
// Criar um novo projeto
// Endpoint: POST /projects
server.post('/projects', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const projectStatus = ['Planejado', 'Em andamento', 'Concluído', 'Cancelado'];
    const { title, description, priority, status } = request.body;
    // Validação de preenchimento de campos obrigatórios
    if (!title || !priority || !status) {
        reply.code(400).send({ message: 'Os campos Título, Prioridade e Status são obrigatórios.' });
        return;
    }
    // Criar Validação do prioridade - número inteiro
    if (typeof priority !== 'number') {
        reply.code(400).send({ message: 'A prioridade deve ser registrada como número de 1 (mais alta) a 3 (mais baixa)' });
        return;
    }
    if (!projectStatus.includes(status)) {
        reply.code(400).send({ message: `O status deve ser um dos seguintes: ${projectStatus.join(', ')}` });
        return;
    }
    const newProject = {
        id: (0, crypto_1.randomUUID)(), // Gerar um ID único para o projeto
        createdAt: new Date(), // Registrar data e hora de criação do projeto
        title,
        description,
        priority,
        status,
    };
    projects.push(newProject);
    reply.code(201);
    return newProject;
}));
// Obter detalhes de um projeto específico
// Endpoint: GET /projects/:projectId
server.get('/projects/:projectId', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = request.params.projectId;
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
        reply.code(404).send({ message: 'Projeto não encontrado' });
        return;
    }
    return project;
}));
// Atualizar um projeto existente
// Endpoint: PUT /projects/:projectId
// Partial<Project> para PUT (pra indicar que nem todos os campos são obrigatórios na atualização)
server.put('/projects/:projectId', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = request.params.projectId;
    const updates = request.body;
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
        reply.code(404).send({ message: 'Projeto não encontrado' });
        return;
    }
    const originalProject = projects[projectIndex];
    const updatedProject = Object.assign(Object.assign(Object.assign({}, originalProject), updates), { id: originalProject.id, createdAt: originalProject.createdAt });
    projects[projectIndex] = updatedProject;
    return updatedProject;
}));
// Deletar um projeto
// Endpoint: DELETE /projects/:projectId
server.delete('/projects/:projectId', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = request.params.projectId;
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
        reply.code(404).send({ message: 'Projeto não encontrado' });
        return;
    }
    projects.splice(projectIndex, 1);
    reply.code(204).send();
}));
// Iniciar o servidor
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen({ port: 3000, host: '0.0.0.0' });
        server.log.info(`Sever listening on ${JSON.stringify(server.server.address())}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
