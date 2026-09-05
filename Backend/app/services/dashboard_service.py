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

        total_teams = db.query(Team).count()

        return {
            "total_teams": total_teams,
            "teams_created": teams_created,
            "teams_joined": teams_joined,
            "pending_applications": pending_applications,
            "accepted_applications": accepted_applications,
            "profile_completion": current_user.profile_completion or 20,
        }

    @staticmethod
    def get_upcoming_events(db: Session):
        # 1. Query teams that have event_date configured
        team_events = (
            db.query(Team)
            .filter(Team.event_date != None)
            .order_by(Team.event_date.asc())
            .limit(5)
            .all()
        )

        events = []
        for team in team_events:
            events.append({
                "id": team.id,
                "title": f"{team.team_name} - {team.category or 'Hackathon'}",
                "date": team.event_date.strftime("%d %b"),
                "category": team.category or "Hackathon",
                "description": team.description[:100] if team.description else None,
                "team_id": team.id,
            })

        # 2. If fewer than 3 events from database, supplement with active campus competitions
        fallback_events = [
            {
                "id": 1001,
                "title": "Smart India Hackathon 2026",
                "date": "25 Jul",
                "category": "National Hackathon",
                "description": "Nationwide innovation hackathon for problem statements from ministries.",
                "team_id": None,
            },
            {
                "id": 1002,
                "title": "Rathinam AI & Web3 Workshop",
                "date": "30 Jul",
                "category": "Campus Workshop",
                "description": "Hands-on buildathon and workshop hosted by Rathinam Innovation Centre.",
                "team_id": None,
            },
            {
                "id": 1003,
                "title": "Annual Project Expo 2026",
                "date": "10 Aug",
                "category": "Project Expo",
                "description": "Showcase final year and pre-final year tech prototypes to industry experts.",
                "team_id": None,
            },
        ]

        for fe in fallback_events:
            if len(events) < 4:
                events.append(fe)

        return events