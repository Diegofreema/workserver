import { SignInUser, VerifyUser } from '@/@types/user';
import emailVerificationSchema from '@/models/emailVerificationSchema';
import passwordResetToken from '@/models/passwordResetToken';
import User from '@/models/user';
import { generateToken } from '@/utils/helper';
import {
  sendCallMail,
  sendForgetPasswordLink,
  sendSuccessEmail,
  // sendVerificationMail,
} from '@/utils/mail';
import 'dotenv/config';
import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import crypto from 'crypto';

import cloudinary from '@/cloud';
import { StreamChat } from 'stream-chat';

const user = process.env.USER;
const password = process.env.PASSWORD;
const link = process.env.PASSWORD_RESET_LINK;
const api_key = process.env.STREAM_API_KEY!;
const api_secret = process.env.STEAM_SECRET_KEY!;
const serverClient = StreamChat.getInstance(api_key, api_secret);
// Create User Token

export const create: RequestHandler = async (req: any, res) => {
  const { name, email, password, avatar } = req.body;
  console.log('name', name, 'email', email, 'password', password);

  const { secure_url, public_id } = await cloudinary.uploader.upload(avatar, {
    width: 200,
    height: 200,
    crop: 'thumb',
    gravity: 'faces',
  });

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res
      .status(400)
      .json({ error: 'User already exists, Please use a different email' });
  }
  try {
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        url: secure_url,
        public_id: public_id,
      },
    });

    const streamToken = serverClient.createToken(user._id.toString());
    user.streamToken = streamToken;
    await user.save();
    const token = generateToken(5);
    await emailVerificationSchema.create({ owner: user._id, token });
    // await sendVerificationMail(token, {
    //   name,
    //   email,
    //   userId: user._id.toString(),
    // });

    return res.status(201).json({
      user: {
        id: user._id,
        name,
        email,
        streamToken,
        avatar: user?.avatar?.url,
      },
    });
  } catch (error: any) {
    console.log('Sign-in error', error);

    return res.status(500).json({ error: error?.message });
  }
};
export const getProfile: RequestHandler = async (req: any, res) => {
  const { id } = req.params;

  try {
    const userExists = await User.findById(id)
      .populate('organizations', '*')
      .populate('worker', '*');
    if (!userExists) {
      return res
        .status(401)
        .json({ error: 'Unauthorized, User does not exist' });
    }
    res.status(200).json({
      user: {
        id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        streamToken: userExists.streamToken,
        organizations: userExists?.organizations || null,
        avatarUrl: userExists?.avatar.url,
        dateOfBirth: userExists?.dateOfBirth || null,
        followers: userExists?.following?.length,
        posts: userExists?.posts?.length,
        workspace: userExists?.workspaces?.length,
        worker: userExists?.worker,
        phoneNumber: userExists?.phoneNumber,
      },
    });
  } catch (error: any) {
    console.log('Get profile error', error);

    return res.status(500).json({ error: error?.message });
  }
};
export const signIn: RequestHandler = async (req: SignInUser, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });
  console.log('email', email, 'password', password);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const matched = await user.comparePassword(password);
  if (!matched) return res.status(403).json({ error: 'Invalid credentials' });

  return res.status(200).json({
    user: {
      id: user?._id,
      verified: user?.verified,
      name: user?.name,
      email: user?.email,
      streamToken: user?.streamToken,
      avatarUrl: user?.avatar.url,
    },
  });
};

export const verifyEmail: RequestHandler = async (req: VerifyUser, res) => {
  const { token, userId } = req.body;
  console.log({ token, userId });

  const verificationToken = await emailVerificationSchema.findOne({
    owner: userId,
  });

  if (!verificationToken) {
    return res.status(403).json({ error: 'Verification token not found!' });
  }
  const matched = await verificationToken.compareToken(token);

  if (!matched) {
    return res.status(403).json({ error: 'Invalid token!' });
  }

  const user = await User.findByIdAndUpdate(userId, { verified: true });
  await emailVerificationSchema.findByIdAndDelete(verificationToken._id);
  return res.status(201).json({ message: 'Your email has been verified!' });
};
export const reVerifyEmail: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  await emailVerificationSchema.findOneAndDelete({ owner: userId });

  const token = generateToken(5);

  if (!isValidObjectId(userId))
    return res.status(404).json({ error: 'User not found' });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await emailVerificationSchema.create({
    owner: userId,
    token,
  });

  // await sendVerificationMail(token, {
  //   name: user?.name,
  //   email: user?.email,
  //   userId: user?._id.toString(),
  // });

  res
    .status(200)
    .json({ message: 'Please check your email to verify your account' });
};

export const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  await passwordResetToken.findOneAndDelete({ owner: user._id });
  const token = crypto.randomBytes(36).toString('hex');

  await passwordResetToken.create({ owner: user._id, token });
  const resetLinkToBeSent = `${link}?token=${token}&userId=${user._id}`;
  await sendForgetPasswordLink({ email: email, link: resetLinkToBeSent });
  res.json({ message: 'Please check your email' });
};
export const grantValid: RequestHandler = async (req, res) => {
  return res.status(201).json({ valid: true });
};
export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.password = password;
  await user.save();
  await passwordResetToken.findOneAndDelete({ owner: user._id });

  await sendSuccessEmail(user.name, user.email);
  res.json({ message: 'Password updated successfully' });
};

export const updateProfile: any = async (req: any, res: any) => {
  const { name, email, id, avatar, phoneNumber, dateOfBirth } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (avatar) {
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(avatar, {
      width: 200,
      height: 200,
      crop: 'thumb',
      gravity: 'faces',
    });

    user.avatar = { url: secure_url, public_id: public_id };
  }
  user.name = name;
  user.email = email;
  user.phoneNumber = phoneNumber;
  user.dateOfBirth = dateOfBirth;

  await user.save();
  res.status(201).json({ profile: user });
};

export const sendCallToken: RequestHandler = async (req: any, res) => {
  const { token, email, name } = req.body;
  console.log({ token, email });

  await sendCallMail(token, email, name);

  return res.status(201).json({ message: 'Your email has been verified!' });
};
