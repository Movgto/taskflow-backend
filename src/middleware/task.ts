import { Request, Response, NextFunction } from "express"
import Task, {ITask} from "../models/Task"

declare global {
  namespace Express {
    interface Request {
      task: ITask
    }
  }
}

export const taskValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params
  
  try {
    const task = await Task.findById(taskId)

    if (!task) return res.status(404).send('Task not found!')

    req.task = task

    next()
     
  } catch (error) {
    return res.status(500).json({error})
  }
}