from collections import defaultdict
from typing import Optional
from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        # Map user_id -> set of active WebSocket connections (for multiple tabs/devices)
        self.user_connections: dict[int, set[WebSocket]] = defaultdict(set)
        # Map team_id -> set of active WebSocket connections
        self.team_rooms: dict[int, set[WebSocket]] = defaultdict(set)

    async def connect_user(self, user_id: int, websocket: WebSocket):
        self.user_connections[user_id].add(websocket)
        print(f"[WS] User {user_id} connected. Active user connections: {len(self.user_connections[user_id])}")

    def disconnect_user(self, user_id: int, websocket: WebSocket):
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        print(f"[WS] User {user_id} disconnected.")

    async def connect_team(self, team_id: int, websocket: WebSocket):
        self.team_rooms[team_id].add(websocket)
        print(f"[WS] Socked added to Team {team_id} room. Sockets in room: {len(self.team_rooms[team_id])}")

    def disconnect_team(self, team_id: int, websocket: WebSocket):
        if team_id in self.team_rooms:
            self.team_rooms[team_id].discard(websocket)
            if not self.team_rooms[team_id]:
                del self.team_rooms[team_id]
        print(f"[WS] Socket removed from Team {team_id} room.")

    def is_user_online(self, user_id: int) -> bool:
        return bool(self.user_connections.get(user_id))

    async def send_to_user(self, user_id: int, data: dict):
        """
        Send JSON payload to all active connections belonging to user_id.
        """
        sockets = list(self.user_connections.get(user_id, []))
        stale_sockets = []

        for ws in sockets:
            try:
                await ws.send_json(data)
            except Exception as e:
                print(f"[WS] Error sending to user {user_id}: {e}")
                stale_sockets.append(ws)

        for ws in stale_sockets:
            self.disconnect_user(user_id, ws)

    async def broadcast_to_team(
        self,
        team_id: int,
        data: dict,
        exclude_socket: Optional[WebSocket] = None
    ):
        """
        Broadcast JSON payload to all active connections in team_id room.
        """
        sockets = list(self.team_rooms.get(team_id, []))
        stale_sockets = []

        for ws in sockets:
            if ws == exclude_socket:
                continue
            try:
                await ws.send_json(data)
            except Exception as e:
                print(f"[WS] Error broadcasting to team {team_id}: {e}")
                stale_sockets.append(ws)

        for ws in stale_sockets:
            self.disconnect_team(team_id, ws)


manager = ConnectionManager()
