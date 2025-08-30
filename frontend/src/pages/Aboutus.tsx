import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-6 text-pink-700">
          About Us
        </h1>

        {/* Intro */}
        <p className="text-lg text-center mb-10 text-gray-600 leading-relaxed">
          Welcome to <span className="font-semibold">Abhilasha</span> – a
          vibrant platform that organizes diverse programs and open-mic shows,
          bringing together voices, creativity, and communities while promoting
          our rich culture and traditions.
        </p>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            At Abhilasha, our mission is to create a welcoming stage for people
            to express themselves freely—whether through poetry, music, comedy,
            storytelling, or cultural performances. We believe that open-mics
            and cultural programs are powerful ways to connect communities and
            celebrate diversity.
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We envision a platform where traditions meet modern creativity, and
            every voice is valued. Through our events, we strive to preserve
            culture while providing opportunities for new talents to shine.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            What We Do
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Organize open-mic events for artists and performers.</li>
            <li>Host cultural and community-driven programs.</li>
            <li>Promote and preserve traditions through creative platforms.</li>
            <li>Provide a safe space for voices, stories, and performances.</li>
          </ul>
        </div>

        {/* Closing */}
        <p className="text-center text-gray-600 mt-10 text-lg italic">
          "Abhilasha is not just an event—it’s a movement of voices, culture,
          and tradition."
        </p>
      </div>
    </div>
  );
};

export default About;
