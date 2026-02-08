import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Vocabulary } from "./pages/Vocabulary";
import { Grammar } from "./pages/Grammar";
import { Reading } from "./pages/Reading";
import { Listening } from "./pages/Listening";
import { Speaking } from "./pages/Speaking";
import { Progress as ProgressPage } from "./pages/Progress";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "vocabulary", Component: Vocabulary },
      { path: "grammar", Component: Grammar },
      { path: "reading", Component: Reading },
      { path: "listening", Component: Listening },
      { path: "speaking", Component: Speaking },
      { path: "progress", Component: ProgressPage },
    ],
  },
]);