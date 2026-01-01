"use client";

import React from 'react';
import { ShieldCheck, Lock, Eye, AlertCircle } from 'lucide-react';

export const PrivacyView = ({ lang }: { lang: 'en' | 'zh' }) => {
  const isZh = lang === 'zh';
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-10 md:p-14 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="relative space-y-10">
          <div className="flex items-center gap-5">
            <div className="size-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <Lock className="size-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{isZh ? '隐私政策' : 'Privacy Policy'}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{isZh ? '数据处理与保护' : 'Data Handling & Protection'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-600"><Eye className="size-5" /><h3 className="font-black uppercase text-xs tracking-widest">{isZh ? '信息收集' : 'Information Collection'}</h3></div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {isZh ? '我们不会在任何持久性数据库中存储您的 Cloudflare API 密钥或电子邮件。这些凭证仅在您的活跃会话期间用于与 API 通信。' : 'We do not store your Cloudflare API keys or email addresses in any persistent database. Credentials are used only during your active session.'}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-600"><ShieldCheck className="size-5" /><h3 className="font-black uppercase text-xs tracking-widest">{isZh ? '本地安全性' : 'Local Security'}</h3></div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {isZh ? '会话期间生成的数据仅存在于您的浏览器内存中，刷新或关闭标签页后将完全清除。' : 'Data generated during your session resides solely in your browser memory and is completely wiped upon refreshing or closing the tab.'}
              </p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex gap-6">
            <AlertCircle className="size-6 text-slate-400 shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">{isZh ? '第三方服务' : 'Third-Party Services'}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {isZh ? '本应用直接与 Cloudflare API 交互。使用本工具即表示您受 Cloudflare 隐私政策和服务条款的约束。' : 'This application interacts directly with Cloudflare APIs. By using this tool, you are subject to Cloudflare\'s privacy policies.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};