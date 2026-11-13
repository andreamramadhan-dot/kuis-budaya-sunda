import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HostDashboard } from './components/host'
import { BankSoalManager } from './components/bank-soal'

function PreviewDev2() {
  const [activeTab, setActiveTab] = useState<'host' | 'bank-soal'>('host')

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* ── Active View ── */}
      {activeTab === 'host' ? (
        <HostDashboard
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
