"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connectionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    workspace: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Connection', connectionSchema);
