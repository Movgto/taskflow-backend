import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {    
    try {
      await Project.create(req.body)
      res.send('Project has been created successfully!')
    } catch (err) {
      console.log(err)
      const error = new Error('Something went wrong when trying to create a new Project')
      res.status(400).json({error: error.message})
    }
  }

  static getAllProjects = async (req: Request, res: Response) => {    
    try {
      const projects = await Project.find().populate('tasks')
      res.json({
        data: projects
      })
    } catch (err) {
      res.status(400).json({
        error: err
      })
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await Project.findById(id).populate('tasks')

      if (!project) {
        const error = new Error('Project not found')

        return res.status(404).json({
          error: error.message
        })
      }
      
      res.json({
        data: project
      })
    } catch (err) {
      res.status(400).json({
        error: ''
      })
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const project = await Project.findById(id)

      if (!project) {
        const error = new Error('Project not found')
        return res.status(404).json({
          error: error.message
        })
      }

      await project.updateOne(req.body)
      await project.save()

      res.send('Project updated successfully!')
    } catch (err) {
      console.log(err)
      res.status(500).json({
        error: 'We could\'t update the Project, please check all the required data is correct and try again'
      })
    }
  }

  static deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const project = await Project.findById(id)

      if (!project) {
        const error = new Error('Project not found')

        return res.status(404).json({
          error: error.message
        })
      }

      await project.deleteOne()
      res.send('Project deleted successfully')
      
    } catch (err) {
      res.status(400).json({
        error: err
      })
    }
  }
}