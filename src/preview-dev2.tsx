import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HostDashboard } from './components/host'
import { BankSoalManager } from './components/bank-soal'

function PreviewDev2() {
  const [activeTab, setActiveTab] = useState<'host' | 'bank-soal'>('host')

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* Dev Switcher Bar */}
      <div className="fixed top-2.5 right-4 z-50 flex items-center gap-1.5 bg-slate-900/95 p-1 rounded-xl border border-amber-500/40 shadow-2xl backdrop-blur-md">
        <span className="text-[10px] font-bold text-amber-400/80 px-2 uppercase tracking-widest hidden sm:inline">
          Dev 2 Preview:
        </span>
        <button
          onClick={() => setActiveTab('host')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'host'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🖥️ Layar Host (Arena)
        </button>
        <button
          onClick={() => setActiveTab('bank-soal')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'bank-soal'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          📚 Bank Soal
        </button>
      </div>

      {/* Render Active Component */}
      {activeTab === 'host' ? (
        <HostDashboard
          roomCode="TIK26"
          onSwitchToBankSoal={() => setActiveTab('bank-soal')}
        />
      ) : (
        <div className="relative w-full h-full">
          <button
            onClick={() => setActiveTab('host')}
            className="fixed top-3 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg"
          >
            ← Kembali ke Arena Host
          </button>
          <BankSoalManager />
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreviewDev2 />
  </StrictMode>,
)
