import React from 'react';
import Header from '../components/Header';

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12 font-serif">Need a solution fast? That’s what we’re here for.</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Information - New Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-serif">Give us a call</h2>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p className="text-gray-600 text-base font-sans">+91 8464027097</p>
            </div>
            <p className="text-gray-600 mb-4 text-sm font-sans">Store Hours : 11Am to 9pm</p>
            <p className="text-gray-600 mb-6 text-sm font-sans">Call us for any kind of support. We will provide you effective resolution for any query you have.</p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-serif">Ping us anytime – your inbox to ours</h2>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-base font-sans">vijaybrotherssaree@gmail.com</p>
            </div>
            <p className="text-gray-600 mb-4 text-sm font-sans">Average Response Time : 30 Min</p>
            <p className="text-gray-600 mb-6 text-sm font-sans">Email us for any kind of support. We will provide you direct support for all service.</p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-serif">Step into our store and explore!</h2>
            <div className="flex items-start mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600 text-base font-sans">Vijay Brothers, pillar no 689, plat no 14, Road No. 1, beside Metro Station Jntu College, Vasanth Nagar, Hyderabad, Telangana 500085</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-serif">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 font-sans">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 font-sans">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2 font-sans">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans"
                  placeholder="Subject of your message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2 font-sans">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 font-sans"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      </div>
  );
};

export default ContactUs;