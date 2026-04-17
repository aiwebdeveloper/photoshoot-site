"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Trash2, Download, Maximize, 
  History, Languages, Mic, Camera, 
  ArrowRight, Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import { interpretCommand } from '@/lib/multilingual-ai';

export default function PhotoshootGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generations, setGenerations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState('generator'); // 'generator' or 'history'

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    // Simulate AI Generation
    setTimeout(() => {
      const interpretation = interpretCommand(prompt);
      const newImage = {
        id: Date.now(),
        url: `https://picsum.photos/seed/${Math.random()}/1080/1080`,
        prompt: prompt,
        timestamp: new Date().toLocaleTimeString(),
        type: interpretation.action === 'backgroundRemoval' ? 'Product Photoshoot' : 'AI Generation'
      };
      
      setGenerations(prev => [newImage, ...prev]);
      setPrompt('');
      setIsGenerating(false);
    }, 3000);
  };

  const deleteGen = (id) => {
    setGenerations(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="h-screen bg-[#050505] text-white overflow-hidden flex flex-col font-sans">
      {/* Sleek Header */}
      <nav className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-effect shadow-primary/20">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">Photo<span className="text-primary not-italic">Gen</span> AI</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView(view === 'generator' ? 'history' : 'generator')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-xs font-black uppercase hover:bg-white/10 transition-all"
          >
            {view === 'generator' ? <History className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            <span>{view === 'generator' ? 'History' : 'Generator'}</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Languages className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pakistani Languages Active</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

        <AnimatePresence mode="wait">
          {view === 'generator' ? (
            <motion.div 
              key="gen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto px-6 py-12 lg:py-24 space-y-16"
            >
              <div className="text-center space-y-4">
                <motion.h1 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-5xl lg:text-7xl font-black tracking-tight uppercase italic leading-none"
                >
                  Unlimited <span className="text-primary not-italic">Photoshoot</span> <br /> Generation
                </motion.h1>
                <p className="text-gray-500 font-medium text-lg lg:text-xl">Understand Urdu, Roman Urdu, and English instructions instantly.</p>
              </div>

              {/* Central Input Hub */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[3rem] blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
                <section className="relative bg-[#0a0a0a] p-2 rounded-[3rem] border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-4 px-6">
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Mic className="w-6 h-6 text-primary" />
                    </div>
                    <input 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      type="text" 
                      placeholder="Likho kya generate krna ha? (e.g. 'Red car ka photoshoot' or 'Model in studio')"
                      className="flex-1 bg-transparent border-none outline-none py-8 text-xl lg:text-2xl font-medium placeholder:text-gray-700"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="bg-primary px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl shadow-primary/40 disabled:opacity-50 transition-all"
                    >
                      {isGenerating ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Generate</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </section>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'Amazon Product Background Removal',
                  'E-commerce Studio Lighting',
                  'Model in Modern Room',
                  'Stylish Product Photography',
                  'Background Hatao aur Professional banao'
                ].map(s => (
                  <button 
                    key={s}
                    onClick={() => setPrompt(s)}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase hover:bg-white/10 hover:border-primary/50 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Last Generated Preview */}
              {generations.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 pt-12"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">New Creation</h2>
                    <div className="flex items-center gap-3">
                      <button className="p-3 bg-white/5 rounded-2xl hover:bg-primary transition-all"><Download className="w-5 h-5" /></button>
                      <button className="p-3 bg-white/5 rounded-2xl hover:bg-primary transition-all"><Maximize className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="aspect-video lg:aspect-square max-h-[600px] w-full bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                    <img src={generations[0].url} className="w-full h-full object-cover" alt="Generated" />
                    <div className="absolute bottom-8 left-8 p-6 glass-morphism rounded-3xl border border-white/10 max-w-md">
                       <p className="text-xs font-black uppercase text-primary mb-1 tracking-widest">{generations[0].type}</p>
                       <p className="text-lg font-bold italic line-clamp-2">"{generations[0].prompt}"</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-12"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Your Creations</h2>
                <div className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold uppercase border border-white/10">
                  {generations.length} Photoshoots
                </div>
              </div>

              {generations.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center opacity-20 gap-4">
                  <ImageIcon className="w-20 h-20" />
                  <p className="text-xl font-bold uppercase tracking-widest">No history yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {generations.map(gen => (
                    <motion.div 
                      key={gen.id}
                      layoutId={gen.id}
                      className="group relative aspect-square rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 shadow-2xl"
                    >
                      <img src={gen.url} className="w-full h-full object-cover" alt={gen.prompt} />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4 p-8 backdrop-blur-md">
                        <p className="text-center font-bold italic line-clamp-3">"{gen.prompt}"</p>
                        <div className="flex items-center gap-3">
                          <button className="p-4 bg-white/10 rounded-2xl hover:bg-primary transition-all"><Download className="w-6 h-6" /></button>
                          <button onClick={() => deleteGen(gen.id)} className="p-4 bg-white/10 rounded-2xl hover:bg-accent transition-all"><Trash2 className="w-6 h-6" /></button>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-4">{gen.timestamp}</span>
                      </div>
                      <div className="absolute top-6 right-6 bg-primary/20 backdrop-blur-md p-2 rounded-full border border-primary/30">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="h-12 border-t border-white/5 flex items-center justify-center bg-black/60 shrink-0">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Powered by PhotoGen AI • Professional Pakistani Model Integration</p>
      </footer>
    </div>
  );
}
