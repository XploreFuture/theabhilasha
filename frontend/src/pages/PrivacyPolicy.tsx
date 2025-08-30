import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-orange-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-700">
          Privacy Policy
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Effective Date: {new Date().getFullYear()}
        </p>

        {/* Intro */}
        <p className="text-lg mb-8 text-gray-700 leading-relaxed">
          At <span className="font-semibold">Abhilasha</span>, we value your
          privacy and are committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, and safeguard your
          data when you use our platform, attend our events, or interact with
          us.
        </p>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Personal details such as your name, email, and contact number.</li>
            <li>Information you provide while registering for events.</li>
            <li>Feedback, comments, or content you share with us.</li>
            <li>Technical data such as IP address, browser type, and device info.</li>
          </ul>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The information we collect is used to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Organize and improve our programs and open-mic events.</li>
            <li>Communicate updates, announcements, and event details.</li>
            <li>Respond to your inquiries and provide support.</li>
            <li>Enhance user experience and ensure platform security.</li>
          </ul>
        </div>

        {/* Sharing of Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Sharing of Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We do not sell or trade your personal information. However, we may
            share it with trusted third-party service providers who assist us in
            running our events, communications, or website, always in compliance
            with this policy.
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Your Rights
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Access, update, or delete your personal data.</li>
            <li>Opt out of promotional emails or messages.</li>
            <li>
              Contact us at any time regarding concerns about your privacy.
            </li>
          </ul>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We use reasonable measures to protect your personal information.
            However, please note that no method of transmission over the
            Internet is completely secure.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact
            us at:  
            <br />
            <span className="font-semibold">Email:</span>{" "}
            abhilasha.openmic@gmail.com
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-10 text-sm">
          © {new Date().getFullYear()} Abhilasha. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
