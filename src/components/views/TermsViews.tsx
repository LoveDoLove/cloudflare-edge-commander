"use client";

import React from 'react';
import { Scale } from 'lucide-react';

export const TermsView = ({ lang }: { lang: 'en' | 'zh' }) => {
  const isZh = lang === 'zh';
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-10 md:p-14 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50/50 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="relative space-y-10">
          <div className="flex items-center gap-5">
            <div className="size-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
              <Scale className="size-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{isZh ? '服务条款' : 'Terms of Service'}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{isZh ? '使用协议与免责声明' : 'Usage Agreement & Disclaimers'}</p>
            </div>
          </div>
          <div className="space-y-8">
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="size-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200">01</span>
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-900">{isZh ? '接受条款' : 'Acceptance'}</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium pl-9">{isZh ? '通过访问本工具，您同意将其用于管理 Cloudflare 配置。您对使用您的凭据执行的操作负全责。' : 'By accessing this tool, you agree to use it for managing configurations. You are solely responsible for actions performed with your credentials.'}</p>
            </section>
            
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="size-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200">02</span>
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-900">{isZh ? '无关联声明' : 'No Affiliation'}</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium pl-9">{isZh ? '本工具是一个独立项目，不隶属于 Cloudflare, Inc.，也未获得其授权或背书。' : 'This project is independent and is NOT affiliated with Cloudflare, Inc.'}</p>
            </section>
            
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="size-6 bg-rose-50 rounded-full flex items-center justify-center text-[10px] font-black text-rose-500 border border-rose-100">03</span>
                <h3 className="font-black uppercase text-xs tracking-widest text-rose-600">{isZh ? '责任限制' : 'Disclaimer'}</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium pl-9">{isZh ? '软件按“原样”提供。作者在任何情况下均不对因使用软件而产生的任何索赔或损害负责。' : 'The software is provided "AS IS". Authors shall not be liable for any claim or damages arising from the use of the software.'}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};