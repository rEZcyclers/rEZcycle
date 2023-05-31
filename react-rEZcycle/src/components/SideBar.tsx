import { SideBarItems } from "./SideBarItems";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <div className="SideBar">
      <ul className="SideBarItems">
        {SideBarItems.map((val, key) => {
          return (
            <li
              key={key}
              className="item"
              id={window.location.pathname == val.link ? "active" : ""}
              onClick={() => {}}
            >
              <div id="icon">{val.icon}</div>{" "}
              <div id="name">
                <Link to={val.link}>{val.name}</Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SideBar;
