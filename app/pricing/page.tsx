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
            Choose the perfect plan for your writing needs. Start free and upgrade as you grow.
          </p>
        </div>
      </section>

      <section className="py-16 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Free</h2>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">$0</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 mb-6">Perfect for getting started with AI-powered writing assistance.</p>
                <Link 
                  href="/register" 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
                >
                  Get Started
                </Link>
              </div>
              <div className="bg-slate-50 p-8">
                <ul className="space-y-4">
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Up to 500 words per month
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic grammar & style checks
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    3 document types
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic AI suggestions
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative transform md:scale-105 z-10">
              <div className="absolute top-0 w-full text-center py-2 bg-blue-600 text-white text-sm font-semibold">
                Most Popular
              </div>
              <div className="p-8 pt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pro</h2>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">$7,99</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 mb-6">For professionals who need advanced writing capabilities.</p>
                <Link 
                  href="/register?plan=pro" 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
                >
                  Start Pro Trial
                </Link>
              </div>
              <div className="bg-slate-50 p-8">
                <ul className="space-y-4">
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited words
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced grammar & style analysis
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    All document types
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced AI suggestions
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    SEO optimization tools
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Priority support
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Enterprise</h2>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">$24,99</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 mb-6">For teams and businesses needing advanced features.</p>
                <Link 
                  href="/contact-sales" 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
                >
                  Contact Sales
                </Link>
              </div>
              <div className="bg-slate-50 p-8">
                <ul className="space-y-4">
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Everything in Pro
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Team collaboration tools
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom AI model training
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced analytics
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    API access
                  </li>
                  <li className="flex items-start text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    24/7 dedicated support
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
                answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 14-day money-back guarantee if you're not satisfied with your Pro or Enterprise subscription."
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
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Get Started?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are already using TextifyAI to improve their writing.
          </p>
          <Link 
            href="/register" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Try TextifyAI Free
          </Link>
        </div>
      </section>
    </main>
  );
}
