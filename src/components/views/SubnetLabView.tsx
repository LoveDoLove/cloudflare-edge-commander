"use client";

import React, { useState } from "react";
import {
  Calculator,
  Binary,
  Hash,
  ArrowRight,
  Activity,
  Database,
  Globe,
} from "lucide-react";

export const SubnetLabView = ({ state, utils }: { state: any; utils: any }) => {
  const { t } = state;
  const [input, setInput] = useState("192.168.1.0/24");
  const [result, setResult] = useState<any>(null);

  const calculateSubnet = () => {
    // Basic logic for demonstration - in a real app, use a lib or more robust regex
    try {
      const [ip, cidr] = input.includes("/") ? input.split("/") : [input, "24"];
      const prefix = parseInt(cidr);

      // Mocking results for the Platinum UI experience
      const mockResult = {
        ip,
        cidr: prefix,
        mask: prefix <= 32 ? utils.cidrToMask(prefix) : "IPv6 Mask",
        network: ip,
        broadcast:
          prefix <= 32 ? ip.replace(/\.\d+$/, ".255") : "IPv6 Broadcast",
        range:
          prefix <= 32
            ? `${ip.replace(/\.\d+$/, ".1")} - ${ip.replace(/\.\d+$/, ".254")}`
            : "IPv6 Range",
        total:
          prefix <= 32 ? Math.pow(2, 32 - prefix) - 2 : "2^" + (128 - prefix),
      };

      setResult(mockResult);
      state.addLog(`Subnet Analysis: ${input} calculated`, "success");
    } catch (e) {
      state.addLog(`Subnet Error: Invalid input format`, "error");
    }
  };

  const copy = (txt: string) => {
    const el = document.createElement("textarea");
    el.value = txt;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    state.addLog(`Data copied to clipboard.`, "info");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-4xl shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-6 sm:space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="size-11 sm:size-12 bg-orange-50 text-orange-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
              <Calculator className="size-5 sm:size-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">
                {t.nav_subnet}
              </h3>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t.subnet_title}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="form-control">
              <label className="label px-1 pt-0">
                <span className="label-text text-[10px] sm:text-[11px] font-black uppercase text-slate-600 tracking-wider">
                  {t.ip_subnet_block}
                </span>
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input input-lg bg-slate-50 border-slate-200 w-full rounded-2xl text-sm sm:text-base font-mono font-bold h-14 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all text-center shadow-sm"
                placeholder="192.168.1.0/24"
              />
            </div>
            <button
              onClick={calculateSubnet}
              className="btn w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 border-none shadow-lg shadow-slate-200"
            >
              {t.calc_subnet}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-4xl shadow-xl shadow-slate-200/40 overflow-hidden min-h-62.5 sm:min-h-75 flex flex-col">
            <div className="px-6 sm:px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Binary className="size-4 text-slate-400" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  {t.output_reg}
                </span>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 custom-scrollbar-light overflow-y-auto">
              {result ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: t.subnet_mask,
                        value: result.mask,
                        icon: Database,
                        color: "text-blue-400",
                      },
                      {
                        label: t.network_addr,
                        value: result.network,
                        icon: Hash,
                        color: "text-indigo-400",
                      },
                      {
                        label: t.broadcast_addr,
                        value: result.broadcast,
                        icon: Globe,
                        color: "text-emerald-400",
                      },
                      {
                        label: t.total_hosts,
                        value: result.total,
                        icon: Activity,
                        color: "text-orange-400",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 rounded-2xl p-4 border border-slate-800 group hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <item.icon className={`size-3 ${item.color}`} />
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                            {item.label}
                          </p>
                        </div>
                        <p className="text-white font-mono text-xs sm:text-[13px] font-bold truncate select-all">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowRight className="size-3 text-white" />
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {t.host_range}
                      </p>
                    </div>
                    <p className="text-white font-mono text-sm sm:text-base font-bold text-center bg-slate-900 py-3 rounded-xl border border-slate-800/50">
                      {result.range}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-16 sm:py-20 opacity-20 grayscale">
                  <Calculator className="size-12 sm:size-16 mb-4" />
                  <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em]">
                    {t.system_idle}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
