import Link from 'next/link';
import { ArrowLeft, CheckCircle, Mail, ExternalLink } from 'lucide-react';

export default function NewMandalOnboardingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r pt-28 from-red-900 via-red-800 to-red-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/bmm-members"
            className="inline-flex items-center gap-2 text-red-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold">
            New Mandal Onboarding Process
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Requirements Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Requirements for Onboarding a New Mandal:
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-900">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-red-900" />
                  Register the Mandal with the appropriate State/Provincial authority
                </h3>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-red-900 font-bold">USA:</span>
                    <span>Register as a nonprofit entity in the respective State</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-900 font-bold">Canada:</span>
                    <span>Incorporate as a Not-for-Profit organization under Provincial or Federal laws</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-900">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-red-900" />
                  Obtain nonprofit/tax-exempt status
                </h3>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-red-900 font-bold">USA:</span>
                    <span>Apply for 501(c)(3) status with the IRS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-900 font-bold">Canada:</span>
                    <span>Apply for Registered Charity status with the Canada Revenue Agency (CRA) <em>(if eligible)</em></span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Once your non-profit registration is complete, please share the following details and documents to{' '}
              <a
                href="mailto:president@bmmonline.org"
                className="text-red-900 hover:text-red-700 underline inline-flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                president@bmmonline.org
              </a>
              :
            </h2>

            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>State registration certificate for your non-profit organization</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Federal non-profit certification (if available/applicable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Certificate of Good Standing from the state</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span>Names and contact details of office bearers:</span>
                    <p className="text-sm text-gray-600 italic ml-4 mt-1">
                      (President, Secretary, Treasurer, and proposed BMM Representative)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>List of Executive Committee members and Trustees (if applicable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Official address of the Mandal</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Tax ID (EIN)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Mandal website (if available)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Membership count and membership fee structure</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Notes/minutes from your most recent AGM (if available)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>NOC from a neighboring Mandal (if within a 50-mile radius, if applicable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Brief highlights of Mandal activities (programs, community initiatives, etc.)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Fee Section */}
          <section className="mb-12">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-amber-900 mb-2">Annual Membership Fee</h3>
              <p className="text-amber-800">
                Depending upon the size of the Mandal (determined by the membership count), there is an annual fee for the Mandal. 
                E.g., <strong>$60 fee for less than 100 members</strong>.
              </p>
            </div>
          </section>

          {/* Constitution Section */}
          <section className="mb-12">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-2">BMM Constitution</h3>
              <p className="text-blue-800 mb-3">
                The BMM Constitution can be found at:{' '}
                <a
                  href="https://bmmonline.org/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 underline inline-flex items-center gap-1"
                >
                  https://bmmonline.org/about/
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              <p className="text-blue-800">
                Please make sure you review it and your Mandal will fulfill all the requirements.
              </p>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-12">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-green-900 mb-2">BMM Membership Benefits</h3>
              <p className="text-green-800 mb-3">
                Regarding BMM Membership benefits for the Mandal, there are many programs that BMM offers.
              </p>
              <p className="text-green-800">
                Please visit BMM website to learn more:{' '}
                <a
                  href="https://bmmonline.org/initiatives/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-900 underline inline-flex items-center gap-1"
                >
                  https://bmmonline.org/initiatives/
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mb-12">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Questions?</h3>
              <p className="text-gray-700 mb-4">
                Please contact us at{' '}
                <a
                  href="mailto:president@bmmonline.org"
                  className="text-red-900 hover:text-red-700 underline font-medium"
                >
                  president@bmmonline.org
                </a>{' '}
                if you have any questions.
              </p>
            </div>
          </section>

          {/* Welcome Message */}
          <section className="text-center py-8 border-t-2 border-red-900">
            <p className="text-xl font-bold text-red-900 mb-2">
              We are looking forward to working with you and welcoming you to the BMM Pariwar!
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Link
                href="/bmm-members"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Members
              </Link>
              <a
                href="mailto:president@bmmonline.org"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-900 border-2 border-red-900 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}