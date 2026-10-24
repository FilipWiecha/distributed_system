import { createBrowserRouter } from "react-router-dom";

import { Layout } from "../components/layout/Layout";

import { ProtectedRoute } from "./ProtectedRoute";

import { ExerciseAddPage } from "../pages/exercise/ExerciseAddPage";
import { ExerciseDetailsPage } from "../pages/exercise/ExerciseDetailsPage";
import { WorkoutListPage } from "../pages/workout/WorkoutListPage";
import { TrainingPlanListPage } from "../pages/trainingplan/TrainingPlanListPage";
import { TrainingPlanAddPage } from "../pages/trainingplan/TrainingPlanAddPage";
import { TrainingPlanDetailsPage } from "../pages/trainingplan/TrainingPlanDetailsPage";
import { WorkoutAddPage } from "../pages/workout/WorkoutAddPage";
import { WorkoutDetailsPage } from "../pages/workout/WorkoutDetailsPage";
import { ExerciseListPage } from "../pages/exercise/ExerciseListPage";
import { DashboardPage } from "../pages/main/DashboardPage";

import { AccountRedirect } from "./AccountRedirect";
export const router = createBrowserRouter([
  { path: "/login", element: <AccountRedirect path="/login" /> },
  { path: "/register", element: <AccountRedirect path="/register" /> },
  {
    element: <Layout />,
    children: [
      // Authenticated
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },

          {
            path: "/profile",
            element: <AccountRedirect path="/profile" />,
          },

          {
            path: "/settings",
            element: <AccountRedirect path="/settings" />,
          },

          {
            path: "/exercise",
            element: <ExerciseListPage />,
          },

          {
            path: "/exercise/new",
            element: <ExerciseAddPage />,
          },

          {
            path: "/exercise/:id",
            element: <ExerciseDetailsPage />,
          },

          {
            path: "/workout",
            element: <WorkoutListPage />,
          },

          {
            path: "/workout/new",
            element: <WorkoutAddPage />,
          },

          {
            path: "/workout/:id",
            element: <WorkoutDetailsPage />,
          },

          {
            path: "/trainingplan",
            element: <TrainingPlanListPage />,
          },

          {
            path: "/trainingplan/new",
            element: <TrainingPlanAddPage />,
          },

          {
            path: "/trainingplan/:id",
            element: <TrainingPlanDetailsPage />,
          },
        ],
      },
    ],
  },
]);
