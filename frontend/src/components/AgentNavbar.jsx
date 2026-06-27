import { useState } from "react";
import { Bell, UserCircle2, X } from "lucide-react";
import axios from "axios";
import { getCurrentUser } from "../services/userService";

const AgentNavbar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agentData, setAgentData] = useState(null);

    const getAgentData = async () => {
        try {
            setLoading(true);
            const response = await getCurrentUser()

            setAgentData(response);
            setShowProfile(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header
                className="
                    h-20
                    border-b
                    border-white/10
                    bg-slate-900/70
                    backdrop-blur-xl
                    flex
                    items-center
                    justify-between
                    px-8
                "
            >
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        Agent Dashboard
                    </h2>

                    <p className="text-slate-400 text-sm">
                        Review & Manage Insurance Claims
                    </p>
                </div>

                <div className="flex items-center gap-5">
                    <button
                        className="
                            w-11
                            h-11
                            rounded-full
                            bg-white/10
                            flex
                            items-center
                            justify-center
                            text-white
                        "
                    >
                        <Bell size={18} />
                    </button>

                    <button
                        onClick={getAgentData}
                        className="
                            flex
                            items-center
                            gap-3
                            px-4
                            py-2
                            rounded-xl
                            bg-white/10
                            hover:bg-white/20
                            transition
                        "
                    >
                        <UserCircle2 size={28} />
                        <span className="text-white font-medium">
                            {loading ? "Loading..." : "Agent"}
                        </span>
                    </button>
                </div>
            </header>

            {showProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-3xl
                            border
                            border-white/10
                            bg-slate-900
                            p-8
                            shadow-2xl
                        "
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                Agent Profile
                            </h2>

                            <button
                                onClick={() => setShowProfile(false)}
                                className="text-white"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="flex justify-center mb-6">
                            <UserCircle2
                                size={90}
                                className="text-cyan-400"
                            />
                        </div>

                        <div className="space-y-4 text-white">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Full Name
                                </p>
                                <p className="font-semibold">
                                    {agentData?.fullName}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Email
                                </p>
                                <p className="font-semibold">
                                    {agentData?.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Role
                                </p>
                                <p className="font-semibold">
                                    {agentData?.role}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Status
                                </p>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        agentData?.active
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-red-500/20 text-red-400"
                                    }`}
                                >
                                    {agentData?.active
                                        ? "ACTIVE"
                                        : "INACTIVE"}
                                </span>
                            </div>

                            {agentData?.phoneNumber && (
                                <div>
                                    <p className="text-slate-400 text-sm">
                                        Phone Number
                                    </p>
                                    <p className="font-semibold">
                                        {agentData.phoneNumber}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AgentNavbar;