import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white/70 backdrop-blur-xl border-b flex items-center justify-between px-6">

      {/* LEFT */}

      {/* CENTER */}
      <h2 className="font-semibold text-slate-700">
        Insurance Admin Panel
      </h2>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          {role}
        </span>

        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 animate-pulse"></div>

      </div>

    </div>
  );
};

export default Navbar;