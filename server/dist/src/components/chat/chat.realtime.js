"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitChatMessage = exports.addChatRealtimeClient = void 0;
const clientsByUserId = new Map();
const writeEvent = (res, payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
};
const addChatRealtimeClient = (userId, res) => {
    var _a;
    const key = String(userId);
    const clients = (_a = clientsByUserId.get(key)) !== null && _a !== void 0 ? _a : new Set();
    clients.add(res);
    clientsByUserId.set(key, clients);
    writeEvent(res, { type: "connected" });
    return () => {
        clients.delete(res);
        if (clients.size === 0) {
            clientsByUserId.delete(key);
        }
    };
};
exports.addChatRealtimeClient = addChatRealtimeClient;
const emitChatMessage = (recipientUserIds, payload) => {
    const delivered = new Set();
    recipientUserIds.forEach((userId) => {
        if (userId === null || userId === undefined)
            return;
        const clients = clientsByUserId.get(String(userId));
        if (!clients)
            return;
        clients.forEach((client) => {
            if (delivered.has(client))
                return;
            writeEvent(client, payload);
            delivered.add(client);
        });
    });
};
exports.emitChatMessage = emitChatMessage;
