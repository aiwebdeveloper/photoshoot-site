"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Sparkles, Trash2, Download, Maximize, 
  Type, Layout, Image as ImageIcon, CheckCircle2, 
  Menu, X, History, Layers, Settings, Languages 
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
  const fileInputRef = useRef(null);

  const socialSizes = [
    { label: 'Instagram Post', value: '1:1', dims: '1080x1080' },
    { label: 'TikTok/Reels', value: '9:16', dims: '1080x1920' },
    { label: 'YouTube Thumb', value: '16:9', dims: '1280x720' },
    { label: 'Facebook Cover', value: '205:76', dims: '820x312' },
  ];

  const handleUpload = (e) => {
    const filesArray = Array.from(e.target.files).slice(0, 20); // Max 20 images
    const newImages = filesArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
      status: 'uploaded',
      processed: false
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const runAICommand = async () => {
    if (!command.trim()) return;
    setIsProcessing(true);
    
    const interpretation = interpretCommand(command);
    
    try {
      if (interpretation.action === 'addText' && images.length > 0) {
        const textToSearch = command.split(' ').pop(); // Simple heuristic for text
        const updatedImages = await Promise.all(images.map(async (img) => {
          const newUrl = await addTextToImage(img.url, textToSearch);
          return { ...img, url: newUrl, processed: true, status: 'Text Added' };
        }));
        setImages(updatedImages);
      } else if (interpretation.action === 'backgroundRemoval') {
        // Simulate background removal
        setImages(prev => prev.map(img => ({ ...img, processed: true, status: 'No BG' })));
      } else if (interpretation.action === 'generateImage') {
        const newImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: `https://picsum.photos/seed/${Math.random()}/1080/1080`,
          name: 'AI Generated',
          status: 'AI Generated',
          processed: true
        };
        setImages(prev => [...prev, newImage]);
      }

      const newEntry = {
        id: Date.now(),
        command: command,
        action: interpretation.action,
        timestamp: new Date().toLocaleTimeString(),
        result: 'Command executed'
      };
      
      setHistory(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setCommand('');
      setIsProcessing(false);
    }
  };

  const deleteHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen hero-gradient text-white overflow-hidden flex flex-col">
      {/* Top Navigation */}
      <nav className="h-16 glass-morphism px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-effect">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nexus<span className="text-primary">Edit</span> AI</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button className="text-sm font-medium hover:text-primary transition-colors">Templates</button>
          <button className="text-sm font-medium hover:text-primary transition-colors">Social Sizes</button>
          <button className="text-sm font-medium hover:text-primary transition-colors">Pricing</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 glass-morphism rounded-full text-xs font-semibold">
            <Languages className="w-4 h-4" />
            <span>Urdu / Eng / Roman</span>
          </div>
          <button className="bg-primary hover:bg-opacity-90 px-4 py-2 rounded-lg text-sm font-bold transition-all glow-effect">
            Upgrade Pro
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 glass-morphism border-r border-white/10 p-4 hidden lg:flex flex-col gap-6">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Dashboard</h3>
            <div className="space-y-1">
              {['Editor', 'History', 'Assets', 'Presets'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.toLowerCase() ? 'bg-primary text-white glow-effect' : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  {tab === 'Editor' && <Layout className="w-5 h-5" />}
                  {tab === 'History' && <History className="w-5 h-5" />}
                  {tab === 'Assets' && <ImageIcon className="w-5 h-5" />}
                  {tab === 'Presets' && <Settings className="w-5 h-5" />}
                  <span className="font-medium">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10">
              <p className="text-sm font-bold mb-1">Unlimited Gen</p>
              <p className="text-xs text-gray-400 mb-3">You have 100% access to all features.</p>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-full shadow-[0_0_10px_#6366f1]"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'editor' ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto space-y-8"
              >
                {/* AI Command Center */}
                <section className="glass-morphism p-1 rounded-2xl border border-primary/30 glow-effect">
                  <div className="flex items-center gap-3 p-2">
                    <div className="flex-1 relative">
                      <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <input 
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && runAICommand()}
                        type="text" 
                        placeholder="Bolo kya krna hai? (e.g., 'Background hatao' or 'Make it professional')"
                        className="w-full bg-transparent border-none outline-none py-4 pl-12 pr-4 text-lg font-medium placeholder:text-gray-500"
                      />
                    </div>
                    <button 
                      onClick={runAICommand}
                      disabled={isProcessing}
                      className="bg-primary hover:bg-opacity-90 p-4 rounded-xl transition-all disabled:opacity-50"
                    >
                      {isProcessing ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Sparkles className="w-5 h-5" />}
                    </button>
                  </div>
                </section>

                {/* Grid of Images */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Workspace <span className="text-gray-500 text-sm font-normal ml-2">{images.length}/20 Images</span></h2>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-2 px-4 py-2 glass-morphism rounded-xl hover:bg-white/5 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Batch</span>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleUpload} 
                        multiple 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                  </div>

                  {images.length === 0 ? (
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="border-2 border-dashed border-white/10 rounded-3xl h-96 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold">Drag & Drop or Click to Upload</p>
                        <p className="text-gray-500">Supports PNG, JPG, WEBP (Max 20 images at once)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {images.map(img => (
                        <motion.div 
                          layoutId={img.id}
                          key={img.id} 
                          className="group relative aspect-square glass-morphism rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all"
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors"><Maximize className="w-4 h-4" /></button>
                              <button className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors"><Download className="w-4 h-4" /></button>
                              <button 
                                onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                                className="p-2 bg-white/10 rounded-lg hover:bg-accent transition-colors"
                              ><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{img.status}</span>
                          </div>

                          {img.processed && (
                            <div className="absolute top-2 right-2 bg-green-500 p-1 rounded-full shadow-lg">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Professional Toolset */}
                <section className="grid md:grid-cols-3 gap-6">
                  <div className="glass-morphism p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500/20 rounded-2xl"><Layers className="w-6 h-6 text-blue-400" /></div>
                      <h3 className="font-bold text-lg">Batch Editing</h3>
                    </div>
                    <p className="text-sm text-gray-400">Apply background removal or filters to all {images.length} images at once.</p>
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all border border-white/10">Apply Multi-Edit</button>
                  </div>

                  <div className="glass-morphism p-6 rounded-3xl space-y-4 text-center border-primary/20">
                    <div className="mx-auto p-3 bg-primary/20 rounded-2xl w-fit"><Sparkles className="w-6 h-6 text-primary" /></div>
                    <h3 className="font-bold text-lg">AI Smart Background</h3>
                    <p className="text-sm text-gray-400">Automatically add stylish backgrounds matching your product.</p>
                    <button className="w-full py-3 bg-primary rounded-xl font-bold transition-all glow-effect">Magic Replace</button>
                  </div>

                  <div className="glass-morphism p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-accent/20 rounded-2xl"><Type className="w-6 h-6 text-accent" /></div>
                      <h3 className="font-bold text-lg">Dynamic Text</h3>
                    </div>
                    <p className="text-sm text-gray-400">Add marketing text, prices, and labels with AI placement.</p>
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all border border-white/10">Open Text Editor</button>
                  </div>
                </section>
              </motion.div>
            ) : activeTab === 'history' ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Activity History</h2>
                  <button 
                    onClick={clearAllHistory}
                    className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                      <History className="w-16 h-16 mx-auto mb-4 opacity-10" />
                      <p>No history found. Start by giving an AI command!</p>
                    </div>
                  ) : (
                    history.map(item => (
                      <div key={item.id} className="glass-morphism p-5 rounded-2xl flex items-center justify-between group border border-white/5 hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl">
                            <Sparkles className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">"{item.command}"</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{item.timestamp}</span>
                              <span className="px-2 py-0.5 bg-white/5 rounded uppercase">{item.action}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteHistory(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-accent/20 rounded-lg transition-all text-gray-400 hover:text-accent"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        {/* Right Panel - Tools */}
        <aside className="w-80 glass-morphism border-l border-white/10 p-6 hidden xl:block space-y-8">
          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Maximize className="w-4 h-4 text-primary" />
              Social Media Sizes
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {socialSizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => setSelectedSize(size.value)}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    selectedSize === size.value ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase">{size.label}</p>
                  <p className="text-xs font-medium">{size.dims}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Ready Prompts
            </h3>
            <div className="space-y-2">
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
                  className="w-full text-left p-3 text-xs font-medium bg-white/5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all border border-white/5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 glass-morphism rounded-3xl border-primary/20 bg-primary/5">
             <h4 className="font-bold text-sm mb-2">Pro Export</h4>
             <p className="text-xs text-gray-400 mb-4">Export all processed images in high quality.</p>
             <button className="w-full py-3 bg-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
               <Download className="w-4 h-4" />
               Download All (ZIP)
             </button>
             <div className="mt-4 flex justify-between text-[10px] font-bold text-gray-500 uppercase">
               <span>Format: PNG</span>
               <span>Quality: 100%</span>
             </div>
          </div>
        </aside>
      </div>

      {/* Mobile Nav Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[100]">
        <button className="w-14 h-14 bg-primary rounded-full shadow-2xl flex items-center justify-center glow-effect">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
