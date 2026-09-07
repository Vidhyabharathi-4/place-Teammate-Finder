from typing import Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    WebSocket,
    WebSocketDisconnect,
    status
)
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.db.database import get_db, SessionLocal
from app.models.user import User
from app.core.config import SECRET_KEY, ALGORITHM
from app.dependencies.auth_dependency import get_current_user
from app.schemas.chat import (
    DirectMessageCreate,
    DirectMessageResponse,
    TeamMessageCreate,
    TeamMessageResponse,
    ConversationSummary,
    UnreadCountsResponse,
    ChatUserResponse
)
from app.services.chat_service import ChatService
from app.websocket.chat_manager import manager

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


# Helper function to authenticate WebSocket connections via JWT token query parameter
def get_ws_user(token: Optional[str], db: Session) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            return None
        return db.query(User).filter(User.college_email == email).first()
    except (JWTError, Exception):
        return None


# -------------------------------------------------------------
# REST: Conversations & Discovery
# -------------------------------------------------------------

@router.get("/conversations", response_model=list[ConversationSummary])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ChatService.get_conversations(current_user.id, db)


@router.get("/unread-count", response_model=UnreadCountsResponse)
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ChatService.get_unread_counts(current_user.id, db)


@router.get("/users", response_model=list[ChatUserResponse])
def search_chat_users(
    search: Optional[str] = None,
    specialization: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ChatService.search_users_for_chat(
        current_user.id,
        search=search,
        specialization=specialization,
        db=db
    )


# -------------------------------------------------------------
# REST: Direct Messages
# -------------------------------------------------------------

@router.get("/direct/{user_id}", response_model=list[DirectMessageResponse])
def get_direct_messages(
    user_id: int,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ChatService.get_direct_messages(
        current_user.id,
        user_id,
        limit=limit,
        offset=offset,
        db=db
    )


@router.post("/direct/{user_id}", response_model=DirectMessageResponse, status_code=status.HTTP_201_CREATED)
async def send_direct_message(
    user_id: int,
    data: DirectMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    msg = ChatService.send_direct_message(
        sender_id=current_user.id,
        receiver_id=user_id,
        message_text=data.message,
        db=db
    )

    # Deliver via WebSocket in real-time if recipient is online
    payload = {
        "type": "new_message",
        "data": {
            "id": msg.id,
            "sender_id": current_user.id,
            "receiver_id": user_id,
            "message": msg.message,
            "is_read": False,
            "created_at": msg.created_at.isoformat(),
            "sender_name": current_user.name,
            "sender_profile_picture": current_user.profile_picture
        }
    }
    await manager.send_to_user(user_id, payload)
    return msg


@router.post("/direct/{user_id}/read")
async def mark_direct_read(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = ChatService.mark_direct_as_read(
        current_user_id=current_user.id,
        sender_id=user_id,
        db=db
    )
    # Notify sender that their messages were read
    await manager.send_to_user(user_id, {
        "type": "messages_read",
        "reader_id": current_user.id
    })
    return res


# -------------------------------------------------------------
# REST: Team Group Chat
# -------------------------------------------------------------

@router.get("/team/{team_id}", response_model=list[TeamMessageResponse])
def get_team_messages(
    team_id: int,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ChatService.get_team_messages(
        team_id=team_id,
        current_user_id=current_user.id,
        limit=limit,
        offset=offset,
        db=db
    )


@router.post("/team/{team_id}", response_model=TeamMessageResponse, status_code=status.HTTP_201_CREATED)
async def send_team_message(
    team_id: int,
    data: TeamMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    msg = ChatService.send_team_message(
        team_id=team_id,
        sender_id=current_user.id,
        message_text=data.message,
        db=db
    )

    # Broadcast to all connected team members
    payload = {
        "type": "new_team_message",
        "data": {
            "id": msg.id,
            "team_id": team_id,
            "sender_id": current_user.id,
            "message": msg.message,
            "created_at": msg.created_at.isoformat(),
            "sender_name": current_user.name,
            "sender_profile_picture": current_user.profile_picture,
            "sender_department": current_user.department
        }
    }
    await manager.broadcast_to_team(team_id, payload)
    return msg


# -------------------------------------------------------------
# WebSockets: Real-Time Direct Chat
# -------------------------------------------------------------

@router.websocket("/ws/direct/{target_user_id}")
async def websocket_direct_chat(
    websocket: WebSocket,
    target_user_id: int,
    token: Optional[str] = Query(None)
):
    db = SessionLocal()
    try:
        user = get_ws_user(token, db)
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        if user.id == target_user_id:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        target_user = db.query(User).filter(User.id == target_user_id, User.is_active == True).first()
        if not target_user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        await websocket.accept()
        await manager.connect_user(user.id, websocket)

        # Notify active partner that this user is online
        await manager.send_to_user(target_user_id, {
            "type": "user_status",
            "user_id": user.id,
            "is_online": True
        })

        while True:
            data = await websocket.receive_json()
            event_type = data.get("type", "message")

            if event_type == "message":
                text = data.get("message", "")
                if not text or not str(text).strip():
                    continue

                new_msg = ChatService.send_direct_message(
                    sender_id=user.id,
                    receiver_id=target_user_id,
                    message_text=str(text),
                    db=db
                )

                payload = {
                    "type": "new_message",
                    "data": {
                        "id": new_msg.id,
                        "sender_id": user.id,
                        "receiver_id": target_user_id,
                        "message": new_msg.message,
                        "is_read": False,
                        "created_at": new_msg.created_at.isoformat(),
                        "sender_name": user.name,
                        "sender_profile_picture": user.profile_picture
                    }
                }

                # Deliver to recipient
                await manager.send_to_user(target_user_id, payload)
                # Echo confirmation back to sender
                await websocket.send_json({
                    "type": "message_sent",
                    "data": payload["data"]
                })

            elif event_type == "typing":
                await manager.send_to_user(target_user_id, {
                    "type": "typing",
                    "sender_id": user.id,
                    "is_typing": bool(data.get("is_typing", True))
                })

            elif event_type == "read":
                ChatService.mark_direct_as_read(user.id, target_user_id, db)
                await manager.send_to_user(target_user_id, {
                    "type": "messages_read",
                    "reader_id": user.id
                })

    except WebSocketDisconnect:
        if user:
            manager.disconnect_user(user.id, websocket)
            # Notify partner if user is now offline
            if not manager.is_user_online(user.id):
                await manager.send_to_user(target_user_id, {
                    "type": "user_status",
                    "user_id": user.id,
                    "is_online": False
                })
    except Exception as e:
        print(f"[WS Direct Error] {e}")
        if user:
            manager.disconnect_user(user.id, websocket)
    finally:
        db.close()


# -------------------------------------------------------------
# WebSockets: Real-Time Team Chat
# -------------------------------------------------------------

@router.websocket("/ws/team/{team_id}")
async def websocket_team_chat(
    websocket: WebSocket,
    team_id: int,
    token: Optional[str] = Query(None)
):
    db = SessionLocal()
    try:
        user = get_ws_user(token, db)
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        # STRICT BACKEND AUTHORIZATION: Verify team membership
        try:
            ChatService.verify_team_membership(team_id, user.id, db)
        except HTTPException:
            await websocket.close(
                code=status.WS_1008_POLICY_VIOLATION,
                reason="Forbidden: Not a team member"
            )
            return

        await websocket.accept()
        await manager.connect_team(team_id, websocket)
        await manager.connect_user(user.id, websocket)

        while True:
            data = await websocket.receive_json()
            event_type = data.get("type", "message")

            if event_type == "message":
                text = data.get("message", "")
                if not text or not str(text).strip():
                    continue

                new_msg = ChatService.send_team_message(
                    team_id=team_id,
                    sender_id=user.id,
                    message_text=str(text),
                    db=db
                )

                payload = {
                    "type": "new_team_message",
                    "data": {
                        "id": new_msg.id,
                        "team_id": team_id,
                        "sender_id": user.id,
                        "message": new_msg.message,
                        "created_at": new_msg.created_at.isoformat(),
                        "sender_name": user.name,
                        "sender_profile_picture": user.profile_picture,
                        "sender_department": user.department
                    }
                }

                # Broadcast to all connected team members
                await manager.broadcast_to_team(team_id, payload)

            elif event_type == "typing":
                await manager.broadcast_to_team(
                    team_id,
                    {
                        "type": "team_typing",
                        "sender_id": user.id,
                        "sender_name": user.name,
                        "is_typing": bool(data.get("is_typing", True))
                    },
                    exclude_socket=websocket
                )

    except WebSocketDisconnect:
        if user:
            manager.disconnect_team(team_id, websocket)
            manager.disconnect_user(user.id, websocket)
    except Exception as e:
        print(f"[WS Team Error] {e}")
        if user:
            manager.disconnect_team(team_id, websocket)
            manager.disconnect_user(user.id, websocket)
    finally:
        db.close()
