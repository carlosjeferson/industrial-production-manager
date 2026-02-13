import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductionSuggestion } from '../features/productSlice';
import type { RootState, AppDispatch } from '../app/store';
import { 
  TrendingUp, 
  AlertCircle, 
  Box,
  ArrowRight
} from 'lucide-react';

const ProductionSuggestion: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { suggestion, status } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProductionSuggestion());
  }, [dispatch]);

  if (status === 'loading' || !suggestion) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl shadow-sm border border-slate-100 mt-8">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-500 font-medium">Calculating resource requirements...</p>
      </div>
    );
  }

  const hasSuggestions = suggestion.suggestion && suggestion.suggestion.length > 0;

  return (
    <div className="mt-12 bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50/50 p-8 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl font-bold">
              <TrendingUp size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight text-center md:text-left">
                Production Strategy
              </h2>
              <p className="text-slate-500 text-sm">Feasible products based on current inventory</p>
            </div>
          </div>

          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xl shadow-lg flex items-center gap-2">
            ${suggestion.totalValue?.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="p-8">
        {!hasSuggestions ? (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-[24px] border-2 border-dashed">
            <AlertCircle size={40} className="text-slate-300 mb-2" />
            <p className="text-slate-500 font-bold">Insufficient Stock</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestion.suggestion.map((item: any, index: number) => (
              <div key={index} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black bg-slate-800 text-white px-2 py-1 rounded mb-2 inline-block">
                      PRIORITY #{index + 1}
                    </span>
                    <h3 className="text-xl font-black text-slate-800">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Produce</p>
                    <p className="text-3xl font-black text-indigo-600 leading-none">{item.quantity}</p>
                  </div>
                </div>

                {/* LISTA DE MATERIAIS NECESSÁRIOS */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex-grow text-center">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Box size={12} /> Materials to be Consumed
                  </h4>
                  <div className="space-y-2">
                    {/* Aqui assumimos que o backend envia os materiais dentro do item da sugestão */}
                    {item.materials?.map((mat: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-200 pb-1">
                        <span className="text-slate-600 font-medium">{mat.name}</span>
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <span>{mat.requiredAmount * item.quantity}</span>
                          <span className="text-[10px] text-slate-400">total</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <span className="text-xs font-bold text-emerald-600">Unit Price: ${item.price}</span>
                  <div className="flex items-center text-indigo-500 font-bold text-xs gap-1">
                    Ready to start <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionSuggestion;