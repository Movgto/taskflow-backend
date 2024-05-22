import type {Request, Response} from 'express'
import Note, { INote } from '../models/Note'

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    try {
      const note = new Note({
        content: req.body.content,
        createdBy: req.user.id,
        task: req.task.id 
      })

      await note.save()

      req.task.notes.push(note.id)

      await req.task.save()

      res.send('Note was created successfully!')
    } catch (error) {
      res.status(500).json({error})
    }
  }

  static getNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({
        task: req.task.id
      }).populate({
        path: 'createdBy',
        select: 'id email name'
      })

      res.json(notes)

    } catch (error) {
      res.status(500).json({error})
    }
  }

  static deleteNote = async (req: Request, res: Response) => {
    const {noteId} = req.params
    const {task, user} = req

    try {
      const note = await Note.findById(noteId)

      if (!note) {
        const error = new Error('Note was not found')
        return res.status(404).json({error: error.message})
      }

      if (note.createdBy.toString() !== user.id) {
        const error = new Error('Unauthorized Action')
        return res.status(403).json({error: error.message})
      }

      await note.deleteOne()
      
      task.notes = task.notes.filter(note => note.toString() !== noteId)

      await task.save()

      res.send('Note was deleted successfully!')
    } catch (error) {
      res.status(500).json({error})
    }
  }
}