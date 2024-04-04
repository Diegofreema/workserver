"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationBody = exports.VerifyEmailSchema = exports.SignInSchema = exports.CreateUserSchema = void 0;
const mongoose_1 = require("mongoose");
const yup = __importStar(require("yup"));
exports.CreateUserSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is missing!')
        .min(3, 'Name is too short!')
        .max(20, 'Name is too long!'),
    email: yup.string().email('Invalid email').required('Email is missing!'),
});
exports.SignInSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is missing!'),
    password: yup
        .string()
        .trim()
        .required('Password is missing!')
        .min(8, 'Password is too short!')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
});
exports.VerifyEmailSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is missing!')
        .min(3, 'Name is too short!')
        .max(20, 'Name is too long!'),
    email: yup.string().email('Invalid email').required('Email is missing!'),
    password: yup
        .string()
        .trim()
        .required('Password is missing!')
        .min(8, 'Password is too short!')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
});
exports.EmailVerificationBody = yup.object().shape({
    token: yup.string().trim().required('Invalid token'),
    userId: yup
        .string()
        .transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
            return value;
        }
        return '';
    })
        .required('Invalid userId'),
});
