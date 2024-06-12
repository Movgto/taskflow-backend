import Task, { ITask } from "../models/Task";
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
      const task = await Task.findById(req.task.id).populate({
        path: 'changeHistory.user',
        select: 'email id name'
      })

      if (!task || task.project.toString() !== req.project.id) {
        return res.status(400).json({
          error: 'Invalid action'
        })
      }      

      res.json({
        task
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

      res.send('Task was successfully deleted from the database!')
    } catch (error) {
      res.status(500).json({error})
    }
  }

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const task = req.task
      const project = req.project

      if (task.project.toString() !== project.id) {
        return res.status(400).send('Invalid request')
      }

      const status : ITask['status'] = req.body.status
      if (status) {
        task.status = status

        const changeData = {
          user: req.user.id,
          status
        }

        task.changeHistory.push(changeData)

        await task.save()
        return res.send('Status was updated successfully!')
      }
    } catch (error) {
      res.status(500).json({error})
    }
  }
}