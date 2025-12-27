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

  // Mobile Sidebar State
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

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("commander_pref_lang");
    if (savedLang === "en" || savedLang === "zh") {
      setLangState(savedLang as Language);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("commander_pref_lang", newLang);
  };

  const t = translations[lang];

  useEffect(() => {
    if (isConsoleOpen) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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

  const handleFetchAccounts = async () => {
    if (!authEmail || !globalKey) {
      setStatus({ type: "error", message: "Credentials required." });
      return;
    }
    setLoadStates((s) => ({ ...s, inv: true }));
    addLog("Syncing accounts...", "info");
    try {
      const data = (await fetchCF("accounts")) as any[];
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
    addLog(`Loading zones for ${accName}...`, "info");
    try {
      const data = (await fetchCF(`zones?account.id=${accId}`)) as any[];
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
    setEditingRecordId(null);
    setSelectedDnsIds(new Set());
    setLoadStates((s) => ({ ...s, cert: true, dns: true }));
    addLog(`Context: ${name}...`, "info");
    try {
      try {
        const universalSettings = await fetchCF(
          `zones/${id}/ssl/universal/settings`
        );
        if (universalSettings?.certificate_authority)
          setCaProvider(universalSettings.certificate_authority);
        const sslSettings = await fetchCF(`zones/${id}/settings/ssl`);
        if (sslSettings?.value) setSslMode(sslSettings.value);
      } catch (e: any) {}
      try {
        const records = (await fetchCF(`zones/${id}/dns_records`)) as any[];
        setDnsRecords(records || []);
      } catch (e: any) {}
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
    addLog(`Creating ${newDns.type} record...`, "info");
    try {
      await fetchCF(`zones/${zoneId}/dns_records`, "POST", newDns);
      addLog(`Created: ${newDns.name}`, "success");
      setNewDns({ type: "A", name: "", content: "", ttl: 1, proxied: false });
      const records = (await fetchCF(`zones/${zoneId}/dns_records`)) as any[];
      setDnsRecords(records);
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, dns: false }));
    }
  };

  const handleDeleteDnsRecord = async () => {
    if (!zoneId || !recordToDelete) return;
    setLoadStates((s) => ({ ...s, dns: true }));
    addLog(`Deleting ${recordToDelete.name}...`, "info");
    try {
      await fetchCF(
        `zones/${zoneId}/dns_records/${recordToDelete.id}`,
        "DELETE"
      );
      addLog(t.update_done, "success");
      setDnsRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, dns: false }));
      setRecordToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!zoneId || selectedDnsIds.size === 0) return;
    setLoadStates((s) => ({ ...s, bulk: true, dns: true }));
    addLog(
      `Initiating bulk delete for ${selectedDnsIds.size} records...`,
      "info"
    );

    const ids = Array.from(selectedDnsIds);
    let successCount = 0;

    for (const id of ids) {
      try {
        await fetchCF(`zones/${zoneId}/dns_records/${id}`, "DELETE");
        successCount++;
      } catch (e: any) {
        addLog(`Failed to delete ID ${id}: ${e.message}`, "error");
      }
    }

    addLog(
      `Bulk delete completed: ${successCount}/${ids.length} success.`,
      "success"
    );
    const records = (await fetchCF(`zones/${zoneId}/dns_records`)) as any[];
    setDnsRecords(records);
    setSelectedDnsIds(new Set());
    setShowBulkDeleteConfirm(false);
    setLoadStates((s) => ({ ...s, bulk: false, dns: false }));
  };

  const handleBulkProxy = async (enable: boolean) => {
    if (!zoneId || selectedDnsIds.size === 0) return;
    setLoadStates((s) => ({ ...s, bulk: true, dns: true }));
    addLog(
      `Bulk proxy ${enable ? "enable" : "disable"} for ${
        selectedDnsIds.size
      } records...`,
      "info"
    );

    const ids = Array.from(selectedDnsIds);
    let successCount = 0;

    for (const id of ids) {
      const record = dnsRecords.find((r) => r.id === id);
      if (!record || !["A", "AAAA", "CNAME"].includes(record.type)) continue;
      try {
        await fetchCF(`zones/${zoneId}/dns_records/${id}`, "PATCH", {
          proxied: enable,
        });
        successCount++;
      } catch (e: any) {
        addLog(`Proxy failed for ${record.name}: ${e.message}`, "error");
      }
    }

    addLog(`Bulk proxy update completed: ${successCount} updated.`, "success");
    const records = (await fetchCF(`zones/${zoneId}/dns_records`)) as any[];
    setDnsRecords(records);
    setSelectedDnsIds(new Set());
    setLoadStates((s) => ({ ...s, bulk: false, dns: false }));
  };

  const handleSaveEdit = async () => {
    if (!zoneId || !editingRecordId || !editFormData) return;
    setLoadStates((s) => ({ ...s, dns: true }));
    addLog(`Updating record: ${editFormData.name}...`, "info");
    try {
      await fetchCF(`zones/${zoneId}/dns_records/${editingRecordId}`, "PATCH", {
        type: editFormData.type,
        name: editFormData.name,
        content: editFormData.content,
        proxied: editFormData.proxied,
      });
      addLog(t.update_done, "success");
      const records = (await fetchCF(`zones/${zoneId}/dns_records`)) as any[];
      setDnsRecords(records);
      setEditingRecordId(null);
      setEditFormData(null);
    } catch (err: any) {
      addLog(`Update Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, dns: false }));
    }
  };

  const handleApplyCA = async () => {
    if (!zoneId) return;
    setLoadStates((s) => ({ ...s, ca: true }));
    addLog(`Updating CA...`, "info");
    try {
      await fetchCF(`zones/${zoneId}/ssl/universal/settings`, "PATCH", {
        certificate_authority: caProvider,
      });
      addLog(t.update_done, "success");
      setStatus({ type: "success", message: `CA updated.` });
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, ca: false }));
    }
  };

  const handleApplySSL = async () => {
    if (!zoneId) return;
    setLoadStates((s) => ({ ...s, ssl: true }));
    addLog(`Updating Encryption...`, "info");
    try {
      await fetchCF(`zones/${zoneId}/settings/ssl`, "PATCH", {
        value: sslMode,
      });
      addLog(t.update_done, "success");
      setStatus({ type: "success", message: `SSL level updated.` });
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, ssl: false }));
    }
  };

  const handleAddDomain = async () => {
    if (!selectedAccountId || !newDomainName) return;
    setLoadStates((s) => ({ ...s, addDomain: true }));
    addLog(`Adding ${newDomainName}...`, "info");
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

  // Task 1 Logic: Export
  const handleExportDns = () => {
    if (dnsRecords.length === 0) return;
    const data = JSON.stringify(dnsRecords, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dns-export-${selectedZoneName}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    addLog(`Exported ${dnsRecords.length} records.`, "success");
  };

  // Task 1 Logic: Import
  const handleImportDns = async (file: File) => {
    if (!zoneId) return;
    setLoadStates((s) => ({ ...s, dns: true }));
    addLog(`Parsing import file: ${file.name}...`, "info");

    try {
      const text = await file.text();
      let recordsToImport: any[] = [];

      if (file.name.endsWith(".json")) {
        recordsToImport = JSON.parse(text);
      } else if (file.name.endsWith(".csv")) {
        const lines = text.split("\n");
        recordsToImport = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => {
            const values = line.split(",");
            return {
              type: values[0]?.trim(),
              name: values[1]?.trim(),
              content: values[2]?.trim(),
              proxied: values[3]?.trim().toLowerCase() === "true",
              ttl: parseInt(values[4]) || 1,
            };
          });
      }

      let successCount = 0;
      let failCount = 0;

      for (const record of recordsToImport) {
        try {
          await fetchCF(`zones/${zoneId}/dns_records`, "POST", {
            type: record.type,
            name: record.name,
            content: record.content,
            proxied: !!record.proxied,
            ttl: record.ttl || 1,
          });
          successCount++;
        } catch (e) {
          failCount++;
        }
      }

      addLog(
        t.import_success
          .replace("{s}", successCount.toString())
          .replace("{f}", failCount.toString()),
        "success"
      );
      const updated = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(updated);
    } catch (err) {
      addLog(t.import_error, "error");
    } finally {
      setLoadStates((s) => ({ ...s, dns: false }));
    }
  };

  const toggleSelectDns = (id: string) => {
    setSelectedDnsIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllDns = (currentRecords: any[]) => {
    if (
      selectedDnsIds.size === currentRecords.length &&
      currentRecords.length > 0
    ) {
      setSelectedDnsIds(new Set());
    } else {
      setSelectedDnsIds(new Set(currentRecords.map((r) => r.id)));
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
    handleDeleteDnsRecord,
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
    toggleSelectDns,
    toggleSelectAllDns,
    handleBulkDelete,
    handleBulkProxy,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    handleExportDns,
    handleImportDns,
  };
}
