"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCallToken = exports.updateProfile = exports.updatePassword = exports.grantValid = exports.forgotPassword = exports.reVerifyEmail = exports.verifyEmail = exports.signIn = exports.getProfile = exports.create = void 0;
const emailVerificationSchema_1 = __importDefault(require("../models/emailVerificationSchema"));
const passwordResetToken_1 = __importDefault(require("../models/passwordResetToken"));
const user_1 = __importDefault(require("../models/user"));
const helper_1 = require("../utils/helper");
const mail_1 = require("../utils/mail");
require("dotenv/config");
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const cloud_1 = __importDefault(require("../cloud"));
const stream_chat_1 = require("stream-chat");
const user = process.env.USER;
const password = process.env.PASSWORD;
const link = process.env.PASSWORD_RESET_LINK;
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STEAM_SECRET_KEY;
const serverClient = stream_chat_1.StreamChat.getInstance(api_key, api_secret);
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, avatar } = req.body;
    console.log('name', name, 'email', email, 'password', password);
    const { secure_url, public_id } = yield cloud_1.default.uploader.upload(avatar, {
        width: 200,
        height: 200,
        crop: 'thumb',
        gravity: 'faces',
    });
    const userExists = yield user_1.default.findOne({ email: email });
    if (userExists) {
        return res
            .status(400)
            .json({ error: 'User already exists, Please use a different email' });
    }
    try {
        const user = yield user_1.default.create({
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
        yield user.save();
        const token = (0, helper_1.generateToken)(5);
        yield emailVerificationSchema_1.default.create({ owner: user._id, token });
        yield (0, mail_1.sendVerificationMail)(token, {
            name,
            email,
            userId: user._id.toString(),
        });
        return res.status(201).json({
            user: { id: user._id, name, email, streamToken },
        });
    }
    catch (error) {
        console.log('Sign-in error', error);
        return res.status(500).json({ error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.create = create;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id } = req.params;
    try {
        const userExists = yield user_1.default.findById(id)
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
                organizations: (userExists === null || userExists === void 0 ? void 0 : userExists.organizations) || null,
                avatarUrl: userExists === null || userExists === void 0 ? void 0 : userExists.avatar.url,
                dateOfBirth: (userExists === null || userExists === void 0 ? void 0 : userExists.dateOfBirth) || null,
                followers: (_a = userExists === null || userExists === void 0 ? void 0 : userExists.following) === null || _a === void 0 ? void 0 : _a.length,
                posts: (_b = userExists === null || userExists === void 0 ? void 0 : userExists.posts) === null || _b === void 0 ? void 0 : _b.length,
                workspace: (_c = userExists === null || userExists === void 0 ? void 0 : userExists.workspaces) === null || _c === void 0 ? void 0 : _c.length,
                worker: userExists === null || userExists === void 0 ? void 0 : userExists.worker,
                phoneNumber: userExists === null || userExists === void 0 ? void 0 : userExists.phoneNumber,
            },
        });
    }
    catch (error) {
        console.log('Get profile error', error);
        return res.status(500).json({ error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.getProfile = getProfile;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({
        email,
    });
    console.log('email', email, 'password', password);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const matched = yield user.comparePassword(password);
    if (!matched)
        return res.status(403).json({ error: 'Invalid credentials' });
    return res.status(200).json({
        user: {
            id: user === null || user === void 0 ? void 0 : user._id,
            verified: user === null || user === void 0 ? void 0 : user.verified,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            streamToken: user === null || user === void 0 ? void 0 : user.streamToken,
            avatarUrl: user === null || user === void 0 ? void 0 : user.avatar.url,
        },
    });
});
exports.signIn = signIn;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, userId } = req.body;
    console.log({ token, userId });
    const verificationToken = yield emailVerificationSchema_1.default.findOne({
        owner: userId,
    });
    if (!verificationToken) {
        return res.status(403).json({ error: 'Verification token not found!' });
    }
    const matched = yield verificationToken.compareToken(token);
    if (!matched) {
        return res.status(403).json({ error: 'Invalid token!' });
    }
    const user = yield user_1.default.findByIdAndUpdate(userId, { verified: true });
    yield emailVerificationSchema_1.default.findByIdAndDelete(verificationToken._id);
    return res.status(201).json({ message: 'Your email has been verified!' });
});
exports.verifyEmail = verifyEmail;
const reVerifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    yield emailVerificationSchema_1.default.findOneAndDelete({ owner: userId });
    const token = (0, helper_1.generateToken)(5);
    if (!(0, mongoose_1.isValidObjectId)(userId))
        return res.status(404).json({ error: 'User not found' });
    const user = yield user_1.default.findById(userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    yield emailVerificationSchema_1.default.create({
        owner: userId,
        token,
    });
    yield (0, mail_1.sendVerificationMail)(token, {
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        userId: user === null || user === void 0 ? void 0 : user._id.toString(),
    });
    res
        .status(200)
        .json({ message: 'Please check your email to verify your account' });
});
exports.reVerifyEmail = reVerifyEmail;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    yield passwordResetToken_1.default.findOneAndDelete({ owner: user._id });
    const token = crypto_1.default.randomBytes(36).toString('hex');
    yield passwordResetToken_1.default.create({ owner: user._id, token });
    const resetLinkToBeSent = `${link}?token=${token}&userId=${user._id}`;
    yield (0, mail_1.sendForgetPasswordLink)({ email: email, link: resetLinkToBeSent });
    res.json({ message: 'Please check your email' });
});
exports.forgotPassword = forgotPassword;
const grantValid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).json({ valid: true });
});
exports.grantValid = grantValid;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, userId } = req.body;
    const user = yield user_1.default.findById(userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    user.password = password;
    yield user.save();
    yield passwordResetToken_1.default.findOneAndDelete({ owner: user._id });
    yield (0, mail_1.sendSuccessEmail)(user.name, user.email);
    res.json({ message: 'Password updated successfully' });
});
exports.updatePassword = updatePassword;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { name, email, id, avatar, phoneNumber, dateOfBirth } = req.body;
    const user = yield user_1.default.findById(id);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    if (avatar) {
        if ((_d = user.avatar) === null || _d === void 0 ? void 0 : _d.public_id) {
            yield cloud_1.default.uploader.destroy(user.avatar.public_id);
        }
        const { secure_url, public_id } = yield cloud_1.default.uploader.upload(avatar, {
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
    yield user.save();
    res.status(201).json({ profile: user });
});
exports.updateProfile = updateProfile;
const sendCallToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email, name } = req.body;
    console.log({ token, email });
    yield (0, mail_1.sendCallMail)(token, email, name);
    return res.status(201).json({ message: 'Your email has been verified!' });
});
exports.sendCallToken = sendCallToken;
