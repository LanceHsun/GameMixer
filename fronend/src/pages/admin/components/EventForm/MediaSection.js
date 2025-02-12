import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const MediaSection = ({ formData, setFormData }) => {
  const [newPictureUrl, setNewPictureUrl] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPicture = () => {
    if (newPictureUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        pictures: [...(prev.pictures || []), newPictureUrl.trim()]
      }));
      setNewPictureUrl('');
    }
  };

  const handleRemovePicture = (index) => {
    setFormData(prev => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Picture URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Main Picture URL
        </label>
        <input
          type="url"
          name="mainPicture"
          value={formData.mainPicture}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
          placeholder="https://..."
        />
      </div>

      {/* Additional Pictures */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Pictures
        </label>
        <div className="mt-1 flex space-x-2">
          <input
            type="url"
            value={newPictureUrl}
            onChange={(e) => setNewPictureUrl(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddPicture)}
            placeholder="Enter picture URL"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
          />
          <button
            type="button"
            onClick={handleAddPicture}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[#2C2C2C] bg-[#FFD200] hover:bg-[#FFE566]"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {formData.pictures.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 rounded-md border-gray-300 bg-gray-50 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => handleRemovePicture(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="mt-1 flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
            placeholder="Enter tag"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[#2C2C2C] bg-[#FFD200] hover:bg-[#FFE566]"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaSection;