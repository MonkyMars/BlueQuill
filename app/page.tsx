import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-16">
            <h1 className="text-5xl font-bold mb-4">
            AI-Powered Document Creation and Optimization
            </h1>
          <p className="text-xl mb-8 text-slate-200">
            EvoWrite helps you create, edit, and optimize your documents with intelligent AI assistance. From content suggestions to SEO optimization, we make your writing process smarter and more efficient.
          </p>
          <div className="space-x-4">
            <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Try it Now
            </Link>
            <Link href="/learn-more" className="border border-white hover:bg-white hover:text-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-700">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'AI Writing Assistant',
                description: 'Get real-time suggestions and improvements as you write, with context-aware AI that understands your content.'
              },
              {
                title: 'SEO Optimization',
                description: 'Analyze and optimize your content for search engines with keyword suggestions and readability improvements.'
              },
              {
                title: 'Document Management',
                description: 'Organize and manage all your documents in one place with easy search, filtering, and categorization.'
              },
              {
                title: 'Collaborative Tools',
                description: 'Share and collaborate on documents with team members, with version control and real-time updates.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-gray-800">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-700">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Document', description: 'Start with a new document or import existing content.' },
              { step: '2', title: 'Write & Edit', description: 'Use our intuitive editor with real-time AI assistance and suggestions.' },
              { step: '3', title: 'Optimize', description: 'Enhance your content with SEO tools and readability improvements.' },
              { step: '4', title: 'Share & Export', description: 'Share your optimized content or export it for use anywhere.' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-700">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "EvoWrite's AI assistant and SEO tools have helped me create better content in less time. The suggestions are always relevant and helpful.",
                author: "Sarah Johnson",
                role: "Content Creator"
              },
              {
                quote: "The document management and collaboration features make it easy to work with my team. The AI suggestions are a game-changer.",
                author: "Michael Chen",
                role: "Team Lead"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-lg mb-4 italic text-slate-700">{testimonial.quote}</p>
                <p className="font-semibold text-gray-700">{testimonial.author}</p>
                <p className="text-slate-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start creating better content today!</h2>
          <p className="text-xl mb-8">
            Join our community of writers and content creators using EvoWrite to improve their work.
          </p>
          <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
            Get Started Now - It&apos;s Free
          </Link>
        </div>
      </section>
    </main>
  );
}
