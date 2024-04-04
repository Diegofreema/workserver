import { Model, ObjectId, Schema, model } from 'mongoose';
interface ConnectionDoc {
  userId: ObjectId;
  workspace: ObjectId;
}

const connectionSchema = new Schema<ConnectionDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Connection', connectionSchema) as Model<ConnectionDoc>;
