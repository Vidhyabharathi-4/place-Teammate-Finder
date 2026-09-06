from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User

from app.schemas.application import (
    ApplicationCreate,
    ApplicationStatusUpdate
)

from app.services.notification_service import NotificationService


class ApplicationService:

    @staticmethod
    def apply_to_team(
        team_id: int,
        applicant_id: int,
        application_data: ApplicationCreate,
        db: Session
    ):

        team = db.query(Team).filter(
            Team.id == team_id
        ).first()

        if not team:
            raise HTTPException(
                status_code=404,
                detail="Team not found."
            )

        if team.owner_id == applicant_id:
            raise HTTPException(
                status_code=400,
                detail="You cannot apply to your own team."
            )

        existing_application = db.query(Application).filter(
            Application.team_id == team_id,
            Application.applicant_id == applicant_id
        ).first()

        if existing_application:
            raise HTTPException(
                status_code=400,
                detail="You have already applied to this team."
            )

        application = Application(
            team_id=team_id,
            applicant_id=applicant_id,
            message=application_data.message,
            status="Pending"
        )

        db.add(application)
        db.commit()
        db.refresh(application)

        # Notify Team Owner
        try:
            applicant = db.query(User).filter(User.id == applicant_id).first()
            applicant_name = applicant.name if applicant else "A student"
            applicant_dept = f" ({applicant.department})" if applicant and applicant.department else ""

            NotificationService.create_notification(
                user_id=team.owner_id,
                title="New Team Application",
                message=f"{applicant_name}{applicant_dept} applied to join '{team.team_name}'.",
                notification_type="APPLICATION",
                db=db
            )
        except Exception as notify_err:
            print(f"Warning: Failed to create notification: {notify_err}")

        return application

    @staticmethod
    def get_team_applications(
        team_id: int,
        current_user_id: int,
        db: Session
    ):

        team = db.query(Team).filter(
            Team.id == team_id
        ).first()

        if not team:
            raise HTTPException(
                status_code=404,
                detail="Team not found."
            )

        if team.owner_id != current_user_id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to view these applications."
            )

        return db.query(Application).filter(
            Application.team_id == team_id
        ).all()

    @staticmethod
    def get_my_applications(
        applicant_id: int,
        db: Session
    ):

        return db.query(Application).filter(
            Application.applicant_id == applicant_id
        ).all()

    @staticmethod
    def update_application_status(
        application_id: int,
        status_data: ApplicationStatusUpdate,
        current_user_id: int,
        db: Session
    ):

        application = db.query(Application).filter(
            Application.id == application_id
        ).first()

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found."
            )

        team = db.query(Team).filter(
            Team.id == application.team_id
        ).first()

        if not team:
            raise HTTPException(
                status_code=404,
                detail="Team not found."
            )

        if team.owner_id != current_user_id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to perform this action."
            )

        if status_data.status not in ["Accepted", "Rejected"]:
            raise HTTPException(
                status_code=400,
                detail="Status must be either 'Accepted' or 'Rejected'."
            )

        if status_data.status == "Accepted":

            current_members = db.query(TeamMember).filter(
                TeamMember.team_id == application.team_id
            ).count()

            if current_members >= team.max_members:
                raise HTTPException(
                    status_code=400,
                    detail="Team is already full."
                )

            existing_member = db.query(TeamMember).filter(
                TeamMember.team_id == application.team_id,
                TeamMember.user_id == application.applicant_id
            ).first()

            if not existing_member:

                member = TeamMember(
                    team_id=application.team_id,
                    user_id=application.applicant_id,
                    role="Member"
                )

                db.add(member)

        application.status = status_data.status

        db.commit()
        db.refresh(application)

        # Notify Applicant
        if application.status == "Accepted":

            NotificationService.create_notification(
                user_id=application.applicant_id,
                title="Application Accepted",
                message=f"Congratulations! Your application to '{team.team_name}' has been accepted.",
                notification_type="ACCEPTED",
                db=db
            )

        else:

            NotificationService.create_notification(
                user_id=application.applicant_id,
                title="Application Rejected",
                message=f"Your application to '{team.team_name}' has been rejected.",
                notification_type="REJECTED",
                db=db
            )

        return application