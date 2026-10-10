import { Outlet } from "react-router-dom";
import "./main.scss";
import BottomBar from "../../components/BottomBar/BottomBar";
import { useContext } from "react";
import { PostsContext } from "../../context/Posts/PostsContext";

const Main = () => {
  const posts = useContext(PostsContext)?.posts ?? [];
  return (
    <div className="page page-main">
      <div className="inner-page">
        <Outlet />
      </div>
      <BottomBar />
    </div>
  );
};
export default Main;
