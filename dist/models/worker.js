"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workerSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    role: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Worker', workerSchema);
