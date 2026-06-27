import { FaBell, FaUserCircle } from "react-icons/fa";

const CustomerNavbar = () => {
  return (
    <div
      className="
      h-20
      flex
      items-center
      justify-between
      px-8
w-[80vw]
      bg-white/40
      backdrop-blur-2xl

      border-b border-white/50
      "
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Welcome Back 👋
        </h2>

        <p className="text-sm text-slate-500">
          Manage your insurance portfolio
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button
          className="
          w-11 h-11
          rounded-full
          bg-white/70
          flex items-center justify-center
          shadow-md
          "
        >
          <FaBell className="text-slate-700" />
        </button>

        <div
          className="
          flex items-center gap-3
          bg-white/70
          px-4 py-2
          rounded-2xl
          shadow-md
          "
        >
          <FaUserCircle
            size={30}
            className="text-blue-600"
          />

          <div>
            <p className="font-semibold text-slate-800">
              Customer
            </p>

            <p className="text-xs text-slate-500">
              Insurance User
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerNavbar;