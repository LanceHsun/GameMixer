// src/services/api.js
import { paths } from '../config/paths';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Auth APIs
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  }
};

// Helper functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export default authAPI;



export const contactService = {
  // Submit contact form with email notifications
  async submitContactForm(formData) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        category: formData.category,
        notifications: {
          user: {
            subject: 'Thank you for contacting Game Mixer',
            template: 'contact-confirmation',
            data: {
              name: formData.name,
              email: formData.email,
              message: formData.message,
              category: `**${formData.category}**`,
              baseUrl: paths.BASE_PATH
            }
          },
          admin: {
            subject: 'New Contact Form Submission',
            template: 'admin-notification',
            data: {
              name: formData.name,
              email: formData.email,
              message: formData.message,
              category: formData.category,
              submitTime: new Date().toISOString(),
              baseUrl: paths.BASE_PATH
            }
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit contact form');
    }

    return response.json();
  }
};

export const eventService = {
    // Get all events
    async getAllEvents(tag = '') {
      const queryParams = tag ? `?tag=${encodeURIComponent(tag)}` : '';
      const response = await fetch(`${API_BASE_URL}/events${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      return response.json();
    },
  
    // Get event by ID
    async getEventById(id) {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
  
      return response.json();
    },
  
    // Create new event
    async createEvent(eventData, token) {
      const response = await fetch(`${API_BASE_URL}/admin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
  
      return response.json();
    },
  
    // Update event
    async updateEvent(id, eventData, token) {
        if (!id) {
          throw new Error('Event ID is required');
        }
    
        if (!token) {
          throw new Error('Authentication token is required');
        }
    
        try {
          console.log('Updating event with ID:', id);
          console.log('Update payload:', eventData);
          
          const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
          });
    
          return handleResponse(response);
        } catch (error) {
          console.error('Event update error:', error);
          // Enhance error message with more details
          const enhancedError = new Error(
            `Failed to update event: ${error.message || 'Unknown error'}`
          );
          enhancedError.originalError = error;
          throw enhancedError;
        }
      },
  
    // Delete event
    async deleteEvent(id, token) {
      const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
  
      return response.json();
    },
  
    // Get event tags
    async getEventTags() {
      const response = await fetch(`${API_BASE_URL}/events/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch event tags');
      }
  
      return response.json();
    }
  };

export const donationService = {
    // Submit monetary donation
    async submitMonetaryDonation(donationData) {
      const response = await fetch(`${API_BASE_URL}/donations/monetary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: donationData.amount,
          contactEmail: donationData.email,
          paymentMethod: donationData.paymentMethod,
          notifications: {
            donor: {
              subject: 'Thank you for your donation to Game Mixer',
              template: 'donation-confirmation',
              data: {
                name: donationData.name,
                amount: donationData.amount,
                paymentMethod: donationData.paymentMethod,
                baseUrl: paths.BASE_PATH
              }
            },
            admin: {
              subject: 'New Monetary Donation Received',
              template: 'admin-donation-notification',
              data: {
                donorEmail: donationData.email,
                amount: donationData.amount,
                paymentMethod: donationData.paymentMethod,
                submitTime: new Date().toISOString(),
                baseUrl: paths.BASE_PATH
              }
            }
          }
        })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process monetary donation');
      }
  
      return response.json();
    },
  
    // Submit goods donation
    async submitGoodsDonation(donationData) {
      const response = await fetch(`${API_BASE_URL}/donations/goods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donationType: donationData.donationType,
          details: donationData.details,
          contactEmail: donationData.email,
          notifications: {
            donor: {
              subject: 'Thank you for your goods donation to Game Mixer',
              template: 'goods-donation-confirmation',
              data: {
                name: donationData.name,
                donationType: donationData.donationType,
                details: donationData.details,
                baseUrl: paths.BASE_PATH
              }
            },
            admin: {
              subject: 'New Goods Donation Offer Received',
              template: 'admin-goods-notification',
              data: {
                donorEmail: donationData.email,
                donationType: donationData.donationType,
                details: donationData.details,
                submitTime: new Date().toISOString(),
                baseUrl: paths.BASE_PATH
              }
            }
          }
        })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process goods donation');
      }
  
      return response.json();
    }
  };