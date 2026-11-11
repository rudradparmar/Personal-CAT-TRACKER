'use client';

import React, { useState } from 'react';
import { TrackerStore } from '@/types/tracker';
import {
  Smartphone,
  Cloud,
  Download,
  Upload,
  QrCode,
  RefreshCw,
  Check,
  X,
  Copy,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncRoom: string;
  onSetSyncRoom: (room: string) => void;
  onManualSync: () => void;
  isSyncing: boolean;
  lastSynced: number | null;
  store: TrackerStore;
  onImportStore: (imported: TrackerStore) => void;
}

export default function SyncModal({
  isOpen,
  onClose,
  syncRoom,
  onSetSyncRoom,
  onManualSync,
  isSyncing,
  lastSynced,
  store,
  onImportStore
}: SyncModalProps) {
  const [inputRoom, setInputRoom] = useState(syncRoom);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate pairing URL for phone
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const pairingUrl = `${currentOrigin}${currentPath}?room=${encodeURIComponent(inputRoom || 'my-cat-sprint')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    pairingUrl
  )}`;

  const handleApplyRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoom.trim()) {
      onSetSyncRoom(inputRoom.trim());
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(pairingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(store, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAT_2026_Sprint_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        onImportStore(parsed);
        alert('Data backup successfully restored!');
        onClose();
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Cloud Sync & Phone Access
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Edit targets live on phone and laptop simultaneously
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Room Section */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Sync Passkey / Room Key
            </label>
            <form onSubmit={handleApplyRoom} className="flex gap-2">
              <input
                type="text"
                value={inputRoom}
                onChange={e => setInputRoom(e.target.value)}
                placeholder="e.g. rudra-cat-2026"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm active:scale-95 transition-all"
              >
                Connect
              </button>
            </form>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Active Room: <strong className="text-slate-800 dark:text-slate-200">{syncRoom || 'None (Local only)'}</strong>
              </span>
              {lastSynced && (
                <span>Last Synced: {new Date(lastSynced).toLocaleTimeString()}</span>
              )}
            </div>
          </div>

          {/* QR Code For Instant Mobile Setup */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="Scan to open on phone"
                width={130}
                height={130}
                className="rounded-lg"
              />
            </div>
            <div className="text-center sm:text-left space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Scan with Phone Camera
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly opens this tracker on your phone with your sync room pre-configured!
              </p>
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Phone Link'}</span>
              </button>
            </div>
          </div>

          {/* Google Drive / Permanent File Backup */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Backup / Google Drive Archive
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleExportJson}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-95 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-brand-500" />
                <span>Export JSON File</span>
              </button>

              <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-95 transition-all shadow-sm cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJson}
                />
              </label>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-center">
              You can save the exported JSON file directly to your Google Drive or iCloud folder for permanent safety.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

