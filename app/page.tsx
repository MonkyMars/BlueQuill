import Image from 'next/image';
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
            BlueQuill helps you create, edit, and optimize your documents with intelligent AI assistance. From content suggestions to SEO optimization, we make your writing process smarter and more efficient.
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
                quote: "BlueQuill's AI assistant and SEO tools have helped me create better content in less time. The suggestions are always relevant and helpful.",
                author: "Sarah Johnson",
                role: "Content Creator",
                picture: "https://randomuser.me/api/portraits/women/27.jpg"
              },
              {
                quote: "The document management and collaboration features make it easy to work with my team. The AI suggestions are a game-changer.",
                author: "Michael Chen",
                role: "Team Lead",
                picture: "https://randomuser.me/api/portraits/men/29.jpg"
              }
            ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="relative">
                  <Image 
                    src={testimonial.picture} 
                    alt={testimonial.author} 
                    width={64} 
                    height={64} 
                    className="rounded-full ring-4 ring-blue-50"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                    </svg>
                  </div>
                  </div>
                  <blockquote className="mt-6 text-lg text-center text-slate-700">
                  &ldquo;{testimonial.quote}&ldquo;
                  </blockquote>
                  <footer className="mt-6">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-blue-600">{testimonial.role}</div>
                  </footer>
                </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start creating better content today!</h2>
          <p className="text-xl mb-8">
            Join our community of writers and content creators using BlueQuill to improve their work.
          </p>
          <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
            Get Started Now - It&apos;s Free
          </Link>
        </div>
      </section>
    </main>
  );
}
