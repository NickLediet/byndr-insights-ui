import { createBrowserRouter } from "react-router";
import { Root } from "./components/layout/Root";
import { LandingPage } from "./pages/LandingPage";
import { CardDatabase } from "./pages/CardDatabase";
import { CardDetail } from "./pages/CardDetail";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { QueryBuilder } from "./pages/QueryBuilder";
import { MetagamePage } from "./pages/MetagamePage";
import { DesignSystem } from "./pages/DesignSystem";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LandingPage },
      { path: "cards", Component: CardDatabase },
      { path: "cards/:id", Component: CardDetail },
      { path: "analytics", Component: AnalyticsDashboard },
      { path: "query", Component: QueryBuilder },
      { path: "metagame", Component: MetagamePage },
      { path: "design", Component: DesignSystem },
    ],
  },
]);
