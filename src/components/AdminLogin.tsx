"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface AdminLoginProps {
  pin: string;
  setPin: (pin: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  authError: boolean;
  setView: (view: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ pin, setPin, handleLogin, authError, setView }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <button onClick={() => setView('menu')} className="mb-8 text-slate-400 hover:text-slate-600 transition flex items-center gap-1 text-sm font-medium">
        <ChevronLeft className="w-4 h-4" /> Back to Menu
      </button>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">Store Access</h2>
        <p className="text-slate-500 text-sm">Please enter the staff PIN to continue.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className={`w-full bg-slate-50 border px-4 py-3 rounded-lg text-lg focus:outline-none transition-colors ${authError ? 'border-red-300 focus:border-red-500 text-red-600' : 'border-slate-200 focus:border-[#004B87]'}`}
            autoFocus
          />
          {authError && <p className="text-red-500 text-xs mt-2">Incorrect PIN. Please try again.</p>}
        </div>
        <button type="submit" className="w-full bg-[#004B87] text-white font-medium py-3 rounded-lg hover:bg-[#003A69] transition-colors shadow-sm">
          Access Dashboard
        </button>
      </form>
    </div>
  </div>
);

export default AdminLogin;
