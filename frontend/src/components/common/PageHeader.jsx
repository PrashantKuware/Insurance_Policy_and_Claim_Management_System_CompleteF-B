import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const ROUTE_LABELS = {
  admindashboard: "Dashboard",
  allProducts: "Products",
  addProduct: "Add Product",
  allCustomers: "Customers",
  addCustomer: "Add Customer",
  allAgents: "Agents",
  addagent: "Add Agent",
  viewallclaim: "Claims",
  viewallplan: "Policy Plans",
  addplan: "Add Plan",
  agentdashboard: "Dashboard",
  customerdashboard: "Dashboard",
};

const PageHeader = ({ title, subtitle, showBreadcrumbs = true }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Home", path: role === "AGENT" ? "/agentdashboard" : role === "CUSTOMER" ? "/customerdashboard" : "/admindashboard" }];

    segments.forEach((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      const label = ROUTE_LABELS[segment] || segment.replace(/-/g, " ");
      crumbs.push({ label, path });
    });

    return crumbs;
  }, [location.pathname, role]);

  return (
    <div className="flex flex-col gap-1.5 pb-2">
      {showBreadcrumbs && breadcrumbs.length > 1 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
          {breadcrumbs.map((crumb, idx) => (
            <span key={`${crumb.path}-${idx}`} className="flex items-center gap-1.5 min-w-0">
              {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-blue-600 dark:text-blue-400 truncate capitalize">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-blue-600 dark:hover:text-blue-400 truncate capitalize transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="page-title leading-tight">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  );
};

export default PageHeader;
