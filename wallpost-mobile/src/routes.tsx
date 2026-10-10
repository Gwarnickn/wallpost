import { createBrowserRouter } from "react-router-dom";
import { BackOverrider } from "./context/BackOverrider/BackOverrider";
import Main from "./pages/Main/Main";
import MapPage from "./pages/Map/Map";
import Feed from "./pages/Main/Feed/Feed";
import Scan from "./pages/Scan/Scan";
import Wall from "./pages/Wall/Wall";

export const appRoutes = createBrowserRouter([
  {
    element: <BackOverrider />,
    children: [
      {
        path: "/",
        element: <Main />,
        children: [
          {
            path: "feed",
            element: <Feed />,
          },
          {
            path: "map",
            element: <MapPage />,
          },
          {
            path: "scan",
            element: <Scan />,
          },
          {
            path: "saved-posts",
            element: <Wall />,
          },
        ],
      },
    ],
  },
]);
