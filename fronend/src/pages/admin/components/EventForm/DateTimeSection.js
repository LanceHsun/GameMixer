import React from 'react';

const DateTimeSection = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Start Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Time *
        </label>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm ${
            errors.startTime ? 'border-red-500' : ''
          }`}
        />
        {errors.startTime && (
          <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
        )}
      </div>

      {/* End Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Time *
        </label>
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFD200] focus:ring-[#FFD200] sm:text-sm ${
            errors.endTime ? 'border-red-500' : ''
          }`}
        />
        {errors.endTime && (
          <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
        )}
      </div>
    </div>
  );
};

export default DateTimeSection;