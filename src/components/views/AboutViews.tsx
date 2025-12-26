"use client";

import React from 'react';
import { Github, ExternalLink, User, Globe, Info, Heart } from 'lucide-react';

export const AboutView = ({ lang }: { lang: 'en' | 'zh' }) => {
  const isZh = lang === 'zh';
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-5xl mx-auto space-y-12 pb-24">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-10 md:p-14 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50/50 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="size-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                <Globe className="size-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {isZh ? '项目情报' : 'Project Intelligence'}
                </h1>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em]">
                  Cloudflare Edge Commander v1.0
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {/* Fixed text color for visibility on hover */}
              <a 
                href="https://github.com/LoveDoLove/cloudflare-edge-commander" 
                target="_blank" 
                className="btn btn-ghost bg-slate-50 hover:bg-slate-200 text-slate-900 rounded-xl font-black uppercase text-[10px] h-12 px-5 border border-slate-200 transition-all"
              >
                <Github className="size-4 mr-2" /> {isZh ? '项目源码' : 'Source Code'}
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900">
                  <User className="size-5 text-orange-600" />
                  <h3 className="font-black uppercase text-xs tracking-widest">{isZh ? '开发者信息' : 'Developer'}</h3>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                        <img src="https://github.com/LoveDoLove.png" alt="LoveDoLove" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">LoveDoLove</p>
                        <a href="https://github.com/LoveDoLove" target="_blank" className="text-[10px] font-bold text-orange-600 hover:underline flex items-center gap-1">
                          @github/LoveDoLove <ExternalLink className="size-2.5" />
                        </a>
                      </div>
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
                     {isZh ? '致力于构建高性能、直观的边缘网络管理工具。' : 'Dedicated to building high-performance, intuitive edge network management tools.'}
                   </p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900">
                  <Info className="size-5 text-orange-600" />
                  <h3 className="font-black uppercase text-xs tracking-widest">{isZh ? '项目愿景' : 'Mission'}</h3>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                   <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                     {isZh 
                       ? '“让复杂的边缘基础设施管理变得简单、安全且触手可及。”' 
                       : '"Making complex edge infrastructure management simple, secure, and accessible to everyone."'}
                   </p>
                   <div className="mt-4 flex gap-2">
                      <div className="badge badge-sm bg-orange-100 text-orange-700 border-none font-black text-[9px] px-3">NEXT.JS</div>
                      <div className="badge badge-sm bg-blue-100 text-blue-700 border-none font-black text-[9px] px-3">CLOUDFLARE API</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-8 opacity-30">
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            MADE WITH <Heart className="size-3 text-orange-600 fill-orange-600" /> BY LOVEDOLOVE
         </div>
      </div>
    </div>
  );
};