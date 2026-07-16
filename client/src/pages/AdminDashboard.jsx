import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings, API_BASE_URL } from '../context/SettingsContext';
import { 
  RiInboxLine, RiFolderOpenLine, RiImageAddLine, 
  RiStarLine, RiSettings4Line, RiLogoutBoxRLine, RiAddLine, 
  RiDeleteBin7Line, RiEditLine, RiCheckLine, RiCloseLine
} from 'react-icons/ri';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { admin, token, login, logout } = useAuth();
  const { settings, updateSettings, fetchSettings } = useSettings();

  // Authentication states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Navigation state
  const [activeTab, setActiveTab] = useState('products'); // dashboard, products, categories, gallery, reviews, settings

  // Shared states
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  // Form states & Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', duration: 'Daily',
    category: '', dimensions: '', included: '', featured: false
  });
  const [categoryName, setCategoryName] = useState('');
  const [galleryForm, setGalleryForm] = useState({ eventName: '', location: 'Dallas, TX', category: '' });

  // Settings states
  const [settingsForm, setSettingsForm] = useState({
    phone: '', whatsapp: '', instagram: '', facebook: '', address: '', hours: ''
  });

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('key', '8451f34223c6e62555eec9187d855f8f');
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && (data.data?.display_url || data.data?.url)) {
        return data.data.display_url || data.data.url;
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error('Image upload failed', err);
      showToast('Image upload failed: ' + err.message, 'error');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchCategories();
      fetchProducts();
      fetchReviews();
      fetchGallery();
      setSettingsForm(settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin, settings]);

  // Fetch helpers
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const result = await res.json();
      if (result.success) setCategories(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const result = await res.json();
      if (result.success) setProducts(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setReviews(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery`);
      const result = await res.json();
      if (result.success) setGalleryItems(result.data);
    } catch (err) { console.error(err); }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const result = await login(username, password);
    if (!result.success) {
      setLoginError(result.message);
    }
  };

  // Product CRUD
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditProduct(prod);
      setProductForm({
        title: prod.title,
        description: prod.description,
        price: prod.price,
        duration: prod.duration || 'Daily',
        category: prod.category?._id || prod.category || '',
        dimensions: prod.dimensions || '',
        included: prod.included ? prod.included.join(', ') : '',
        featured: prod.featured || false
      });
      setUploadedImages(prod.images || []);
    } else {
      setEditProduct(null);
      setProductForm({
        title: '', description: '', price: '', duration: 'Daily',
        category: categories[0]?._id || '', dimensions: '', included: '', featured: false
      });
      setUploadedImages([]);
    }
    setIsProductModalOpen(true);
  };

  const handleProductImageChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadToImgBB(files[i]);
        if (url) {
          setUploadedImages(prev => [...prev, url]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveUploadedImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      showToast('Please upload at least one image', 'error');
      return;
    }

    try {
      const includedArray = productForm.included
        ? productForm.included.split(',').map(i => i.trim()).filter(i => i !== '')
        : [];

      const payload = {
        title: productForm.title,
        description: productForm.description,
        price: Number(productForm.price),
        duration: productForm.duration,
        category: productForm.category || categories[0]?._id,
        dimensions: productForm.dimensions,
        included: includedArray,
        featured: productForm.featured,
        images: uploadedImages
      };

      const url = editProduct 
        ? `${API_BASE_URL}/products/${editProduct._id}`
        : `${API_BASE_URL}/products`;

      const method = editProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        showToast(editProduct ? 'Product updated successfully.' : 'Product created successfully.', 'success');
        setIsProductModalOpen(false);
        fetchProducts();
      } else {
        showToast(result.message, 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        fetchProducts();
      }
    } catch (err) { console.error(err); }
  };

  // Category CRUD
  const handleCategoryCreate = async (e) => {
    e.preventDefault();
    if (!categoryName) return;
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: categoryName })
      });
      const result = await res.json();
      if (result.success) {
        setCategoryName('');
        fetchCategories();
      } else {
        alert(result.message);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        fetchCategories();
      } else {
        alert(result.message);
      }
    } catch (err) { console.error(err); }
  };

  // Gallery actions
  const handleGalleryImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadToImgBB(file);
      if (url) {
        setGalleryImageUrl(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryImageUrl) {
      showToast('Please wait for the image upload to complete', 'error');
      return;
    }

    try {
      const payload = {
        eventName: galleryForm.eventName,
        location: galleryForm.location,
        category: galleryForm.category || categories[0]?._id,
        imageUrl: galleryImageUrl
      };

      const res = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        showToast('Gallery setup photograph uploaded successfully.', 'success');
        setGalleryForm({ eventName: '', location: 'Dallas, TX', category: '' });
        setGalleryImageUrl('');
        fetchGallery();
      } else {
        showToast(result.message, 'error');
      }
    } catch (err) { 
      console.error(err); 
      showToast('Gallery item upload failed: ' + err.message, 'error');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Remove this event photo from the gallery?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        fetchGallery();
      }
    } catch (err) { console.error(err); }
  };

  // Review status
  const handleModerateReview = async (id, status, isFeatured) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, isFeatured })
      });
      const result = await res.json();
      if (result.success) {
        fetchReviews();
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        fetchReviews();
      }
    } catch (err) { console.error(err); }
  };

  // Settings save
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');
    const result = await updateSettings(settingsForm, token);
    if (result.success) {
      setMessage('Settings updated successfully.');
      fetchSettings();
    } else {
      setErrorMsg(result.message);
    }
  };

  if (!admin) {
    return (
      <div className="login-panel-page">
        <div className="login-box">
          <h2>Admin Portal Login</h2>
          <p>Sign in to configure rentals, gallery setups, and moderate reviews.</p>
          {loginError && <div className="error-badge">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-login">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          FriendlyEcors <span>Studio</span>
        </div>
        <div className="sidebar-menu">
          <button 
            className={`menu-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <RiInboxLine />
            <span>Products Catalog</span>
          </button>
          <button 
            className={`menu-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <RiFolderOpenLine />
            <span>Categories</span>
          </button>
          <button 
            className={`menu-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <RiImageAddLine />
            <span>Gallery Upload</span>
          </button>
          <button 
            className={`menu-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <RiStarLine />
            <span>Review Moderation</span>
          </button>
          <button 
            className={`menu-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <RiSettings4Line />
            <span>Store Settings</span>
          </button>
        </div>

        <button className="sidebar-logout-btn" onClick={logout}>
          <RiLogoutBoxRLine />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {message && <div className="toast-success">{message}</div>}
        {errorMsg && <div className="toast-error">{errorMsg}</div>}

        {/* 1. Products Tab */}
        {activeTab === 'products' && (
          <section className="admin-content-section">
            <div className="section-head">
              <h2>Product Rentals Catalog</h2>
              <button className="btn-add-new" onClick={() => handleOpenProductModal()}>
                <RiAddLine /> <span>Add Prop Item</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        <img 
                          src={prod.images[0]} 
                          alt={prod.title} 
                          className="table-thumbnail" 
                        />
                      </td>
                      <td className="font-semibold">{prod.title}</td>
                      <td>{prod.category?.name || 'Unassigned'}</td>
                      <td>${prod.price} / {prod.duration}</td>
                      <td>{prod.featured ? '★ Yes' : 'No'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => handleOpenProductModal(prod)}>
                            <RiEditLine size={18} />
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteProduct(prod._id)}>
                            <RiDeleteBin7Line size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 2. Categories Tab */}
        {activeTab === 'categories' && (
          <section className="admin-content-section">
            <div className="section-head">
              <h2>Category Catalog</h2>
            </div>
            
            <div className="categories-tab-layout">
              <form onSubmit={handleCategoryCreate} className="form-card-add">
                <h3>Create New Category</h3>
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Flower Walls"
                    required
                  />
                </div>
                <button type="submit" className="btn-save">Create Category</button>
              </form>

              <div className="categories-list-panel">
                <h3>Active Categories</h3>
                <div className="list-items">
                  {categories.map((cat) => (
                    <div key={cat._id} className="list-row-item">
                      <span>{cat.name} ({cat.slug})</span>
                      <button className="btn-delete-row" onClick={() => handleDeleteCategory(cat._id)}>
                        <RiDeleteBin7Line size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Gallery Tab */}
        {activeTab === 'gallery' && (
          <section className="admin-content-section">
            <div className="section-head">
              <h2>Setup Gallery Portfolios</h2>
            </div>

            <div className="gallery-tab-layout">
              <form onSubmit={handleGallerySubmit} className="form-card-add">
                <h3>Upload Event Photograph</h3>
                <div className="form-group">
                  <label>Event / Setup Title</label>
                  <input
                    type="text"
                    value={galleryForm.eventName}
                    onChange={(e) => setGalleryForm({ ...galleryForm, eventName: e.target.value })}
                    placeholder="e.g. Sarah Wedding Decor"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={galleryForm.location}
                    onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Photo File (Uploads immediately)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageChange}
                    disabled={uploading}
                    required={!galleryImageUrl}
                  />
                  {uploading && <p className="upload-indicator-text">Uploading to ImgBB...</p>}
                </div>
                {galleryImageUrl && (
                  <div className="form-group">
                    <label>Uploaded Preview</label>
                    <img src={galleryImageUrl} alt="Gallery Setup Preview" className="gallery-form-preview" />
                  </div>
                )}
                <button 
                  type="submit" 
                  className="btn-save" 
                  disabled={uploading || !galleryImageUrl}
                >
                  {uploading ? 'Uploading...' : 'Upload Setup Photo'}
                </button>
              </form>

              <div className="gallery-admin-grid">
                {galleryItems.map((item) => (
                  <div key={item._id} className="gallery-admin-card">
                    <img src={item.imageUrl} alt={item.eventName} />
                    <div className="info">
                      <h4>{item.eventName}</h4>
                      <p>{item.location}</p>
                    </div>
                    <button className="btn-delete-float" onClick={() => handleDeleteGallery(item._id)}>
                      <RiDeleteBin7Line size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. Reviews Tab */}
        {activeTab === 'reviews' && (
          <section className="admin-content-section">
            <div className="section-head">
              <h2>Review Testimonial Moderation</h2>
            </div>

            <div className="reviews-admin-list">
              {reviews.map((rev) => (
                <div key={rev._id} className={`review-mod-row ${rev.status}`}>
                  <div className="meta">
                    <h4>{rev.author}</h4>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <RiStarLine key={i} className={i < rev.rating ? 'active' : ''} />
                      ))}
                    </div>
                    <p className="comment">"{rev.comment}"</p>
                  </div>

                  <div className="controls">
                    <span className="status-label">Status: {rev.status}</span>
                    <div className="btn-group">
                      {rev.status !== 'approved' && (
                        <button className="btn-approve" onClick={() => handleModerateReview(rev._id, 'approved', rev.isFeatured)}>
                          <RiCheckLine /> Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button className="btn-reject" onClick={() => handleModerateReview(rev._id, 'rejected', rev.isFeatured)}>
                          <RiCloseLine /> Reject
                        </button>
                      )}
                      <button 
                        className={`btn-feature ${rev.isFeatured ? 'featured' : ''}`}
                        onClick={() => handleModerateReview(rev._id, rev.status, !rev.isFeatured)}
                      >
                        {rev.isFeatured ? '★ Featured' : 'Feature'}
                      </button>
                      <button className="btn-delete-row" onClick={() => handleDeleteReview(rev._id)}>
                        <RiDeleteBin7Line />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Settings Tab */}
        {activeTab === 'settings' && (
          <section className="admin-content-section">
            <div className="section-head">
              <h2>Store Contact Settings</h2>
            </div>

            <form onSubmit={handleSettingsSubmit} className="settings-form-panel">
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Contact Link</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp Number (Digits Only for wa.me redirect)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Instagram Handle (username only)</label>
                  <input
                    type="text"
                    value={settingsForm.instagram}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Facebook Page Handle</label>
                  <input
                    type="text"
                    value={settingsForm.facebook}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address / Dallas Studio Location</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Studio Business Hours</label>
                <input
                  type="text"
                  value={settingsForm.hours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hours: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-save-large">Save Studio Configurations</button>
            </form>
          </section>
        )}
      </main>

      {/* Product Detail Modal */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-box">
            <div className="modal-head">
              <h2>{editProduct ? 'Edit Prop Details' : 'Add New Rental Prop'}</h2>
              <button className="btn-close-modal" onClick={() => setIsProductModalOpen(false)}>
                <RiCloseLine size={24} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Title</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rental Price ($)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration Limit</label>
                  <input
                    type="text"
                    value={productForm.duration}
                    onChange={(e) => setProductForm({ ...productForm, duration: e.target.value })}
                    placeholder="e.g. Daily, 3-Day"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dimensions</label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    placeholder="e.g. 8ft x 8ft"
                  />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    />
                    <span>Highlight on Homepage Spotlight</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Included items (comma separated)</label>
                <input
                  type="text"
                  value={productForm.included}
                  onChange={(e) => setProductForm({ ...productForm, included: e.target.value })}
                  placeholder="e.g. Flower Wall panels, Heavy steel stand, Setup services"
                />
              </div>

              {uploadedImages.length > 0 && (
                <div className="form-group">
                  <label>Uploaded Previews (Before Saving)</label>
                  <div className="uploaded-previews-grid">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="preview-thumbnail-container">
                        <img src={img} alt="Uploaded Prop Preview" className="preview-thumbnail" />
                        <button 
                          type="button" 
                          className="btn-remove-preview" 
                          onClick={() => handleRemoveUploadedImage(idx)}
                          aria-label="Remove image"
                        >
                          <RiCloseLine size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Prop Images (Uploads immediately)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleProductImageChange}
                  disabled={uploading}
                />
                {uploading && <p className="upload-indicator-text">Uploading image(s) to ImgBB...</p>}
              </div>

              <button 
                type="submit" 
                className="btn-submit-form" 
                disabled={uploading}
              >
                {uploading ? 'Uploading Images...' : 'Save Prop Settings'}
              </button>
            </form>
          </div>
        </div>
      )}
      {toast.visible && (
        <div className={`floating-toast glass-effect ${toast.type}`}>
          <p>{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
