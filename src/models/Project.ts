import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

export type ProjectType = Document & {
  projectName: string
  clientName: string
  description: string
  tasks: PopulatedDoc<ITask>[]
  manager: PopulatedDoc<IUser>
  team: PopulatedDoc<IUser>[]
}

const ProjectSchema : Schema = new Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  tasks: [
    {
      type: Types.ObjectId,
      ref: 'Task'
    }
  ],
  manager: {
    type: Types.ObjectId,
    ref: 'User'
  },
  team: [
    {
      type: Types.ObjectId,
      ref: 'User'
    }
  ]
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)

export default Project