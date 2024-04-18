import { Request, Response, NextFunction } from "express"
import Project, { ProjectType } from "../models/Project"

declare global {
  namespace Express {
    interface Request {
      project: ProjectType
    }
  }
}

export const projectValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params
  
  try {
    const project = await Project.findById(projectId)

    if (!project) return res.status(404).send('Project not found!')

    req.project = project

    next()
     
  } catch (error) {
    return res.status(500).json({error})
  }
}