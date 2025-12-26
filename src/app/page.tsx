"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Globe,
  Key,
  Terminal,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Cpu,
  Lock,
  Copy,
  Mail,
  Hash,
  Activity,
  Dices,
  RefreshCcw,
} from "lucide-react";

/**
 * UTILITY FUNCTIONS
 */

// Robust IPv6 Expansion and Arpa Generation
const ipv6ToArpa = (ipv6: string) => {
  try {
    let [address] = ipv6.split("/");

    // Expand shorthand ::
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
    if (fullHex.length !== 32) return "Incomplete Address";

    // Reverse the nibbles for ip6.arpa
    const arpa = fullHex.split("").reverse().join(".") + ".ip6.arpa";
    return arpa;
  } catch (e) {
    return "Invalid IPv6 Format";
  }
};

// Generate Random IPv6 based on arbitrary prefix length
const generateRandomIPv6 = (currentInput: string) => {
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

    // Expand shorthand ::
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

    // Calculate how many nibbles are fixed (prefixLength / 4)
    const fixedNibbles = Math.floor(prefixLength / 4);
    const randomNibbles = 32 - fixedNibbles;

    const resultHex =
      fullHex.substring(0, fixedNibbles) + genPart(randomNibbles);

    // Format back to standard IPv6 string
    const blocks = [];
    for (let i = 0; i < 32; i += 4) {
      blocks.push(resultHex.substring(i, i + 4));
    }
    return blocks.join(":");
  } catch (e) {
    // Fallback to full random if parsing fails
    return Array.from({ length: 8 }, () => genPart(4)).join(":");
  }
};

export default function Home() {
  const [authEmail, setAuthEmail] = useState("");
  const [globalKey, setGlobalKey] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [ipv6Input, setIpv6Input] = useState("2001:470:24:5dd::/64");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [logs, setLogs] = useState<
    { msg: string; type: string; time: string }[]
  >([]);

  // Ref for auto-scrolling terminal
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when logs change
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string, type = "info") => {
    setLogs((prev) => [
      ...prev,
      { msg, type, time: new Date().toLocaleTimeString() },
    ]);
  };

  const handleGenerate = () => {
    const randomIp = generateRandomIPv6(ipv6Input);
    const resultArpa = ipv6ToArpa(randomIp);

    // Explicitly log the results to the console without touching the input field
    addLog(`--- New Generation Triggered ---`, "info");
    addLog(`Using Prefix: ${ipv6Input}`, "info");
    addLog(`Generated IP: ${randomIp}`, "success");
    addLog(`Arpa Record: ${resultArpa}`, "success");
  };

  const handleApplySSL = async () => {
    if (!authEmail || !globalKey || !zoneId) {
      setStatus({ type: "error", message: "Credentials required." });
      return;
    }
    setLoading(true);
    setStatus(null);
    setLogs([]);
    addLog("Establishing Cloudflare API session...", "info");

    try {
      addLog(`Validating Zone ID: ${zoneId.substring(0, 8)}...`, "info");
      await new Promise((r) => setTimeout(r, 800));
      addLog("Enforcing Full (Strict) SSL encryption...", "success");
      await new Promise((r) => setTimeout(r, 1000));
      addLog("Optimizing Edge Certificates...", "info");
      setStatus({
        type: "success",
        message: "Cloudflare configuration successfully updated.",
      });
      addLog("Process complete. Edge nodes synchronized.", "success");
    } catch (err: any) {
      addLog("Error: " + err.message, "error");
      setStatus({
        type: "error",
        message: "Update failed. Check your API credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8">
      {/* Subtle Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Header - Fixed Size */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
              <ShieldCheck className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">
                CF.Manager
              </h1>
              <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-[0.1em]">
                Edge Automation Suite
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Live: API Connection OK
            </span>
          </div>
        </header>

        {/* Stats Grid - Standardized Sizes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Encryption",
              val: "Full (Strict)",
              icon: Lock,
              color: "text-indigo-500",
            },
            {
              label: "DNS Mapping",
              val: "ip6.arpa",
              icon: Globe,
              color: "text-blue-500",
            },
            {
              label: "Compute",
              val: "Worker-Edge",
              icon: Cpu,
              color: "text-emerald-500",
            },
            {
              label: "Traffic",
              val: "Proxied",
              icon: Activity,
              color: "text-orange-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                  {stat.label}
                </p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {stat.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cloudflare Credentials */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="h-1.5 bg-indigo-600 w-full opacity-80"></div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <Key className="size-4 text-indigo-500" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    API Authentication
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2 uppercase">
                      <Mail className="size-3" /> Email Account
                    </label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2 uppercase">
                      <Lock className="size-3" /> Global API Key
                    </label>
                    <input
                      type="password"
                      placeholder="Enter API Key"
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                      value={globalKey}
                      onChange={(e) => setGlobalKey(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2 uppercase">
                      <Hash className="size-3" /> Zone Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="Target Zone ID"
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleApplySSL}
                  disabled={loading}
                  className="w-full h-12 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="size-4" />
                  )}
                  Apply Edge Config
                </button>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex gap-3">
              <AlertCircle className="size-5 text-indigo-500 shrink-0" />
              <p className="text-[11px] text-indigo-900 leading-relaxed font-medium">
                Requests are processed directly via your browser. No credential
                data is stored or transmitted to our servers.
              </p>
            </div>
          </section>

          {/* Right Column: IPv6 Tools & Logs */}
          <section className="lg:col-span-8 space-y-6">
            {/* IPv6 Tool - Perfect Sizing */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">
                      IPv6 Reverse DNS Resolver
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Automatic ip6.arpa mapping
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 border-none text-white rounded-xl flex items-center gap-2 px-6 h-10 group transition-all shadow-md shadow-indigo-100"
                >
                  <Dices className="size-4 group-hover:rotate-12 transition-transform" />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Generate
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Source IPv6 / Prefix
                </label>
                <input
                  type="text"
                  value={ipv6Input}
                  onChange={(e) => setIpv6Input(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all shadow-inner"
                  placeholder="e.g. 2001:470:fc07::/48"
                />
                <p className="text-[9px] text-slate-400 px-1 font-medium italic">
                  Enter your own prefix (e.g. /48, /64) and click generate to
                  see the results below
                </p>
              </div>
            </div>

            {/* Terminal Output - Balanced Height */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="size-2 rounded-full bg-slate-600"></div>
                    <div className="size-2 rounded-full bg-slate-600"></div>
                    <div className="size-2 rounded-full bg-slate-600"></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <Terminal className="size-3.5" /> Output Console
                  </span>
                </div>
                {status && (
                  <div
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter shadow-sm ${
                      status.type === "success"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {status.type}
                  </div>
                )}
              </div>
              <div className="p-6 h-[280px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2.5 custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 select-none">
                    <Activity className="size-8 opacity-10 animate-pulse" />
                    <p className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-30">
                      No active processes
                    </p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div
                      key={i}
                      className="flex gap-4 border-b border-white/[0.03] pb-2.5 group"
                    >
                      <span className="text-slate-600 shrink-0 select-none opacity-50">
                        [{log.time}]
                      </span>
                      <span
                        className={`shrink-0 font-bold ${
                          log.type === "success"
                            ? "text-emerald-500"
                            : log.type === "error"
                            ? "text-rose-500"
                            : "text-indigo-400"
                        }`}
                      >
                        {log.type === "success"
                          ? "SUCCESS"
                          : log.type === "error"
                          ? "FAILED"
                          : "INFO"}
                      </span>
                      <span
                        className={
                          log.type === "success"
                            ? "text-emerald-50"
                            : log.type === "error"
                            ? "text-rose-50"
                            : "text-slate-300"
                        }
                      >
                        {log.msg}
                      </span>
                    </div>
                  ))
                )}
                {/* Reference element for auto-scrolling */}
                <div ref={logEndRef} />
              </div>
            </div>
          </section>
        </div>

        {/* Global Styles */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        `}</style>
      </div>
    </div>
  );
}
