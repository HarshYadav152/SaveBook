"use client"
import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Smartphone, Shield, FileText } from 'lucide-react';
import { SignOutButton, SignUpButton, useUser } from '@clerk/nextjs';

export default function HomePage() {
  const { isSignedIn } = useUser();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Your Digital
            <span className="text-blue-500 block">Notebook</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            SaveBook is a modern, intuitive note-taking application that helps you capture,
            organize, and access your thoughts seamlessly across all your devices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/book"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
            >
              Start Taking Notes
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose SaveBook?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Built with modern technology and user experience at its core
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-blue-500" />}
            title="Intuitive Organization"
            description="Easily create, edit, and organize your notes with our clean and intuitive interface. Never lose track of your thoughts again."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-blue-500" />}
            title="Lightning Fast"
            description="Built on Next.js for optimal performance. Experience instant loading and smooth interactions across all your devices."
          />
          <FeatureCard
            icon={<Smartphone className="h-8 w-8 text-blue-500" />}
            title="Fully Responsive"
            description="Works seamlessly on desktop, tablet, and mobile. Access your notes anywhere, anytime with our responsive design."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-blue-500" />}
            title="Secure & Private"
            description="Your notes are safe with us. We prioritize your privacy and data security with modern encryption practices."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white p-5">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Organize Your Thoughts?
          </h2>
          {!isSignedIn ? <SignOutButton>
            <SignUpButton mode="modal" afterSignUpUrl="/book">
              <button
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 inline-flex items-center gap-2"
              >
                Create Your Account
                <ArrowRight className="h-5 w-5" />
              </button>
            </SignUpButton>
          </SignOutButton> :
            <div className='flex justify-center items-center'>
              <Link
                href="/book"
                className="w-auto flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <FileText className="h-5 w-5" />
                Go to Notes
              </Link>
            </div>
          }
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-200 group hover:shadow-lg hover:shadow-blue-500/10">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}