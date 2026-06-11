import React from "react";
import { Eye } from "lucide-react";
import Pagination from "./Pagination";

const PayslipTable = ({
  activeTab,
  payslips,
  loading,
  currentPage,
  setCurrentPage,
  hasNext,
  hasPrev,
  onViewPayslip,
  getMonthName,
  formatCurrency,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
              {activeTab === "all_payslips" && (
                <th className="px-6 py-4">Employee</th>
              )}
              <th className="px-6 py-4">Period</th>
              {activeTab === "my_payslips" && (
                <th className="px-6 py-4">Basic Salary</th>
              )}
              <th className="px-6 py-4">Net Salary</th>
              <th className="px-6 py-4">Generated On</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payslips.length === 0 ? (
              <tr>
                <td
                  colSpan={activeTab === "all_payslips" ? "5" : "5"}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  {activeTab === "all_payslips"
                    ? "No payslips have been generated."
                    : "No payslips available yet."}
                </td>
              </tr>
            ) : (
              payslips.map((payslip) => (
                <tr
                  key={payslip.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {activeTab === "all_payslips" && (
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 capitalize">
                        {payslip.employee?.firstname ||
                          `Emp #${payslip.employee}`}{" "}
                        {payslip.employee?.lastname || ""}
                      </div>
                      <div className="text-sm text-slate-500">
                        {payslip.employee?.position || "Employee"}
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4 font-medium text-slate-900">
                    {getMonthName(payslip.month)} {payslip.year}
                  </td>

                  {activeTab === "my_payslips" && (
                    <td className="px-6 py-4 text-slate-600">
                      {formatCurrency(payslip.basic_salary)}
                    </td>
                  )}

                  <td className="px-6 py-4 text-emerald-600 font-semibold">
                    {formatCurrency(payslip.net_salary)}
                  </td>

                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(payslip.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewPayslip(payslip)} // <-- Updated
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 inline-flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />{" "}
                      {activeTab === "my_payslips" && "View"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Pagination Component */}
      {payslips.length > 0 && (
        <div className="px-6 pb-6 border-t border-slate-200 bg-slate-50/50">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            hasNext={hasNext}
            hasPrev={hasPrev}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default PayslipTable;
