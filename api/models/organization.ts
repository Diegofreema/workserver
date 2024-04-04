import { compare, hash } from 'bcrypt';
import { Model, ObjectId, Schema, model } from 'mongoose';
// organization_name: yup.string().required('Name of organization is required'),
//   category: yup.string().required('Category is required'),
//   location: yup.string().required('Location is required'),
//   description: yup.string().required('Description is required'),
//   startDay: yup.string().required('Working days are required'),
//   endDay: yup.string().required('Working days are required'),

//   website_url: yup.string().required('Website link is required'),
//   email: yup.string().email('Invalid email').required('Email is required'),
export interface Organization {
  organizationName: string;
  email: string;
  password: string;
  location: string;
  description: string;
  category: string;
  open: boolean;
  avatar: {
    url: string;
    public_id: string;
  };
  websiteUrl: string;
  startDay: string;
  endDay: string;
  followers?: ObjectId[];
  ownerId: ObjectId;
  startTime: string;
  endTime: string;
}
interface Methods {
  comparePassword(password: string): Promise<boolean>;
}
const organizationSchema = new Schema<Organization, {}, Methods>(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },

    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    websiteUrl: {
      type: String,
    },

    location: {
      type: String,
    },

    endDay: {
      type: String,
      required: true,
    },
    startDay: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

organizationSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

organizationSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};

export default model('Organization', organizationSchema) as Model<
  Organization,
  {},
  Methods
>;
