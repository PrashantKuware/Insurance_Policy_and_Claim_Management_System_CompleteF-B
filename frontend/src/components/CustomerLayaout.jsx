import CustomerSidebar from "../components/CustomerSidebar";
import CustomerNavbar from "../components/CustomerNavbar";

const CustomerLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef4ff]">

      {/* Background */}
      <div className="absolute inset-0">

        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="orb orb4"></div>

      </div>

      <div className="relative z-10 flex">

        <div className="w-72 fixed h-screen">
          <CustomerSidebar />
        </div>

        <div className="ml-72 flex-1">

          <CustomerNavbar />

          <main className="p-8">
            {children}
          </main>

        </div>

      </div>

      <style>{`
        @keyframes float {
          50% {
            transform: translateY(-30px);
          }
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(30px);
          animation: float 8s ease-in-out infinite;
        }

        .orb1 {
          width: 300px;
          height: 300px;
          background: #93c5fd;
          top: -50px;
          left: 25%;
        }

        .orb2 {
          width: 220px;
          height: 220px;
          background: #c4b5fd;
          top: 20%;
          right: 10%;
        }

        .orb3 {
          width: 250px;
          height: 250px;
          background: #bfdbfe;
          bottom: 10%;
          left: 10%;
        }

        .orb4 {
          width: 180px;
          height: 180px;
          background: #ddd6fe;
          bottom: 5%;
          right: 15%;
        }
      `}</style>

    </div>
  );
};

export default CustomerLayout;