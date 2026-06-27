import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaShieldAlt,
  FaBoxOpen,
  FaFileSignature,
} from "react-icons/fa";

const CustomerSidebar = () => {
  const links = [
    {
      name: "Dashboard",
      path: "/customerdashboard",
      icon: <FaHome />,
    },
    {
      name: "My Policies",
      path: "/customer/policies",
      icon: <FaShieldAlt />,
    },
    {
      name: "Products",
      path: "/customer/products",
      icon: <FaBoxOpen />,
    },
    {
      name: "Claims",
      path: "/customer/claims",
      icon: <FaFileSignature />,
    },
  ];

  return (
    <div className="h-full bg-[#0f172a]/90 backdrop-blur-2xl text-white p-6">

      <h1 className="text-3xl font-bold mb-10">
        🛡 Customer
      </h1>

      <div className="space-y-3">

        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              flex items-center gap-4
              px-5 py-4 rounded-2xl
              transition-all duration-300

              ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                  : "hover:bg-white/10"
              }
            `
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

      </div>
    </div>
  );
};

export default CustomerSidebar;