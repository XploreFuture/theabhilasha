import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-700">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Effective Date: {new Date().getFullYear()}
        </p>

        {/* Intro */}
        <p className="text-lg mb-8 text-gray-700 leading-relaxed">
          These Terms and Conditions apply to ticket purchases and attendance at
          events organized by <span className="font-semibold">Abhilasha</span>.
          By purchasing a ticket, you agree to the terms outlined below.
        </p>

        {/* Ticket Policy */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Ticket Policy
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Tickets are required for entry to all Abhilasha events unless
              otherwise specified.
            </li>
            <li>
              Each ticket admits one person only and must be presented at the
              venue.
            </li>
            <li>
              Tickets are non-transferable without prior approval from Abhilasha.
            </li>
            <li>
              Abhilasha reserves the right to refuse entry to any attendee who
              does not comply with event rules.
            </li>
          </ul>
        </div>

        {/* Refund Policy */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Refund Policy
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              All ticket sales are <span className="font-semibold">final</span>.
            </li>
            <li>
              Refunds are only provided if the event is{" "}
              <span className="font-semibold">canceled or rescheduled</span> by
              Abhilasha.
            </li>
            <li>
              No refunds will be given for a change of personal circumstances,
              including inability to attend.
            </li>
            <li>
              In case of event cancellation, refunds will be issued to the
              original payment method within 7–10 business days.
            </li>
          </ul>
        </div>

        {/* Event Guidelines */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Event Guidelines
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Attendees are expected to maintain respectful behavior throughout
              the event.
            </li>
            <li>
              Any disruptive or offensive conduct may lead to removal from the
              venue without a refund.
            </li>
            <li>
              Photography and recording may be restricted based on event rules.
            </li>
            <li>
              Abhilasha is not responsible for lost or stolen personal
              belongings during events.
            </li>
          </ul>
        </div>

        {/* Liability Disclaimer */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Liability Disclaimer
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By attending an Abhilasha event, you agree to participate at your
            own risk. Abhilasha is not liable for any injury, loss, or damage
            incurred during the event, except where required by law.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about these Terms & Conditions, please contact us at:  
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

export default TermsAndConditions;
