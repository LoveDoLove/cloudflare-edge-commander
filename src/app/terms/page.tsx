"use client";

import React from 'react';
import { FileText, ArrowLeft, ShieldCheck, Key, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </a>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="h-2 bg-indigo-600 w-full opacity-80"></div>
          <div className="p-8 md:p-12 space-y-10">
            <header className="space-y-4">
              <div className="size-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <FileText className="size-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Terms and Conditions</h1>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Effective: Jan 1, 2025</span>
                <span className="size-1 bg-slate-200 rounded-full"></span>
                <span>ip6-arpa-dnsgen-autossl</span>
              </div>
            </header>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="size-5 text-indigo-500" /> 1. Acceptance of Terms
                </h2>
                <p>By accessing this website, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-indigo-500" /> 2. License
                </h2>
                <p>This project is licensed under the <strong>Apache License, Version 2.0</strong>. You may use, reproduce, and distribute the work in accordance with the terms of that license.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Key className="size-5 text-indigo-500" /> 3. Use of Tool
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>User Responsibility:</strong> You are solely responsible for the accuracy of the IPv6 prefixes and Cloudflare credentials you enter.</li>
                  <li><strong>API Usage:</strong> You are responsible for ensuring your use of this tool complies with Cloudflare's Terms of Service.</li>
                  <li><strong>Prohibited Use:</strong> You may not use this tool for any fraudulent or malicious activity.</li>
                </ul>
              </section>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Disclaimer of Warranty</h2>
                <p className="text-xs font-mono uppercase">
                  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS (LoveDoLove) BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY.
                </p>
              </div>

              <section className="pt-8 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center font-medium">
                  © {new Date().getFullYear()} LoveDoLove. All rights reserved.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}