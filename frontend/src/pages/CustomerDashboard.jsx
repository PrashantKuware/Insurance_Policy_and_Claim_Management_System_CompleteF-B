import CustomerLayout from "../components/CustomerLayaout";
import MyPolicies from "../components/MyPolicies";
import Product from "../components/Product";

const CustomerDashboard = () => {
  return (
    <CustomerLayout>
      <div className="relative">


        <div className="relative z-10 space-y-10 text-white">

          <div>
            <h1 className="text-4xl font-bold text-[#243447]">
              Customer Dashboard
            </h1>

            <p className="text-gray-600 mt-2">
              Manage your policies & explore plans
            </p>
          </div>

          <section>
            <MyPolicies />
          </section>

          <section>
            <Product />
          </section>

        </div>

      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;