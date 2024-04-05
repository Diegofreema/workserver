import { Model, ObjectId, Schema, model } from 'mongoose';

export interface WorkerDoc {
  organizationId: ObjectId;
  userId: ObjectId;
  skills: string;
  gender: string;
  qualifications: string;
  exp: string;
  location: string;
  assignedWorkspace: string;
  bossId: ObjectId;
  role: string;
}

const workerSchema = new Schema<WorkerDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    skills: {
      type: String,
    },
    gender: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    exp: {
      type: String,
    },
    location: {
      type: String,
    },
    assignedWorkspace: {
      type: String,
    },
    bossId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

export default model('Worker', workerSchema) as Model<WorkerDoc>;
