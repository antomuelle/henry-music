import { createBrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import Stage from "./views/Stage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Stage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "search",
        element: <h2>Search</h2>,
      }
    ]
  },
])