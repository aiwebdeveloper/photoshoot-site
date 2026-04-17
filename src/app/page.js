"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Sparkles, Trash2, Download, Maximize, 
  Type, Layout, Image as ImageIcon, CheckCircle2, 
  Menu, X, History, Layers, Settings, Languages,
  Mic, Sliders, Monitor, Share2, Save
} from 'lucide-react';
import { interpretCommand, getResponse } from '@/lib/multilingual-ai';
import { resizeImage, addTextToImage } from '@/lib/image-utils';

export default function PhotoProStudio() {
  const [images, setImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedSize, setSelectedSize] = useState('1:1');
  const [exportFormat, setExportFormat] = useState('PNG');
  const [exportQuality, setExportQuality] = useState('100%');
  const fileInputRef = useRef(null);

  const socialSizes = [
    { label: 'Instagram Post', value: '1:1', dims: '1080x1080' },
    { label: 'TikTok/Reels', value: '9:16', dims: '1080x1920' },
    { label: 'YouTube Thumb', value: '16:9', dims: '1280x720' },
    { label: 'Facebook Cover', value: '205:76', dims: '820x312' },
  ];

  const handleUpload = (e) => {
    const filesArray = Array.from(e.target.files).slice(0, 20);
    const newImages = filesArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
      status: 'Uploaded',
      processed: false,
      style: 'Normal'
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const runAICommand = async (manualCommand = null) => {
    const targetCommand = manualCommand || command;
    if (!targetCommand.trim()) return;
    setIsProcessing(true);
    
    const interpretation = interpretCommand(targetCommand);
    
    try {
      if (interpretation.action === 'addText' && images.length > 0) {
        const textToSearch = targetCommand.split(' ').pop();
        const updatedImages = await Promise.all(images.map(async (img) => {
          const newUrl = await addTextToImage(img.url, textToSearch);
          return { ...img, url: newUrl, processed: true, status: 'Text Added' };
        }));
        setImages(updatedImages);
      } else if (interpretation.action === 'backgroundRemoval') {
        setImages(prev => prev.map(img => ({ ...img, processed: true, status: 'No Background' })));
      } else if (interpretation.action === 'generateImage') {
        const newImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: `https://picsum.photos/seed/${Math.random()}/1080/1080`,
          name: 'AI Generated',
          status: 'AI Generated',
          processed: true,
          style: 'Cinematic'
        };
        setImages(prev => [...prev, newImage]);
      } else if (interpretation.action === 'professionalStyle') {
        setImages(prev => prev.map(img => ({ ...img, processed: true, style: 'Professional', status: 'Enhanced' })));
      } else if (interpretation.action === 'resize') {
        setImages(prev => prev.map(img => ({ ...img, status: 'Resized' })));
      }

      const newEntry = {
        id: Date.now(),
        command: targetCommand,
        action: interpretation.action,
        timestamp: new Date().toLocaleTimeString(),
        result: 'Success'
      };
      
      setHistory(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      if (!manualCommand) setCommand('');
      setIsProcessing(false);
    }
  };

  const clearHistory = (id = null) => {
    if (id) {
      setHistory(prev => prev.filter(i => i.id !== id));
    } else {
      setHistory([]);
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0c] text-white overflow-hidden flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* Premium Navigation */}
      <nav className="h-20 glass-morphism px-8 flex items-center justify-between z-50 border-b border-white/5 shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <motion.div 
            onClick={() => setActiveTab('editor')}
            whileHover={{ rotate: 180 }}
            className="w-12 h-12 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center glow-effect shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer"
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Nexus<span className="text-primary not-italic">Edit</span></span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">AI Studio Live</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <button onClick={() => setActiveTab('editor')} className="text-sm font-bold text-gray-400 hover:text-white transition-all uppercase tracking-wide">Studio</button>
          <button onClick={() => setActiveTab('history')} className="text-sm font-bold text-gray-400 hover:text-white transition-all uppercase tracking-wide">History</button>
          <button className="text-sm font-bold text-gray-400 hover:text-white transition-all uppercase tracking-wide">Templates</button>
        </div>

        <div className="flex items-center gap-6">
          {activeTab !== 'editor' && (
            <button 
              onClick={() => setActiveTab('editor')}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold uppercase hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
              <span>Back to Editor</span>
            </button>
          )}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
            <Languages className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase">UR / EN / ROM</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Modern Sidebar */}
        <aside className="w-24 lg:w-72 glass-morphism border-r border-white/5 p-6 flex flex-col gap-8">
          <div className="space-y-2">
            <h3 className="hidden lg:block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Main Menu</h3>
            {[
              { id: 'editor', icon: Layout, label: 'Studio' },
              { id: 'history', icon: History, label: 'History' },
              { id: 'assets', icon: ImageIcon, label: 'Vault' },
              { id: 'settings', icon: Settings, label: 'Config' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                  activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="hidden lg:block font-bold text-sm tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto hidden lg:block">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
              <p className="text-xs font-black uppercase text-primary mb-2 tracking-widest">AI Power</p>
              <h4 className="text-sm font-bold mb-4">Unlimited Gen Active</h4>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-full bg-primary shadow-[0_0_15px_#6366f1]"
                ></motion.div>
              </div>
            </div>
          </div>
        </aside>

        {/* Studio Workspace */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'editor' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-7xl mx-auto space-y-12"
              >
                {/* AI Instruction Bar - ENHANCED */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">AI Instructions Assistant</h2>
                  </div>
                  <section className="bg-white/5 p-1.5 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-primary/50 transition-all">
                    <div className="flex items-center gap-4 px-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-gray-400" />
                      </div>
                      <input 
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && runAICommand()}
                        type="text" 
                        placeholder="Mery command urdu, english, roman urdu main smjhy... (e.g. 'Background hatao')"
                        className="flex-1 bg-transparent border-none outline-none py-6 text-xl font-medium placeholder:text-gray-600"
                      />
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => runAICommand()}
                        disabled={isProcessing}
                        className="bg-primary hover:bg-primary/80 px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
                      >
                        {isProcessing ? "Processing..." : (
                          <>
                            <span>Run Magic</span>
                            <Sparkles className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </section>
                </div>

                {/* Batch Workspace */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-black italic tracking-tighter uppercase">Canvas</h2>
                      <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-500 border border-white/10 uppercase">
                        {images.length} / 20 Images
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setImages([])}
                        className="text-xs font-bold text-gray-500 hover:text-accent transition-all uppercase"
                      >Clear All</button>
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Batch</span>
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleUpload} multiple className="hidden" accept="image/*" />
                    </div>
                  </div>

                  {images.length === 0 ? (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      onClick={() => fileInputRef.current.click()}
                      className="h-[500px] border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] flex flex-col items-center justify-center gap-8 cursor-pointer group transition-all hover:border-primary/30"
                    >
                      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center group-hover:bg-primary/10 transition-all">
                        <Upload className="w-10 h-10 text-gray-500 group-hover:text-primary group-hover:scale-125 transition-all" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-2xl font-black uppercase tracking-widest">Drop up to 20 images</p>
                        <p className="text-gray-500 font-medium">PNG, JPG, WEBP • Professional Studio Quality</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {images.map(img => (
                        <motion.div 
                          layoutId={img.id}
                          key={img.id}
                          className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 shadow-2xl"
                        >
                          <img src={img.url} alt={img.name} className={`w-full h-full object-cover transition-all duration-700 ${img.style === 'Professional' ? 'contrast-125 brightness-110 saturate-110' : ''}`} />
                          
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4 p-6 backdrop-blur-sm">
                             <div className="flex items-center gap-3">
                               <button className="p-3 bg-white/10 rounded-xl hover:bg-primary transition-all"><Download className="w-5 h-5" /></button>
                               <button className="p-3 bg-white/10 rounded-xl hover:bg-primary transition-all"><Maximize className="w-5 h-5" /></button>
                               <button 
                                 onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                                 className="p-3 bg-white/10 rounded-xl hover:bg-accent transition-all"
                               ><Trash2 className="w-5 h-5" /></button>
                             </div>
                             <div className="text-center">
                               <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">{img.status}</p>
                               <p className="text-[10px] font-bold text-gray-500 uppercase">{img.style} Style</p>
                             </div>
                          </div>

                          {img.processed && (
                            <div className="absolute top-4 right-4 bg-primary p-2 rounded-full shadow-[0_0_15px_#6366f1]">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Action Tools */}
                <section className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: Layers, title: 'Apply to All', desc: 'Process all images with the current AI instruction.', color: 'blue', action: () => runAICommand() },
                    { icon: Sparkles, title: 'AI Backgrounds', desc: 'Auto-replace backgrounds with stylish studio settings.', color: 'purple', action: () => runAICommand('Background hatao') },
                    { icon: Sliders, title: 'Pro Enhancer', desc: 'Auto color correction, lighting, and quality boost.', color: 'green', action: () => runAICommand('Professional banao') }
                  ].map((tool, idx) => (
                    <button 
                      key={idx}
                      onClick={tool.action}
                      className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 text-left transition-all hover:translate-y-[-10px] shadow-xl"
                    >
                      <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-${tool.color}-500/20 group-hover:scale-110 transition-transform`}>
                        <tool.icon className={`w-7 h-7 text-${tool.color}-400`} />
                      </div>
                      <h3 className="text-xl font-black mb-2 uppercase tracking-tight italic">{tool.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                    </button>
                  ))}
                </section>
              </motion.div>
            ) : activeTab === 'history' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setActiveTab('editor')}
                        className="p-3 bg-white/5 rounded-2xl hover:bg-primary transition-all border border-white/10 group"
                      >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                      </button>
                      <h2 className="text-4xl font-black italic uppercase tracking-tighter">Activity</h2>
                    </div>
                    <button onClick={() => clearHistory()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase hover:text-accent transition-all">Flush History</button>
                 </div>
                 <div className="space-y-4">
                    {history.length === 0 ? (
                      <div className="text-center py-40 opacity-20"><History className="w-20 h-20 mx-auto" /></div>
                    ) : (
                      history.map(item => (
                        <div key={item.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center"><Sparkles className="w-5 h-5 text-primary" /></div>
                             <div>
                               <p className="text-lg font-bold italic">"{item.command}"</p>
                               <div className="flex items-center gap-4 text-[10px] font-black uppercase text-gray-500 mt-1">
                                 <span>{item.timestamp}</span>
                                 <span className="text-primary">{item.action}</span>
                               </div>
                             </div>
                          </div>
                          <button onClick={() => clearHistory(item.id)} className="opacity-0 group-hover:opacity-100 p-3 hover:bg-accent/20 rounded-xl transition-all"><Trash2 className="w-5 h-5 text-accent" /></button>
                        </div>
                      ))
                    )}
                 </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        {/* Pro Control Panel */}
        <aside className="w-96 glass-morphism border-l border-white/5 p-8 hidden xl:block space-y-12">
          {/* Social Presets */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Monitor className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Social Presets</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {socialSizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => { setSelectedSize(size.value); runAICommand(`Resize to ${size.dims}`); }}
                  className={`p-5 rounded-3xl border transition-all text-left flex items-center justify-between group ${
                    selectedSize === size.value ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div>
                    <p className="text-xs font-black uppercase mb-1 tracking-wider">{size.label}</p>
                    <p className="text-[10px] font-bold text-gray-500">{size.dims} PX</p>
                  </div>
                  <Share2 className={`w-4 h-4 transition-all ${selectedSize === size.value ? 'text-primary' : 'text-gray-600 group-hover:text-white'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Sizing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Maximize className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Custom Dimensions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-600 uppercase">Width</p>
                <input type="number" placeholder="1080" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-600 uppercase">Height</p>
                <input type="number" placeholder="1080" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none transition-all" />
              </div>
            </div>
            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-primary transition-all">Apply Custom Size</button>
          </div>

          {/* Ready to Use Prompts */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ready to Use Prompts</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Professional Amazon Listing',
                'Cinematic Forest Background',
                'Minimalist Studio White',
                'Cyberpunk Neon Style',
                'Luxury Marble Background'
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => setCommand(prompt)}
                  className="px-4 py-2 text-[10px] font-black uppercase bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Export Settings */}
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 space-y-8 shadow-2xl">
             <div className="flex items-center justify-between">
                <h4 className="font-black italic uppercase tracking-tighter text-lg">Export Pro</h4>
                <div className="p-2 bg-primary rounded-xl"><Download className="w-5 h-5" /></div>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Format</p>
                   <div className="flex gap-2">
                      {['PNG', 'JPG', 'WEBP'].map(f => (
                        <button key={f} onClick={() => setExportFormat(f)} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${exportFormat === f ? 'bg-primary border-primary' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>{f}</button>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quality</p>
                   <div className="flex gap-2">
                      {['HD', '2K', '4K'].map(q => (
                        <button key={q} onClick={() => setExportQuality(q)} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${exportQuality === q ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>{q}</button>
                      ))}
                   </div>
                </div>
             </div>

             <button className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3">
               <span>Process & Save</span>
               <Save className="w-4 h-4" />
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
