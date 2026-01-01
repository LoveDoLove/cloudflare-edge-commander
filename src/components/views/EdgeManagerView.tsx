"use client";

import React from "react";
import {
  Globe,
  ChevronRight,
  Loader2,
  Edit3,
  Trash2,
  Check,
  X,
  Award,
  Shield,
  CloudCog,
  Search,
  CheckSquare,
  Square,
  Zap,
  ZapOff,
  Download,
  Upload,
  Activity,
} from "lucide-react";

const DNS_TYPES = [
  "A",
  "AAAA",
  "CAA",
  "CERT",
  "CNAME",
  "DNSKEY",
  "DS",
  "HTTPS",
  "LOC",
  "MX",
  "NAPTR",
  "NS",
  "PTR",
  "SMIMEA",
  "SRV",
  "SSHFP",
  "SVCB",
  "TLSA",
  "TXT",
  "URI",
];

const canBeProxied = (type: string) => ["A", "AAAA", "CNAME"].includes(type);

export const EdgeManagerView = ({ state }: { state: any }) => {
  const { t } = state;

  const filteredDns = state.dnsRecords.filter(
    (r: any) =>
      r.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      r.content.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Zone Registry Sidebar */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/40 flex flex-col overflow-hidden transition-all duration-500 min-w-0">
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase text-slate-700 tracking-[0.15em]">
            {t.zone_registry}
          </h3>
          <span className="badge badge-sm font-black text-[10px] bg-slate-200 border-none text-slate-600 px-3">
            {state.zones.length}
          </span>
        </div>
        <div className="p-4 sm:p-5 space-y-5">
          {state.selectedAccountId && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t.add_domain}
                value={state.newDomainName}
                onChange={(e) => state.setNewDomainName(e.target.value)}
                className="input input-sm bg-white border-slate-200 flex-1 rounded-xl text-[11px] font-bold h-11 focus:ring-4 focus:ring-indigo-50 shadow-sm"
              />
              <button
                onClick={state.handleAddDomain}
                disabled={state.loadStates.addDomain}
                className="btn btn-sm sm:btn-md btn-primary rounded-xl h-11 px-4 border-none shadow-md text-white hover:bg-indigo-700"
              >
                {t.add_btn}
              </button>
            </div>
          )}
          <div className="max-h-60 sm:max-h-120 overflow-y-auto space-y-2 custom-scrollbar-light px-1 pr-2 py-2">
            {!state.selectedAccountId ? (
              <div className="p-12 sm:p-20 text-center text-[10px] text-slate-400 font-black uppercase opacity-50">
                {t.select_account}
              </div>
            ) : (
              state.zones.map((z: any) => (
                <button
                  key={z.id}
                  onClick={() => state.handleSelectZone(z.id, z.name)}
                  className={`w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between group transition-all border duration-300 min-w-0 ${
                    state.zoneId === z.id
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-100 ring-2 ring-indigo-600 ring-offset-2"
                      : "bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <span className="text-[12px] font-black truncate flex-1 pr-4 min-w-0">
                    {z.name}
                  </span>
                  <ChevronRight
                    className={`size-4 shrink-0 transition-transform ${
                      state.zoneId === z.id
                        ? "translate-x-0"
                        : "-translate-x-1 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* DNS Management Area */}
      <div className="lg:col-span-8 space-y-6 min-w-0">
        {state.zoneId ? (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-5 sm:p-8 space-y-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 pb-4 min-w-0 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-10 sm:size-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                    <Globe className="size-6 sm:size-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase truncate">
                      {t.dns_registry}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                      {t.active_zone}: {state.selectedZoneName}
                    </p>
                  </div>
                </div>

                {/* Quick-Sec Nuclear Button */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {t.quick_sec}
                    </span>
                    <button
                      onClick={state.handleNuclearBtn}
                      disabled={state.loadStates.bulk}
                      className="btn btn-xs bg-rose-600 hover:bg-rose-700 text-white border-none rounded-xl font-black uppercase h-10 px-4 shadow-lg shadow-rose-200 animate-pulse hover:animate-none group transition-all"
                    >
                      <Shield className="size-3.5 mr-2 group-hover:rotate-12 transition-transform" />
                      {t.nuclear_btn}
                    </button>
                  </div>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tight">
                    {t.nuclear_desc}
                  </p>
                </div>

                <div className="flex flex-1 items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t.search_placeholder}
                      value={state.searchTerm}
                      onChange={(e) => state.setSearchTerm(e.target.value)}
                      className="input input-sm bg-slate-50 border-slate-200 w-full pl-9 rounded-xl text-[10px] font-bold h-10 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all"
                    />
                  </div>
                  {/* Task 1 Buttons */}
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={state.handleExportDns}
                      className="btn btn-sm btn-ghost text-slate-400 hover:text-indigo-600 p-2"
                      title={t.export_dns}
                    >
                      <Download className="size-4" />
                    </button>
                    <label
                      className="btn btn-sm btn-ghost text-slate-400 hover:text-emerald-600 p-2 cursor-pointer"
                      title={t.import_dns}
                    >
                      <Upload className="size-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv,.json"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          state.handleImportDns(e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Add Record Form */}
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                <select
                  value={state.newDns.type}
                  onChange={(e) =>
                    state.setNewDns({ ...state.newDns, type: e.target.value })
                  }
                  className="select select-sm select-bordered bg-white font-black h-11 text-[11px] sm:col-span-1 rounded-xl focus:outline-none shadow-sm"
                >
                  {DNS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Name"
                  value={state.newDns.name}
                  onChange={(e) =>
                    state.setNewDns({ ...state.newDns, name: e.target.value })
                  }
                  className="input input-sm bg-white border-slate-200 h-11 text-[11px] font-black sm:col-span-1 rounded-xl focus:ring-4 focus:ring-indigo-100 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Content"
                  value={state.newDns.content}
                  onChange={(e) =>
                    state.setNewDns({
                      ...state.newDns,
                      content: e.target.value,
                    })
                  }
                  className="input input-sm bg-white border-slate-200 h-11 text-[11px] font-black sm:col-span-2 rounded-xl focus:ring-4 focus:ring-indigo-100 shadow-sm"
                />
                <div className="flex items-center justify-center py-2 sm:py-0 sm:col-span-1">
                  {canBeProxied(state.newDns.type) && (
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={state.newDns.proxied}
                        onChange={(e) =>
                          state.setNewDns({
                            ...state.newDns,
                            proxied: e.target.checked,
                          })
                        }
                        className="checkbox checkbox-sm checkbox-primary rounded-lg border-2"
                      />
                      <span className="text-[10px] font-black text-slate-600 uppercase group-hover:text-indigo-600">
                        {t.proxy}
                      </span>
                    </label>
                  )}
                </div>
                <button
                  onClick={state.handleAddDnsRecord}
                  disabled={state.loadStates.dns}
                  className="btn btn-md btn-primary h-11 font-black uppercase rounded-xl border-none shadow-lg text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50"
                >
                  {t.create}
                </button>
              </div>

              {/* Bulk Toolbar */}
              {state.selectedDnsIds.size > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-indigo-600 p-3 gap-3 rounded-2xl shadow-lg animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3 sm:ml-2">
                    <CheckSquare className="size-4 text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      {t.selected_count.replace(
                        "{n}",
                        state.selectedDnsIds.size.toString()
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => state.handleBulkProxy(true)}
                      className="btn btn-xs bg-white/20 hover:bg-white/30 text-white border-none rounded-lg font-black uppercase h-8 px-3"
                    >
                      <Zap className="size-3 mr-1" /> {t.bulk_proxy}
                    </button>
                    <button
                      onClick={() => state.handleBulkProxy(false)}
                      className="btn btn-xs bg-white/20 hover:bg-white/30 text-white border-none rounded-lg font-black uppercase h-8 px-3"
                    >
                      <ZapOff className="size-3 mr-1" /> {t.bulk_unproxy}
                    </button>
                    <button
                      onClick={() => state.setShowBulkDeleteConfirm(true)}
                      className="btn btn-xs bg-rose-500 hover:bg-rose-600 text-white border-none rounded-lg font-black uppercase h-8 px-3 shadow-md shadow-rose-900/20"
                    >
                      <Trash2 className="size-3 mr-1" /> {t.bulk_delete}
                    </button>
                  </div>
                </div>
              )}

              {/* Record Table */}
              <div className="max-h-120 overflow-x-auto border border-slate-200 rounded-2xl relative min-h-60 shadow-inner bg-white custom-scrollbar-light">
                {state.loadStates.dns && !state.loadStates.bulk ? (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 gap-3">
                    <span className="loading loading-spinner loading-lg text-indigo-600"></span>
                    <p className="text-[10px] font-black uppercase text-indigo-900 tracking-[0.2em] animate-pulse">
                      {t.syncing_dns}
                    </p>
                  </div>
                ) : (
                  <table className="table table-xs w-full min-w-175 border-collapse text-left">
                    <thead className="bg-slate-100 text-slate-900 sticky top-0 z-10 shadow-sm">
                      <tr className="font-black text-[10px] uppercase tracking-widest border-b border-slate-200">
                        <th className="px-5 py-4 w-12 text-center">
                          <button
                            onClick={() =>
                              state.toggleSelectAllDns(filteredDns)
                            }
                            className="flex items-center justify-center hover:text-indigo-600 transition-colors mx-auto"
                          >
                            {state.selectedDnsIds.size === filteredDns.length &&
                            filteredDns.length > 0 ? (
                              <CheckSquare className="size-4" />
                            ) : (
                              <Square className="size-4" />
                            )}
                          </button>
                        </th>
                        <th className="px-5 py-4 w-20">Type</th>
                        <th className="px-5 py-4 w-32">Name</th>
                        <th className="px-5 py-4">Content</th>
                        <th className="px-5 py-4 text-center w-20">
                          {t.proxy}
                        </th>
                        <th className="px-5 py-4 text-right w-44">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDns.map((r: any) => (
                        <tr
                          key={r.id}
                          className={`hover:bg-indigo-50/50 border-b border-slate-100 last:border-0 transition-colors ${
                            state.editingRecordId === r.id
                              ? "bg-amber-50/30"
                              : ""
                          } ${
                            state.selectedDnsIds.has(r.id) ? "bg-indigo-50" : ""
                          }`}
                        >
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => state.toggleSelectDns(r.id)}
                              className={`transition-colors mx-auto flex items-center justify-center ${
                                state.selectedDnsIds.has(r.id)
                                  ? "text-indigo-600"
                                  : "text-slate-300"
                              }`}
                            >
                              {state.selectedDnsIds.has(r.id) ? (
                                <CheckSquare className="size-4" />
                              ) : (
                                <Square className="size-4" />
                              )}
                            </button>
                          </td>
                          {state.editingRecordId === r.id ? (
                            <>
                              <td className="px-2 py-2">
                                <select
                                  value={state.editFormData.type}
                                  onChange={(e) =>
                                    state.setEditFormData({
                                      ...state.editFormData,
                                      type: e.target.value,
                                    })
                                  }
                                  className="select select-xs select-bordered w-full bg-white font-bold h-9 text-[10px] rounded-lg focus:outline-none"
                                >
                                  {DNS_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                      {t}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-2 py-2">
                                <input
                                  type="text"
                                  value={state.editFormData.name}
                                  onChange={(e) =>
                                    state.setEditFormData({
                                      ...state.editFormData,
                                      name: e.target.value,
                                    })
                                  }
                                  className="input input-xs input-bordered w-full bg-white font-bold h-9 text-[10px] rounded-lg"
                                />
                              </td>
                              <td className="px-2 py-2">
                                <input
                                  type="text"
                                  value={state.editFormData.content}
                                  onChange={(e) =>
                                    state.setEditFormData({
                                      ...state.editFormData,
                                      content: e.target.value,
                                    })
                                  }
                                  className="input input-xs input-bordered w-full bg-white font-bold h-9 text-[10px] rounded-lg"
                                />
                              </td>
                              <td className="px-2 py-2 text-center">
                                {canBeProxied(state.editFormData.type) ? (
                                  <button
                                    onClick={() =>
                                      state.setEditFormData({
                                        ...state.editFormData,
                                        proxied: !state.editFormData.proxied,
                                      })
                                    }
                                    className={`size-6 mx-auto rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                                      state.editFormData.proxied
                                        ? "bg-orange-400"
                                        : "bg-slate-200"
                                    }`}
                                  >
                                    <div
                                      className={`size-1.5 rounded-full bg-white transition-transform ${
                                        state.editFormData.proxied
                                          ? "scale-110"
                                          : "scale-75 opacity-40"
                                      }`}
                                    />
                                  </button>
                                ) : (
                                  <span className="text-[8px] font-black text-slate-300 uppercase">
                                    N/A
                                  </span>
                                )}
                              </td>
                              <td className="px-2 py-2 text-right">
                                <div className="flex items-center justify-end gap-1.5 pt-1">
                                  <button
                                    onClick={state.handleSaveEdit}
                                    className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white px-2 border-none"
                                  >
                                    <Check className="size-3.5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      state.setEditingRecordId(null)
                                    }
                                    className="btn btn-xs btn-ghost bg-slate-100 rounded-lg text-slate-600 px-2"
                                  >
                                    <X className="size-3.5" />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-5 py-4 font-black text-indigo-700 text-[11px]">
                                {r.type}
                              </td>
                              <td className="px-5 py-4 font-bold text-slate-900 text-[11px] truncate max-w-40">
                                {r.name}
                              </td>
                              <td className="px-5 py-4 text-[10px] font-mono text-slate-600 break-all">
                                {r.content}
                              </td>
                              <td className="px-5 py-4 text-center">
                                {r.proxied ? (
                                  <div className="size-3 mx-auto rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.4)] border-2 border-white" />
                                ) : (
                                  <div className="size-3 mx-auto rounded-full bg-slate-200 border-2 border-white" />
                                )}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {/* Task 2 Button */}
                                  <button
                                    onClick={() => state.checkPropagation(r)}
                                    className={`btn btn-ghost btn-xs rounded-xl transition-all ${
                                      state.propResults[r.id]?.loading
                                        ? "text-indigo-600"
                                        : "text-slate-300 hover:text-indigo-600"
                                    }`}
                                    title={t.prop_check}
                                  >
                                    {state.propResults[r.id]?.loading ? (
                                      <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                      <Activity className="size-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      state.setEditingRecordId(r.id);
                                      state.setEditFormData({ ...r });
                                    }}
                                    className="btn btn-ghost btn-xs text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl"
                                  >
                                    <Edit3 className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => state.setRecordToDelete(r)}
                                    className="btn btn-ghost btn-xs text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                                {/* Task 2 indicators */}
                                {state.propResults[r.id] &&
                                  !state.propResults[r.id].loading && (
                                    <div className="flex gap-1 justify-end mt-1 mr-2">
                                      {state.propResults[r.id].checks?.map(
                                        (c: any, i: number) => (
                                          <div
                                            key={i}
                                            title={`${c.name}: ${c.value}`}
                                            className={`size-1.5 rounded-full ${
                                              c.status === "success"
                                                ? "bg-emerald-500 shadow-[0_0_5px_#10b981]"
                                                : c.status === "pending"
                                                ? "bg-amber-500"
                                                : "bg-slate-300"
                                            }`}
                                          />
                                        )
                                      )}
                                    </div>
                                  )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      {filteredDns.length === 0 && !state.loadStates.dns && (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest"
                          >
                            {t.registry_empty}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* SSL/CA Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-8">
              <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-slate-900/40 space-y-6 flex flex-col min-h-55 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/5 blur-3xl rounded-full" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="size-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-inner">
                    <Award className="size-5" />
                  </div>
                  <h3 className="font-black text-white text-sm tracking-widest uppercase">
                    {t.ca_deploy}
                  </h3>
                </div>
                {state.loadStates.cert ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                  </div>
                ) : (
                  <>
                    <div className="form-control flex-1">
                      <label className="label py-1.5">
                        <span className="label-text text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          {t.authority}
                        </span>
                      </label>
                      <select
                        value={state.caProvider}
                        onChange={(e) => state.setCaProvider(e.target.value)}
                        className="select select-sm bg-slate-800 text-white border-slate-700 w-full rounded-xl font-bold h-11 focus:ring-2 focus:ring-indigo-500/40 outline-none shadow-inner"
                      >
                        <option value="google">Google Trust</option>
                        <option value="lets_encrypt">Let's Encrypt</option>
                        <option value="ssl_com">SSL.com</option>
                        <option value="digicert">DigiCert</option>
                      </select>
                    </div>
                    <button
                      onClick={state.handleApplyCA}
                      disabled={state.loadStates.ca}
                      className="btn btn-primary btn-md w-full rounded-xl font-black uppercase text-[10px] h-12 text-white hover:bg-indigo-700"
                    >
                      {t.update_ca}
                    </button>
                  </>
                )}
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-slate-900/40 space-y-6 flex flex-col min-h-55 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="size-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-inner">
                    <Shield className="size-5" />
                  </div>
                  <h3 className="font-black text-white text-sm tracking-widest uppercase">
                    {t.enc_layer}
                  </h3>
                </div>
                {state.loadStates.cert ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                  </div>
                ) : (
                  <>
                    <div className="form-control flex-1">
                      <label className="label py-1.5">
                        <span className="label-text text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          {t.sec_level}
                        </span>
                      </label>
                      <select
                        value={state.sslMode}
                        onChange={(e) => state.setSslMode(e.target.value)}
                        className="select select-sm bg-slate-800 text-white border-slate-700 w-full rounded-xl font-bold h-11 focus:ring-2 focus:ring-indigo-500/40 outline-none shadow-inner"
                      >
                        <option value="off">Off (Dev Only)</option>
                        <option value="flexible">Flexible</option>
                        <option value="full">Full</option>
                        <option value="strict">Full (Strict)</option>
                      </select>
                    </div>
                    <button
                      onClick={state.handleApplySSL}
                      disabled={state.loadStates.ssl}
                      className="btn btn-primary btn-md w-full rounded-xl font-black uppercase text-[10px] h-12 text-white hover:bg-indigo-700"
                    >
                      {t.enforce_enc}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full min-h-100 bg-white border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 sm:p-16 text-center opacity-50 shadow-inner">
            <CloudCog className="size-10 sm:size-12 text-slate-300 mb-4 animate-bounce" />
            <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500">
              {t.init_context}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};
