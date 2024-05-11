import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputValidation } from "../middleware/validation";
import TaskController from "../controllers/TaskController";
import { projectValidation } from "../middleware/project";
import { taskValidation } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { isManager } from "../middleware/authorization";

const projectRouter = Router()

// Authenticate user middleware for project routes
projectRouter.use(authenticate)

projectRouter.post('/',
  body('projectName').notEmpty().withMessage('Project name cannot be empty'),
  body('clientName').notEmpty().withMessage('Client name cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  handleInputValidation,
  ProjectController.createProject
)

projectRouter.get('/', ProjectController.getAllProjects)

projectRouter.get('/:id',
  param('id').isMongoId().withMessage('Invalid ID'),
  handleInputValidation,
  ProjectController.getProjectById
)

projectRouter.put('/:id',
  isManager,
  param('id').isMongoId().withMessage('Invalid ID'),
  body('projectName').notEmpty().withMessage('Project name cannot be empty'),
  body('clientName').notEmpty().withMessage('Client name cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  handleInputValidation,
  ProjectController.updateProject
)

projectRouter.delete('/:id',
  isManager,
  param('id').isMongoId().withMessage('Invalid ID'),
  handleInputValidation,
  ProjectController.deleteProduct
)

// Tasks routes

// Injects project validation for task actions which require 'projectId' in the URL, example: '/:projectId/more/stuff'

projectRouter.param('projectId', projectValidation)

projectRouter.post('/:projectId/tasks',
  isManager,
  body('name').notEmpty().withMessage('Name of the task cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  handleInputValidation,
  TaskController.createTask
)

projectRouter.get('/:projectId/tasks',
  handleInputValidation,
  TaskController.getTasks
)

projectRouter.param('taskId', taskValidation)

projectRouter.get('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('Invalid Task ID'),
  handleInputValidation,
  TaskController.getTaskById
)

projectRouter.put('/:projectId/tasks/:taskId',
  isManager,
  param('taskId').isMongoId().withMessage('Invalid Task ID'),
  body('name').notEmpty().withMessage('Name of the task cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  handleInputValidation,
  TaskController.updateTaskById
)

projectRouter.patch('/:projectId/tasks/:taskId',
  body('status').notEmpty().withMessage('Status cannot be empty'),
  handleInputValidation,
  TaskController.updateTaskStatus
)

projectRouter.delete('/:projectId/tasks/:taskId',
  isManager,
  param('taskId').isMongoId().withMessage('Invalid Task ID'),
  handleInputValidation,
  TaskController.deleteTaskById
)

// Team members routes

projectRouter.post('/:projectId/team/find',
  isManager,
  body('email').isEmail().toLowerCase().withMessage('Invalid email'),
  handleInputValidation,
  TeamController.findUser
)

projectRouter.post('/:projectId/team',
  isManager,
  body('id').isMongoId().withMessage('Invalid User ID'),
  handleInputValidation,
  TeamController.addMember
)

projectRouter.get('/:projectId/team',
  TeamController.getMembers
)

projectRouter.delete('/:projectId/team',
  isManager,
  body('id').isMongoId().withMessage('Invalid User ID'),
  handleInputValidation,
  TeamController.removeMember
)

export default projectRouter