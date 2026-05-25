import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ActivityScreen } from "./screens/ActivityScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { AchievementsScreen } from "./screens/AchievementsScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginScreen,
  },
  {
    path: "/home",
    Component: HomeScreen,
  },
  {
    path: "/activity",
    Component: ActivityScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
  {
    path: "/achievements",
    Component: AchievementsScreen,
  },
]);
