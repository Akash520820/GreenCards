import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import toast, { Toaster } from 'react-hot-toast';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, categories } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    offerPrice: '',
    stock: '',
  });
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload only image files');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);

    const newFiles = [...imageFiles];
    newFiles[index] = null;
    setImageFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const filteredFiles = imageFiles.filter(Boolean);
    if (!filteredFiles.length) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('category', formData.category); // Category _id
      payload.append('price', formData.price);
      if (formData.offerPrice) payload.append('discountPrice', formData.offerPrice);
      payload.append('stock', formData.stock || 0);
      filteredFiles.forEach((file) => payload.append('images', file));

      await addProduct(payload);

      toast.success('Product added successfully! 🎉', {
        duration: 2000,
        position: 'top-center',
      });

      setFormData({ name: '', description: '', category: '', price: '', offerPrice: '', stock: '' });
      setImageFiles([null, null, null, null]);
      setImagePreviews([null, null, null, null]);

      setTimeout(() => {
        navigate('/seller/inventory');
      }, 1000);
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error(err.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <Toaster />

      <div className="add-product-header">
        <h1 className="add-product-title">Add New Product</h1>
        <p className="add-product-subtitle">Add your product details and images</p>
      </div>

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-section">
          <label className="form-label">Product Images (Max 4)</label>
          <div className="image-upload-grid">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="image-upload-box">
                {preview ? (
                  <div className="image-preview-container">
                    <img src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <i className="bi bi-x-circle-fill" aria-hidden="true"></i>
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="file-input"
                    />
                    <i className="bi bi-cloud-upload upload-icon"></i>
                    <span className="upload-text">Upload</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Type here"
            className="form-input"
            required
          />
        </div>

        <div className="form-section">
          <label htmlFor="description" className="form-label">Product Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Type here"
            className="form-textarea"
            rows="4"
          ></textarea>
        </div>

        <div className="form-section">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {categories.length === 0 && (
            <small className="text-muted d-block mt-1">
              No categories yet — create one from your database/admin tools first.
            </small>
          )}
        </div>

        <div className="form-row">
          <div className="form-section form-section-half">
            <label htmlFor="price" className="form-label">Product Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0"
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-section form-section-half">
            <label htmlFor="offerPrice" className="form-label">Offer Price</label>
            <input
              type="number"
              id="offerPrice"
              name="offerPrice"
              value={formData.offerPrice}
              onChange={handleInputChange}
              placeholder="0"
              className="form-input"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="stock" className="form-label">Stock Quantity</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="0"
            className="form-input"
            min="0"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Adding Product...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
