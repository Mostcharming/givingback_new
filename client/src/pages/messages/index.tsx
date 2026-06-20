/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { MessageCircle, Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import logo from "../../assets/images/logo.png";
import useBackendService from "../../services/backend_service";
import { useContent } from "../../services/useContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface Chat {
  id: string;
  otherParticipant: {
    userId: string | null;
    userType: string;
    email?: string | null;
  };
  unreadCount: number;
  lastMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

type ChatEvent =
  | { type: "connected" }
  | {
      type: "message";
      chatId: string | number;
      message: Message;
    };

interface Message {
  id: string | number;
  chatId: string | number;
  senderUserId: string | number;
  senderUserType: string;
  message: string;
  attachments: any[];
  status: string;
  createdAt: string;
}

const mapMessageFromApi = (msg: any): Message => ({
  id: msg.id,
  chatId: msg.chatId ?? msg.chat_id,
  senderUserId: msg.senderUserId ?? msg.sender_user_id,
  senderUserType: msg.senderUserType ?? msg.sender_user_type,
  message: msg.message,
  attachments: msg.attachments || [],
  status: msg.status,
  createdAt: msg.createdAt ?? msg.created_at,
});

const ADMIN_USER_TYPE = "admin";

const isAdminChat = (chat: Chat | null) => {
  return chat?.otherParticipant?.userType === ADMIN_USER_TYPE;
};

const getUserTypeDisplay = (userType?: string | null) => {
  const normalized = userType?.toLowerCase();
  if (normalized === "admin") return "ADMIN";
  if (normalized === "ngo") return "NGO";
  return "DONOR";
};

const capitalizeFirstLetter = (value?: string | null) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const getBackendErrorMessage = (error: any, fallback: string) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const getDateSeparator = (
  currentDate: Date,
  previousDate: Date | null,
): string | null => {
  // If it's the first message, show the separator
  if (!previousDate) {
    return formatDateSeparator(currentDate);
  }

  // Check if dates are different
  const currentDay = currentDate.toDateString();
  const previousDay = previousDate.toDateString();

  if (currentDay !== previousDay) {
    return formatDateSeparator(currentDate);
  }

  return null;
};

const formatDateSeparator = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateString = date.toDateString();
  const todayString = today.toDateString();
  const yesterdayString = yesterday.toDateString();

  if (dateString === todayString) {
    return "Today";
  } else if (dateString === yesterdayString) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

function MessageDonor() {
  const { authState } = useContent();
  const currentUserId =
    authState.user?.id !== undefined && authState.user?.id !== null
      ? String(authState.user.id)
      : null;
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchValidation, setSearchValidation] = useState<
    "valid" | "invalid" | null
  >(null);
  const [showSearchTooltip, setShowSearchTooltip] = useState(false);
  const [searchedDonor, setSearchedDonor] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedChatIdRef = useRef<string | null>(null);
  const chatsRef = useRef<Chat[]>([]);

  const fetchChatsAPI = useBackendService<{ chats: Chat[] }, any>(
    "/chats",
    "GET",
  );

  const fetchMessagesAPI = useBackendService<{ messages: Message[] }, any>(
    selectedChat?.id ? `/chats/${selectedChat.id}/messages` : "/chats",
    "GET",
  );

  const sendMessageAPI = useBackendService<{ data: Message }, any>(
    selectedChat?.id ? `/chats/${selectedChat.id}/messages` : "/chats",
    "POST",
  );

  const createChatAPI = useBackendService<{ chat: Chat }, any>(
    "/chats",
    "POST",
  );

  const searchDonorAPI = useBackendService<{ donor: any }, any>(
    `/chats/search-donor`,
    "POST",
  );

  const isOwnMessage = (message: Message) => {
    if (!currentUserId) return false;
    return String(message.senderUserId) === currentUserId;
  };

  const markChatAsRead = async (chatId: string | number) => {
    await axios.put(
      `${API_BASE_URL}/chats/${chatId}/mark-as-read`,
      {},
      {
        headers: {
          Authorization: authState.token ? `Bearer ${authState.token}` : undefined,
        },
      },
    );
    window.dispatchEvent(new Event("chat-unread-count-refresh"));
  };

  useEffect(() => {
    selectedChatIdRef.current =
      selectedChat?.id !== undefined && selectedChat?.id !== null
        ? String(selectedChat.id)
        : null;
  }, [selectedChat?.id]);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const result = await fetchChatsAPI.mutateAsync({});
        setChats(result.chats || []);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    if (authState.user?.id) {
      loadChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedChat?.id) {
      const loadMessages = async () => {
        try {
          const result = await fetchMessagesAPI.mutateAsync({});
          const transformedMessages = (result.messages || []).map((msg: any) =>
            mapMessageFromApi(msg),
          );
          setMessages(transformedMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };

      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?.id]);

  useEffect(() => {
    if (!selectedChat?.id || selectedChat.unreadCount <= 0) return;

    const markSelectedChatAsRead = async () => {
      try {
        await markChatAsRead(selectedChat.id);
        setChats((currentChats) =>
          currentChats.map((chat) =>
            String(chat.id) === String(selectedChat.id)
              ? { ...chat, unreadCount: 0 }
              : chat,
          ),
        );
        setSelectedChat((currentChat) =>
          currentChat && String(currentChat.id) === String(selectedChat.id)
            ? { ...currentChat, unreadCount: 0 }
            : currentChat,
        );
      } catch (error) {
        console.error("Failed to mark chat as read:", error);
      }
    };

    markSelectedChatAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?.id, selectedChat?.unreadCount]);

  useEffect(() => {
    if (!authState.user?.id || !authState.token) return;

    const events = new EventSource(
      `${API_BASE_URL}/chats/events/stream?token=${encodeURIComponent(authState.token)}`,
    );

    events.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as ChatEvent;

        if (payload.type !== "message") return;

        const incomingMessage = mapMessageFromApi(payload.message);
        const incomingChatId = String(payload.chatId);
        const knownChat = chatsRef.current.some(
          (chat) => String(chat.id) === incomingChatId,
        );

        if (!knownChat) {
          fetchChatsAPI
            .mutateAsync({})
            .then((result) => setChats(result.chats || []))
            .catch((error) =>
              console.error(
                "Failed to refresh chats after realtime event:",
                error,
              ),
            );
        }

        setChats((currentChats) =>
          currentChats.map((chat) => {
            if (String(chat.id) !== incomingChatId) return chat;

            return {
              ...chat,
              unreadCount:
                selectedChatIdRef.current === incomingChatId
                  ? 0
                  : chat.unreadCount + 1,
              lastMessage: incomingMessage.message,
              updatedAt: incomingMessage.createdAt,
            };
          }),
        );

        if (selectedChatIdRef.current !== incomingChatId) return;

        markChatAsRead(incomingChatId)
          .catch((error) =>
            console.error("Failed to mark realtime message as read:", error),
          );

        setMessages((currentMessages) => {
          const exists = currentMessages.some(
            (message) => String(message.id) === String(incomingMessage.id),
          );

          if (exists) return currentMessages;

          return [...currentMessages, incomingMessage];
        });
      } catch (error) {
        console.error("Failed to process chat realtime event:", error);
      }
    };

    events.onerror = (error) => {
      console.error("Chat realtime connection failed:", error);
    };

    return () => {
      events.close();
    };
  }, [authState.token, authState.user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAdminChatClick = async () => {
    const adminChat = chats.find(
      (chat) => chat.otherParticipant?.userType === ADMIN_USER_TYPE,
    );

    if (adminChat) {
      setSelectedChat(adminChat);
    } else {
      // Create a new chat with admin if it doesn't exist
      try {
        const result = await createChatAPI.mutateAsync({
          otherParticipant: {
            userType: ADMIN_USER_TYPE,
          },
        });
        setSelectedChat(result.chat);
        setChats([...chats, result.chat]);
      } catch (error) {
        console.error("Failed to create admin chat:", error);
      }
    }
  };

  const handleChatClick = async (chat: Chat) => {
    setSelectedChat({ ...chat, unreadCount: 0 });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    try {
      const result = await sendMessageAPI.mutateAsync({
        message: messageText,
        attachments: [],
      });

      const sentMessage = mapMessageFromApi(result.data);
      setMessages((currentMessages) => [...currentMessages, sentMessage]);
      setChats((currentChats) =>
        currentChats.map((chat) =>
          String(chat.id) === String(sentMessage.chatId)
            ? {
                ...chat,
                lastMessage: sentMessage.message,
                updatedAt: sentMessage.createdAt,
              }
            : chat,
        ),
      );
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSearchText(value);

    if (!value.trim()) {
      setSearchValidation(null);
      setSearchedDonor(null);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setSearchValidation("invalid");
      setSearchedDonor(null);
      return;
    }

    // Search for donor
    try {
      const result = await searchDonorAPI.mutateAsync({ email: value });
      if (result.donor) {
        setSearchValidation("valid");
        setSearchedDonor(result.donor);
      } else {
        setSearchValidation("invalid");
        setSearchedDonor(null);
      }
    } catch (error) {
      console.error("Failed to search donor:", error);
      toast.error(getBackendErrorMessage(error, "Failed to search donor"));
      setSearchValidation("invalid");
      setSearchedDonor(null);
    }
  };

  const handleStartChatWithDonor = async () => {
    if (!searchedDonor) return;
    // If a chat already exists with this userId (don't care donor vs corporate), reuse it
    const existingChat = chats.find((chat) => {
      const otherId = chat.otherParticipant?.userId;
      if (otherId !== undefined && otherId !== null) {
        return String(otherId) === String(searchedDonor.id);
      }

      // Fallback: match by email when userId is not available
      const otherEmail = chat.otherParticipant?.email;
      if (otherEmail && searchedDonor.email) {
        return String(otherEmail).toLowerCase() === String(searchedDonor.email).toLowerCase();
      }

      return false;
    });

    if (existingChat) {
      setSelectedChat(existingChat);
      setSearchText("");
      setSearchValidation(null);
      setSearchedDonor(null);
      return;
    }

    try {
      // Treat `corporate` the same as `donor` when creating chats
      const normalizedType =
        searchedDonor.userType === "corporate" ? "donor" : searchedDonor.userType || "donor";

      const result = await createChatAPI.mutateAsync({
        otherParticipant: {
          userId: searchedDonor.id,
          userType: normalizedType,
        },
      });

      // Add the new chat to the list
      setChats((prev) => [...prev, result.chat]);
      setSelectedChat(result.chat);
      setSearchText("");
      setSearchValidation(null);
      setSearchedDonor(null);
    } catch (error) {
      console.error("Failed to create chat with donor:", error);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const displayName =
      chat.otherParticipant?.userId || chat.otherParticipant?.userType;
    const matchesSearch = (displayName || "")
      .toString()
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesSearch && chat.otherParticipant?.userType !== ADMIN_USER_TYPE;
  });

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .messages-container {
            flex-direction: column !important;
            height: auto !important;
          }
          .messages-sidebar {
            width: 100% !important;
            border-end: none !important;
            border-bottom: 1px solid #e8ebf2 !important;
            max-height: 40vh;
          }
          .messages-main {
            flex: 1;
            min-height: 60vh;
          }
        }
      `}</style>
      <div
        className="d-flex messages-container"
        style={{ backgroundColor: "#f5f7fa", height: "95vh" }}
      >
        {/* Left Sidebar */}
        <div
          className="messages-sidebar bg-white p-3 border-end d-flex flex-column"
          style={{ width: "420px", borderColor: "#e8ebf2" }}
        >
          {/* Header */}
          <div className="p-4" style={{ borderColor: "#e8ebf2" }}>
            <h1 className="h5 mb-0 fw-semibold" style={{ color: "#128330" }}>
              Messages
            </h1>
            <p className="small mb-0" style={{ color: "#888888" }}>
              Communicate with NGOs, Donors and GivingBack admin team.
            </p>
          </div>

          {/* Search */}
          <div className="p-3">
            <div style={{ position: "relative" }}>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ backgroundColor: "white" }}>
                      <Search />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    style={{
                      backgroundColor: "white",
                      height: "100%",
                      borderColor:
                        searchValidation === "valid"
                          ? "#128330"
                          : searchValidation === "invalid"
                            ? "#dc3545"
                            : "#e8ebf2",
                      borderWidth: searchValidation ? "2px" : "1px",
                    }}
                    className="p-3"
                    placeholder={
                      authState.user?.role === "ngo"
                        ? "Search donors by email"
                        : "Search"
                    }
                    type="text"
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() =>
                      authState.user?.role === "ngo" &&
                      setShowSearchTooltip(true)
                    }
                    onBlur={() => setShowSearchTooltip(false)}
                    title={
                      authState.user?.role === "ngo"
                        ? "Search for donors by email"
                        : ""
                    }
                  />
                </InputGroup>
              </FormGroup>

              {/* Tooltip */}
              {showSearchTooltip &&
                authState.user?.role === "ngo" &&
                !searchText && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      backgroundColor: "#333",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      zIndex: 1000,
                      marginTop: "4px",
                    }}
                  >
                    Search for donors by email
                  </div>
                )}

              {/* Donor suggestion */}
              {searchValidation === "valid" && searchedDonor && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    right: "0",
                    backgroundColor: "white",
                    border: "1px solid #128330",
                    borderRadius: "4px",
                    marginTop: "4px",
                    zIndex: 1000,
                  }}
                >
                  <div
                    className="p-3 d-flex align-items-center justify-content-between"
                    style={{ cursor: "pointer" }}
                    onClick={handleStartChatWithDonor}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f1f2f7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <div>
                      <p className="mb-0 small fw-medium">
                        {searchedDonor.name || "Donor"}
                      </p>
                      <p className="mb-0 small" style={{ color: "#888888" }}>
                        {searchedDonor.email}
                      </p>
                    </div>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#128330",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-grow-1 overflow-auto">
            {/* Admin Chat - Always at the top */}
            <div className="px-3 border-bottom">
              <div
                className="d-flex align-items-center p-3 rounded-2 cursor-pointer"
                style={{
                  cursor: "pointer",
                  backgroundColor: isAdminChat(selectedChat)
                    ? "#f1f2f7"
                    : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f1f2f7")
                }
                onMouseLeave={(e) => {
                  if (!isAdminChat(selectedChat)) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
                onClick={handleAdminChatClick}
              >
                <Image
                  src={logo}
                  alt="GivingBack Admin"
                  width={50}
                  height={50}
                  className="bg-white rounded-circle m-2"
                />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    <span
                      className="fw-medium mb-0 small"
                      style={{ color: "#000000" }}
                    >
                      GivingBack Admin
                    </span>
                    <div>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_45_22028)">
                          <path
                            d="M3.20825 7.18455C3.08662 6.63666 3.10529 6.06692 3.26255 5.52817C3.4198 4.98942 3.71054 4.49909 4.10781 4.10265C4.50507 3.70622 4.99601 3.41651 5.53509 3.26038C6.07417 3.10426 6.64394 3.08677 7.19158 3.20955C7.49301 2.73814 7.90825 2.35019 8.39904 2.08146C8.88983 1.81273 9.44037 1.67187 9.99992 1.67188C10.5595 1.67187 11.11 1.81273 11.6008 2.08146C12.0916 2.35019 12.5068 2.73814 12.8082 3.20955C13.3567 3.08624 13.9275 3.10364 14.4674 3.26015C15.0074 3.41665 15.4989 3.70717 15.8965 4.10468C16.294 4.50219 16.5845 4.99378 16.741 5.53372C16.8975 6.07366 16.9149 6.64441 16.7916 7.19289C17.263 7.49431 17.6509 7.90956 17.9197 8.40035C18.1884 8.89114 18.3293 9.44168 18.3293 10.0012C18.3293 10.5608 18.1884 11.1113 17.9197 11.6021C17.6509 12.0929 17.263 12.5081 16.7916 12.8096C16.9144 13.3572 16.8969 13.927 16.7408 14.466C16.5846 15.0051 16.2949 15.4961 15.8985 15.8933C15.502 16.2906 15.0117 16.5813 14.473 16.7386C13.9342 16.8958 13.3645 16.9145 12.8166 16.7929C12.5156 17.2661 12.1 17.6557 11.6084 17.9257C11.1167 18.1956 10.5649 18.3371 10.0041 18.3371C9.44323 18.3371 8.89144 18.1956 8.39981 17.9257C7.90818 17.6557 7.49261 17.2661 7.19158 16.7929C6.64394 16.9157 6.07417 16.8982 5.53509 16.7421C4.99601 16.5859 4.50507 16.2962 4.10781 15.8998C3.71054 15.5033 3.4198 15.013 3.26255 14.4743C3.10529 13.9355 3.08662 13.3658 3.20825 12.8179C2.73321 12.5173 2.34193 12.1014 2.07079 11.6089C1.79965 11.1164 1.65747 10.5634 1.65747 10.0012C1.65747 9.43905 1.79965 8.88601 2.07079 8.39354C2.34193 7.90108 2.73321 7.48518 3.20825 7.18455Z"
                            fill="#128330"
                            stroke="#128330"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.5 9.9987L9.16667 11.6654L12.5 8.33203"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_45_22028">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <p className="mb-0 small" style={{ color: "#888888" }}>
                    Send us a message
                  </p>
                </div>
              </div>
            </div>

            {/* Other Chats */}
            {filteredChats.map((chat) => (
              <div key={chat.id} className="px-3 border-bottom">
                <div
                  className="d-flex align-items-center p-3 rounded-2 cursor-pointer"
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedChat?.id === chat.id ? "#f1f2f7" : "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1f2f7")
                  }
                  onMouseLeave={(e) => {
                    if (selectedChat?.id !== chat.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  onClick={() => handleChatClick(chat)}
                >
                  <Image
                    src={logo}
                    alt="Chat"
                    width={50}
                    height={50}
                    className="bg-white rounded-circle m-2"
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="fw-medium mb-0 small"
                        style={{ color: "#000000" }}
                      >
                        {chat.otherParticipant?.userType === "admin"
                          ? "GivingBack Admin"
                          : capitalizeFirstLetter(
                              chat.otherParticipant?.email,
                            ) || "Unknown"}
                      </span>
                    </div>
                    <p className="mb-0 small" style={{ color: "#888888" }}>
                      {getUserTypeDisplay(chat.otherParticipant?.userType)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className="messages-main flex-grow-1 d-flex flex-column"
          style={{ minHeight: 0 }}
        >
          {!selectedChat ? (
            <div
              className="flex-grow-1 d-flex align-items-center justify-content-center"
              style={{ minHeight: 0 }}
            >
              <div className="text-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#e8ebf2",
                  }}
                >
                  <MessageCircle
                    style={{
                      width: "32px",
                      height: "32px",
                      color: "#888888",
                    }}
                  />
                </div>
                <h2 className="h5 fw-medium mb-2" style={{ color: "#000000" }}>
                  Select a message
                </h2>
                <p className="small mb-0" style={{ color: "#888888" }}>
                  {"Select a message from the list to view it's content."}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div
                className="p-4 border-bottom"
                style={{ borderColor: "#e8ebf2", backgroundColor: "white" }}
              >
                <h2 className="h5 fw-medium mb-0" style={{ color: "#000000" }}>
                  {isAdminChat(selectedChat)
                    ? "GivingBack Admin"
                    : `${capitalizeFirstLetter(selectedChat.otherParticipant?.email) || "Unknown"} • ${getUserTypeDisplay(selectedChat.otherParticipant?.userType)}`}
                </h2>
              </div>

              {/* Messages Container */}
              <div
                className="flex-grow-1 overflow-auto p-4"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#f5f7fa",
                }}
              >
                {messages.length === 0 ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-center">
                      <p style={{ color: "#888888" }}>No messages yet</p>
                      <p className="small" style={{ color: "#888888" }}>
                        Start the conversation by sending a message
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const currentDate = new Date(message.createdAt);
                    const previousMessage =
                      index > 0 ? messages[index - 1] : null;
                    const previousDate = previousMessage
                      ? new Date(previousMessage.createdAt)
                      : null;
                    const dateSeparator = getDateSeparator(
                      currentDate,
                      previousDate,
                    );

                    return (
                      <div key={message.id}>
                        {dateSeparator && (
                          <div className="d-flex align-items-center my-3">
                            <div
                              style={{
                                flex: 1,
                                height: "1px",
                                backgroundColor: "#e8ebf2",
                              }}
                            />
                            <div
                              style={{
                                margin: "0 12px",
                                fontSize: "12px",
                                color: "#888888",
                                fontWeight: "500",
                              }}
                            >
                              {dateSeparator}
                            </div>
                            <div
                              style={{
                                flex: 1,
                                height: "1px",
                                backgroundColor: "#e8ebf2",
                              }}
                            />
                          </div>
                        )}
                        <div
                          className="mb-3 d-flex"
                          style={{
                            justifyContent: isOwnMessage(message)
                              ? "flex-end"
                              : "flex-start",
                          }}
                        >
                          <div
                            style={{
                              maxWidth: "60%",
                              padding: "10px 16px",
                              borderRadius: "8px",
                              backgroundColor: isOwnMessage(message)
                                ? "#128330"
                                : "#e8ebf2",
                              color: isOwnMessage(message)
                                ? "white"
                                : "#000000",
                            }}
                          >
                            <p className="mb-0 small">{message.message}</p>
                            <p
                              className="mb-0 text-end"
                              style={{
                                fontSize: "10px",
                                opacity: 0.7,
                                marginTop: "4px",
                              }}
                            >
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div
                className="p-4 border-top"
                style={{
                  borderColor: "#e8ebf2",
                  backgroundColor: "#f5f7fa",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <Input
                    type="textarea"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    style={{
                      borderColor: "#e8ebf2",
                      borderRadius: "8px",
                      padding: "10px 48px 10px 12px",
                      minHeight: "40px",
                      maxHeight: "100px",
                      resize: "none",
                      backgroundColor: "white",
                      paddingRight: "48px",
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    style={{
                      position: "absolute",
                      right: "8px",
                      bottom: "8px",
                      backgroundColor: "#128330",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      cursor: messageText.trim() ? "pointer" : "not-allowed",
                      opacity: messageText.trim() ? 1 : 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MessageDonor;
