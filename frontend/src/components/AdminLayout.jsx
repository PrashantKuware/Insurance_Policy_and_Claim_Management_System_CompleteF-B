import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ">

      {/* SIDEBAR (FIXED) */}
      <div className="w-72 fixed h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 ml-72 flex flex-col">

        <Navbar />

        <main className="p-6 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;