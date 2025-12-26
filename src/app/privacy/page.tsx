"use client";

import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Database, EyeOff, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </a>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="h-2 bg-emerald-500 w-full opacity-80"></div>
          <div className="p-8 md:p-12 space-y-10">
            <header className="space-y-4">
              <div className="size-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="size-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Privacy Policy</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Safe & Secure Automation</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
              <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <EyeOff className="size-5 text-emerald-600 mb-3" />
                <h3 className="font-bold text-emerald-900 mb-1">No Data Collection</h3>
                <p className="text-sm text-emerald-800/70 leading-relaxed">We never collect, store, or transmit your credentials to our servers.</p>
              </div>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <Lock className="size-5 text-blue-600 mb-3" />
                <h3 className="font-bold text-blue-900 mb-1">Local Processing</h3>
                <p className="text-sm text-blue-800/70 leading-relaxed">Everything runs inside your browser. State is cleared on refresh.</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <Database className="size-5 text-indigo-500" /> Data Handling
                </h2>
                <p>Our application is designed as a client-side utility. All data entered (including Cloudflare Email, API Keys, and Zone IDs) is processed exclusively within your own web browser.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <Globe className="size-5 text-indigo-500" /> Third-Party Services
                </h2>
                <p>The application interacts directly with the <strong>Cloudflare API</strong>. Your use of these features is subject to Cloudflare's own privacy regulations.</p>
              </section>

              <section className="pt-8 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium">
                  Last Updated: January 1, 2025
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}