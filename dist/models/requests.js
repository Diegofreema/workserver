"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const requestSchema = new mongoose_1.Schema({
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Workspace',
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Request', requestSchema);
