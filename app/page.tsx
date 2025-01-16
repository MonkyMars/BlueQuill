import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            Unleash Your Creativity with AI-Powered Writing
          </h1>
          <p className="text-xl mb-8 text-slate-200">
            Let TextifyAI assist you in drafting, refining, and optimizing your content—whether you&apos;re writing blogs, scripts, or academic papers. Powered by advanced AI, your words just got smarter.
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
                title: 'AI-Driven Writing Assistance',
                description: 'Generate ideas, optimize content, and improve writing quality with AI suggestions tailored to your needs.'
              },
              {
                title: 'Smart Content Optimization',
                description: 'Enhance readability, SEO, and engagement by letting our AI handle keyword integration and content structure.'
              },
              {
                title: 'Script & Academic Writing Support',
                description: `Whether you're drafting a script or writing an essay, TextifyAI tailors its tools to your specific project type.`
              },
              {
                title: 'Seamless Workflow',
                description: 'Enjoy a distraction-free writing environment with tools that integrate smoothly into your writing process.'
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
              { step: '1', title: 'Start Writing', description: 'Begin your writing process with an initial draft or blank page.' },
              { step: '2', title: 'AI-Assist', description: 'Let TextifyAI analyze your content and provide suggestions for structure, tone, and optimization.' },
              { step: '3', title: 'Refine & Finish', description: 'Use the AI-driven feedback to make real-time adjustments, adding keywords, refining grammar, and polishing your writing.' },
              { step: '4', title: 'Done & Ready', description: 'Whether for blogs, scripts, or essays, your content is ready for the next step—publication, submission, or collaboration.' }
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
                quote: "TextifyAI has transformed the way I write. It's like having a professional editor and content strategist by my side every step of the way!",
                author: "Sarah Johnson",
                role: "Blogger"
              },
              {
                quote: "Perfect for scripts and essays—this AI makes my writing process 10 times faster.",
                author: "Michael Chen",
                role: "Scriptwriter"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-lg mb-4 italic text-slate-700">{testimonial.quote}</p>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-slate-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start writing smarter today!</h2>
          <p className="text-xl mb-8">
            Join thousands of users who are transforming their writing process with TextifyAI.
          </p>
          <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
            Get Started Now - It&apos;s Free
          </Link>
        </div>
      </section>
    </main>
  );
}
