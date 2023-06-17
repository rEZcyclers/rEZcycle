import { SideBarItems } from "./SideBarItems";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const navigateTo = useNavigate();

  return (
    <div className="SideBar">
      <ul className="SideBarList">
        {SideBarItems.map((val, key) => {
          return (
            <li
              key={key}
              className="SideBarItem"
              id={window.location.pathname == val.link ? "active" : ""}
              onClick={() => navigateTo(val.link)}
            >
              <div id="icon">{val.icon}</div>
              <div id="name">{val.name}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SideBar;
