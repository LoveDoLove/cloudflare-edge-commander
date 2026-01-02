"use client";

import React, { useState } from "react";
import {
  Radio,
  Server,
  Network,
  Globe,
  Plus,
  Trash2,
  Save,
  Loader2,
  ChevronRight,
  Database,
  ExternalLink,
} from "lucide-react";

export const TunnelManagementView = ({ state }: { state: any }) => {
  const { t } = state;
  const [newRoute, setNewRoute] = useState("");
  const [newName, setNewName] = useState("");

  const selectedTunnel = state.tunnelDetails;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar: Tunnel List */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
          <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-white/5 text-indigo-400 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                <Radio className="size-7 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight uppercase">
                  {t.tunnel_registry}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {t.active_tunnels}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar pr-2">
            {!state.selectedAccountId ? (
              <div className="py-12 text-center opacity-30 flex flex-col items-center gap-3">
                <Database className="size-10" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t.select_account}
                </span>
              </div>
            ) : state.tunnels.length === 0 && !state.loadStates.tunnels ? (
              <div className="py-12 text-center opacity-30 flex flex-col items-center gap-3">
                <Server className="size-10" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t.tunnel_empty}
                </span>
              </div>
            ) : (
              state.tunnels.map((tunnel: any) => (
                <button
                  key={tunnel.id}
                  onClick={() => {
                    state.handleSelectTunnel(tunnel.id);
                    setNewName(tunnel.name);
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all border group relative overflow-hidden ${
                    state.selectedTunnelId === tunnel.id
                      ? "bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20"
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <span className="text-xs font-black truncate pr-4">
                      {tunnel.name}
                    </span>
                    <span
                      className={`badge badge-xs border-none font-black text-[8px] uppercase px-2 py-2 ${
                        tunnel.status === "healthy"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {tunnel.status === "healthy"
                        ? t.tunnel_connected
                        : t.tunnel_inactive}
                    </span>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-[8px] font-bold uppercase text-slate-400">
                      {tunnel.id.slice(0, 8)}...
                    </div>
                    <ChevronRight
                      className={`size-3 transition-transform ${
                        state.selectedTunnelId === tunnel.id
                          ? "translate-x-1"
                          : "opacity-0"
                      }`}
                    />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Panel: Tunnel Configuration */}
      <div className="lg:col-span-8 space-y-6">
        {!selectedTunnel ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-100">
            <div className="size-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center">
              <Radio className="size-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {state.selectedTunnelId ? t.processing : t.tunnel_config}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {state.selectedTunnelId
                  ? "Fetching details from Cloudflare..."
                  : "Select a tunnel to enter configuration node"}
              </p>
            </div>
            {state.loadStates.tunnels && (
              <Loader2 className="size-6 animate-spin text-indigo-500" />
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Tunnel Identity Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="size-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100">
                    <Database className="size-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">
                      {selectedTunnel.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      {selectedTunnel.id}
                    </p>
                  </div>
                </div>
                <div
                  className={`badge font-black text-[10px] uppercase py-3 px-4 rounded-xl border-none ${
                    selectedTunnel.status === "healthy"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {selectedTunnel.status === "healthy"
                    ? t.tunnel_connected
                    : t.tunnel_inactive}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label py-1.5">
                    <span className="label-text text-slate-500 text-[10px] font-black uppercase tracking-widest font-sans">
                      {t.tunnel_name}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="input bg-slate-50 border-slate-200 w-full rounded-xl text-sm font-bold h-12 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm"
                    />
                    <button
                      onClick={() =>
                        state.handleUpdateTunnelName(selectedTunnel.id, newName)
                      }
                      disabled={
                        state.loadStates.tunnels ||
                        newName === selectedTunnel.name
                      }
                      className="btn btn-square bg-indigo-600 hover:bg-indigo-700 border-none text-white shadow-lg shadow-indigo-100 h-12 w-12 rounded-xl"
                    >
                      <Save className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-end">
                  <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Connectors
                      </p>
                      <p className="text-sm font-black text-slate-700">
                        {selectedTunnel.connections?.length || 0} Nodes
                      </p>
                    </div>
                    <Globe className="size-8 text-slate-200" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* CIDR Routes */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 flex flex-col">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-5">
                  <Network className="size-5 text-indigo-500" />
                  <h3 className="text-xs font-black uppercase text-slate-700 tracking-widest">
                    {t.cidr_routes}
                  </h3>
                </div>

                <div className="space-y-2 flex-1 max-h-60 overflow-y-auto custom-scrollbar-light pr-1 mb-4">
                  {state.tunnelRoutes.length === 0 ? (
                    <div className="py-8 text-center text-[10px] font-black uppercase text-slate-300 tracking-widest">
                      {t.tunnel_routes_empty}
                    </div>
                  ) : (
                    state.tunnelRoutes.map((route: any) => (
                      <div
                        key={route.id}
                        className="group flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 transition-colors border border-slate-100 rounded-xl"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700">
                            {route.network}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">
                            {route.comment || "No Description"}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            state.handleDeleteTunnelRoute(route.id)
                          }
                          className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-600 transition-all hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="10.0.0.0/24"
                    value={newRoute}
                    onChange={(e) => setNewRoute(e.target.value)}
                    className="input bg-slate-50 border-slate-200 flex-1 rounded-xl text-xs font-bold h-10 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm"
                  />
                  <button
                    onClick={() => {
                      state.handleAddTunnelRoute(newRoute);
                      setNewRoute("");
                    }}
                    disabled={!newRoute || state.loadStates.tunnels}
                    className="btn btn-sm h-10 px-4 bg-slate-900 hover:bg-indigo-600 border-none text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200/50"
                  >
                    <Plus className="size-4 mr-1" /> {t.add_btn}
                  </button>
                </div>
              </div>

              {/* Public Hostnames */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 flex flex-col">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-5">
                  <Globe className="size-5 text-indigo-500" />
                  <h3 className="text-xs font-black uppercase text-slate-700 tracking-widest">
                    {t.hostname_routes}
                  </h3>
                </div>

                <div className="space-y-2 flex-1 max-h-60 overflow-y-auto custom-scrollbar-light pr-1 mb-4">
                  {!state.tunnelConfig?.config?.ingress ? (
                    <div className="py-8 text-center text-[10px] font-black uppercase text-slate-300 tracking-widest">
                      {t.tunnel_hostnames_empty}
                    </div>
                  ) : (
                    state.tunnelConfig.config.ingress
                      .filter((rule: any) => rule.hostname)
                      .map((rule: any, idx: number) => (
                        <div
                          key={idx}
                          className="group flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 transition-colors border border-slate-100 rounded-xl"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-slate-700 truncate">
                              {rule.hostname}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-bold text-slate-400 uppercase">
                                {rule.service}
                              </span>
                              <ChevronRight className="size-2 text-slate-300" />
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <a
                              href={`https://${rule.hostname}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-white rounded-lg"
                            >
                              <ExternalLink className="size-3" />
                            </a>
                            <button
                              onClick={() => {
                                const newIngress =
                                  state.tunnelConfig.config.ingress.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                state.handleUpdateTunnelConfig({
                                  ...state.tunnelConfig.config,
                                  ingress: newIngress,
                                });
                              }}
                              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-white rounded-lg"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                <button
                  className="w-full btn btn-sm h-10 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  onClick={() =>
                    window.open(
                      `https://one.dash.cloudflare.com/${state.selectedAccountId}/access/tunnels/${selectedTunnel.id}/edit`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="size-4 mr-2" />
                  Edit on Zero Trust Dash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
