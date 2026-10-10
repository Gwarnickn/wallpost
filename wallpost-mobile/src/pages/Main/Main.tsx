import { Outlet } from "react-router-dom";
import "./main.scss";
import BottomBar from "../../components/BottomBar/BottomBar";

const Main = () => {
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
