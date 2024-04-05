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
exports.sendSuccessEmail = exports.sendForgetPasswordLink = exports.sendCallMail = exports.sendVerificationMail = exports.generateMailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const template_1 = require("../newEmail/template");
const user = process.env.USER;
const password = process.env.PASSWORD;
const fromEmail = process.env.FROM_EMAIL;
const generateMailTransporter = () => {
    const transport = nodemailer_1.default.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
            user: user,
            pass: password,
        },
    });
    return transport;
};
exports.generateMailTransporter = generateMailTransporter;
const sendVerificationMail = (token, profile) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = (0, exports.generateMailTransporter)();
    const welcomeMessage = `Hi ${profile.name} Welcome to Workcloud. Please verify your email  with this token below.`;
    yield transport.sendMail({
        from: fromEmail,
        to: profile.email,
        subject: 'Welcome to workcloud',
        html: (0, template_1.generateTemplate)({
            title: 'Good to have you here ' + profile.name,
            message: welcomeMessage,
            logo: '',
            banner: '',
            link: '#',
            btnTitle: token,
        }),
    });
});
exports.sendVerificationMail = sendVerificationMail;
const sendCallMail = (token, email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = (0, exports.generateMailTransporter)();
    const welcomeMessage = `Hi ${name} use this code to join your call.`;
    yield transport.sendMail({
        from: fromEmail,
        to: email,
        subject: 'Join Call',
        html: (0, template_1.generateTemplate)({
            title: 'Good to have you here ' + name,
            message: welcomeMessage,
            logo: '',
            banner: '',
            link: '#',
            btnTitle: token,
        }),
    });
});
exports.sendCallMail = sendCallMail;
const sendForgetPasswordLink = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = (0, exports.generateMailTransporter)();
    const message = `Hi. Please click on the link below to reset your password`;
    yield transport.sendMail({
        from: fromEmail,
        to: options.email,
        subject: 'Reset Password',
        html: (0, template_1.generateTemplate)({
            title: 'Forgot Password',
            message: message,
            logo: '',
            banner: '',
            link: options.link,
            btnTitle: 'Reset Password',
        }),
    });
});
exports.sendForgetPasswordLink = sendForgetPasswordLink;
const sendSuccessEmail = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = (0, exports.generateMailTransporter)();
    const message = `Hi ${name} your password has been updated!`;
    yield transport.sendMail({
        from: fromEmail,
        to: email,
        subject: 'Password Reset Successfully',
        html: (0, template_1.generateTemplate)({
            title: 'Password Reset Successfully',
            message: message,
            logo: '',
            banner: '',
            link: process.env.SIGN_IN_URL,
            btnTitle: 'Login in',
        }),
    });
});
exports.sendSuccessEmail = sendSuccessEmail;
