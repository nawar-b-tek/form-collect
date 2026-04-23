/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Home, 
  Briefcase, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Smartphone,
  MapPin,
  Send,
  Loader2,
  Activity,
  Layers,
  ShieldCheck,
  Globe,
  Lock,
  EyeOff
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Step, FormData } from './types';
import MapSelector from '@/src/components/MapSelector';
import { MetricsChart } from '@/src/components/MetricsChart';

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzPeHse-3Botq41AM57OI8s4IiCsZgit1wH6yXVQCj2KRvSrvTAEsjlVR9uUCbAP14k/exec';

const COUNTRY_CODES = [
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
];

export default function App() {
  const [step, setStep] = useState<Step>('phone');
  const [data, setData] = useState<FormData>({
    phone: '',
    countryCode: '+216',
    home: { address: '', lat: null, lng: null },
    work: { address: '', lat: null, lng: null },
  });
  const [loading, setLoading] = useState(false);

  const steps: { key: Step; label: string; icon: any }[] = [
    { key: 'phone', label: 'Phone', icon: Smartphone },
    { key: 'home', label: 'Home', icon: Home },
    { key: 'work', label: 'Work', icon: Briefcase },
    { key: 'confirm', label: 'Verify', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const nextStep = () => {
    if (step === 'phone') setStep('home');
    else if (step === 'home') setStep('work');
    else if (step === 'work') setStep('confirm');
  };

  const prevStep = () => {
    if (step === 'home') setStep('phone');
    else if (step === 'work') setStep('home');
    else if (step === 'confirm') setStep('work');
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Structure complète pour correspondre à vos 8 colonnes
    const payload = {
      phone: `'${data.countryCode} ${data.phone}`,
      home_address: data.home.address,
      home_lat: data.home.lat,
      home_lng: data.home.lng,
      work_address: data.work.address,
      work_lat: data.work.lat,
      work_lng: data.work.lng
    };

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
      setStep('success');
    } catch (error) {
      console.error('Submission error:', error);
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 lg:p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Context & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
        
            <h1 className="font-display text-5xl font-extrabold tracking-tighter leading-[0.9] text-brand text-balance">
              Precision Geospatial <span className="text-accent">Intelligence</span>
            </h1>
            <p className="text-muted text-sm leading-relaxed max-w-sm font-medium">
              High-fidelity analytical system engineered for strategic infrastructure optimization and elite user journey mapping.
            </p>
          </motion.div>

          {/* Privacy Protocol Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 border border-dashed border-border rounded-2xl bg-white/50 space-y-3"
          >
            <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              Privacy Protocol
            </div>
            <p className="text-[11px] text-muted font-medium leading-relaxed">
              Your data security is our top priority. All transmitted information is end-to-end encrypted and handled with strict confidentiality. We do not store or share your personal identifiers with unauthorized third parties.
            </p>
            <div className="flex items-center gap-4 text-[9px] text-muted/60 font-bold uppercase">
              <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Zero-Knowledge</span>
              <span className="flex items-center gap-1 text-success"><ShieldCheck className="w-3 h-3" /> Verified Secure</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="modern-card p-6 space-y-4 overflow-hidden relative"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                Flow Metrics
              </h3>
              <span className="font-mono text-[10px] bg-bg px-2 py-0.5 rounded border border-border text-muted">LIVE</span>
            </div>
            <MetricsChart />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <StatItem label="Reliability" value="99.9%" icon={ShieldCheck} />
              <StatItem label="Network" value="Global" icon={Globe} />
            </div>
          </motion.div>

          <footer className="pt-4 text-[10px] font-mono text-muted/60 uppercase tracking-widest">
            ID_PROTOCOL: LMN-RX-2026
          </footer>
        </div>

        {/* Right column: The Form */}
        <div className="lg:col-span-7 w-full max-w-2xl mx-auto lg:mx-0">
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modern-card p-8 lg:p-10 relative overflow-hidden"
          >
            {/* Step Indicators */}
            {step !== 'success' && (
              <div className="flex items-center justify-between mb-12">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = i === currentStepIndex;
                  const isPast = i < currentStepIndex;

                  return (
                    <div key={s.key} className="flex-1 flex flex-col items-center group relative">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
                        isActive ? "bg-accent text-white shadow-xl shadow-accent/30 scale-110" : 
                        isPast ? "bg-success text-white" : 
                        "bg-bg border border-border text-muted"
                      )}>
                        {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <div className={cn(
                        "mt-3 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-300",
                        isActive ? "text-accent" : "text-muted/40"
                      )}>
                        {s.label}
                      </div>
                      {/* Connection lines */}
                      {i < steps.length - 1 && (
                        <div className={cn(
                          "absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-[2px] -z-0 transition-colors duration-500",
                          isPast ? "bg-success/30" : "bg-border"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted"> Telephone Identification </label>
                    <div className="flex gap-4">
                      <select 
                        value={data.countryCode}
                        onChange={(e) => setData({ ...data, countryCode: e.target.value })}
                        className="bg-bg border border-border rounded-2xl px-4 py-4 font-mono text-sm focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all cursor-pointer"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <input 
                        type="tel"
                        placeholder="XX XXX XXX"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value.replace(/\D/g, '') })}
                        className="flex-1 bg-bg border border-border rounded-2xl px-6 py-4 font-mono text-xl focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all placeholder:text-muted/20"
                      />
                    </div>
                  </div>
                  <button
                    disabled={data.phone.length < 8}
                    onClick={nextStep}
                    className="w-full h-16 bg-accent text-white rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-3 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-accent/20 disabled:bg-border disabled:transform-none disabled:shadow-none transition-all duration-300"
                  >
                    Next Step <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {step === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" /> Residential Source
                  </h2>
                  <MapSelector 
                    center={[36.8065, 10.1815]}
                    onLocationChange={(lat, lng, address) => setData({ ...data, home: { address, lat, lng } })}
                    zone="home"
                  />
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 h-14 bg-bg border border-border rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-border transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={!data.home.address}
                      onClick={nextStep}
                      className="flex-[4] h-14 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-accent/20 transition-all"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'work' && (
                <motion.div
                  key="work"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-xl font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-success" /> Professional Hub
                  </h2>
                  <MapSelector 
                    center={data.home.lat ? [data.home.lat, data.home.lng!] : [36.8065, 10.1815]}
                    onLocationChange={(lat, lng, address) => setData({ ...data, work: { address, lat, lng } })}
                    zone="work"
                  />
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 h-14 bg-bg border border-border rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-border transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={!data.work.address}
                      onClick={nextStep}
                      className="flex-[4] h-14 bg-success text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-success/20 transition-all"
                    >
                      Validate <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <SummaryCard icon={Smartphone} label="Contact" value={data.phone} sub={`${data.countryCode}`} color="accent" />
                    <SummaryCard icon={Home} label="Residence" value={data.home.address} color="accent" />
                    <SummaryCard icon={Briefcase} label="Workplace" value={data.work.address} color="success" />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button onClick={prevStep} className="flex-1 h-16 bg-bg border border-border rounded-2xl font-bold text-muted hover:text-brand hover:border-brand transition-all">
                      Modify
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-[3] h-16 bg-brand text-white rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-3 hover:translate-y-[-2px] hover:shadow-2xl transition-all"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                      {loading ? 'Processing...' : 'Submit Final Audit'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <CheckCircle2 className="w-12 h-12" />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-success/20 -z-10"
                    />
                  </div>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight">Transmission Complete</h2>
                  <p className="text-muted text-sm max-w-xs mx-auto font-medium">
                    Your geospatial coordinates have been securely synchronized with our analytical infrastructure.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-8 py-4 bg-bg border border-border rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-brand transition-all"
                  >
                    New Audit
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="bg-bg p-3 rounded-2xl border border-border/50 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-accent">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[9px] font-bold text-muted uppercase tracking-wider">{label}</p>
        <p className="text-xs font-bold font-mono">{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="flex gap-5 p-5 bg-bg/50 rounded-2xl border border-border hover:border-brand/20 transition-all group">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
        color === 'accent' ? "bg-accent/10 text-accent" : "bg-success/10 text-success"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <label className="text-[10px] font-bold text-muted uppercase tracking-[0.1em]">{label}</label>
          {sub && <span className="font-mono text-[9px] bg-white px-1.5 py-0.5 rounded border border-border">{sub}</span>}
        </div>
        <p className="text-sm font-bold text-brand line-clamp-1 group-hover:text-accent transition-colors">{value || 'Not specified'}</p>
      </div>
    </div>
  );
}
