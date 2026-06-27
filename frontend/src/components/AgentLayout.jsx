import AgentSidebar from "./AgentSidebar";
import AgentNavbar from "./AgentNavbar";

const AgentLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 flex overflow-hidden">

            <AgentSidebar />

            <div className="flex-1 flex flex-col">

                <AgentNavbar />

                <main className="flex-1 overflow-y-auto p-6">

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">

                        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full" />

                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full" />

                    </div>

                    <div className="relative z-10">
                        {children}
                    </div>

                </main>

            </div>

        </div>
    );
};

export default AgentLayout;