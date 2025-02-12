import React, { useState } from 'react';
import { contactService } from '../../../../services/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const categories = [
    'Sponsors and Partners',
    'Donation',
    'Membership',
    'Volunteers',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (!formData.category) newErrors.category = 'Please select a category';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await contactService.submitContactForm(formData);
      
      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent successfully! We will contact you soon.'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: '',
        category: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-gradient-to-b from-[#FAF6F0] to-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#2C2C2C] text-center mb-6">CONTACT</h2>
        
        <div className="text-center mb-6">
          <p className="text-lg text-[#2C2C2C]">Santa Clara, CA, USA</p>
          <a href="mailto:admin@game-mixer.org" className="text-lg text-[#6B90FF] hover:underline">
            admin@game-mixer.org
          </a>
        </div>

        {submitStatus.message && (
          <div className={`mb-4 p-4 rounded ${
            submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2.5 border-b-2 bg-transparent focus:outline-none transition-colors
                ${errors.name ? 'border-red-500' : 'border-[#2C2C2C]/20 focus:border-[#6B90FF]'}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2.5 border-b-2 bg-transparent focus:outline-none transition-colors
                ${errors.email ? 'border-red-500' : 'border-[#2C2C2C]/20 focus:border-[#6B90FF]'}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2.5 border-b-2 bg-transparent focus:outline-none transition-colors
                ${errors.message ? 'border-red-500' : 'border-[#2C2C2C]/20 focus:border-[#6B90FF]'}`}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2.5 border-b-2 bg-transparent focus:outline-none transition-colors
                ${errors.category ? 'border-red-500' : 'border-[#2C2C2C]/20 focus:border-[#6B90FF]'}
                ${!formData.category ? 'text-[#2C2C2C]/50' : 'text-[#2C2C2C]'}`}
            >
              <option value="" disabled>Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#FFD200] text-[#2C2C2C] px-10 py-2.5 rounded-lg font-bold 
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFE566]'} 
                transition-colors`}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;