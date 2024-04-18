import Task from "../models/Task";
import type { Request, Response } from "express";

export default class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {      
      const project = req.project

      const task = await Task.create(req.body)

      project.tasks.push(task.id)
      task.project = project.id

      await Promise.allSettled([
        project.save(),
        task.save()
      ])
      
      res.send('Task created successfully!')
    } catch (error) {
      console.log(error)
      res.status(400).json({
        error
      })
    }
  }

  static getTasks = async (req: Request, res: Response) => {
    const project = req.project

    try {
      const tasks = await Task.find({
        project: project.id
      }).populate('project')

      res.json({
        tasks
      })
    } catch (error) {
      res.status(500).json({
        error
      })
    }
  }

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = req.task      

      if (task.project.toString() !== req.project.id) {
        return res.status(400).json({
          error: 'Invalid action'
        })
      }

      res.json({
        task: await task.populate('project')
      })  
    } catch (error) {
      res.status(500).send('Something went wrong when trying to get the requested information')
    }
  }

  static updateTaskById = async (req: Request, res: Response) => {   
    try {
      const task = req.task      

      if (task.project.toString() !== req.project.id) {
        return res.status(400).json({
          error: 'Invalid action'
        })
      }

      await task.updateOne(req.body)

      res.send('Task was updated successfully!')
    } catch (error) {
      res.status(500).send('Something went wrong when trying to get the requested information')
    }
  }

  static deleteTaskById = async (req: Request, res: Response) => {    
    try {
      const task = req.task

      if (task.project.toString() !== req.project.id) {
        return res.status(400).send('Invalid request')
      }

      req.project.tasks = req.project.tasks.filter(t => t !== task.id)

      await Promise.allSettled([
        task.deleteOne(),
        req.project.save()
      ])

      res.send('Task was successfully deleted from the database! Now go fuck yourself!')
    } catch (error) {
      res.status(500).json({error})
    }
  }
}