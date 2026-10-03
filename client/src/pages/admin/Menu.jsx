import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api, { resolveImageUrl } from '../../utils/api';

// ─── Icon options for categories ──────────────────────────────────────────────
const ICON_OPTIONS = [
  { value: 'local_cafe',      label: 'Café' },
  { value: 'coffee',          label: 'Coffee' },
  { value: 'coffee_maker',    label: 'Coffee Maker' },
  { value: 'ac_unit',         label: 'Cold / Ice' },
  { value: 'eco',             label: 'Eco / Matcha' },
  { value: 'bakery_dining',   label: 'Pastries' },
  { value: 'lunch_dining',    label: 'Savory' },
  { value: 'restaurant',      label: 'Restaurant' },
  { value: 'sports_bar',      label: 'Bar' },
  { value: 'emoji_food_beverage', label: 'Beverage' },
];

// ─── Reusable Toggle ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer
        peer-checked:after:translate-x-full peer-checked:after:border-white
        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
        after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
        peer-checked:bg-primary">
      </div>
    </label>
  );
}

// ─── STATUS TOAST ─────────────────────────────────────────────────────────────
function Toast({ status }) {
  if (!status) return null;
  const styles = {
    saving:  'bg-secondary-container text-on-secondary-container',
    saved:   'bg-tertiary-container text-on-tertiary-container',
    error:   'bg-error-container text-on-error-container',
  };
  const icons  = { saving: 'progress_activity', saved: 'check_circle', error: 'error' };
  const labels = { saving: 'Enregistrement…', saved: 'Enregistré !', error: 'Erreur' };
  return (
    <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${styles[status]}`}>
      <span className={`material-symbols-outlined text-[18px] ${status === 'saving' ? 'animate-spin' : ''}`}>
        {icons[status]}
      </span>
      <span className="font-label-md">{labels[status]}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORY MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════
function CategoryManager() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [toast, setToast] = useState('');
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', icon: 'local_cafe', order: 0,
  });

  const { data: categoriesData, isLoading } = useQuery('adminCategories', api.getAdminCategories);
  const categories = categoriesData?.categories || [];

  const showToast = (status) => {
    setToast(status);
    setTimeout(() => setToast(''), 3000);
  };

  const createMutation = useMutation(api.createCategory, {
    onSuccess: () => { queryClient.invalidateQueries('adminCategories'); closeModal(); showToast('saved'); },
    onError: () => showToast('error'),
  });

  const updateMutation = useMutation(({ id, data }) => api.updateCategory(id, data), {
    onSuccess: () => { queryClient.invalidateQueries('adminCategories'); closeModal(); showToast('saved'); },
    onError: () => showToast('error'),
  });

  const deleteMutation = useMutation(api.deleteCategory, {
    onSuccess: () => { queryClient.invalidateQueries('adminCategories'); showToast('saved'); },
    onError: () => showToast('error'),
  });

  const resetForm = () => setFormData({ name: '', slug: '', description: '', icon: 'local_cafe', order: 0 });

  const openAdd = () => { resetForm(); setEditingCategory(null); setShowModal(true); };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || 'local_cafe',
      order: cat.order,
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingCategory(null); resetForm(); };

  // Auto-generate slug from name
  const handleNameChange = (value) => {
    setFormData({
      ...formData,
      name: value,
      slug: editingCategory
        ? formData.slug
        : value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;
    showToast('saving');
    const payload = { ...formData, order: parseInt(formData.order, 10) || 0 };
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (cat) => {
    if (cat._count?.products > 0) {
      alert(`Impossible de supprimer "${cat.name}" : cette catégorie contient ${cat._count.products} produit(s).`);
      return;
    }
    if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
      deleteMutation.mutate(cat.id);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="font-body-md text-on-surface-variant">
          {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-3">
          <Toast status={toast} />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="font-label-lg">Nouvelle catégorie</span>
          </button>
        </div>
      </div>

      {/* Category list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 rounded-xl glass-effect px-5 py-4"
            >
              {/* Order badge */}
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                <span className="font-label-sm text-on-surface-variant">{cat.order}</span>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  {cat.icon || 'local_cafe'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-headline-sm text-on-surface truncate">{cat.name}</p>
                <p className="font-body-sm text-on-surface-variant truncate">
                  {cat.description || <span className="italic opacity-50">Aucune description</span>}
                </p>
              </div>

              {/* Slug chip */}
              <span className="hidden md:inline font-mono text-xs px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant shrink-0">
                /{cat.slug}
              </span>

              {/* Product count */}
              <span className="hidden sm:flex items-center gap-1 font-label-sm text-on-surface-variant shrink-0">
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                {cat._count?.products ?? 0} produits
              </span>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(cat)}
                  className="w-9 h-9 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all"
                  title="Modifier"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="w-9 h-9 rounded-lg bg-error-container hover:bg-error text-on-error-container flex items-center justify-center transition-all"
                  title="Supprimer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-xl" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-lg rounded-xl glass-effect-3 shadow-elevation-3 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-on-surface">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-surface-container-high text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ex: Cafés Froids"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant">Slug *</label>
                <div className="flex items-center gap-2 h-11 px-4 rounded-lg bg-surface-container-high focus-within:ring-2 focus-within:ring-primary">
                  <span className="font-mono text-on-surface-variant text-sm">/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="flex-1 bg-transparent text-on-surface font-mono text-sm focus:outline-none"
                    placeholder="cafes-froids"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Courte description affichée dans le menu"
                />
              </div>

              {/* Icon + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-md text-on-surface-variant">Icône</label>
                  <div className="relative">
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-high text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary pointer-events-none text-[20px]">
                      {formData.icon}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-md text-on-surface-variant">Ordre d'affichage</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-high text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-container-high/50 border border-outline-variant">
                <div className="w-9 h-9 rounded-full bg-primary-container/25 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">{formData.icon}</span>
                </div>
                <div>
                  <p className="font-label-md text-on-surface">{formData.name || 'Nom de la catégorie'}</p>
                  <p className="font-body-sm text-on-surface-variant text-xs">{formData.description || 'Description…'}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 h-11 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-label-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="flex-1 h-11 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 transition-all font-label-lg shadow-glow-primary disabled:opacity-50"
                >
                  {createMutation.isLoading || updateMutation.isLoading
                    ? 'Enregistrement…'
                    : editingCategory ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCT MANAGEMENT  (original logic, cleaned up)
// ══════════════════════════════════════════════════════════════════════════════
function ProductManager() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState('');
  const [imageFile, setImageFile] = useState(null);      // selected File object
  const [imagePreview, setImagePreview] = useState('');  // local blob URL for preview
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', categoryId: '',
    imageUrl: '', imageAlt: '', available: true, isBestSeller: false, isSpecialty: false,
  });

  const { data: productsData, isLoading } = useQuery('adminProducts', api.getAdminProducts);
  const { data: categoriesData } = useQuery('adminCategories', api.getAdminCategories);
  const products   = productsData?.products   || [];
  const categories = categoriesData?.categories || [];

  const showToast = (status) => { setToast(status); setTimeout(() => setToast(''), 3000); };

  const createMutation = useMutation(api.createProduct, {
    onSuccess: () => { queryClient.invalidateQueries('adminProducts'); closeModal(); showToast('saved'); },
    onError: () => showToast('error'),
  });

  const updateMutation = useMutation(({ id, data }) => api.updateProduct(id, data), {
    onSuccess: () => { queryClient.invalidateQueries('adminProducts'); closeModal(); showToast('saved'); },
    onError: () => showToast('error'),
  });

  const deleteMutation = useMutation(api.deleteProduct, {
    onSuccess: () => { queryClient.invalidateQueries('adminProducts'); showToast('saved'); },
    onError: () => showToast('error'),
  });

  const toggleMutation = useMutation(({ id, available }) => api.updateProduct(id, { available }), {
    onSuccess: () => queryClient.invalidateQueries('adminProducts'),
  });

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', categoryId: '',
      imageUrl: '', imageAlt: '', available: true, isBestSeller: false, isSpecialty: false,
    });
    setImageFile(null);
    setImagePreview('');
  };

  const openAdd = () => { resetForm(); setEditingProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, description: p.description, price: p.price.toString(),
      categoryId: p.categoryId, imageUrl: p.imageUrl || '', imageAlt: p.imageAlt || '',
      available: p.available, isBestSeller: p.isBestSeller, isSpecialty: p.isSpecialty,
    });
    setImageFile(null);
    // Show existing image as preview
    setImagePreview(p.imageUrl || '');
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingProduct(null); resetForm(); };

  // Handle file selection: show preview immediately, upload to server
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const localUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(localUrl);
    setImageUploading(true);

    try {
      const { imageUrl } = await api.uploadProductImage(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
      showToast('saved');
    } catch {
      showToast('error');
      setImageFile(null);
      setImagePreview(formData.imageUrl); // revert to old image
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.categoryId) return;
    if (imageUploading) return; // wait for upload to finish
    showToast('saving');
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    };
    editingProduct
      ? updateMutation.mutate({ id: editingProduct.id, data: payload })
      : createMutation.mutate(payload);
  };

  const handleDelete = (p) => {
    if (confirm(`Supprimer "${p.name}" ?`)) deleteMutation.mutate(p.id);
  };

  // blob: URLs come from URL.createObjectURL — pass through as-is
  const resolveImage = (url) => {
    if (!url) return null;
    if (url.startsWith('blob:')) return url;
    return resolveImageUrl(url);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="font-body-md text-on-surface-variant">
          {products.length} produit{products.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-3">
          <Toast status={toast} />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="font-label-lg">Nouveau produit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="rounded-lg glass-effect p-4 space-y-3">
              {product.imageUrl ? (
                <img
                  src={resolveImage(product.imageUrl)}
                  alt={product.imageAlt || product.name}
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="w-full h-40 rounded-lg bg-surface-container-high items-center justify-center"
                style={{ display: product.imageUrl ? 'none' : 'flex' }}
              >
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-30">image</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface">{product.name}</h3>
                <p className="font-body-sm text-on-surface-variant line-clamp-2">{product.description}</p>
                <p className="font-body-sm text-secondary mt-1">{product.category?.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-secondary">{product.price.toFixed(3)} TND</span>
                <Toggle
                  checked={product.available}
                  onChange={() => toggleMutation.mutate({ id: product.id, available: !product.available })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(product)}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-label-sm flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="px-3 py-2 rounded-lg bg-error-container text-on-error-container hover:bg-error transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-xl" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl glass-effect-3 shadow-elevation-3 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-on-surface">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-md text-on-surface-variant">Nom du produit *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-high text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-md text-on-surface-variant">Catégorie *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-high text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant">Prix (TND) *</label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-surface-container-high text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* ── Image upload ─────────────────────────────────────────── */}
              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant">Photo du produit</label>

                {/* Preview area */}
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface-container-high">
                    <img
                      src={resolveImage(imagePreview)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    {/* uploading overlay */}
                    {imageUploading && (
                      <div className="absolute inset-0 bg-surface-container-lowest/60 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
                        <span className="font-label-md text-on-surface">Envoi en cours…</span>
                      </div>
                    )}
                    {/* remove button */}
                    {!imageUploading && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-error-container text-on-error-container hover:bg-error flex items-center justify-center shadow transition-all"
                        title="Supprimer l'image"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    )}
                  </div>
                ) : (
                  /* Drop zone */
                  <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-high/50 hover:bg-surface-container-high cursor-pointer transition-all">
                    <span className="material-symbols-outlined text-[40px] text-on-surface-variant opacity-50">cloud_upload</span>
                    <span className="font-label-md text-on-surface-variant mt-1">Cliquer ou glisser une image</span>
                    <span className="font-body-sm text-on-surface-variant opacity-60 mt-0.5">JPG, PNG, WEBP — max 5 Mo</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}

                {/* Change photo button when preview is shown */}
                {imagePreview && !imageUploading && (
                  <label className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm cursor-pointer transition-all">
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    Changer la photo
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant">Texte alternatif image</label>
                <input
                  type="text"
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg bg-surface-container-high text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Description de l'image pour l'accessibilité"
                />
              </div>

              <div className="flex flex-wrap gap-6">
                {[
                  { key: 'available',    label: 'Disponible' },
                  { key: 'isBestSeller', label: 'Meilleure vente' },
                  { key: 'isSpecialty',  label: 'Spécialité' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                      className="w-5 h-5 rounded focus:ring-0"
                    />
                    <span className="font-label-md text-on-surface">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 h-11 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-label-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading || imageUploading}
                  className="flex-1 h-11 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 transition-all font-label-lg shadow-glow-primary disabled:opacity-50"
                >
                  {imageUploading
                    ? 'Envoi image…'
                    : createMutation.isLoading || updateMutation.isLoading
                    ? 'Enregistrement…'
                    : editingProduct ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT PAGE — Tabs: Produits | Catégories
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { key: 'products',   label: 'Produits',    icon: 'inventory_2' },
  { key: 'categories', label: 'Catégories',  icon: 'category' },
];

function Menu() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Gestion du Menu</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Gérez vos produits et catégories
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-full bg-surface-container-high/70 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-label-lg ${
              activeTab === tab.key
                ? 'bg-primary-container text-on-primary-container shadow'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {activeTab === 'products'   && <ProductManager />}
        {activeTab === 'categories' && <CategoryManager />}
      </div>
    </div>
  );
}

export default Menu;
