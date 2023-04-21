import { Outlet, createBrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import Stage from "./views/Stage";
import Player from "./views/Player";
import PlaylistHome from "./views/PlaylistHome";
import Playlist from "./views/Playlist";
import Search from "./views/Search";

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
        element: <Search />,
      },
      {
        path: "collection",
        element: <h2>Collection</h2>,
      },
      {
        path: "playlist",
        element: <><Outlet /></>,
        children: [
          { index: true, element: <PlaylistHome /> },
          { path: ":id", element: <Playlist /> }
        ]
      },
      {
        path: "player/:trackId",
        element: <Player />
      }
    ]
  },
])