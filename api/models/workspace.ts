import { Model, ObjectId, Schema, model } from 'mongoose';

export interface WorkspaceDoc {
  workspaceName: string;
  ownerId: ObjectId;
  workerId: ObjectId;
  role: string;
  active: boolean;
  leisure: boolean;
  waitList: ObjectId[];
  organizationId: ObjectId;
  salary: string;
  responsibility: string;
}

const workspaceSchema = new Schema<WorkspaceDoc>(
  {
    workspaceName: {
      type: String,
      trim: true,
    },

    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    role: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    active: {
      type: Boolean,
      default: false,
    },

    leisure: {
      type: Boolean,
      default: false,
    },

    waitList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    salary: {
      type: String,
    },
    responsibility: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

export default model('Workspace', workspaceSchema) as Model<WorkspaceDoc>;
