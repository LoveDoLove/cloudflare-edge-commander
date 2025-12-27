"use client";

import { useState, useEffect, useRef } from 'react';

export type Language = 'en' | 'zh';

export function useCloudflareManager() {
  const [lang, setLangState] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'auth' | 'edge' | 'utils' | 'docs' | 'about' | 'privacy' | 'terms'>('auth');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(280);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [authEmail, setAuthEmail] = useState('');
  const [globalKey, setGlobalKey] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [ipv6Input, setIpv6Input] = useState('2001:db8::/32');
  const [labResults, setLabResults] = useState<{ip: string, arpa: string}[]>([]);
  
  const [loadStates, setLoadStates] = useState({
    inv: false, zone: false, cert: false, addDomain: false, dns: false, ca: false, ssl: false, bulk: false
  });
  
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [logs, setLogs] = useState<{ msg: string, type: string, time: string }[]>([]);
  
  const [accounts, setAccounts] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [dnsRecords, setDnsRecords] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedAccountName, setSelectedAccountName] = useState<string | null>(null);
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);
  
  const [caProvider, setCaProvider] = useState<string>('google');
  const [sslMode, setSslMode] = useState<string>('strict');
  const [newDomainName, setNewDomainName] = useState('');
  const [newDns, setNewDns] = useState({ type: 'A', name: '', content: '', ttl: 1, proxied: false });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDnsIds, setSelectedDnsIds] = useState<Set<string>>(new Set());
  const [recordToDelete, setRecordToDelete] = useState<any | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('commander_pref_lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      setLangState(savedLang as Language);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('commander_pref_lang', newLang);
  };

  const dict = {
    en: {
      core_services: "Core Services",
      legal_compliance: "Project & Legal",
      nav_conn: "Connection",
      nav_edge: "Edge Manager",
      nav_lab: "Network Lab",
      nav_docs: "DNS Guide",
      nav_about: "About Us",
      nav_privacy: "Privacy Policy",
      nav_terms: "Terms of Service",
      monitor_open: "Process Monitor",
      monitor_close: "Close Monitor",
      auth_title: "Connectivity & Access",
      infra_title: "Infrastructure Management",
      lab_title: "Network Intelligence Lab",
      docs_title: "DNS Reference Registry",
      about_title: "Project Intelligence",
      privacy_title: "Data Sovereignty",
      terms_title: "Service Agreement",
      api_creds: "API Credentials",
      acc_email: "Account Email",
      global_key: "Global API Key",
      establish_session: "Establish Session",
      active_contexts: "Active Contexts",
      awaiting_auth: "Awaiting Auth",
      zone_registry: "Zone Registry",
      add_domain: "Add domain.com...",
      add_btn: "Add",
      select_account: "Select Account First",
      dns_registry: "Distributed DNS Registry",
      active_zone: "Active Zone",
      syncing_dns: "Syncing DNS Records...",
      create: "Create",
      proxy: "Proxy",
      registry_empty: "Registry Empty",
      ca_deploy: "CA Deployment",
      authority: "Authority",
      update_ca: "Update CA",
      enc_layer: "Encryption Layer",
      sec_level: "Security Level",
      enforce_enc: "Enforce Encryption",
      init_context: "Initialize Zone Context",
      net_lab: "Network Lab",
      intel_engine: "Intelligence Engine",
      ipv6_block: "IPv6 Address / Block",
      analyze: "Analyze",
      randomize: "Randomize",
      output_reg: "Lab Output Registry",
      system_idle: "System Idle",
      confirm_del: "Confirm Deletion",
      del_desc: "Permanently remove this record? This action cannot be reversed.",
      cancel: "Cancel",
      delete: "Delete Record",
      live_logs: "Live Node Logs",
      waiting_events: "Waiting for events...",
      copy_ip: "Copy IP",
      copy_arpa: "Copy ARPA",
      mapping: "Reverse Mapping",
      gen_node: "Generated Node",
      success_acc: "Sync Success: {n} accounts found.",
      found_zones: "Found {n} zones.",
      sync_done: "Sync complete.",
      update_done: "Update successful.",
      bulk_actions: "Bulk Actions",
      bulk_delete: "Bulk Delete",
      bulk_proxy: "Bulk Proxy",
      bulk_unproxy: "Bulk Unproxy",
      search_placeholder: "Search records...",
      selected_count: "{n} selected",
      confirm_bulk_del: "Bulk Deletion",
      bulk_del_desc: "Are you sure you want to delete {n} records? This cannot be undone.",
      processing: "Processing...",
    },
    zh: {
      core_services: "核心服务",
      legal_compliance: "项目与法律",
      nav_conn: "连接设置",
      nav_edge: "边缘管理",
      nav_lab: "网络实验室",
      nav_docs: "DNS 指南",
      nav_about: "关于我们",
      nav_privacy: "隐私政策",
      nav_terms: "服务条款",
      monitor_open: "运行监控",
      monitor_close: "关闭监控",
      auth_title: "连接与访问控制",
      infra_title: "基础设施管理",
      lab_title: "网络情报实验室",
      docs_title: "DNS 参考注册表",
      about_title: "项目情报中心",
      privacy_title: "数据主权声明",
      terms_title: "服务协议",
      api_creds: "API 凭据",
      acc_email: "账号邮箱",
      global_key: "全局 API 密钥",
      establish_session: "建立会话",
      active_contexts: "活跃上下文",
      awaiting_auth: "等待认证",
      zone_registry: "区域注册表",
      add_domain: "添加域名 domain.com...",
      add_btn: "添加",
      select_account: "请先选择账号",
      dns_registry: "分布式 DNS 注册表",
      active_zone: "活跃区域",
      syncing_dns: "正在同步 DNS 记录...",
      create: "创建",
      proxy: "代理",
      registry_empty: "注册表为空",
      ca_deploy: "CA 证书部署",
      authority: "证书颁发机构",
      update_ca: "更新 CA",
      enc_layer: "加密层级",
      sec_level: "安全级别",
      enforce_enc: "强制加密",
      init_context: "初始化区域上下文",
      net_lab: "网络实验室",
      intel_engine: "情报引擎",
      ipv6_block: "IPv6 地址 / 网段",
      analyze: "分析",
      randomize: "随机化",
      output_reg: "实验输出注册表",
      system_idle: "系统空闲",
      confirm_del: "确认删除",
      del_desc: "永久移除此记录？此操作无法撤销。",
      cancel: "取消",
      delete: "删除记录",
      live_logs: "实时节点日志",
      waiting_events: "等待事件...",
      copy_ip: "复制 IP",
      copy_arpa: "复制 ARPA",
      mapping: "反向映射",
      gen_node: "生成的节点",
      success_acc: "同步成功：找到 {n} 个账号。",
      found_zones: "找到 {n} 个区域。",
      sync_done: "同步完成。",
      update_done: "更新成功。",
      bulk_actions: "批量操作",
      bulk_delete: "批量删除",
      bulk_proxy: "批量开启代理",
      bulk_unproxy: "批量关闭代理",
      search_placeholder: "搜索记录...",
      selected_count: "已选择 {n} 项",
      confirm_bulk_del: "确认批量删除",
      bulk_del_desc: "确定要删除 {n} 条记录吗？此操作不可逆。",
      processing: "处理中...",
    }
  };

  const t = dict[lang];

  useEffect(() => {
    if (isConsoleOpen) { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }
  }, [logs, isConsoleOpen]);

  const addLog = (msg: string, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const fetchCF = async (endpoint: string, method = 'GET', body?: any): Promise<any> => {
    const response = await fetch('/api/cloudflare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, email: authEmail, key: globalKey, method, body })
    });
    const data = await response.json() as any;
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'API Request Failed');
    return data.result;
  };

  const handleFetchAccounts = async () => {
    if (!authEmail || !globalKey) { setStatus({ type: 'error', message: 'Credentials required.' }); return; }
    setLoadStates(s => ({ ...s, inv: true }));
    addLog('Syncing accounts...', 'info');
    try {
      const data = await fetchCF('accounts') as any[];
      setAccounts(data);
      addLog(t.success_acc.replace('{n}', data.length.toString()), 'success');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, inv: false })); }
  };

  const handleSelectAccount = async (accId: string, accName: string) => {
    setSelectedAccountId(accId); setSelectedAccountName(accName);
    setZones([]); setLoadStates(s => ({ ...s, zone: true }));
    addLog(`Loading zones for ${accName}...`, 'info');
    try {
      const data = await fetchCF(`zones?account.id=${accId}`) as any[];
      setZones(data);
      addLog(t.found_zones.replace('{n}', data.length.toString()), 'success');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, zone: false })); }
  };

  const handleSelectZone = async (id: string, name: string) => {
    setZoneId(id); setSelectedZoneName(name); setDnsRecords([]); setEditingRecordId(null);
    setSelectedDnsIds(new Set()); 
    setLoadStates(s => ({ ...s, cert: true, dns: true }));
    addLog(`Context: ${name}...`, 'info');
    try {
      try {
        const universalSettings = await fetchCF(`zones/${id}/ssl/universal/settings`);
        if (universalSettings?.certificate_authority) setCaProvider(universalSettings.certificate_authority);
        const sslSettings = await fetchCF(`zones/${id}/settings/ssl`);
        if (sslSettings?.value) setSslMode(sslSettings.value);
      } catch (e: any) {}
      try {
        const records = await fetchCF(`zones/${id}/dns_records`) as any[];
        setDnsRecords(records || []);
      } catch (e: any) {}
      addLog(t.sync_done, 'success');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, cert: false, dns: false })); }
  };

  const handleAddDnsRecord = async () => {
    if (!zoneId || !newDns.name || !newDns.content) return;
    setLoadStates(s => ({ ...s, dns: true }));
    addLog(`Creating ${newDns.type} record...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records`, 'POST', newDns);
      addLog(`Created: ${newDns.name}`, 'success');
      setNewDns({ type: 'A', name: '', content: '', ttl: 1, proxied: false });
      const records = await fetchCF(`zones/${zoneId}/dns_records`) as any[];
      setDnsRecords(records);
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, dns: false })); }
  };

  const handleDeleteDnsRecord = async () => {
    if (!zoneId || !recordToDelete) return;
    setLoadStates(s => ({ ...s, dns: true }));
    addLog(`Deleting ${recordToDelete.name}...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records/${recordToDelete.id}`, 'DELETE');
      addLog(t.update_done, 'success');
      setDnsRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, dns: false })); setRecordToDelete(null); }
  };

  const handleBulkDelete = async () => {
    if (!zoneId || selectedDnsIds.size === 0) return;
    setLoadStates(s => ({ ...s, bulk: true, dns: true }));
    addLog(`Initiating bulk delete for ${selectedDnsIds.size} records...`, 'info');
    
    const ids = Array.from(selectedDnsIds);
    let successCount = 0;
    
    for (const id of ids) {
      try {
        await fetchCF(`zones/${zoneId}/dns_records/${id}`, 'DELETE');
        successCount++;
      } catch (e: any) {
        addLog(`Failed to delete ID ${id}: ${e.message}`, 'error');
      }
    }
    
    addLog(`Bulk delete completed: ${successCount}/${ids.length} success.`, 'success');
    const records = await fetchCF(`zones/${zoneId}/dns_records`) as any[];
    setDnsRecords(records);
    setSelectedDnsIds(new Set());
    setShowBulkDeleteConfirm(false);
    setLoadStates(s => ({ ...s, bulk: false, dns: false }));
  };

  const handleBulkProxy = async (enable: boolean) => {
    if (!zoneId || selectedDnsIds.size === 0) return;
    setLoadStates(s => ({ ...s, bulk: true, dns: true }));
    addLog(`Bulk proxy ${enable ? 'enable' : 'disable'} for ${selectedDnsIds.size} records...`, 'info');
    
    const ids = Array.from(selectedDnsIds);
    let successCount = 0;

    for (const id of ids) {
      const record = dnsRecords.find(r => r.id === id);
      if (!record || !['A', 'AAAA', 'CNAME'].includes(record.type)) continue;
      try {
        await fetchCF(`zones/${zoneId}/dns_records/${id}`, 'PATCH', { proxied: enable });
        successCount++;
      } catch (e: any) {
        addLog(`Proxy failed for ${record.name}: ${e.message}`, 'error');
      }
    }

    addLog(`Bulk proxy update completed: ${successCount} updated.`, 'success');
    const records = await fetchCF(`zones/${zoneId}/dns_records`) as any[];
    setDnsRecords(records);
    setSelectedDnsIds(new Set());
    setLoadStates(s => ({ ...s, bulk: false, dns: false }));
  };

  const handleSaveEdit = async () => {
    if (!zoneId || !editingRecordId || !editFormData) return;
    setLoadStates(s => ({ ...s, dns: true }));
    addLog(`Updating record: ${editFormData.name}...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records/${editingRecordId}`, 'PATCH', {
        type: editFormData.type, name: editFormData.name, content: editFormData.content, proxied: editFormData.proxied
      });
      addLog(t.update_done, 'success');
      const records = await fetchCF(`zones/${zoneId}/dns_records`) as any[];
      setDnsRecords(records);
      setEditingRecordId(null); setEditFormData(null);
    } catch (err: any) { addLog(`Update Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, dns: false })); }
  };

  const handleApplyCA = async () => {
    if (!zoneId) return;
    setLoadStates(s => ({ ...s, ca: true }));
    addLog(`Updating CA...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/ssl/universal/settings`, 'PATCH', { certificate_authority: caProvider });
      addLog(t.update_done, 'success');
      setStatus({ type: 'success', message: `CA updated.` });
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, ca: false })); }
  };

  const handleApplySSL = async () => {
    if (!zoneId) return;
    setLoadStates(s => ({ ...s, ssl: true }));
    addLog(`Updating Encryption...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/settings/ssl`, 'PATCH', { value: sslMode });
      addLog(t.update_done, 'success');
      setStatus({ type: 'success', message: `SSL level updated.` });
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, ssl: false })); }
  };

  const handleAddDomain = async () => {
    if (!selectedAccountId || !newDomainName) return;
    setLoadStates(s => ({ ...s, addDomain: true }));
    addLog(`Adding ${newDomainName}...`, 'info');
    try {
      await fetchCF('zones', 'POST', { name: newDomainName, account: { id: selectedAccountId } });
      addLog(`Success: ${newDomainName} registered.`, 'success');
      setNewDomainName('');
      handleSelectAccount(selectedAccountId, selectedAccountName || '');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, addDomain: false })); }
  };

  const toggleSelectDns = (id: string) => {
    setSelectedDnsIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllDns = (currentRecords: any[]) => {
    if (selectedDnsIds.size === currentRecords.length && currentRecords.length > 0) {
      setSelectedDnsIds(new Set());
    } else {
      setSelectedDnsIds(new Set(currentRecords.map(r => r.id)));
    }
  };

  return {
    lang, setLang, t,
    activeTab, setActiveTab, isConsoleOpen, setIsConsoleOpen,
    consoleHeight, setConsoleHeight,
    isSidebarOpen, setIsSidebarOpen,
    authEmail, setAuthEmail, globalKey, setGlobalKey, handleFetchAccounts,
    accounts, selectedAccountId, handleSelectAccount,
    zones, zoneId, selectedZoneName, handleSelectZone,
    dnsRecords, newDns, setNewDns, handleAddDnsRecord, recordToDelete, setRecordToDelete, handleDeleteDnsRecord,
    editingRecordId, setEditingRecordId, editFormData, setEditFormData, handleSaveEdit,
    caProvider, setCaProvider, handleApplyCA, sslMode, setSslMode, handleApplySSL,
    ipv6Input, setIpv6Input, labResults, setLabResults, loadStates, status, logs,
    setNewDomainName, newDomainName, addLog, logEndRef, handleAddDomain,
    searchTerm, setSearchTerm, selectedDnsIds, toggleSelectDns, toggleSelectAllDns, 
    handleBulkDelete, handleBulkProxy, showBulkDeleteConfirm, setShowBulkDeleteConfirm
  };
}