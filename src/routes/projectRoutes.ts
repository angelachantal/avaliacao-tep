import Fastify, { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginOptions } from 'fastify';
import {randomUUID} from 'crypto'; 

// Tipo Project - Define a estrutura de dados de um projeto.
// ID e data de criação serão criados automaticamente e não podem ser alterados 
interface Project {
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    priority: number;
    status: string; 
};

// Banco de dados em memória
let projects: Project[] = [];

// Interface para parâmetros de rota (id do projeto). Ajuda o TypeScript os tipos de parâmetros da URL.
interface ProjectParams {
    projectId: string;
};

// Interface para o corpo de requisição (POST e PUT)
interface CreateProjectBody {
    title: string;
    description: string;
    priority: number;
    status: string; 
};

async function projectRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

// Listar todos os projetos (com filtro de paginação) ======= => Falta configurar a paginação
// Endpoint: GET /projects
fastify.get('/projects', async (request: FastifyRequest, reply: FastifyReply) => {
    return projects;
});

// Criar um novo projeto
// Endpoint: POST /projects
fastify.post<{ Body: CreateProjectBody }>(
    '/projects',
     async (request: FastifyRequest<{ Body: CreateProjectBody }>, reply: FastifyReply) =>{
        const projectStatus = ['Planejado', 'Em andamento', 'Concluído', 'Cancelado'];

        const {  title, description, priority, status} = request.body;

        // Validação de preenchimento de campos obrigatórios
        if (!title || !priority || !status){
            reply.code(400).send({ message: 'Os campos Título, Prioridade e Status são obrigatórios.'});
            return;
        }

        // Criar Validação do prioridade - número inteiro
        if (typeof priority !== 'number'){
            reply.code(400).send({ message: 'A prioridade deve ser registrada como número de 1 (mais alta) a 3 (mais baixa)' });
            return;
        }

        if (!projectStatus.includes(status)) {
            reply.code(400).send({ message: `O status deve ser um dos seguintes: ${projectStatus.join(', ')}` });
            return;
        }
    
        const newProject = {
            id : randomUUID(),    // Gerar um ID único para o projeto
            createdAt: new Date(),    // Registrar data e hora de criação do projeto
            title,
            description,
            priority,
            status, 
        };

        projects.push(newProject); 
        
        reply.code(201); 
        return newProject;
     }
    );
// Obter detalhes de um projeto específico
// Endpoint: GET /projects/:projectId
fastify.get<{ Params: ProjectParams }>(
    '/projects/:projectId',
    async (request: FastifyRequest<{ Params: ProjectParams }>, reply: FastifyReply) =>{
        const projectId = request.params.projectId;
        const project = projects.find((p) => p.id === projectId);

        if (!project){
            reply.code(404).send({ message: 'Projeto não encontrado'});
            return;
        }

        return project;
    }
);

// Atualizar um projeto existente
// Endpoint: PUT /projects/:projectId
// Partial<Project> para PUT (pra indicar que nem todos os campos são obrigatórios na atualização)
fastify.put<{ Body: Partial<CreateProjectBody>; Params: ProjectParams }>(
    '/projects/:projectId',
    async (request: FastifyRequest<{ Body: Partial<CreateProjectBody>; Params: ProjectParams}>, reply: FastifyReply) => {
        const projectId = request.params.projectId;
        const updates = request.body;

        const projectIndex = projects.findIndex((p) => p.id === projectId);

        if (projectIndex === -1) {
            reply.code(404).send({ message: 'Projeto não encontrado' });
            return;
        }

        const originalProject = projects[projectIndex];
        const updatedProject = {
            ...originalProject, //Pega todos os campos do projeto original
            ...updates, // Sobrescreve com os campos que foram fornecidos no corpo da requisição
            id: originalProject.id, // Garante que o ID não seja alterado
            createdAt: originalProject.createdAt, // Garante que a data de criação não seja alterada
        };
        projects[projectIndex] = updatedProject;
        return updatedProject;
    });

// Deletar um projeto
// Endpoint: DELETE /projects/:projectId
fastify.delete<{ Params: ProjectParams }>(
    '/projects/:projectId',
    async (request: FastifyRequest<{ Params: ProjectParams }>, reply: FastifyReply) => {
        const projectId = request.params.projectId;
        const projectIndex = projects.findIndex((p) => p.id === projectId);

        if (projectIndex === -1) {
            reply.code(404).send({ message: 'Projeto não encontrado' });
            return;
        }

        projects.splice(projectIndex, 1);
        reply.code(204).send();
    }
)};

export default projectRoutes;