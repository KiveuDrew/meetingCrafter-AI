/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Clock, RefreshCcw, Loader2, ArrowRight } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { AgendaView } from './components/AgendaView';
import { parseFile } from './lib/fileParser';
import { generateAgenda, type MeetingAgenda } from './lib/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(60);
  const [isLoading, setIsLoading] = useState(false);
  const [agenda, setAgenda] = useState<MeetingAgenda | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!file) {
      setError("Please upload a document first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const content = await parseFile(file);
      const result = await generateAgenda(content, duration);
      setAgenda(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate agenda. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setAgenda(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <Sparkles size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">MeetingCrafter</span>
          </div>
          
          {agenda && (
            <button
              onClick={reset}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
            >
              <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              Build Another
            </button>
          )}
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!agenda ? (
              <motion.section
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto space-y-12"
              >
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                    Effortless agendas from your <span className="text-indigo-600">documents.</span>
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed">
                    Upload your meeting brief, project notes, or research docs. We'll extract the core topics and structure them into a timed agenda.
                  </p>
                </div>

                <div className="space-y-10">
                  <FileUploader 
                    onFileSelect={(f) => { setFile(f); setError(null); }} 
                    selectedFile={file} 
                    error={error || undefined}
                  />

                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 uppercase tracking-widest">
                      <Clock size={16} className="text-indigo-600" />
                      Meeting Duration
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex-1 space-y-4">
                        <input
                          type="range"
                          min="15"
                          max="180"
                          step="15"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>15M</span>
                          <span>45M</span>
                          <span>90M</span>
                          <span>120M</span>
                          <span>180M</span>
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <span className="text-3xl font-bold text-indigo-600">{duration}</span>
                        <span className="text-sm font-bold text-slate-400 ml-1">mins</span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!file || isLoading}
                    onClick={handleGenerate}
                    className={cn(
                      "w-full py-5 px-8 rounded-2xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3",
                      file && !isLoading
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Crafting your agenda...
                      </>
                    ) : (
                      <>
                        Generate Agenda
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="agenda"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AgendaView agenda={agenda} totalTime={duration} />
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

