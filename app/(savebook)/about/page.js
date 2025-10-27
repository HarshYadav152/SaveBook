import Link from 'next/link';
import { ArrowLeft, Users, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
          <h1 className="text-4xl font-bold mb-4">About SaveBook</h1>
          <p className="text-gray-300 text-lg">
            Learn more about our mission to revolutionize note-taking.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-semibold">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              SaveBook was born from a simple idea: note-taking should be effortless, organized, and accessible everywhere. 
              We're committed to providing a clean, intuitive platform that helps you capture and organize your thoughts 
              without getting in your way.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-semibold">Our Team</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We're a small team of developers and designers passionate about creating tools that enhance productivity 
              and creativity. We believe in building software that puts users first and respects their privacy.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-semibold">Why Choose Us</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Unlike other note-taking apps, SaveBook focuses on simplicity and performance. We don't clutter your 
              experience with unnecessary features. Just a clean, fast, and reliable platform for your thoughts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}