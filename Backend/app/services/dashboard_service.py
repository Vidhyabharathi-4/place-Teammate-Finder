from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.application import Application
from app.models.team_member import TeamMember
from app.models.user import User


class DashboardService:

    @staticmethod
    def get_dashboard_stats(
        current_user: User,
        db: Session
    ):

        teams_created = (
            db.query(Team)
            .filter(
                Team.owner_id == current_user.id
            )
            .count()
        )

        teams_joined = (
            db.query(TeamMember)
            .filter(
                TeamMember.user_id == current_user.id
            )
            .count()
        )

        pending_applications = (
            db.query(Application)
            .filter(
                Application.applicant_id == current_user.id,
                Application.status == "Pending"
            )
            .count()
        )

        accepted_applications = (
            db.query(Application)
            .filter(
                Application.applicant_id == current_user.id,
                Application.status == "Accepted"
            )
            .count()
        )

        return {

            "teams_created": teams_created,

            "teams_joined": teams_joined,

            "pending_applications": pending_applications,

            "accepted_applications": accepted_applications,

            "profile_completion":
                current_user.profile_completion

        }