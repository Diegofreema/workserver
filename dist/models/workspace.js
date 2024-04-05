"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workspaceSchema = new mongoose_1.Schema({
    workspaceName: {
        type: String,
        trim: true,
    },
    workerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    role: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    salary: {
        type: String,
    },
    responsibility: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Workspace', workspaceSchema);
