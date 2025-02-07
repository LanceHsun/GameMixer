import React, { useState, useEffect, useMemo } from 'react';
import BasicInformation from './BasicInformation';
import DateTimeSection from './DateTimeSection';
import MediaSection from './MediaSection';
import ExternalLinksSection from './ExternalLinksSection';
import { X } from 'lucide-react';

const EventFormModal = ({ isOpen, onClose, event = null, onSubmit }) => {
  // 使用 useMemo 来记忆 initialFormState
  const initialFormState = useMemo(() => ({
    title: '',
    subtitle: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    mainPicture: '',
    pictures: [],
    tags: [],
    video: '',
    links: {
      registration: { title: '', url: '' },
      location: { title: '', url: '' },
      additionalInfo: []
    }
  }), []); // 空依赖数组，因为这个对象不需要变化

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      const formattedEvent = {
        ...event,
        startTime: formatDateTimeForInput(event.startTime),
        endTime: formatDateTimeForInput(event.endTime),
        tags: event.tags || [],
        pictures: event.pictures || [],
        links: event.links || initialFormState.links
      };
      setFormData(formattedEvent);
    } else {
      setFormData(initialFormState);
    }
  }, [event, isOpen, initialFormState]); // 添加 initialFormState 作为依赖

  const formatDateTimeForInput = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toISOString().slice(0, 16);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString()
      };

      // Clean up empty links
      const cleanedLinks = {
        ...(submitData.links.registration?.url && {
          registration: submitData.links.registration
        }),
        ...(submitData.links.location?.url && {
          location: submitData.links.location
        }),
        additionalInfo: submitData.links.additionalInfo.filter(
          link => link.title && link.url
        )
      };

      submitData.links = cleanedLinks;
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Close Button */}
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {event ? 'Edit Event' : 'Create New Event'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <BasicInformation
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
              
              <DateTimeSection
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />

              <MediaSection
                formData={formData}
                setFormData={setFormData}
              />

              <ExternalLinksSection
                formData={formData}
                setFormData={setFormData}
              />

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-[#2C2C2C] bg-[#FFD200] border border-transparent rounded-md hover:bg-[#FFE566] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD200] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#2C2C2C]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {event ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    event ? 'Update Event' : 'Create Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFormModal;