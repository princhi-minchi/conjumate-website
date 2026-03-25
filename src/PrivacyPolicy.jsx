import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PrivacyPolicy = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          <h2 className="text-3xl font-bold text-dark-teal mb-6">Privacy Policy</h2>
          
          <div className="prose prose-slate max-w-none text-gray-600 space-y-4">
            <p className="font-medium text-gray-900">Last Updated: March 25, 2026</p>
            
            <section>
              <h3 className="text-xl font-semibold text-dark-teal mt-6 mb-2">1. Information We Collect</h3>
              <p>
                When you join our waitlist, we collect your <strong>email address</strong>. This is the only personal 
                information we require to keep you updated about Conjumate's progress and launch.
              </p>
              <p>
                We also collect technical data such as your <strong>User-Agent</strong> and <strong>timestamp</strong> to 
                prevent spam and improve our service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-dark-teal mt-6 mb-2">2. How We Use Your Information</h3>
              <p>
                Your email address is used exclusively to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Send you updates about Conjumate.</li>
                <li>Notify you when our browser extension is available.</li>
                <li>Request feedback to improve the product.</li>
              </ul>
              <p>We will <strong>never</strong> sell your data or share it with third parties for marketing purposes.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-dark-teal mt-6 mb-2">3. Legal Basis for Processing (GDPR)</h3>
              <p>
                We process your personal data based on your <strong>explicit consent</strong>. By checking the consent 
                box on our signup form, you agree to this processing.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-dark-teal mt-6 mb-2">4. Your Rights</h3>
              <p>
                Under the GDPR, you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access the data we have about you.</li>
                <li>Request correction of your data.</li>
                <li>Request deletion of your data ("Right to be Forgotten").</li>
                <li>Withdraw your consent at any time.</li>
              </ul>
              <p>To exercise any of these rights, please contact us at <strong>raunaksharmabss@gmail.com</strong>.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-dark-teal mt-6 mb-2">5. Data Storage</h3>
              <p>
                Your information is stored securely using Google Cloud infrastructure (via Google Sheets/Apps Script). 
                We implement appropriate technical measures to protect your data.
              </p>
            </section>

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
              <button
                onClick={onClose}
                className="btn-honeystyle !py-3 !px-8 text-base"
              >
                Got it
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivacyPolicy;
