import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials } from '../features/rawMaterialSlice';
import type { RootState, AppDispatch } from '../app/store';
import api from '../services/api';
import Swal from 'sweetalert2';
import { Package, Plus, Pencil, Trash2, X } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: { popup: 'rounded-2xl border border-slate-100 shadow-xl' }
});

const MaterialManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.materials);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', stockQuantity: 0 });

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', code: '', stockQuantity: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/raw-materials/${editingId}`, formData);
        Toast.fire({ icon: 'success', title: 'Material atualizado!' });
      } else {
        await api.post('/raw-materials', formData);
        Toast.fire({ icon: 'success', title: 'Material adicionado!' });
      }
      resetForm();
      dispatch(fetchMaterials());
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Erro ao salvar material.' });
    }
  };

  const handleEdit = (material: any) => {
    setEditingId(material.id);
    setFormData({
      name: material.name,
      code: material.code,
      stockQuantity: material.stockQuantity
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Excluir Material?',
      text: "Isso pode afetar produtos que dependem desta matéria-prima!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: 'rounded-[32px] p-8',
        confirmButton: 'rounded-2xl px-6 py-3 font-bold',
        cancelButton: 'rounded-2xl px-6 py-3 font-bold' }
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/raw-materials/${id}`);
        Toast.fire({ icon: 'success', title: 'Removido com sucesso!' });
        dispatch(fetchMaterials());
      } catch (error) {
        Toast.fire({ icon: 'error', title: 'Erro ao excluir material.' });
      }
    }
  };

  const materialsToRender = Array.isArray(items) ? items : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Package className="text-blue-600 h-8 w-8" /> Raw Materials Stock
          </h1>
          <p className="text-slate-500 mt-2">Manage your inventory and material requirements</p>
        </header>

        {/* FORMULÁRIO (Create/Update) */}
        <div className={`bg-white rounded-3xl shadow-xl border-t-8 transition-all duration-500 mb-10 ${editingId ? 'border-amber-500' : 'border-blue-600'}`}>
          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className={`p-3 rounded-2xl ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                {editingId ? <Pencil size={20} /> : <Plus size={20} />}
              </span>
              <h2 className="text-xl font-bold">{editingId ? 'Edit Material' : 'Add New Material'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Code</label>
                <input 
                  type="text" value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="MAT-001" 
                  className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  required 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Name</label>
                <input 
                  type="text" value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Iron Plate" 
                  className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  required 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Stock Quantity</label>
                <input 
                  type="number" value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: Number(e.target.value)})}
                  placeholder="0" 
                  className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  required 
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button type="submit" className={`flex-1 py-4 rounded-2xl font-black text-white text-lg shadow-2xl transition-all active:scale-95 ${editingId ? 'bg-amber-500 shadow-amber-200' : 'bg-blue-600 shadow-blue-200'}`}>
                {editingId ? 'Update Material' : 'Register Material'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                   <X size={18} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABELA (Read/Delete) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Inventory List</h3>
            <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase">
              {status === 'loading' ? 'Syncing...' : `${materialsToRender.length} Items`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                  <th className="px-8 py-4">Code</th>
                  <th className="px-8 py-4">Name</th>
                  <th className="px-8 py-4">Stock</th>
                  <th className="px-8 py-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {materialsToRender.map((material) => (
                  <tr key={material.id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-8 py-5 font-mono text-sm text-blue-600 font-bold">{material.code}</td>
                    <td className="px-8 py-5 font-bold text-slate-700">{material.name}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${material.stockQuantity < 5 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {material.stockQuantity} units
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(material)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(material.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialManagement;