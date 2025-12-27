"use client";

import { useState, useEffect, useRef } from "react";
import { translations, Language } from "@/i18n/translations";

export function useCloudflareManager() {
  const [lang, setLangState] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<
    "auth" | "edge" | "utils" | "docs" | "about" | "privacy" | "terms"
  >("auth");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(280);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [authEmail, setAuthEmail] = useState("");
  const [globalKey, setGlobalKey] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [ipv6Input, setIpv6Input] = useState("2001:db8::/32");
  const [labResults, setLabResults] = useState<{ ip: string; arpa: string }[]>(
    []
  );

  const [loadStates, setLoadStates] = useState({
    inv: false,
    zone: false,
    cert: false,
    addDomain: false,
    dns: false,
    ca: false,
    ssl: false,
    bulk: false,
  });

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [logs, setLogs] = useState<
    { msg: string; type: string; time: string }[]
  >([]);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [dnsRecords, setDnsRecords] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [selectedAccountName, setSelectedAccountName] = useState<string | null>(
    null
  );
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);

  const [caProvider, setCaProvider] = useState<string>("google");
  const [sslMode, setSslMode] = useState<string>("strict");
  const [newDomainName, setNewDomainName] = useState("");
  const [newDns, setNewDns] = useState({
    type: "A",
    name: "",
    content: "",
    ttl: 1,
    proxied: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDnsIds, setSelectedDnsIds] = useState<Set<string>>(new Set());
  const [recordToDelete, setRecordToDelete] = useState<any | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any | null>(null);

  const [propResults, setPropResults] = useState<Record<string, any>>({});

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("commander_pref_lang");
    if (savedLang === "en" || savedLang === "zh")
      setLangState(savedLang as Language);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("commander_pref_lang", newLang);
  };

  const t = translations[lang];

  useEffect(() => {
    if (isConsoleOpen)
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, isConsoleOpen]);

  const addLog = (msg: string, type = "info") => {
    setLogs((prev) => [
      ...prev,
      { msg, type, time: new Date().toLocaleTimeString() },
    ]);
  };

  const fetchCF = async (
    endpoint: string,
    method = "GET",
    body?: any
  ): Promise<any> => {
    const response = await fetch("/api/cloudflare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint,
        email: authEmail,
        key: globalKey,
        method,
        body,
      }),
    });
    const data = (await response.json()) as any;
    if (!data.success)
      throw new Error(data.errors?.[0]?.message || "API Request Failed");
    return data.result;
  };

  const sanitizeContent = (content: string, type: string) => {
    if (type === "TXT") {
      return content.replace(/^"|"$/g, "").replace(/\\"/g, '"');
    }
    return content;
  };

  const handleFetchAccounts = async () => {
    if (!authEmail || !globalKey) return;
    setLoadStates((s) => ({ ...s, inv: true }));
    try {
      const data = await fetchCF("accounts");
      setAccounts(data);
      addLog(t.success_acc.replace("{n}", data.length.toString()), "success");
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, inv: false }));
    }
  };

  const handleSelectAccount = async (accId: string, accName: string) => {
    setSelectedAccountId(accId);
    setSelectedAccountName(accName);
    setZones([]);
    setLoadStates((s) => ({ ...s, zone: true }));
    try {
      const data = await fetchCF(`zones?account.id=${accId}`);
      setZones(data);
      addLog(t.found_zones.replace("{n}", data.length.toString()), "success");
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, zone: false }));
    }
  };

  const handleSelectZone = async (id: string, name: string) => {
    setZoneId(id);
    setSelectedZoneName(name);
    setDnsRecords([]);
    setLoadStates((s) => ({ ...s, cert: true, dns: true }));
    try {
      try {
        const universal = await fetchCF(`zones/${id}/ssl/universal/settings`);
        if (universal?.certificate_authority)
          setCaProvider(universal.certificate_authority);
        const ssl = await fetchCF(`zones/${id}/settings/ssl`);
        if (ssl?.value) setSslMode(ssl.value);
      } catch (e) {}
      const records = await fetchCF(`zones/${id}/dns_records`);
      setDnsRecords(records || []);
      addLog(t.sync_done, "success");
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, cert: false, dns: false }));
    }
  };

  const handleAddDnsRecord = async () => {
    if (!zoneId || !newDns.name || !newDns.content) return;
    setLoadStates((s) => ({ ...s, dns: true }));
    try {
      const sanitized = {
        ...newDns,
        content: sanitizeContent(newDns.content, newDns.type),
      };
      await fetchCF(`zones/${zoneId}/dns_records`, "POST", sanitized);
      addLog(`Created: ${newDns.name}`, "success");
      setNewDns({ type: "A", name: "", content: "", ttl: 1, proxied: false });
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, dns: false }));
    }
  };

  const handleSaveEdit = async () => {
    if (!zoneId || !editingRecordId || !editFormData) return;
    setLoadStates((s) => ({ ...s, dns: true }));
    try {
      const sanitized = {
        ...editFormData,
        content: sanitizeContent(editFormData.content, editFormData.type),
      };
      await fetchCF(
        `zones/${zoneId}/dns_records/${editingRecordId}`,
        "PATCH",
        sanitized
      );
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
      setEditingRecordId(null);
      addLog(t.update_done, "success");
    } catch (err: any) {
      addLog(`Update Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, dns: false }));
    }
  };

  const handleApplyCA = async () => {
    if (!zoneId) return;
    setLoadStates((s) => ({ ...s, ca: true }));
    try {
      await fetchCF(`zones/${zoneId}/ssl/universal/settings`, "PATCH", {
        certificate_authority: caProvider,
      });
      addLog(t.update_done, "success");
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, ca: false }));
    }
  };

  const handleApplySSL = async () => {
    if (!zoneId) return;
    setLoadStates((s) => ({ ...s, ssl: true }));
    try {
      await fetchCF(`zones/${zoneId}/settings/ssl`, "PATCH", {
        value: sslMode,
      });
      addLog(t.update_done, "success");
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, ssl: false }));
    }
  };

  const handleAddDomain = async () => {
    if (!selectedAccountId || !newDomainName) return;
    setLoadStates((s) => ({ ...s, addDomain: true }));
    try {
      await fetchCF("zones", "POST", {
        name: newDomainName,
        account: { id: selectedAccountId },
      });
      addLog(`Success: ${newDomainName} registered.`, "success");
      setNewDomainName("");
      handleSelectAccount(selectedAccountId, selectedAccountName || "");
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, addDomain: false }));
    }
  };

  const handleExportDns = () => {
    const blob = new Blob([JSON.stringify(dnsRecords, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dns-${selectedZoneName}.json`;
    a.click();
    addLog(`Exported ${dnsRecords.length} records.`, "success");
  };

  const handleImportDns = async (file: File) => {
    if (!zoneId) return;
    setLoadStates((s) => ({ ...s, dns: true }));
    try {
      const text = await file.text();
      let imported = [];
      if (file.name.endsWith(".json")) {
        imported = JSON.parse(text);
      } else {
        const rows = text.split("\n").slice(1);
        imported = rows
          .filter((r) => r.trim())
          .map((row) => {
            const cols =
              row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(",");
            return {
              type: cols[0]?.replace(/"/g, "").trim(),
              name: cols[1]?.replace(/"/g, "").trim(),
              content: cols[2]?.replace(/"/g, "").trim(),
              proxied: cols[3]?.toLowerCase().includes("true"),
              ttl: parseInt(cols[4]) || 1,
            };
          });
      }
      let s = 0,
        f = 0;
      for (const r of imported) {
        try {
          const sanitized = {
            ...r,
            content: sanitizeContent(r.content, r.type),
          };
          await fetchCF(`zones/${zoneId}/dns_records`, "POST", sanitized);
          s++;
        } catch {
          f++;
        }
      }
      addLog(
        t.import_success
          .replace("{s}", s.toString())
          .replace("{f}", f.toString()),
        "success"
      );
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
    } catch (err) {
      addLog(t.import_error, "error");
    } finally {
      setLoadStates((s) => ({ ...s, dns: false }));
    }
  };

  const checkPropagation = async (record: any) => {
    setPropResults((prev) => ({ ...prev, [record.id]: { loading: true } }));
    const resolvers = [
      {
        name: "Google",
        url: `https://dns.google/resolve?name=${record.name}&type=${record.type}`,
      },
      {
        name: "Cloudflare",
        url: `https://cloudflare-dns.com/dns-query?name=${record.name}&type=${record.type}`,
        headers: { Accept: "application/dns-json" },
      },
      {
        name: "Quad9",
        url: `https://dns.quad9.net:5053/dns-query?name=${record.name}&type=${record.type}`,
        headers: { Accept: "application/dns-json" },
      },
    ];
    try {
      const checks = await Promise.all(
        resolvers.map(async (res) => {
          try {
            const r = await fetch(res.url, { headers: res.headers });
            const json: any = await r.json();
            const answer = json.Answer?.[0]?.data || "NXDOMAIN";
            const match =
              answer.toLowerCase().includes(record.content.toLowerCase()) ||
              record.content
                .toLowerCase()
                .includes(answer.toLowerCase().replace(/\.$/, ""));
            return {
              name: res.name,
              status: match ? "success" : "pending",
              value: answer,
            };
          } catch {
            return { name: res.name, status: "error", value: "Timeout" };
          }
        })
      );
      setPropResults((prev) => ({
        ...prev,
        [record.id]: { loading: false, checks },
      }));
    } catch {
      setPropResults((prev) => ({
        ...prev,
        [record.id]: { loading: false, error: true },
      }));
    }
  };

  return {
    lang,
    setLang,
    t,
    activeTab,
    setActiveTab,
    isConsoleOpen,
    setIsConsoleOpen,
    consoleHeight,
    setConsoleHeight,
    isSidebarOpen,
    setIsSidebarOpen,
    authEmail,
    setAuthEmail,
    globalKey,
    setGlobalKey,
    handleFetchAccounts,
    accounts,
    selectedAccountId,
    handleSelectAccount,
    zones,
    zoneId,
    selectedZoneName,
    handleSelectZone,
    dnsRecords,
    newDns,
    setNewDns,
    handleAddDnsRecord,
    recordToDelete,
    setRecordToDelete,
    handleDeleteDnsRecord: async () => {
      if (!zoneId || !recordToDelete) return;
      setLoadStates((s) => ({ ...s, dns: true }));
      try {
        await fetchCF(
          `zones/${zoneId}/dns_records/${recordToDelete.id}`,
          "DELETE"
        );
        setDnsRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
        addLog(t.update_done, "success");
      } catch (e: any) {
        addLog(e.message, "error");
      } finally {
        setLoadStates((s) => ({ ...s, dns: false }));
        setRecordToDelete(null);
      }
    },
    editingRecordId,
    setEditingRecordId,
    editFormData,
    setEditFormData,
    handleSaveEdit,
    caProvider,
    setCaProvider,
    handleApplyCA,
    sslMode,
    setSslMode,
    handleApplySSL,
    ipv6Input,
    setIpv6Input,
    labResults,
    setLabResults,
    loadStates,
    status,
    logs,
    setNewDomainName,
    newDomainName,
    addLog,
    logEndRef,
    handleAddDomain,
    searchTerm,
    setSearchTerm,
    selectedDnsIds,
    toggleSelectDns: (id: string) =>
      setSelectedDnsIds((prev) => {
        const n = new Set(prev);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
      }),
    toggleSelectAllDns: (recs: any[]) =>
      setSelectedDnsIds((prev) =>
        prev.size === recs.length ? new Set() : new Set(recs.map((r) => r.id))
      ),
    handleBulkDelete: async () => {
      setLoadStates((s) => ({ ...s, bulk: true }));
      for (const id of Array.from(selectedDnsIds)) {
        try {
          await fetchCF(`zones/${zoneId}/dns_records/${id}`, "DELETE");
        } catch {}
      }
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
      setSelectedDnsIds(new Set());
      setShowBulkDeleteConfirm(false);
      setLoadStates((s) => ({ ...s, bulk: false }));
    },
    handleBulkProxy: async (p: boolean) => {
      setLoadStates((s) => ({ ...s, bulk: true }));
      for (const id of Array.from(selectedDnsIds)) {
        try {
          await fetchCF(`zones/${zoneId}/dns_records/${id}`, "PATCH", {
            proxied: p,
          });
        } catch {}
      }
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
      setSelectedDnsIds(new Set());
      setLoadStates((s) => ({ ...s, bulk: false }));
    },
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    handleExportDns,
    handleImportDns,
    checkPropagation,
    propResults,
  };
}
