import type {Request, Response, NextFunction} from 'express'

export const isManager = (req: Request, res: Response, next: NextFunction) => {
  const {user, project} = req
  console.log('---- User ----')
  console.log(user)
  console.log('---- Project ----')
  console.log(project)
  if (user.id !== project.manager.toString()) {
    return res.status(403).json({
      error: 'Unauthorized Action'
    })
  }

  next()
}