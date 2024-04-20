import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputValidation } from "../middleware/validation";
import TaskController from "../controllers/TaskController";
import { projectValidation } from "../middleware/project";
import { taskValidation } from "../middleware/task";

const projectRouter = Router()

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
  param('id').isMongoId().withMessage('Invalid ID'),
  body('projectName').notEmpty().withMessage('Project name cannot be empty'),
  body('clientName').notEmpty().withMessage('Client name cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  handleInputValidation,
  ProjectController.updateProject
)

projectRouter.delete('/:id',
  param('id').isMongoId().withMessage('Invalid ID'),
  handleInputValidation,
  ProjectController.deleteProduct
)

// Tasks routes

// Injects project validation for task actions which require 'projectId' in the URL, example: '/:projectId/more/stuff'

projectRouter.param('projectId', projectValidation)

projectRouter.post('/:projectId/tasks',
  param('projectId').isMongoId().withMessage('Project ID cannot be empty'),
  body('name').notEmpty().withMessage('Name of the task cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  handleInputValidation,
  TaskController.createTask
)

projectRouter.get('/:projectId/tasks',
  param('projectId').isMongoId().withMessage('Invalid ID'),
  handleInputValidation,
  TaskController.getTasks
)

projectRouter.param('taskId', taskValidation)

projectRouter.get('/:projectId/tasks/:taskId',
  param('projectId').isMongoId().withMessage('Invalid Project ID'),
  param('taskId').isMongoId().withMessage('Invalid Task ID'),
  handleInputValidation,
  TaskController.getTaskById
)

projectRouter.put('/:projectId/tasks/:taskId',
  param('projectId').isMongoId().withMessage('Invalid Project ID'),
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
  param('projectId').isMongoId().withMessage('Invalid Project ID'),
  param('taskId').isMongoId().withMessage('Invalid Task ID'),
  handleInputValidation,
  TaskController.deleteTaskById
)

export default projectRouter