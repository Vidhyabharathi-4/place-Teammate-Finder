import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import chatService from "../services/chatService";
import profileService from "../services/profileService";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  // WebSocket state
  const [wsConnected, setWsConnected] = useState(false);
  const [wsConnecting, setWsConnecting] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isIntentionalCloseRef = useRef(false);

  // Student discovery in New Chat modal
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchStudentsQuery, setSearchStudentsQuery] = useState("");
  const [studentSpecialization, setStudentSpecialization] = useState("All Specializations");
  const [searchingStudents, setSearchingStudents] = useState(false);

  // 1. Fetch Conversations & Unread Count
  const loadConversations = useCallback(async () => {
    try {
      const [convs, unreadData] = await Promise.all([
        chatService.getConversations(),
        chatService.getUnreadCount(),
      ]);
      setConversations(convs || []);
      setTotalUnread(unreadData?.total_unread || 0);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 30000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  // 2. Handle URL query parameters (?user={id} or ?team={id})
  useEffect(() => {
    const targetUserId = searchParams.get("user");
    const targetTeamId = searchParams.get("team");

    if (targetUserId) {
      const uId = parseInt(targetUserId, 10);
      if (uId && uId !== user?.id) {
        // Check if conversation already exists in list
        const existing = conversations.find(
          (c) => c.type === "direct" && c.target_id === uId
        );
        if (existing) {
          setActiveConversation(existing);
        } else {
          // Fetch student profile to initialize a new conversation card
          profileService
            .getUserProfile(uId)
            .then((student) => {
              const syntheticConv = {
                id: `dm_${student.id}`,
                type: "direct",
                target_id: student.id,
                name: student.name,
                avatar: student.profile_picture,
                subtext: student.department || "Student",
                last_message: "New direct message",
                last_message_time: new Date().toISOString(),
                unread_count: 0,
                is_online: false,
              };
              setConversations((prev) => [
                syntheticConv,
                ...prev.filter((c) => c.id !== syntheticConv.id),
              ]);
              setActiveConversation(syntheticConv);
            })
            .catch((err) => {
              console.error("Failed to load target student:", err);
            });
        }
      }
    } else if (targetTeamId) {
      const tId = parseInt(targetTeamId, 10);
      if (tId) {
        const existingTeam = conversations.find(
          (c) => c.type === "team" && c.target_id === tId
        );
        if (existingTeam) {
          setActiveConversation(existingTeam);
        }
      }
    }
  }, [searchParams, conversations, user?.id]);

  // 3. Search students in New Chat modal
  const fetchStudents = useCallback(async () => {
    try {
      setSearchingStudents(true);
      const params = {};
      if (searchStudentsQuery.trim()) params.search = searchStudentsQuery.trim();
      if (studentSpecialization && studentSpecialization !== "All Specializations") {
        params.specialization = studentSpecialization;
      }
      const data = await chatService.searchChatUsers(params);
      setAvailableStudents(data || []);
    } catch (err) {
      console.error("Failed to search students:", err);
    } finally {
      setSearchingStudents(false);
    }
  }, [searchStudentsQuery, studentSpecialization]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // 4. Connect WebSocket & Load Message History when activeConversation changes
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    isIntentionalCloseRef.current = false;

    // Load Message History via REST
    const loadHistory = async () => {
      setLoadingMessages(true);
      try {
        if (activeConversation.type === "direct") {
          const history = await chatService.getDirectMessages(
            activeConversation.target_id
          );
          if (isMounted) setMessages(history || []);
          // Mark as read
          chatService.markDirectAsRead(activeConversation.target_id).catch(() => {});
          // Decrement unread counter locally
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversation.id ? { ...c, unread_count: 0 } : c
            )
          );
        } else {
          const history = await chatService.getTeamMessages(
            activeConversation.target_id
          );
          if (isMounted) setMessages(history || []);
        }
      } catch (err) {
        console.error("Failed to load message history:", err);
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    loadHistory();

    // WebSocket Setup
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const wsBase = chatService.getWebSocketBaseUrl();
    const wsPath =
      activeConversation.type === "direct"
        ? `/ws/direct/${activeConversation.target_id}`
        : `/ws/team/${activeConversation.target_id}`;

    const wsUrl = `${wsBase}${wsPath}?token=${encodeURIComponent(token)}`;

    const connectWebSocket = () => {
      if (!isMounted) return;
      setWsConnecting(true);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        setWsConnected(true);
        setWsConnecting(false);
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === "new_message" || payload.type === "new_team_message") {
            const newMsg = payload.data;
            // Check if this message belongs to the active conversation
            const isRelevant =
              activeConversation.type === "team"
                ? newMsg.team_id === activeConversation.target_id
                : (newMsg.sender_id === activeConversation.target_id &&
                    newMsg.receiver_id === user?.id) ||
                  (newMsg.sender_id === user?.id &&
                    newMsg.receiver_id === activeConversation.target_id);

            if (isRelevant) {
              setMessages((prev) => {
                // Avoid duplicate messages
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });

              // If DM from partner, mark read immediately
              if (
                activeConversation.type === "direct" &&
                newMsg.sender_id === activeConversation.target_id
              ) {
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({ type: "read" }));
                }
              }
            }

            // Update conversations list preview
            setConversations((prev) =>
              prev.map((c) => {
                if (
                  (activeConversation.type === "team" && c.target_id === newMsg.team_id) ||
                  (activeConversation.type === "direct" &&
                    (c.target_id === newMsg.sender_id || c.target_id === newMsg.receiver_id))
                ) {
                  return {
                    ...c,
                    last_message: newMsg.message,
                    last_message_time: newMsg.created_at,
                  };
                }
                return c;
              })
            );
          } else if (payload.type === "message_sent") {
            const confirmedMsg = payload.data;
            setMessages((prev) => {
              if (prev.some((m) => m.id === confirmedMsg.id)) return prev;
              return [...prev, confirmedMsg];
            });
          } else if (payload.type === "typing" || payload.type === "team_typing") {
            if (payload.sender_id !== user?.id) {
              setPartnerTyping(true);
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => {
                setPartnerTyping(false);
              }, 2500);
            }
          } else if (payload.type === "messages_read") {
            setMessages((prev) =>
              prev.map((m) =>
                m.sender_id === user?.id ? { ...m, is_read: true } : m
              )
            );
          } else if (payload.type === "user_status") {
            if (activeConversation.target_id === payload.user_id) {
              setActiveConversation((prev) => ({
                ...prev,
                is_online: payload.is_online,
              }));
            }
            setConversations((prev) =>
              prev.map((c) =>
                c.target_id === payload.user_id
                  ? { ...c, is_online: payload.is_online }
                  : c
              )
            );
          }
        } catch (err) {
          console.error("Error handling WebSocket message:", err);
        }
      };

      ws.onclose = (event) => {
        if (!isMounted) return;
        setWsConnected(false);
        setWsConnecting(false);

        // Auto-reconnect after 3 seconds if disconnected unintentionally
        if (!isIntentionalCloseRef.current && event.code !== 1008) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setWsConnecting(false);
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      isIntentionalCloseRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [activeConversation, user?.id]);

  // 5. Send Message (via WebSocket with REST fallback)
  const handleSendMessage = async (text) => {
    if (!text.trim() || !activeConversation) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", message: text }));
    } else {
      // Fallback to REST API
      try {
        let sent;
        if (activeConversation.type === "direct") {
          sent = await chatService.sendDirectMessage(
            activeConversation.target_id,
            text
          );
        } else {
          sent = await chatService.sendTeamMessage(
            activeConversation.target_id,
            text
          );
        }
        setMessages((prev) => [...prev, sent]);
      } catch (err) {
        console.error("Failed to send message via REST fallback:", err);
        alert(err.response?.data?.detail || "Failed to send message.");
      }
    }
  };

  // 6. Send Typing Indicator
  const handleSendTyping = (isTyping) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "typing", is_typing: isTyping }));
    }
  };

  // 7. Start New Chat from Discovery Modal
  const handleStartNewChat = (student) => {
    const existing = conversations.find(
      (c) => c.type === "direct" && c.target_id === student.id
    );
    if (existing) {
      setActiveConversation(existing);
    } else {
      const newConv = {
        id: `dm_${student.id}`,
        type: "direct",
        target_id: student.id,
        name: student.name,
        avatar: student.profile_picture,
        subtext: student.department || "Student",
        last_message: "Started conversation",
        last_message_time: new Date().toISOString(),
        unread_count: 0,
        is_online: student.is_online,
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(newConv);
    }
    setSearchParams({ user: student.id });
  };

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
    if (conv.type === "direct") {
      setSearchParams({ user: conv.target_id });
    } else {
      setSearchParams({ team: conv.target_id });
    }
  };

  const handleBackToList = () => {
    setActiveConversation(null);
    setSearchParams({});
  };

  return (
    <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] max-w-7xl mx-auto -m-3 sm:-m-6 lg:-m-8 bg-white dark:bg-slate-900 flex overflow-hidden border border-slate-200 dark:border-slate-800 sm:rounded-3xl shadow-lg">
      {/* Left Panel: Conversation List (hidden on mobile if activeConversation is open) */}
      <div
        className={`w-full lg:w-auto h-full flex flex-col ${
          activeConversation ? "hidden lg:flex" : "flex"
        }`}
      >
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onSelectConversation={handleSelectConversation}
          totalUnread={totalUnread}
          onStartNewChat={handleStartNewChat}
          availableStudents={availableStudents}
          searchStudentsQuery={searchStudentsQuery}
          onSearchStudentsChange={setSearchStudentsQuery}
          studentSpecialization={studentSpecialization}
          onStudentSpecializationChange={setStudentSpecialization}
          searchingStudents={searchingStudents}
        />
      </div>

      {/* Right Panel: Chat Window (hidden on mobile if no activeConversation) */}
      <div
        className={`flex-1 h-full flex flex-col ${
          !activeConversation ? "hidden lg:flex" : "flex"
        }`}
      >
        <ChatWindow
          activeConversation={activeConversation}
          currentUserId={user?.id}
          messages={messages}
          loadingMessages={loadingMessages}
          wsConnected={wsConnected}
          wsConnecting={wsConnecting}
          onSendMessage={handleSendMessage}
          onSendTyping={handleSendTyping}
          partnerTyping={partnerTyping}
          onBackToList={handleBackToList}
        />
      </div>
    </div>
  );
}

export default Chat;
