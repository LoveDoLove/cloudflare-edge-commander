"use client";

import { useState, useEffect, useRef } from 'react';

export function useCloudflareManager() {
  const [activeTab, setActiveTab] = useState<'auth' | 'edge' | 'utils'>('auth');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [globalKey, setGlobalKey] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [ipv6Input, setIpv6Input] = useState('2001:db8::/32');
  const [labResults, setLabResults] = useState<{ip: string, arpa: string}[]>([]);
  
  const [loadStates, setLoadStates] = useState({
    inv: false, zone: false, cert: false, addDomain: false, dns: false, ca: false, ssl: false
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

  const [recordToDelete, setRecordToDelete] = useState<any | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConsoleOpen) { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }
  }, [logs, isConsoleOpen]);

  const addLog = (msg: string, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    if (type === 'error' || type === 'success') setIsConsoleOpen(true);
  };

  const fetchCF = async (endpoint: string, method = 'GET', body?: any) => {
    const response = await fetch('/api/cloudflare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, email: authEmail, key: globalKey, method, body })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'API Request Failed');
    return data.result;
  };

  const handleFetchAccounts = async () => {
    if (!authEmail || !globalKey) { setStatus({ type: 'error', message: 'Credentials required.' }); return; }
    setLoadStates(s => ({ ...s, inv: true }));
    addLog('Syncing accounts...', 'info');
    try {
      const data = await fetchCF('accounts');
      setAccounts(data);
      addLog(`Sync Success: ${data.length} accounts found.`, 'success');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, inv: false })); }
  };

  const handleSelectAccount = async (accId: string, accName: string) => {
    setSelectedAccountId(accId); setSelectedAccountName(accName);
    setZones([]); setLoadStates(s => ({ ...s, zone: true }));
    addLog(`Loading zones for ${accName}...`, 'info');
    try {
      const data = await fetchCF(`zones?account.id=${accId}`);
      setZones(data);
      addLog(`Found ${data.length} zones.`, 'success');
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, zone: false })); }
  };

  const handleSelectZone = async (id: string, name: string) => {
    setZoneId(id); setSelectedZoneName(name); setDnsRecords([]); setEditingRecordId(null);
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
        const records = await fetchCF(`zones/${id}/dns_records`);
        setDnsRecords(records || []);
      } catch (e: any) {}
      addLog(`Sync complete.`, 'success');
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
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
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
      addLog(`Deleted successfully.`, 'success');
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
      setDnsRecords(records);
    } catch (err: any) { addLog(`Error: ${err.message}`, 'error'); } 
    finally { setLoadStates(s => ({ ...s, dns: false })); setRecordToDelete(null); }
  };

  const handleSaveEdit = async () => {
    if (!zoneId || !editingRecordId || !editFormData) return;
    setLoadStates(s => ({ ...s, dns: true }));
    addLog(`Updating record: ${editFormData.name}...`, 'info');
    try {
      await fetchCF(`zones/${zoneId}/dns_records/${editingRecordId}`, 'PATCH', {
        type: editFormData.type, name: editFormData.name, content: editFormData.content, proxied: editFormData.proxied
      });
      addLog(`Successfully updated ${editFormData.name}`, 'success');
      const records = await fetchCF(`zones/${zoneId}/dns_records`);
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
      addLog(`CA Updated.`, 'success');
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
      addLog(`SSL Updated.`, 'success');
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

  return {
    activeTab, setActiveTab, isConsoleOpen, setIsConsoleOpen,
    authEmail, setAuthEmail, globalKey, setGlobalKey, handleFetchAccounts,
    accounts, selectedAccountId, handleSelectAccount,
    zones, zoneId, selectedZoneName, handleSelectZone,
    dnsRecords, newDns, setNewDns, handleAddDnsRecord, recordToDelete, setRecordToDelete, handleDeleteDnsRecord,
    editingRecordId, setEditingRecordId, editFormData, setEditFormData, handleSaveEdit,
    caProvider, setCaProvider, handleApplyCA, sslMode, setSslMode, handleApplySSL,
    ipv6Input, setIpv6Input, labResults, setLabResults, loadStates, status, logs,
    setNewDomainName, newDomainName, addLog, logEndRef
  };
}