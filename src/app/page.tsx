"use client";

import React from "react";
import {
  LayoutDashboard,
  CloudCog,
  Network,
  Github,
  Terminal,
  BookOpen,
  Layers,
  Info,
  Lock,
  Scale,
  Menu,
  X,
  Calculator,
} from "lucide-react";

import { useCloudflareManager } from "@/hooks/useCloudflareManager";
import { ConnectivityView } from "@/components/views/ConnectivityView";
import { EdgeManagerView } from "@/components/views/EdgeManagerView";
import { NetworkLabView } from "@/components/views/NetworkLabView";
import { SubnetLabView } from "@/components/views/SubnetLabView";
import { DnsDocsView } from "@/components/views/DnsDocsView";
import { AboutView } from "@/components/views/AboutView";
import { PrivacyView } from "@/components/views/PrivacyView";
import { TermsView } from "@/components/views/TermsView";
import {
  DeleteConfirmationModal,
  BulkDeleteModal,
  ConsoleDrawer,
} from "@/components/Overlays";

const utils = {
  ipv6ToArpa: (ipv6: string) => {
    try {
      let [address, prefix] = ipv6.includes("/")
        ? ipv6.split("/")
        : [ipv6, "128"];
      if (address.includes("::")) {
        const parts = address.split("::");
        const leftParts = parts[0].split(":").filter((x) => x !== "");
        const rightParts = parts[1].split(":").filter((x) => x !== "");
        const missingCount = 8 - (leftParts.length + rightParts.length);
        const expanded = [
          ...leftParts,
          ...Array(missingCount).fill("0000"),
          ...rightParts,
        ];
        address = expanded.map((p) => p.padStart(4, "0")).join(":");
      } else {
        address = address
          .split(":")
          .map((p) => p.padStart(4, "0"))
          .join(":");
      }
      const fullHex = address.replace(/:/g, "");
      if (prefix && parseInt(prefix) < 128) {
        const nibbles = Math.floor(parseInt(prefix) / 4);
        return (
          fullHex.substring(0, nibbles).split("").reverse().join(".") +
          ".ip6.arpa"
        );
      }
      return fullHex.split("").reverse().join(".") + ".ip6.arpa";
    } catch (e) {
      return "Invalid IPv6 Format";
    }
  },
  generateRandomIPv6: (currentInput: string) => {
    const hexChars = "0123456789abcdef";
    const genPart = (len: number) =>
      Array.from(
        { length: len },
        () => hexChars[Math.floor(Math.random() * 16)]
      ).join("");
    try {
      const [addressPart, prefixPart] = currentInput.includes("/")
        ? currentInput.split("/")
        : [currentInput, "128"];
      const prefixLength = parseInt(prefixPart) || 128;
      let address = addressPart;
      if (address.includes("::")) {
        const parts = address.split("::");
        const leftParts = parts[0].split(":").filter((x) => x !== "");
        const rightParts = parts[1].split(":").filter((x) => x !== "");
        const missingCount = 8 - (leftParts.length + rightParts.length);
        const expanded = [
          ...leftParts,
          ...Array(missingCount).fill("0000"),
          ...rightParts,
        ];
        address = expanded.map((p) => p.padStart(4, "0")).join(":");
      } else {
        address = address
          .split(":")
          .map((p) => p.padStart(4, "0"))
          .join(":");
      }
      const fullHex = address.replace(/:/g, "");
      const fixedNibbles = Math.floor(prefixLength / 4);
      const resultHex =
        fullHex.substring(0, fixedNibbles) + genPart(32 - fixedNibbles);
      const blocks = [];
      for (let i = 0; i < 32; i += 4)
        blocks.push(resultHex.substring(i, i + 4));
      return blocks.join(":");
    } catch (e) {
      return Array.from({ length: 8 }, () => genPart(4)).join(":");
    }
  },
  cidrToMask: (prefix: number) => {
    const mask = Array(4)
      .fill(0)
      .map((_, i) => {
        const bits = Math.min(Math.max(prefix - i * 8, 0), 8);
        return 256 - Math.pow(2, 8 - bits);
      });
    return mask.join(".");
  },
};

export default function App() {
  const state = useCloudflareManager();
  const { t } = state;

  const NavigationItems = () => (
    <>
      <div className="px-4 py-2">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-2">
          {t.core_services}
        </p>
        <nav className="space-y-1">
          {[
            { id: "auth", label: t.nav_conn, icon: LayoutDashboard },
            { id: "edge", label: t.nav_edge, icon: CloudCog },
            { id: "utils", label: t.nav_lab, icon: Network },
            { id: "subnet", label: t.nav_subnet, icon: Calculator },
            { id: "docs", label: t.nav_docs, icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                state.setActiveTab(tab.id as any);
                state.setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                state.activeTab === tab.id
                  ? "bg-orange-600 text-white shadow-xl shadow-orange-950/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white active:text-white"
              }`}
            >
              <tab.icon className="size-4" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="px-4 py-6 mt-4">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-2">
          {t.legal_compliance}
        </p>
        <nav className="space-y-1">
          {[
            { id: "about", label: t.nav_about, icon: Info },
            { id: "privacy", label: t.nav_privacy, icon: Lock },
            { id: "terms", label: t.nav_terms, icon: Scale },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                state.setActiveTab(tab.id as any);
                state.setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                state.activeTab === tab.id
                  ? "bg-white/10 text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <tab.icon className="size-4" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-slate-50 text-slate-900 relative">
      {/* Mobile Sidebar Overlay */}
      {state.isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => state.setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
        fixed inset-y-0 left-0 w-64 bg-slate-900 flex flex-col shrink-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${state.isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
       shadow-2xl lg:shadow-none`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-950/40 border border-orange-400/20">
              <Layers className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="text-white font-black tracking-widest text-[11px] uppercase leading-none">
                Edge
              </div>
              <div className="text-orange-400 font-black tracking-widest text-[9px] uppercase leading-none mt-1">
                Commander
              </div>
            </div>
          </div>
          <button
            onClick={() => state.setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 p-2"
          >
            <X className="size-5" />
          </button>
        </div>

        <NavigationItems />

        <div className="p-4 mt-auto space-y-4 border-t border-slate-800">
          <div className="flex bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => state.setLang("en")}
              className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                state.lang === "en"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "text-slate-500"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => state.setLang("zh")}
              className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                state.lang === "zh"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "text-slate-500"
              }`}
            >
              中文
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-sm">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => state.setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="size-5" />
            </button>
            <h2 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 truncate">
              {state.activeTab === "auth" && t.auth_title}
              {state.activeTab === "edge" && t.infra_title}
              {state.activeTab === "utils" && t.lab_title}
              {state.activeTab === "subnet" && t.subnet_title}
              {state.activeTab === "docs" && t.docs_title}
              {state.activeTab === "about" && t.about_title}
              {state.activeTab === "privacy" && t.privacy_title}
              {state.activeTab === "terms" && t.terms_title}
            </h2>
          </div>
          <button
            onClick={() => state.setIsConsoleOpen(!state.isConsoleOpen)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-[9px] sm:text-[10px] font-black uppercase transition-all shadow-sm ${
              state.isConsoleOpen
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900 active:bg-slate-50"
            }`}
          >
            <Terminal className="size-3.5" />
            <span className="hidden xs:inline">
              {state.isConsoleOpen ? t.monitor_close : t.monitor_open}
            </span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar-light">
          <div className="max-w-6xl mx-auto transition-all duration-500">
            {state.activeTab === "auth" && <ConnectivityView state={state} />}
            {state.activeTab === "edge" && <EdgeManagerView state={state} />}
            {state.activeTab === "utils" && (
              <NetworkLabView state={state} utils={utils} />
            )}
            {state.activeTab === "subnet" && (
              <SubnetLabView state={state} utils={utils} />
            )}
            {state.activeTab === "docs" && <DnsDocsView lang={state.lang} />}
            {state.activeTab === "about" && <AboutView lang={state.lang} />}
            {state.activeTab === "privacy" && <PrivacyView lang={state.lang} />}
            {state.activeTab === "terms" && <TermsView lang={state.lang} />}
          </div>
        </div>

        {state.recordToDelete && (
          <DeleteConfirmationModal
            state={state}
            record={state.recordToDelete}
            onCancel={() => state.setRecordToDelete(null)}
            onConfirm={state.handleDeleteDnsRecord}
          />
        )}
        {state.showBulkDeleteConfirm && (
          <BulkDeleteModal
            state={state}
            count={state.selectedDnsIds.size}
            onCancel={() => state.setShowBulkDeleteConfirm(false)}
            onConfirm={state.handleBulkDelete}
            loading={state.loadStates.bulk}
          />
        )}
        <ConsoleDrawer
          state={state}
          isOpen={state.isConsoleOpen}
          onClose={() => state.setIsConsoleOpen(false)}
          logs={state.logs}
          logEndRef={state.logEndRef}
        />
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        input::placeholder {
          font-weight: 800;
          color: #94a3b8;
          opacity: 0.4;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        aside nav button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
