import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Teams from "../pages/Teams";
import TeamDetails from "../pages/TeamDetails";
import CreateTeam from "../pages/CreateTeam";
import MyTeams from "../pages/MyTeams";
import Applications from "../pages/Applications";
import Members from "../pages/Members";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import Chat from "../pages/Chat";
import Settings from "../pages/Settings";
import ChangePassword from "../pages/ChangePassword";
import NotificationSettings from "../pages/NotificationSettings";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Teams */}

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Layout>
                <Teams />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateTeam />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <TeamDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* My Teams */}

        <Route
          path="/my-teams"
          element={
            <ProtectedRoute>
              <Layout>
                <MyTeams />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Applications */}

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Layout>
                <Applications />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:teamId"
          element={
            <ProtectedRoute>
              <Layout>
                <Applications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Members */}

        <Route
          path="/teams/:teamId/members"
          element={
            <ProtectedRoute>
              <Layout>
                <Members />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Real-time Chat */}

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <Chat />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Notifications */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Profile (Self & Other Students) */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Change Password */}

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <Layout>
                <ChangePassword />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Notification Settings */}

        <Route
          path="/notification-settings"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationSettings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* About */}

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <Layout>
                <About />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;