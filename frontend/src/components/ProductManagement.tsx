import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchProducts, fetchProductionSuggestion } from '../features/productSlice';
import api from '../services/api';
import Swal from 'sweetalert2';

const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-2xl border border-slate-100 shadow-xl'
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const ProductManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: materials } = useSelector((state: RootState) => state.materials);
  const { items: products, status } = useSelector((state: RootState) => state.products);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [selectedMaterials, setSelectedMaterials] = useState<{rawMaterialId: string, requiredAmount: number}[]>([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const resetForm = () => {
    setEditingId(null);
    setCode(''); setName(''); setPrice(''); setSelectedMaterials([]);
  };

  const addMaterial = (id: string) => {
    if (!id || selectedMaterials.find(m => m.rawMaterialId === id)) return;
    setSelectedMaterials([...selectedMaterials, { rawMaterialId: id, requiredAmount: 1 }]);
  };

  const removeMaterial = (id: string) => {
    setSelectedMaterials(selectedMaterials.filter(m => m.rawMaterialId !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { code, name, price: Number(price), materials: selectedMaterials };
    
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        Toast.fire({ icon: 'success', title: 'Produto atualizado!' });
      } else {
        await api.post('/products', payload);
        Toast.fire({ icon: 'success', title: 'Produto cadastrado!' });
      }
      resetForm();
      dispatch(fetchProducts());
      dispatch(fetchProductionSuggestion());
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Erro ao salvar produto.' });
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setCode(product.code);
    setName(product.name);
    setPrice(product.price);

    setSelectedMaterials(product.materials.map((m: any) => ({
      rawMaterialId: m.rawMaterialId || m.rawMaterial?.id, 
      requiredAmount: m.requiredAmount
    })));

    Toast.fire({ icon: 'info', title: `Editando: ${product.name}` });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Esta ação removerá o produto permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-[32px] p-8',
        confirmButton: 'rounded-2xl px-6 py-3 font-bold',
        cancelButton: 'rounded-2xl px-6 py-3 font-bold'
      }
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        Toast.fire({ icon: 'success', title: 'Produto removido!' });
        dispatch(fetchProducts());
        dispatch(fetchProductionSuggestion());
      } catch (error) {
        Toast.fire({ icon: 'error', title: 'Erro ao excluir produto.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900 relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Product Management</h1>
          <p className="text-slate-500 mt-2">Create, edit and organize your factory products</p>
        </div>

        {/* Formulário Profissional */}
        <div className={`bg-white rounded-3xl shadow-xl border-t-8 transition-all duration-500 mb-10 ${editingId ? 'border-amber-500' : 'border-indigo-600'}`}>
          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className={`p-3 rounded-2xl ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {editingId ? <IconEdit /> : <IconPlus />}
              </span>
              <h2 className="text-xl font-bold">{editingId ? 'Update Product Data' : 'Add New Product'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Unique Code</label>
                <input value={code} onChange={e => setCode(e.target.value)} required placeholder="e.g. PRD-001" className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Product Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Luxury Sofa" className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Price ($)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.00" className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
              </div>
            </div>

            {/* Seção de Materiais */}
            <div className="mt-10 p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="font-bold text-slate-800">Materials Needed</h3>
                <select 
                  className="w-full md:w-auto px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-indigo-500 cursor-pointer shadow-sm" 
                  onChange={(e) => { addMaterial(e.target.value); e.target.value = ""; }} 
                  defaultValue=""
                >
                  <option value="" disabled>+ Choose Material</option>
                  {materials.map((m: any) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedMaterials.length === 0 ? (
                  <p className="col-span-full py-4 text-center text-slate-400 italic text-sm">No materials added yet.</p>
                ) : (
                  selectedMaterials.map((sm, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                      <span className="font-bold text-slate-700">{materials.find((m: any) => m.id === sm.rawMaterialId)?.name || 'Loading...'}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase font-black text-slate-300">Qty</span>
                          <input 
                            type="number" className="w-14 text-center font-bold text-indigo-600 border-b-2 border-indigo-100 outline-none" 
                            value={sm.requiredAmount} 
                            onChange={(e) => {
                              const newMals = [...selectedMaterials];
                              newMals[index] = { ...newMals[index], requiredAmount: Number(e.target.value) };
                              setSelectedMaterials(newMals);
                            }} 
                          />
                        </div>
                        <button type="button" onClick={() => removeMaterial(sm.rawMaterialId)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-all"><IconClose /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button type="submit" className={`flex-1 py-4 rounded-2xl font-black text-white text-lg shadow-2xl transition-all active:scale-95 ${editingId ? 'bg-amber-500 shadow-amber-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
                {editingId ? 'Save Changes' : 'Register Product'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Tabela de Listagem */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Product Inventory</h3>
            <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase">
              {status === 'loading' ? 'Syncing...' : `${products.length} Products`}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                  <th className="px-8 py-4">Code</th>
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 && status !== 'loading' ? (
                  <tr><td colSpan={3} className="px-8 py-10 text-center text-slate-400 italic">No products found.</td></tr>
                ) : (
                  products.map((p: any) => (
                    <tr key={p.id} className="hover:bg-indigo-50/20 transition-all group">
                      <td className="px-8 py-5 font-mono text-sm text-indigo-500 font-bold">{p.code}</td>
                      <td className="px-8 py-5 font-bold text-slate-700">{p.name}</td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center gap-2 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(p)} title="Edit" className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100">
                            <IconEdit />
                          </button>
                          <button onClick={() => handleDelete(p.id)} title="Delete" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;