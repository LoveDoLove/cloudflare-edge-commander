"use client";

import { useState, useEffect, useRef } from "react";
import { translations, Language } from "@/i18n/translations";

export function useCloudflareManager() {
  const [lang, setLangState] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<
    | "auth"
    | "edge"
    | "tunnels"
    | "utils"
    | "subnet"
    | "docs"
    | "about"
    | "privacy"
    | "terms"
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
    tunnels: false,
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
  const [tunnels, setTunnels] = useState<any[]>([]);

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [selectedAccountName, setSelectedAccountName] = useState<string | null>(
    null
  );
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);
  const [securityLevel, setSecurityLevel] = useState<string>("medium");

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
  const [selectedTunnelId, setSelectedTunnelId] = useState<string | null>(null);
  const [tunnelDetails, setTunnelDetails] = useState<any | null>(null);
  const [tunnelRoutes, setTunnelRoutes] = useState<any[]>([]);
  const [tunnelConfig, setTunnelConfig] = useState<any | null>(null);

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
    if (!content) return "";
    let clean = content;
    if (type === "TXT") {
      clean = clean.replace(/\\"/g, '"');
      while (
        (clean.startsWith('"') && clean.endsWith('"')) ||
        (clean.startsWith("'") && clean.endsWith("'"))
      ) {
        clean = clean.substring(1, clean.length - 1);
      }
    }
    return clean;
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
    setTunnels([]);
    setLoadStates((s) => ({ ...s, zone: true, tunnels: true }));

    try {
      const data = await fetchCF(`zones?account.id=${accId}`);
      setZones(data);
      addLog(t.found_zones.replace("{n}", data.length.toString()), "success");
    } catch (err: any) {
      addLog(`Zones Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, zone: false }));
    }

    try {
      const tunnelData = await fetchCF(`accounts/${accId}/cfd_tunnel`);
      setTunnels(tunnelData || []);
      addLog(`Sync: ${tunnelData.length} tunnels found.`, "success");
    } catch (err: any) {
      addLog(`Tunnels Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, tunnels: false }));
    }
  };

  const handleSelectZone = async (id: string, name: string) => {
    setZoneId(id);
    setSelectedZoneName(name);
    setDnsRecords([]);
    setSecurityLevel("medium"); // Reset to neutral state while loading new zone
    setLoadStates((s) => ({ ...s, cert: true, dns: true }));
    try {
      // Fetch Universal SSL info
      try {
        const universal = await fetchCF(`zones/${id}/ssl/universal/settings`);
        if (universal?.certificate_authority)
          setCaProvider(universal.certificate_authority);
      } catch (e) {}

      // Fetch SSL Mode
      try {
        const ssl = await fetchCF(`zones/${id}/settings/ssl`);
        if (ssl?.value) setSslMode(ssl.value);
      } catch (e) {}

      // Fetch Security Level (Under Attack Status)
      try {
        const sec = await fetchCF(`zones/${id}/settings/security_level`);
        if (sec?.value) {
          setSecurityLevel(sec.value);
        }
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
      const payload = {
        type: editFormData.type,
        name: editFormData.name,
        content: sanitizeContent(editFormData.content, editFormData.type),
        proxied: editFormData.proxied,
        ttl: editFormData.ttl,
        priority: editFormData.priority,
      };
      await fetchCF(
        `zones/${zoneId}/dns_records/${editingRecordId}`,
        "PATCH",
        payload
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
      let imported: any[] = [];
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
              priority: parseInt(cols[5]) || undefined,
            };
          });
      }
      let s = 0,
        f = 0;
      for (const r of imported) {
        if (r.meta?.read_only || r.meta?.email_routing) continue;
        try {
          const payload: any = {
            type: r.type,
            name: r.name,
            content: sanitizeContent(r.content, r.type),
            proxied: !!r.proxied,
            ttl: r.ttl || 1,
          };
          if (r.priority !== undefined) payload.priority = r.priority;
          await fetchCF(`zones/${zoneId}/dns_records`, "POST", payload);
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
        name: "Alibaba",
        url: `https://dns.alidns.com/resolve?name=${record.name}&type=${record.type}`,
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

  const handleDeleteDnsRecord = async () => {
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
  };

  const toggleSelectDns = (id: string) =>
    setSelectedDnsIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleSelectAllDns = (recs: any[]) =>
    setSelectedDnsIds((prev) =>
      prev.size === recs.length ? new Set() : new Set(recs.map((r) => r.id))
    );

  const handleBulkDelete = async () => {
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
  };

  const handleBulkProxy = async (p: boolean) => {
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
  };

  const handleNuclearBtn = async () => {
    if (!zoneId) return;
    const isUnderAttack = securityLevel === "under_attack";
    const targetLevel = isUnderAttack ? "medium" : "under_attack";
    const actionLabel = isUnderAttack ? "DISABLE" : "ENABLE";

    if (
      !window.confirm(
        t.nuclear_confirm ||
          `PROTOCOL OVERRIDE: ${actionLabel} Under Attack mode for ${selectedZoneName}?`
      )
    )
      return;

    setLoadStates((s) => ({ ...s, bulk: true }));
    addLog(
      `SECURITY PROTOCOL: Setting ${selectedZoneName} to ${targetLevel}...`,
      isUnderAttack ? "info" : "error"
    );

    try {
      await fetchCF(`zones/${zoneId}/settings/security_level`, "PATCH", {
        value: targetLevel,
      });
      setSecurityLevel(targetLevel);
      addLog(
        `SECURITY PROTOCOL: ${selectedZoneName} is now ${targetLevel}.`,
        "success"
      );
    } catch (e: any) {
      addLog(
        `Security Protocol Error for ${selectedZoneName}: ${e.message}`,
        "error"
      );
    } finally {
      setLoadStates((s) => ({ ...s, bulk: false }));
    }
  };

  const handleSelectTunnel = async (tunnelId: string) => {
    if (!selectedAccountId) return;
    setSelectedTunnelId(tunnelId);
    setLoadStates((s) => ({ ...s, tunnels: true }));
    try {
      const details = await fetchCF(
        `accounts/${selectedAccountId}/cfd_tunnel/${tunnelId}`
      );
      setTunnelDetails(details);
      const routes = await fetchCF(
        `accounts/${selectedAccountId}/teamnet/routes?tunnel_id=${tunnelId}`
      );
      setTunnelRoutes(routes || []);
      try {
        const config = await fetchCF(
          `accounts/${selectedAccountId}/cfd_tunnel/${tunnelId}/configurations`
        );
        setTunnelConfig(config);
      } catch (e) {
        setTunnelConfig(null);
      }
      addLog(`Tunnel ${details.name} loaded.`, "success");
    } catch (err: any) {
      addLog(`Tunnel Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, tunnels: false }));
    }
  };

  const handleUpdateTunnelName = async (tunnelId: string, newName: string) => {
    if (!selectedAccountId) return;
    setLoadStates((s) => ({ ...s, tunnels: true }));
    try {
      await fetchCF(
        `accounts/${selectedAccountId}/cfd_tunnel/${tunnelId}`,
        "PATCH",
        { name: newName }
      );
      setTunnelDetails((prev: any) => ({ ...prev, name: newName }));
      setTunnels((prev) =>
        prev.map((t) => (t.id === tunnelId ? { ...t, name: newName } : t))
      );
      addLog(`Tunnel renamed to ${newName}`, "success");
    } catch (err: any) {
      addLog(`Rename Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, tunnels: false }));
    }
  };

  const handleAddTunnelRoute = async (network: string) => {
    if (!selectedAccountId || !selectedTunnelId) return;
    setLoadStates((s) => ({ ...s, tunnels: true }));
    try {
      await fetchCF(`accounts/${selectedAccountId}/teamnet/routes`, "POST", {
        network,
        tunnel_id: selectedTunnelId,
      });
      const routes = await fetchCF(
        `accounts/${selectedAccountId}/teamnet/routes?tunnel_id=${selectedTunnelId}`
      );
      setTunnelRoutes(routes || []);
      addLog(`Route ${network} added.`, "success");
    } catch (err: any) {
      addLog(`Add Route Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, tunnels: false }));
    }
  };

  const handleDeleteTunnelRoute = async (routeId: string) => {
    if (!selectedAccountId || !selectedTunnelId) return;
    setLoadStates((s) => ({ ...s, tunnels: true }));
    try {
      await fetchCF(
        `accounts/${selectedAccountId}/teamnet/routes/${routeId}`,
        "DELETE"
      );
      setTunnelRoutes((prev) => prev.filter((r) => r.id !== routeId));
      addLog(`Route deleted.`, "success");
    } catch (err: any) {
      addLog(`Delete Route Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, tunnels: false }));
    }
  };

  const handleUpdateTunnelConfig = async (config: any) => {
    if (!selectedAccountId || !selectedTunnelId) return;
    setLoadStates((s) => ({ ...s, tunnels: true }));
    try {
      await fetchCF(
        `accounts/${selectedAccountId}/cfd_tunnel/${selectedTunnelId}/configurations`,
        "PUT",
        config
      );
      setTunnelConfig({ config });
      addLog(`Tunnel configuration updated.`, "success");
    } catch (err: any) {
      addLog(`Config Error: ${err.message}`, "error");
    } finally {
      setLoadStates((s) => ({ ...s, tunnels: false }));
    }
  };

  const handleAddHostname = async (hostname: string, service: string) => {
    if (!selectedAccountId || !selectedTunnelId || !tunnelConfig) return;
    const currentConfig = tunnelConfig.config || { ingress: [] };
    const ingress = [...(currentConfig.ingress || [])];
    const catchAllIdx = ingress.findIndex((r: any) => !r.hostname);
    const newRule = { hostname, service };
    if (catchAllIdx !== -1) {
      ingress.splice(catchAllIdx, 0, newRule);
    } else {
      ingress.push(newRule);
      ingress.push({ service: "http_status:404" });
    }
    await handleUpdateTunnelConfig({ ...currentConfig, ingress });
  };

  const handleDeleteHostname = async (index: number) => {
    if (!selectedAccountId || !selectedTunnelId || !tunnelConfig) return;
    const currentConfig = tunnelConfig.config;
    const ingress = currentConfig.ingress.filter(
      (_: any, i: number) => i !== index
    );
    await handleUpdateTunnelConfig({ ...currentConfig, ingress });
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
    securityLevel,
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
    checkPropagation,
    propResults,
    tunnels,
    handleNuclearBtn,
    selectedTunnelId,
    setSelectedTunnelId,
    tunnelDetails,
    tunnelRoutes,
    tunnelConfig,
    handleSelectTunnel,
    handleUpdateTunnelName,
    handleAddTunnelRoute,
    handleDeleteTunnelRoute,
    handleUpdateTunnelConfig,
    handleAddHostname,
    handleDeleteHostname,
  };
}
