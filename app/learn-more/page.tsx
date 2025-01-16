import Link from 'next/link';

export default function LearnMore() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Discover the Power of TextifyAI
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl">
            Explore how our advanced AI writing assistant can transform your content creation process, boost your productivity, and enhance your writing quality.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Advanced AI Writing Technology</h2>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    State-of-the-art language models for natural, fluent writing
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Context-aware suggestions that understand your writing style
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Real-time grammar and style improvements
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Content Optimization</h2>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    SEO-friendly content suggestions
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Readability analysis and improvements
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Keyword optimization and integration
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Versatile Writing Support</h2>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Blog post and article writing assistance
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Academic paper formatting and citations
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Script and creative writing tools
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Productivity Features</h2>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Distraction-free writing environment
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Quick editing and revision tools
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Progress tracking and goals
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Perfect For Every Writer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Content Creators",
                description: "Create engaging blog posts, articles, and social media content with AI-powered suggestions for better engagement.",
                features: ["SEO optimization", "Tone adjustment", "Engagement analytics"]
              },
              {
                title: "Academic Writers",
                description: "Write research papers, essays, and dissertations with proper citations and academic language assistance.",
                features: ["Citation management", "Academic style", "Research integration"]
              },
              {
                title: "Creative Writers",
                description: "Develop scripts, stories, and creative content with tools that enhance your narrative and character development.",
                features: ["Story structure", "Character development", "Dialogue enhancement"]
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{useCase.title}</h3>
                <p className="text-slate-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, fIndex) => (
                    <li key={fIndex} className="text-blue-600 text-sm">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Start Writing Better Today</h2>
          <p className="text-xl text-slate-600 mb-8">
            Choose a plan that works for you and transform your writing process
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="/pricing" 
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does TextifyAI improve my writing?",
                answer: "TextifyAI uses advanced AI to analyze your content and provide real-time suggestions for grammar, style, tone, and structure. It helps you write more effectively while maintaining your unique voice."
              },
              {
                question: "Is my content secure and private?",
                answer: "Yes, we take privacy seriously. Your content is encrypted and never shared with third parties. You retain full ownership of all your writing."
              },
              {
                question: "Can I try TextifyAI before subscribing?",
                answer: "Absolutely! We offer a free tier that lets you experience the core features of TextifyAI before deciding to upgrade to a premium plan."
              },
              {
                question: "What types of writing does TextifyAI support?",
                answer: "TextifyAI supports various types of writing including blog posts, academic papers, creative writing, business documents, scripts, and more. Each type has specialized features and suggestions."
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
    </main>
  );
}
