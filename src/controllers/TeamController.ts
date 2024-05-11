import type {Request, Response} from 'express'
import User from '../models/User'

export class TeamController {
  static findUser = async (req: Request, res: Response) => {
    const {email} = req.body

    try {
      const user = await User.findOne({email}).select('id email name')

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        })
      }

      res.json(user)
    } catch (error) {
      res.status(500).json({error: 'Could\'t handle that request, please try again later.'})
    }
  }

  static addMember = async (req: Request, res: Response) => {
    const {id} = req.body
    const {project} = req

    try {
      const user = await User.findById(id)

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        })
      }

      if (project.team.some(member => member.toString() === id)) {
        return res.status(409).json({error: 'The user you are trying to add to the project is already a member'})
      }

      project.team.push(user.id)

      await project.save()

      res.send('The user was added to the project!')
    } catch (error) {
      res.status(500).json({error: 'Something went wrong when trying to add a member, please try again later.'})
    }
  }

  static getMembers = async (req: Request, res: Response) => {
    const {project} = req

    try {
      await project.populate({
        path: 'team',
        select: 'id email name'
      })

      res.json(project.team)
    } catch (error) {
      res.status(500).json({
        error: 'Something went wrong while processing this request, please try again later.'
      })
    }  

  }

  static removeMember = async (req: Request, res: Response) => {
    const {id} = req.body
    const {project} = req

    try {
      const user = await User.findById(id)

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        })
      }

      if (!project.team.some(member => member.toString() === id)) {
        return res.status(409).json({error: 'The user you are trying to remove does not exist in the project'})
      }

      project.team = project.team.filter(member => member.toString() !== id)

      await project.save()

      res.send('The user was removed from the project!')
    } catch (error) {
      res.status(500).json({error: 'Something went wrong when trying to add a member, please try again later.'})
    }
  }
}