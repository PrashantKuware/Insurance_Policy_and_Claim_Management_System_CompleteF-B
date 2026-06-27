import Product from "../components/Product";
import GetAllUser from "../components/GetAllUser";
import GetAllCustomer from "../components/GetAllCustomer";

const StatCard = ({ title, value, color }) => (
  <div className={`p-5 rounded-2xl bg-white shadow hover:scale-105 transition border-l-4 ${color}`}>
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-2xl font-bold text-slate-700">{value}</p>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-8 text-gray-500">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome Admin 👋
        </h1>
        <p className="text-gray-500">
          Manage your insurance system efficiently
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <StatCard title="Total Customers" value="120+" color="border-blue-400" />
        <StatCard title="Active Agents" value="25+" color="border-green-400" />
        <StatCard title="Total Products" value="8+" color="border-purple-400" />

      </div>

      {/* SECTIONS */}
      <div className="space-y-8">

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <GetAllCustomer />
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Agents</h2>
          <GetAllUser />
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <Product />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;