"use client";

import React from "react";
import {
  Key,
  User,
  Globe,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Terminal,
  Server,
  Database,
} from "lucide-react";

export const ConnectivityView = ({ state }: { state: any }) => {
  const { t } = state;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column: API Credentials & Tunnel Registry */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <div className="size-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Key className="size-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">
                {t.api_creds}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t.auth_title}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="form-control w-full">
              <label className="label py-1.5">
                <span className="label-text text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  {t.acc_email}
                </span>
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={state.authEmail}
                  onChange={(e) => state.setAuthEmail(e.target.value)}
                  className="input bg-slate-50 border-slate-200 w-full pl-12 rounded-xl text-sm font-bold h-12 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label py-1.5">
                <span className="label-text text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  {t.global_key}
                </span>
              </label>
              <div className="relative group">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••"
                  value={state.globalKey}
                  onChange={(e) => state.setGlobalKey(e.target.value)}
                  className="input bg-slate-50 border-slate-200 w-full pl-12 rounded-xl text-sm font-bold h-12 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <button
              onClick={state.handleFetchAccounts}
              disabled={state.loadStates.inv}
              className="w-full rounded-xl font-black uppercase tracking-widest text-[11px] h-12 shadow-lg shadow-indigo-100 bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center"
            >
              {state.loadStates.inv ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-white" />
                  <span>{t.processing || "Syncing..."}</span>
                </div>
              ) : (
                t.establish_session
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Account & Context Registry */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col h-full min-h-125 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-slate-400" />
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-[0.15em]">
                {t.active_contexts}
              </h3>
            </div>
            <span className="badge font-black text-[10px] bg-slate-200 border-none text-slate-600 px-3">
              {state.accounts.length}
            </span>
          </div>

          <div className="p-6 space-y-3 overflow-y-auto max-h-150 custom-scrollbar-light">
            {state.accounts.length === 0 ? (
              <div className="py-20 text-center text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-50 flex flex-col items-center gap-4">
                <Loader2 className="size-10 animate-spin text-slate-200" />
                {t.awaiting_auth}
              </div>
            ) : (
              state.accounts.map((acc: any) => (
                <button
                  key={acc.id}
                  onClick={() => state.handleSelectAccount(acc.id, acc.name)}
                  className={`w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between group transition-all border duration-300 ${
                    state.selectedAccountId === acc.id
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-100 scale-[1.02]"
                      : "bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                        state.selectedAccountId === acc.id
                          ? "bg-white/10"
                          : "bg-slate-100"
                      }`}
                    >
                      <ShieldCheck className="size-5" />
                    </div>
                    <div className="truncate min-w-0">
                      <p className="text-[12px] font-black truncate tracking-tight">
                        {acc.name}
                      </p>
                      <p
                        className={`text-[8px] font-bold uppercase tracking-widest ${
                          state.selectedAccountId === acc.id
                            ? "text-indigo-200"
                            : "text-slate-400"
                        }`}
                      >
                        {acc.id}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`size-4 shrink-0 transition-transform ${
                      state.selectedAccountId === acc.id
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
    </div>
  );
};
