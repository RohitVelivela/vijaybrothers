'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

// Define interface for form data
interface ContactFormData {
  name: string;
  email: string;
  contactNo: string;
  subject: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    contactNo: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.contactNo || !formData.subject || !formData.message) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all fields.',
        icon: 'error',
        imageUrl: '/VB logo white back.png', // Path to your logo
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Vijay Brothers Logo',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'my-swal-popup',
          title: 'my-swal-title',
          htmlContainer: 'my-swal-html-container',
          confirmButton: 'my-swal-confirm-button',
        },
        buttonsStyling: false,
      });
      return;
    }

    if (!/^\d{10}$/.test(formData.contactNo)) {
      Swal.fire({
        title: 'Error!',
        text: 'Contact number must be 10 digits.',
        icon: 'error',
        imageUrl: '/VB logo white back.png', // Path to your logo
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Vijay Brothers Logo',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'my-swal-popup',
          title: 'my-swal-title',
          htmlContainer: 'my-swal-html-container',
          confirmButton: 'my-swal-confirm-button',
        },
        buttonsStyling: false,
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: result.message || 'Message sent to Vijay Brothers successfully!',
          icon: 'success',
          imageUrl: '/VB logo white back.png', // Path to your logo
          imageWidth: 100,
          imageHeight: 100,
          imageAlt: 'Vijay Brothers Logo',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            htmlContainer: 'my-swal-html-container',
            confirmButton: 'my-swal-confirm-button',
          },
          buttonsStyling: false,
        });
        setFormData({
          name: '',
          email: '',
          contactNo: '',
          subject: '',
          message: '',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to send message.',
          icon: 'error',
          imageUrl: '/VB logo white back.png', // Path to your logo
          imageWidth: 100,
          imageHeight: 100,
          imageAlt: 'Vijay Brothers Logo',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            htmlContainer: 'my-swal-html-container',
            confirmButton: 'my-swal-confirm-button',
          },
          buttonsStyling: false,
        });
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while sending your message.',
        icon: 'error',
        imageUrl: '/VB logo white back.png', // Path to your logo
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Vijay Brothers Logo',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'my-swal-popup',
          title: 'my-swal-title',
          htmlContainer: 'my-swal-html-container',
          confirmButton: 'my-swal-confirm-button',
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-2xl font-extrabold text-center text-red-800 mb-12 font-serif tracking-wide drop-shadow-lg">
          Got a doubt?, We're right here to drape you in answers, just like the perfect saree!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Information Section */}
          <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 transform transition duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 font-serif">Reach Out to Us</h2>

            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-700 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Call Us</p>
                  <p className="text-gray-600 text-base">+91 8464027097</p>
                  <p className="text-sm text-gray-500">Store Hours: 11 AM to 9 PM</p>
                  <p className="text-sm text-gray-500 mt-2">For immediate assistance and support, our team is ready to help you with any queries.</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-700 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Email Us</p>
                  <p className="text-gray-600 text-base">vijaybrotherssaree@gmail.com</p>
                  <p className="text-sm text-gray-500">Average Response Time: 30 Min</p>
                  <p className="text-sm text-gray-500 mt-2">Send us your questions or feedback, and we'll get back to you promptly.</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-700 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Visit Our Store</p>
                  <p className="text-gray-600 text-base">Vijay Brothers, pillar no 689, plat no 14, Road No. 1, beside Metro Station Jntu College, Vasanth Nagar, Hyderabad, Telangana 500085</p>
                  <p className="text-sm text-gray-500 mt-2">Experience our exquisite collection in person. We look forward to welcoming you!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 transform transition duration-300 hover:scale-105">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 font-serif">Send Us a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  placeholder="Your Full Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactNo" className="block text-gray-700 text-sm font-semibold mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  placeholder="Your Contact Number"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  placeholder="Subject of your message"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  Send Message
                </button>
              </div>
            </form>
            {/* Removed status display as SweetAlert2 handles feedback */}
          </div>
        </div>
      </main>

    </div>
  );
};

export default ContactUs;
