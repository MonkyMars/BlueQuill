import Link from 'next/link';

export default function Pricing() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Choose the perfect plan for your content creation needs. Start free and upgrade as you grow.
          </p>
        </div>
      </section>

      <section className="py-16 -mt-8 w-full">
        <div className="mx-auto flex-shrink-0 px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Free</h2>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">$0</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 mb-6">Perfect for getting started with AI-powered document creation.</p>
                <Link 
                  href="/register" 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
                >
                  Get Started
                </Link>
              </div>
              <div className="bg-slate-50 p-8 h-full">
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Up to 5 documents
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic AI writing assistance
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Document organization
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic SEO tools
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Popular
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pro</h2>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">$7.99</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 mb-6">For professionals who need advanced AI features and collaboration tools.</p>
                <Link 
                  href="/register?plan=pro" 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
                >
                  Start Free Trial
                </Link>
              </div>
              <div className="bg-slate-50 p-8 h-full">
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited documents
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced AI writing features
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full SEO optimization tools
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Team collaboration
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Enterprise</h2>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">Custom</span>
                </div>
                <p className="text-slate-600 mb-6">For organizations that need custom solutions and enterprise features.</p>
                <Link 
                  href="/contact" 
                  className="block text-center bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
                >
                  Contact Sales
                </Link>
              </div>
              <div className="bg-slate-50 p-8 h-full">
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Custom AI model training
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dedicated support
                  </li>
                  <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Custom integrations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Pricing FAQ</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I change plans at any time?",
                answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle."
              },
              {
                question: "Is there a long-term contract?",
                answer: "No, all our plans are month-to-month with no long-term commitment required. You can cancel anytime."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards and PayPal for Pro plans. For Enterprise plans, we also support bank transfers."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 14-day money-back guarantee if you're not satisfied with your Pro subscription."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white bg-clip-text">
        Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
        Join our community of content creators and start optimizing your documents today.
          </p>
          <Link 
        href="/register" 
        className="inline-block bg-transparent border-2 border-white text-white p-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
          >
        Try BlueQuill Free
          </Link>
        </div>
      </section>
    </main>
  );
}
