"use client"
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Clock, Send, CheckCircle, User, AlertCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { useEffect, useState } from 'react';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xblpkvdl");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.succeeded) {
      setShowSuccess(true);
      // Reset form after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  if (showSuccess) {
    return (
      <div className="min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          </div>

          {/* Success Message */}
          <div className="bg-gray-800 rounded-lg p-8 border border-green-500 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 rounded-full p-3">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Message Sent Successfully!
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg">
            Get in touch with our team. We're here to help!
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-semibold">Email Us</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                For general inquiries and support:
              </p>
              <a
                href="mailto:HarshYadav152@outlook.com"
                className="text-blue-400 hover:text-blue-300 transition-colors text-lg font-medium"
              >
                HarshYadav152@outlook.com
              </a>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold">Live Chat</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Get instant help from our support team during business hours.
              </p>
              <button className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Start Chat (comming soon)
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-semibold">Response Time</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                • Email: Within 24 hours<br />
                • Live Chat: Instant<br />
                • Priority Support: 4 hours
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>

            {/* Loading State */}
            {state.submitting && (
              <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-3"></div>
                  <span className="text-blue-400">Sending your message...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {state.errors && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-400">Please check the form for errors.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Issue</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Report a Bug</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder="How can we help you? Please provide as much detail as possible."
                  />
                </div>
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={state.submitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {state.submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>

              {/* Form Status Messages */}
              {state.errors && (
                <div className="text-red-400 text-sm text-center">
                  Please fix the errors above before submitting.
                </div>
              )}
            </form>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <p className="text-gray-400 text-sm text-center">
                By submitting this form, you agree to our{' '}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300">
                  privacy policy
                </a>
                . We'll never share your information with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">How quickly will I get a response?</h4>
              <p className="text-gray-300 text-sm">We typically respond to all inquiries within 24 hours on business days.</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-400 mb-2">Do you offer technical support?</h4>
              <p className="text-gray-300 text-sm">Yes! Our technical support team is available to help with any issues.</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-400 mb-2">Can I request new features?</h4>
              <p className="text-gray-300 text-sm">Absolutely! We love hearing feature requests from our users.</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-400 mb-2">Is my data secure?</h4>
              <p className="text-gray-300 text-sm">Yes, we take data security seriously and use industry-standard encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}