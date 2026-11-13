import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/category.service';
import { ProductCategory } from '../../types';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../services/api';
import { FolderTree, Plus, Edit, Trash2, Loader2, X, AlertCircle } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('products.create');
  const canUpdate = hasPermission('products.update');
  const canDelete = hasPermission('products.delete');

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const cats = await categoryService.list();
      setCategories(cats);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIsActive(cat.is_active === 1);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          is_active: isActive,
        });
      } else {
        await categoryService.create({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          is_active: isActive,
        });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta categoria?')) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Categorias de Produtos
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Organize os materiais educativos e temas do catálogo.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={openCreateModal}
            className="candy-button bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-candy"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>NOVA CATEGORIA</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy mb-2" />
            <p className="text-xs font-bold">Carregando categorias...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <FolderTree className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Nenhuma categoria cadastrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Nome</th>
                  <th className="py-4 px-4">Identificador (Slug)</th>
                  <th className="py-4 px-4">Descrição</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Criado em</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-brand-navy">
                      {c.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                      {c.slug}
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                      {c.description || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        c.is_active === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.is_active === 1 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {c.is_active === 1 ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-medium">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {canUpdate && (
                          <button
                            onClick={() => openEditModal(c)}
                            title="Editar Categoria"
                            className="p-2 rounded-xl text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(c.id)}
                            title="Excluir"
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Modal (Create / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-brand-navy text-lg">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Alfabetização Infantil"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                />
              </div>

              <div>
                <label className="block mb-1">Slug (Identificador URL opcional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="alfabetizacao-infantil"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição da categoria..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-brand-pink rounded focus:ring-brand-pink"
                />
                <label htmlFor="cat-active" className="cursor-pointer">
                  Categoria Ativa no Catálogo
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="candy-button px-6 py-2.5 rounded-xl bg-brand-yellow text-brand-navy font-black disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
