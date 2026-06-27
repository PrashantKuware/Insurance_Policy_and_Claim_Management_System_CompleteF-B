import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardCheck,
    History,
    LogOut
} from "lucide-react";

const AgentSidebar = () => {
    return (
        <aside
            className="
                w-72
                bg-slate-900/80
                backdrop-blur-xl
                border-r
                border-white/10
                text-white
                hidden
                lg:flex
                flex-col
            "
        >
            <div className="p-6 border-b border-white/10">

                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    Agent Panel
                </h1>

                <p className="text-slate-400 mt-2">
                    Claim Review System
                </p>

            </div>

            <nav className="flex-1 p-4 space-y-3">

                <NavLink
                    to="/agentdashboard"
                    className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        bg-white/5
                        hover:bg-white/10
                        transition
                    "
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/viewallclaim"
                    className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        hover:bg-white/10
                        transition
                    "
                >
                    <ClipboardCheck size={20} />
                    Claims
                </NavLink>

                <NavLink
                    to="/claim-history"
                    className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        hover:bg-white/10
                        transition
                    "
                >
                    <History size={20} />
                    History
                </NavLink>

            </nav>

            <div className="p-4 border-t border-white/10">

                <button
                    className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-3
                        rounded-xl
                        bg-red-500/20
                        text-red-300
                        hover:bg-red-500/30
                        transition
                    "
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default AgentSidebar;