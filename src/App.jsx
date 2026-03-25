import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import logo from './logo.png';
import demoVideo from './demo.mp4';
import PrivacyPolicy from './PrivacyPolicy';

const App = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!consent) {
      setStatus('error');
      setErrorMessage('Please agree to the Privacy Policy to continue.');
      return;
    }

    setStatus('loading');

    try {
      const SCRIPT_URL = import.meta.env.VITE_WAITLIST_URL;
      
      // Get the honeypot value if it exists
      const formData = new FormData(e.target);
      const hpValue = formData.get('hp_field');

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          hp_field: hpValue,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          consent: true,
          consentTimestamp: new Date().toISOString()
        }),
      });

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Error!', error.message);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="h-dvh w-screen flex flex-col md:flex-row bg-white overflow-hidden relative">

      {/* --- MOBILE VERSION (md:hidden) --- */}
      <div className="md:hidden flex flex-col h-full w-full bg-white p-4">
        {/* Mobile Header: Enhanced Hero Section */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <motion.img 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={logo} 
            alt="Conjumate Logo" 
            className="h-16 w-auto object-contain" 
          />
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex-1 text-3xl font-bold tracking-tight leading-none text-dark-teal text-center"
          >
            Master <span className="text-accent">conjugations</span> <br /> 
            without leaving your tab
          </motion.h1>
        </div>

        {/* Mobile Main Frame (Further increased height) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-[58dvh] min-h-0 bg-[#F5F3FF] rounded-[2.5rem] border-2 border-gray-100 p-4 flex flex-col items-center justify-center gap-3 relative overflow-hidden shadow-sm"
        >
          {/* Framed Video Container - Further Increased Height */}
          <div className="relative w-full max-w-[350px] max-h-[470px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border-[4px] border-white/50 bg-white/20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={demoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Subtitle inside the frame - Larger Size */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center px-4"
          >
            <p className="text-sm text-gray-500 font-semibold leading-relaxed">
              Browser extension that translates and conjugates across 8 European languages.
            </p>
          </motion.div>
        </motion.div>

        {/* Mobile Waitlist Section (Bottom) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 flex flex-col items-center gap-3"
        >
          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100 w-full justify-center"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold text-sm">You're on the list!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-honey w-full !py-3 !text-base"
                disabled={status === 'loading'}
              />
              {/* --- HONEYPOT FIELD --- */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="hp_field" tabIndex="-1" autoComplete="off" />
              </div>
              <div className="flex items-start gap-3 px-1 mb-2">
                <input
                  type="checkbox"
                  id="mobile-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="checkbox-honey mt-1"
                  required
                />
                <label htmlFor="mobile-consent" className="text-[13px] text-gray-500 leading-tight">
                  I agree to the <button type="button" onClick={() => setIsPolicyOpen(true)} className="text-accent font-semibold hover:underline">Privacy Policy</button> and to receive updates.
                </label>
              </div>

              <button
                type="submit"
                className="btn-honeystyle w-full !py-3 !text-base"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
              </button>
              {status === 'error' && (
                <p className="text-rose-600 text-xs font-medium flex items-center gap-2 justify-center">
                  <span className="w-1 h-1 rounded-full bg-rose-600" />
                  {errorMessage}
                </p>
              )}
            </form>
          )}
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 text-[11px] font-semibold"
          >
            Join 100+ learners already on the waitlist.
          </motion.p>
        </motion.div>
      </div>

      {/* --- DESKTOP VERSION (md:flex) --- */}
      {/* Desktop-Only Logo Container - Pushed Higher */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex md:absolute md:top-8 md:right-0 md:w-[60%] md:justify-center z-20"
      >
        <img src={logo} alt="Conjumate Logo" className="h-[82px] w-auto object-contain" />
      </motion.div>

      {/* Left Panel: Demo Section (Desktop) */}
      <div className="hidden md:flex md:w-[40%] bg-panel-bg flex-col items-center justify-center relative overflow-hidden h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full h-full flex items-center justify-center p-16"
        >
          <div className="relative w-full h-full max-w-[90%] max-h-[90%] rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white/30 bg-white/5">
            <video autoPlay loop muted playsInline className="h-full w-full object-cover">
              <source src={demoVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Hero Section (Desktop) - Pushed Content Lower */}
      <div className="hidden md:flex md:flex-grow flex-col justify-start pt-26 items-center px-20 py-12 min-h-screen relative bg-white">
        <div className="max-w-[600px] w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-dark-teal mb-6 text-left"
          >
            Master <span className="text-accent">conjugations</span> without leaving your tab.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-lg text-gray-500 font-medium mb-6 text-left"
          >
            Browser extension that translates and conjugates across 8 European languages.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4"
          >
            {status === 'success' ? (
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-4 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-bold">You're on the list! We'll be in touch soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-honey"
                    disabled={status === 'loading'}
                  />
                  {/* --- HONEYPOT FIELD --- */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input type="text" name="hp_field" tabIndex="-1" autoComplete="off" />
                  </div>
                  <button
                    type="submit"
                    className="btn-honeystyle whitespace-nowrap"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
                  </button>
                </div>
                <div className="flex items-start gap-3 px-1 mt-4">
                  <input
                    type="checkbox"
                    id="desktop-consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="checkbox-honey mt-1"
                    required
                  />
                  <label htmlFor="desktop-consent" className="text-sm text-gray-500 leading-tight">
                    I agree to the <button type="button" onClick={() => setIsPolicyOpen(true)} className="text-accent font-semibold hover:underline border-none p-0 bg-transparent cursor-pointer">Privacy Policy</button> and to receive updates about Conjumate.
                  </label>
                </div>

                {status === 'error' && (
                  <p className="text-rose-600 text-sm font-medium flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    {errorMessage}
                  </p>
                )}
              </form>
            )}
            
            <p className="mt-6 text-gray-400 text-sm font-medium">
              Join 100+ learners already on the waitlist.
            </p>
          </motion.div>
        </div>
      </div>
      <PrivacyPolicy isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </div>
  );
};

export default App;

