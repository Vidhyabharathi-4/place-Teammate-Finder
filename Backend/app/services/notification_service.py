from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationService:

    @staticmethod
    def create_notification(
        user_id: int,
        title: str,
        message: str,
        notification_type: str,
        db: Session
    ):

        print("\n========== Notification Started ==========")
        print(f"User ID          : {user_id}")
        print(f"Title            : {title}")
        print(f"Message          : {message}")
        print(f"Type             : {notification_type}")

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type
        )

        print("Notification object created.")

        db.add(notification)
        print("Added to session.")

        db.commit()
        print("Committed successfully.")

        db.refresh(notification)
        print("Notification refreshed.")

        print("========== Notification Completed ==========\n")

        return notification

    @staticmethod
    def get_notifications(
        user_id: int,
        db: Session
    ):

        print(f"Fetching notifications for User {user_id}")

        return (
            db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .all()
        )

    @staticmethod
    def mark_as_read(
        notification_id: int,
        user_id: int,
        db: Session
    ):

        notification = (
            db.query(Notification)
            .filter(
                Notification.id == notification_id,
                Notification.user_id == user_id
            )
            .first()
        )

        if not notification:
            print("Notification not found.")
            return None

        notification.is_read = True

        db.commit()
        db.refresh(notification)

        print(f"Notification {notification_id} marked as read.")

        return notification

    @staticmethod
    def unread_count(
        user_id: int,
        db: Session
    ):

        count = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
            .count()
        )

        print(f"Unread count for User {user_id}: {count}")

        return count