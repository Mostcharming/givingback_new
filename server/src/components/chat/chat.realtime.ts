import { Response } from "express";

type ChatMessagePayload = {
  type: "message";
  chatId: string | number;
  message: {
    id: string | number;
    chatId: string | number;
    senderUserId: string | number;
    senderUserType: string;
    message: string;
    attachments: unknown[] | null;
    status: string;
    createdAt: Date | string;
  };
};

type ChatEventPayload = ChatMessagePayload;

const clientsByUserId = new Map<string, Set<Response>>();

const writeEvent = (res: Response, payload: ChatEventPayload | { type: "connected" }) => {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const addChatRealtimeClient = (userId: string | number, res: Response) => {
  const key = String(userId);
  const clients = clientsByUserId.get(key) ?? new Set<Response>();
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

export const emitChatMessage = (
  recipientUserIds: Array<string | number | null | undefined>,
  payload: ChatMessagePayload,
) => {
  const delivered = new Set<Response>();

  recipientUserIds.forEach((userId) => {
    if (userId === null || userId === undefined) return;

    const clients = clientsByUserId.get(String(userId));
    if (!clients) return;

    clients.forEach((client) => {
      if (delivered.has(client)) return;
      writeEvent(client, payload);
      delivered.add(client);
    });
  });
};
