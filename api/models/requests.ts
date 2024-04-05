import { Model, ObjectId, Schema, model } from 'mongoose';

export interface Request {
  from: ObjectId;
  to: ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  salary: string;
  responsibility: string;
  workspaceId: ObjectId;
  role: string;
}

const requestSchema = new Schema<Request>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    responsibility: {
      type: String,
    },

    salary: {
      type: String,
    },
    role: {
      type: String,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
    },
  },

  {
    timestamps: true,
  }
);

export default model('Request', requestSchema) as Model<Request>;
