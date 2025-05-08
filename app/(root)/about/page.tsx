import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Sri Fitness',
  description: 'Learn about Sri Fitness - Your Premier Fitness Destination',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Sri Fitness</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your premier destination for fitness excellence, personal transformation, and a healthier lifestyle.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-gray-600">
            At Sri Fitness, we are dedicated to empowering individuals on their fitness journey. 
            Our mission is to provide a comprehensive fitness experience through expert guidance, 
            state-of-the-art facilities, and personalized workout plans that help you achieve 
            your fitness goals.
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="text-gray-600">
            We envision being the leading fitness center that transforms lives through innovative 
            training methods, supportive community environment, and sustainable fitness solutions 
            that promote long-term health and wellness.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Expert Trainers</h3>
          <p className="text-gray-600">
            Our certified fitness professionals are committed to helping you achieve your goals 
            through personalized guidance and support.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Modern Facilities</h3>
          <p className="text-gray-600">
            Experience fitness training with our state-of-the-art equipment and 
            professionally designed workout spaces.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Personalized Plans</h3>
          <p className="text-gray-600">
            Get customized workout and nutrition plans tailored to your specific needs 
            and fitness objectives.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Join Us Today</h2>
        <p className="text-gray-600 mb-8">
          Start your fitness journey with Sri Fitness and experience the difference 
          of professional training and dedicated support.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md transition duration-300 ease-in-out">
          Contact Us
        </button>
      </div>
    </div>
  );
}