from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from fastapi import HTTPException, status

from app.models.user import User
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.direct_message import DirectMessage
from app.models.team_message import TeamMessage
from app.services.notification_service import NotificationService
from app.websocket.chat_manager import manager


class ChatService:

    @staticmethod
    def verify_team_membership(
        team_id: int,
        user_id: int,
        db: Session
    ) -> Team:
        """
        Verify that a user is either the owner or an accepted member of the team.
        Raises 404 if team not found, 403 if user is not authorized.
        """
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found."
            )

        if team.owner_id == user_id:
            return team

        is_member = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        ).first()

        if is_member:
            return team

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this team's chat. Only team members can participate."
        )

    @staticmethod
    def get_conversations(
        current_user_id: int,
        db: Session
    ) -> list[dict]:
        """
        Retrieve all direct message conversations and team group chats for the current user.
        Sorted with the most recent messages first.
        """
        conversations = []

        # 1. Fetch Team Chats
        # Teams owned by user
        owned_teams = db.query(Team).filter(Team.owner_id == current_user_id).all()
        # Teams user is a member of
        member_team_ids = [
            tm.team_id for tm in db.query(TeamMember.team_id).filter(
                TeamMember.user_id == current_user_id
            ).all()
        ]
        joined_teams = db.query(Team).filter(Team.id.in_(member_team_ids)).all() if member_team_ids else []

        all_user_teams = {t.id: t for t in (owned_teams + joined_teams)}.values()

        for team in all_user_teams:
            last_msg = (
                db.query(TeamMessage)
                .filter(TeamMessage.team_id == team.id)
                .order_by(desc(TeamMessage.created_at))
                .first()
            )

            role = "Owner" if team.owner_id == current_user_id else "Member"
            member_count = (
                db.query(TeamMember).filter(TeamMember.team_id == team.id).count() + 1
            )

            conversations.append({
                "id": f"team_{team.id}",
                "type": "team",
                "target_id": team.id,
                "name": team.team_name,
                "avatar": team.banner_image,
                "subtext": f"{member_count} members • {team.category or 'Project'}",
                "last_message": last_msg.message if last_msg else "No messages yet",
                "last_message_time": last_msg.created_at if last_msg else team.created_at,
                "unread_count": 0,
                "is_online": False,
                "role": role,
            })

        # 2. Fetch Direct Message conversations
        # Find all distinct partners
        sent_partners = db.query(DirectMessage.receiver_id).filter(
            DirectMessage.sender_id == current_user_id
        ).distinct().all()

        received_partners = db.query(DirectMessage.sender_id).filter(
            DirectMessage.receiver_id == current_user_id
        ).distinct().all()

        partner_ids = set([p[0] for p in sent_partners] + [p[0] for p in received_partners])

        for partner_id in partner_ids:
            partner = db.query(User).filter(User.id == partner_id).first()
            if not partner:
                continue

            last_msg = (
                db.query(DirectMessage)
                .filter(
                    or_(
                        and_(DirectMessage.sender_id == current_user_id, DirectMessage.receiver_id == partner_id),
                        and_(DirectMessage.sender_id == partner_id, DirectMessage.receiver_id == current_user_id)
                    )
                )
                .order_by(desc(DirectMessage.created_at))
                .first()
            )

            unread_count = (
                db.query(DirectMessage)
                .filter(
                    DirectMessage.sender_id == partner_id,
                    DirectMessage.receiver_id == current_user_id,
                    DirectMessage.is_read == False
                )
                .count()
            )

            subtext = partner.department or "Student"
            if partner.specialization:
                subtext += f" • {partner.specialization}"

            conversations.append({
                "id": f"dm_{partner.id}",
                "type": "direct",
                "target_id": partner.id,
                "name": partner.name,
                "avatar": partner.profile_picture,
                "subtext": subtext,
                "last_message": last_msg.message if last_msg else "Started conversation",
                "last_message_time": last_msg.created_at if last_msg else None,
                "unread_count": unread_count,
                "is_online": manager.is_user_online(partner.id),
                "role": None,
            })

        # Sort conversations by last_message_time descending
        def get_sort_key(conv):
            t = conv.get("last_message_time")
            if isinstance(t, datetime):
                return t.timestamp()
            return 0

        conversations.sort(key=get_sort_key, reverse=True)
        return conversations

    @staticmethod
    def get_direct_messages(
        current_user_id: int,
        other_user_id: int,
        limit: int = 50,
        offset: int = 0,
        db: Session = None
    ) -> list[DirectMessage]:
        """
        Fetch paginated direct message history between current_user and other_user.
        """
        other_user = db.query(User).filter(User.id == other_user_id).first()
        if not other_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        messages = (
            db.query(DirectMessage)
            .filter(
                or_(
                    and_(DirectMessage.sender_id == current_user_id, DirectMessage.receiver_id == other_user_id),
                    and_(DirectMessage.sender_id == other_user_id, DirectMessage.receiver_id == current_user_id)
                )
            )
            .order_by(desc(DirectMessage.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

        # Return in chronological order
        return list(reversed(messages))

    @staticmethod
    def send_direct_message(
        sender_id: int,
        receiver_id: int,
        message_text: str,
        db: Session
    ) -> DirectMessage:
        """
        Create and persist a direct message. Sends notification if receiver is not online.
        """
        cleaned_text = message_text.strip()
        if not cleaned_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty."
            )

        if len(cleaned_text) > 2000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message exceeds 2000 characters limit."
            )

        if sender_id == receiver_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot send messages to yourself."
            )

        receiver = db.query(User).filter(User.id == receiver_id, User.is_active == True).first()
        if not receiver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipient user not found or inactive."
            )

        sender = db.query(User).filter(User.id == sender_id).first()

        new_msg = DirectMessage(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=cleaned_text,
            is_read=False
        )

        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)

        # Generate in-app notification if receiver is not currently online
        if not manager.is_user_online(receiver_id):
            try:
                NotificationService.create_notification(
                    user_id=receiver_id,
                    title=f"New Message from {sender.name if sender else 'a student'}",
                    message=cleaned_text[:120] + ("..." if len(cleaned_text) > 120 else ""),
                    notification_type="MESSAGE",
                    db=db
                )
            except Exception as e:
                print(f"[ChatService] Notification error: {e}")

        return new_msg

    @staticmethod
    def mark_direct_as_read(
        current_user_id: int,
        sender_id: int,
        db: Session
    ):
        """
        Mark all unread direct messages received from sender_id as read.
        """
        db.query(DirectMessage).filter(
            DirectMessage.receiver_id == current_user_id,
            DirectMessage.sender_id == sender_id,
            DirectMessage.is_read == False
        ).update({"is_read": True})

        db.commit()
        return {"status": "success"}

    @staticmethod
    def get_team_messages(
        team_id: int,
        current_user_id: int,
        limit: int = 50,
        offset: int = 0,
        db: Session = None
    ) -> list[TeamMessage]:
        """
        Fetch paginated team group chat messages. Verified for team membership.
        """
        ChatService.verify_team_membership(team_id, current_user_id, db)

        messages = (
            db.query(TeamMessage)
            .filter(TeamMessage.team_id == team_id)
            .order_by(desc(TeamMessage.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

        return list(reversed(messages))

    @staticmethod
    def send_team_message(
        team_id: int,
        sender_id: int,
        message_text: str,
        db: Session
    ) -> TeamMessage:
        """
        Create and persist a team group chat message. Verified for team membership.
        """
        ChatService.verify_team_membership(team_id, sender_id, db)

        cleaned_text = message_text.strip()
        if not cleaned_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty."
            )

        if len(cleaned_text) > 2000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message exceeds 2000 characters limit."
            )

        new_msg = TeamMessage(
            team_id=team_id,
            sender_id=sender_id,
            message=cleaned_text
        )

        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)

        return new_msg

    @staticmethod
    def get_unread_counts(
        user_id: int,
        db: Session
    ) -> dict:
        """
        Return the total number of unread direct messages for the user.
        """
        dm_count = (
            db.query(DirectMessage)
            .filter(
                DirectMessage.receiver_id == user_id,
                DirectMessage.is_read == False
            )
            .count()
        )

        return {
            "total_unread": dm_count,
            "dm_unread": dm_count,
            "team_unread": 0
        }

    @staticmethod
    def search_users_for_chat(
        current_user_id: int,
        search: Optional[str] = None,
        specialization: Optional[str] = None,
        db: Session = None
    ) -> list[dict]:
        """
        Discover teammates to message with search and specialization filter.
        """
        query = db.query(User).filter(
            User.id != current_user_id,
            User.is_active == True
        )

        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    User.name.ilike(term),
                    User.college_email.ilike(term),
                    User.skills.ilike(term),
                    User.department.ilike(term)
                )
            )

        if specialization and specialization != "All Specializations":
            query = query.filter(User.specialization == specialization)

        users = query.order_by(User.name.asc()).limit(30).all()

        results = []
        for u in users:
            results.append({
                "id": u.id,
                "name": u.name,
                "college_email": u.college_email,
                "department": u.department,
                "year": u.year,
                "specialization": u.specialization,
                "skills": u.skills,
                "profile_picture": u.profile_picture,
                "is_online": manager.is_user_online(u.id)
            })

        return results
