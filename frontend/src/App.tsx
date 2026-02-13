import React from 'react';
import MaterialManagement from './components/MaterialManagement';
import ProductManagement from './components/ProductManagement';
import ProductionSuggestion from './components/ProductionSuggestion';

const App: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 scroll-smooth">
      <nav className="bg-indigo-700 p-4 shadow-lg sticky top-0 z-[60]">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-black text-xl tracking-tighter uppercase italic">Industrial ERP</h1>
          </div>
          <div className="hidden md:flex gap-6 text-indigo-100 text-xs font-bold uppercase tracking-widest">
            <a href="#suggestions" className="hover:text-white transition-colors">Sugestões</a>
            <a href="#materials" className="hover:text-white transition-colors">Matérias-Primas</a>
            <a href="#products" className="hover:text-white transition-colors">Produtos</a>
          </div>
          <span className="text-indigo-200 text-[10px] font-black bg-indigo-800 px-3 py-1 rounded-full border border-indigo-600">
            v2026.1.0
          </span>
        </div>
      </nav>

      <main className="space-y-16 mt-8">
        <section id="suggestions" className="scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 md:px-0">
             <ProductionSuggestion />
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-slate-200 w-full" />
        </div>

        <section id="materials" className="scroll-mt-24">
          <MaterialManagement />
        </section>

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-slate-200 w-full" />
        </div>

        <section id="products" className="scroll-mt-24">
          <ProductManagement />
        </section>
      </main>

      <footer className="mt-20 py-12 text-center border-t border-slate-200 bg-white">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Industrial Management Systems
        </p>
        <p className="text-slate-600 font-bold mt-2">Carlos Jeferson Jacinto da Silva</p>
        <p className="text-slate-400 text-[10px] mt-1">UFC - Sistemas de Informação - 2026</p>
      </footer>
    </div>
  );
};

export default App;