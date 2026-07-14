import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  UserPlus, 
  ShieldCheck,
  X
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: "Dashboard", path: "/admindashboard", icon: LayoutDashboard },
    { name: "Add Product", path: "/addProduct", icon: Briefcase },
    { name: "Claims Queue", path: "/viewallclaim", icon: FileText },
    { name: "Add Agent", path: "/addagent", icon: UserPlus },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header Block */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck size={18} />
            </div>
            <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Insurance Pro
            </span>
          </div>

          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-805 text-slate-500 dark:text-slate-400 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768 && onClose) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group border cursor-pointer
                  ${isActive 
                    ? "bg-blue-600/10 dark:bg-blue-500/10 border-blue-500/30 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`
                }
              >
                <Icon size={18} className="transition-transform group-hover:scale-105" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/20 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-widest uppercase">
            Admin Panel v1.2
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;