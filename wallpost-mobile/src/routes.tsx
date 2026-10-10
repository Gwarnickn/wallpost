import { createBrowserRouter } from "react-router-dom";
import { BackOverrider } from "./context/BackOverrider/BackOverrider";
import Main from "./pages/Main/Main";
import MapPage from "./pages/Map/Map";

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
            element: <div>feed</div>,
          },
          {
            path: "map",
            element: <MapPage />,
          },
          {
            path: "profile",
            element: <div>profile</div>,
          },
        ],
      },
    ],
  },
]);
