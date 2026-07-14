// import AgentSidebar from "./AgentSidebar";
// import AgentNavbar from "./AgentNavbar";

// const AgentLayout = ({ children }) => {
//     return (
//       <div className="min-h-screen bg-slate-950 flex overflow-visible">

//             {/* Fixed Sidebar */}
//             <div className="fixed left-0 top-0 h-screen w-72 z-50">
//                 <AgentSidebar />
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 ml-72 flex flex-col h-screen">

//                 <AgentNavbar />

//                 <main className="flex-1 overflow-y-auto p-6 relative">

//                     <div className="absolute inset-0 overflow-hidden pointer-events-none">

//                         <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full" />

//                         <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full" />

//                     </div>

//                     <div className="">
//                         {children}
//                     </div>

//                 </main>

//             </div>

//         </div>
//     );
// };

// export default AgentLayout;

import AgentSidebar from "./AgentSidebar";
import AgentNavbar from "./AgentNavbar";

const AgentLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 flex overflow-hidden text-slate-300">

            {/* SIDEBAR WRAPPER: z-50 सुनिश्चित करता है कि यह हमेशा टॉप पर रहे */}
            <div className="hidden md:block fixed left-0 top-0 h-screen w-72 z-50 border-r border-slate-900 bg-slate-950">
                <AgentSidebar />
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="flex-1 md:ml-72 flex flex-col h-screen min-w-0 ">

                {/* NAVBAR */}
                <AgentNavbar />

                {/* VIEWPORT CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 ">

                    {/* AMBIENT BACKGROUND GLOW EFFECTS */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
                    </div>

                    {/* DYNAMIC COMPONENT INJECTION LAYER: z-10 ताकि कंटेंट ग्लो के ऊपर रहे पर साइडबार के नीचे */}
                    <div >
                        {children}
                    </div>

                </main>

            </div>

        </div>
    );
};

export default AgentLayout;