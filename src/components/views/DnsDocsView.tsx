"use client";

import React from 'react';
import { BookOpen, HelpCircle, Info, ExternalLink, ShieldCheck, Mail, Zap } from 'lucide-react';

const DNS_DATA = [
  {
    category: { en: "Basic Records", zh: "基础记录" },
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50",
    records: [
      { type: "A", name: "Address", en: "Maps a domain name to an IPv4 address.", zh: "将域名映射到 IPv4 地址。" },
      { type: "AAAA", name: "IPv6 Address", en: "Maps a domain name to an IPv6 address.", zh: "将域名映射到 IPv6 地址。" },
      { type: "CNAME", name: "Canonical Name", en: "Creates an alias for another domain name.", zh: "为另一个域名创建别名（不能与其他记录共存）。" },
      { type: "TXT", name: "Text", en: "Used for arbitrary text (SPF, DKIM, verification).", zh: "用于任意文本，常用于 SPF、DKIM 和站点验证。" },
    ]
  },
  {
    category: { en: "Mail & Routing", zh: "邮件与路由" },
    icon: Mail,
    color: "text-blue-500",
    bg: "bg-blue-50",
    records: [
      { type: "MX", name: "Mail Exchanger", en: "Specifies mail server for receiving emails.", zh: "指定负责接收电子邮件的邮件服务器。" },
      { type: "NS", name: "Name Server", en: "Delegates zone to a specific name server.", zh: "委托 DNS 区域使用特定的权威名称服务器。" },
      { type: "PTR", name: "Pointer", en: "Reverse DNS lookup (IP to Domain).", zh: "用于反向 DNS 查询（IP 映射到域名）。" },
      { type: "SRV", name: "Service", en: "Defines location of specific services.", zh: "定义特定服务的具体位置（主机名和端口）。" },
    ]
  },
  {
    category: { en: "Security", zh: "安全记录" },
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    records: [
      { type: "CAA", name: "CA Authorization", en: "Allowed Certificate Authorities.", zh: "指定允许哪些证书颁发机构签发 SSL 证书。" },
      { type: "DNSKEY", name: "DNS Key", en: "Verifies DNSSEC signatures.", zh: "包含用于验证 DNSSEC 签名信息的公钥。" },
      { type: "SSHFP", name: "SSH Fingerprint", en: "Fingerprints for SSH public keys.", zh: "存储 SSH 公钥指纹，防止中间人攻击。" },
      { type: "TLSA", name: "TLS Authentication", en: "Associates TLS cert with domain (DANE).", zh: "用于将 TLS 证书与域名关联（DANE）。" },
    ]
  }
];

export const DnsDocsView = ({ lang }: { lang: 'en' | 'zh' }) => {
  const isZh = lang === 'zh';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-10 pb-16">
      <div className="bg-indigo-600 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <BookOpen className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase">
                {isZh ? 'DNS 帮助文档' : 'DNS Documentation'}
              </h1>
            </div>
            <p className="text-indigo-100 text-sm font-medium max-w-xl leading-relaxed">
              {isZh 
                ? '本指南为边缘管理器支持的每个 DNS 记录类型提供简要说明，帮助您更好地配置网络资产。' 
                : 'This guide provides a brief explanation for each DNS record type supported in the Edge Manager.'}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center">
              <div className="text-2xl font-black mb-1">12+</div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {isZh ? '支持类型' : 'Supported Types'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {DNS_DATA.map((cat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col">
            <div className={`p-6 ${cat.bg} border-b border-slate-100 flex items-center gap-3`}>
              <cat.icon className={`size-5 ${cat.color}`} />
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                {isZh ? cat.category.zh : cat.category.en}
              </h3>
            </div>
            <div className="p-6 flex-1 space-y-6">
              {cat.records.map((rec, j) => (
                <div key={j} className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`px-2 py-0.5 rounded-lg bg-slate-100 font-mono font-black text-[11px] ${cat.color} group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                      {rec.type}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {rec.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium pl-1">
                    {isZh ? rec.zh : rec.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <HelpCircle className="size-24" />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-400">
              <Info className="size-5" />
              <h4 className="font-black uppercase text-xs tracking-widest">
                {isZh ? '使用提示' : 'Usage Notes'}
              </h4>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="size-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  <strong className="text-white">Proxied (Orange Cloud):</strong> {isZh ? '在 Cloudflare 中，A、AAAA 和 CNAME 可以开启代理以启用 CDN 和防火墙。' : 'In Cloudflare, A, AAAA, and CNAME can be proxied to enable CDN/WAF.'}
                </p>
              </li>
              <li className="flex gap-4">
                <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  <strong className="text-white">ip6.arpa:</strong> {isZh ? '对于 IPv6 反向解析，请主要关注 PTR 记录。' : 'For IPv6 reverse DNS, focus primarily on PTR records.'}
                </p>
              </li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {isZh ? '需要更多帮助？' : 'Need More Help?'}
            </p>
            <a href="https://developers.cloudflare.com/dns/" target="_blank" className="btn btn-outline border-white/20 hover:bg-white hover:text-slate-900 text-white rounded-xl font-black uppercase text-[10px] h-12 px-6">
              Cloudflare DNS Docs <ExternalLink className="size-3.5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};