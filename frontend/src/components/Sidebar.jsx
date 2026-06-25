import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-full bg-[#0b1220] text-white p-5 shadow-2xl">

      <h1 className="text-2xl font-bold mb-8 tracking-wide">
        🛡 Insurance Pro
      </h1>

      <div className="space-y-2">

        {[
          ["Dashboard", "/admindashboard"],
          ["Products", "/addProduct"],
          ["Plans", "/addplan"],
          ["Claims", "/viewallclaim"],
          ["Agents", "/addagent"],
          ["Customers", "/addCustomer"],
        ].map(([name, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition-all duration-300
              hover:translate-x-2 hover:bg-white/10
              ${isActive ? "bg-blue-500/20 border-l-4 border-blue-400" : ""}`
            }
          >
            {name}
          </NavLink>
        ))}

      </div>

    </div>
  );
};

export default Sidebar;