import React from "react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const team: TeamMember[] = [
  {
    name: "Abhilasha Sharma",
    role: "Founder & Organizer",
    image: "../public/images/kunu.jpg",
  },
  {
    name: "Rohan Mehta",
    role: "Developer & Content Creator",
    image: "../public/images/niku.jpg",
  },
  {
    name: "Priya Verma",
    role: "Developer",
    image: "../public/images/bau.jpg",
  },
];

const OurTeam: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-700">
          Our Team
        </h1>

        {/* Team Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <div
              key={index}
              className="group [perspective:1000px] cursor-pointer"
            >
              <div className="relative h-80 w-full rounded-2xl shadow-lg transition-transform duration-500 [transform-style:preserve-3d] group-hover:rotate-y-12 group-hover:-rotate-x-6 group-hover:scale-105">
                {/* Image */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover rounded-2xl"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h2 className="text-xl font-bold text-white">
                    {member.name}
                  </h2>
                  <p className="text-sm text-gray-200">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
