import React from "react";
import { Users, ShieldCheck, Video, Calendar } from "lucide-react";

const Feature = ({ icon: Icon, children }) => (
  <li className="flex items-start gap-3">
    <Icon className="size-5 mt-0.5 text-emerald-700" />
    <span className="text-gray-700 text-sm leading-relaxed">{children}</span>
  </li>
);

export default function FamilySubscription() {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Family Subscription</h3>
        <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
          Coming Soon
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Price box */}
        <div className="sm:col-span-1">
          <div className="rounded-xl border p-5 text-center">
            <div className="text-2xl font-bold">Rs 1,500</div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        {/* Details */}
        <div className="sm:col-span-2">
          <ul className="space-y-2">
            <Feature icon={Users}>One plan for the whole family (members limit TBD).</Feature>
            <Feature icon={Calendar}>Book appointments easily from your dashboard.</Feature>
            <Feature icon={Video}>Video consults for scheduled appointments.</Feature>
            <Feature icon={ShieldCheck}>Secure access and privacy-focused design.</Feature>
          </ul>

          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Note:</span>{" "}
            Until subscriptions go live,{" "}
            <span className="font-semibold">non-subscribed users pay Rs 1,000</span>{" "}
            per appointment (informational only).
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled
        className="mt-6 w-full sm:w-auto px-5 py-2 rounded-xl bg-gray-200 text-gray-600 cursor-not-allowed"
      >
        Subscribe (Soon)
      </button>
    </div>
  );
}
