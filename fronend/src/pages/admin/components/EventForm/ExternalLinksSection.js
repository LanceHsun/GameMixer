import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ExternalLinksSection = ({ formData, setFormData }) => {
  const handleLinkChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [type]: {
          ...prev.links[type],
          [field]: value
        }
      }
    }));
  };

  const handleAddAdditionalLink = () => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        additionalInfo: [
          ...prev.links.additionalInfo,
          { title: '', url: '' }
        ]
      }
    }));
  };

  const handleAdditionalLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        additionalInfo: prev.links.additionalInfo.map((link, i) => 
          i === index ? { ...link, [field]: value } : link
        )
      }
    }));
  };

  const handleRemoveAdditionalLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        additionalInfo: prev.links.additionalInfo.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">External Links</h4>
      
      {/* Registration Link */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Registration Link Title
          </label>
          <input
            type="text"
            value={formData.links.registration.title}
            onChange={(e) => handleLinkChange('registration', 'title', e.target.value)}
            placeholder="E.g., Register Now"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Registration URL
          </label>
          <input
            type="url"
            value={formData.links.registration.url}
            onChange={(e) => handleLinkChange('registration', 'url', e.target.value)}
            placeholder="https://"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
          />
        </div>
      </div>

      {/* Location Link */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location Link Title
          </label>
          <input
            type="text"
            value={formData.links.location.title}
            onChange={(e) => handleLinkChange('location', 'title', e.target.value)}
            placeholder="E.g., View on Map"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location URL
          </label>
          <input
            type="url"
            value={formData.links.location.url}
            onChange={(e) => handleLinkChange('location', 'url', e.target.value)}
            placeholder="https://"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
          />
        </div>
      </div>

      {/* Additional Links */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h5 className="text-sm font-medium text-gray-700">Additional Links</h5>
          <button
            type="button"
            onClick={handleAddAdditionalLink}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-[#2C2C2C] bg-[#FFD200] hover:bg-[#FFE566]"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </button>
        </div>

        {formData.links.additionalInfo.map((link, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 relative">
            <div>
              <input
                type="text"
                value={link.title}
                onChange={(e) => handleAdditionalLinkChange(index, 'title', e.target.value)}
                placeholder="Link Title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={link.url}
                onChange={(e) => handleAdditionalLinkChange(index, 'url', e.target.value)}
                placeholder="https://"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveAdditionalLink(index)}
                className="mt-1 p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalLinksSection;