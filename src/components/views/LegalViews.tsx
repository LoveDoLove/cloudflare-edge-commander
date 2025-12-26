"use client";

import React from 'react';
import { ShieldCheck, FileText, Lock, Eye, Scale, AlertCircle } from 'lucide-react';

export const PrivacyView = () => (
  <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-4xl mx-auto space-y-8 pb-12">
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-10 md:p-14 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-[100px] rounded-full -mr-20 -mt-20" />
      
      <div className="relative space-y-10">
        <div className="flex items-center gap-5">
          <div className="size-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Lock className="size-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Privacy Policy</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Data Handling & Protection</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <Eye className="size-5" />
              <h3 className="font-black uppercase text-xs tracking-widest">Information We Collect</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              We do not store your Cloudflare API keys or email addresses in any persistent database. These credentials are only used during your active session to communicate with the Cloudflare API via our secure serverless proxy.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <ShieldCheck className="size-5" />
              <h3 className="font-black uppercase text-xs tracking-widest">Local Session Data</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Data generated during your session (such as ARPA mappings or fetched zone lists) resides solely in your browser's memory and is cleared upon refreshing or closing the application tab.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex gap-6">
          <AlertCircle className="size-6 text-slate-400 shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">Third-Party Services</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              This application interacts directly with Cloudflare, Inc. APIs. By using this tool, you are subject to Cloudflare's own privacy policies and terms of service regarding the management of your network infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const TermsView = () => (
  <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-4xl mx-auto space-y-8 pb-12">
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-10 md:p-14 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 blur-[100px] rounded-full -ml-20 -mb-20" />
      
      <div className="relative space-y-10">
        <div className="flex items-center gap-5">
          <div className="size-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
            <Scale className="size-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Terms of Service</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Usage Agreement & Disclaimers</p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="size-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900">01</span>
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-900">Acceptance of Terms</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium pl-9">
              By accessing the ip6-arpa Manager, you agree to use the tool for its intended purpose: managing Cloudflare DNS and SSL configurations. You are solely responsible for the actions performed using your API credentials.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="size-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900">02</span>
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-900">No Affiliation</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium pl-9">
              This project is an independent tool and is NOT affiliated with, authorized, maintained, sponsored, or endorsed by Cloudflare, Inc. or any of its affiliates or subsidiaries.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="size-6 bg-rose-50 rounded-full flex items-center justify-center text-[10px] font-black text-rose-600">03</span>
              <h3 className="font-black uppercase text-xs tracking-widest text-rose-600">Disclaimer of Liability</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium pl-9">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. In no event shall the authors be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from the use of the software.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Last Updated: December 2025
          </p>
        </div>
      </div>
    </div>
  </div>
);