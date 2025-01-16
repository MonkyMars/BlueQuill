import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { content, title } = await request.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Basic content optimization
    const changes: Array<{
      type: string;
      original: string;
      suggestion: string;
      reason: string;
    }> = [];

    // Process content
    let optimizedContent = content;

    // 1. Replace weak words with stronger alternatives
    const weakWords = {
      'very': 'extremely',
      'really': 'genuinely',
      'good': 'excellent',
      'bad': 'poor',
      'nice': 'impressive',
      'big': 'substantial',
      'small': 'compact',
    };

    Object.entries(weakWords).forEach(([weak, strong]) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      if (regex.test(optimizedContent)) {
        changes.push({
          type: 'word_strength',
          original: weak,
          suggestion: strong,
          reason: 'Using stronger, more specific words improves content quality.'
        });
        optimizedContent = optimizedContent.replace(regex, strong);
      }
    });

    // 2. Optimize sentence length
    const sentences = optimizedContent.split(/[.!?]+/);
    const modifiedSentences = sentences.map((sentence: string) => {
      const words = sentence.trim().split(/\s+/);
      if (words.length > 25) {
        changes.push({
          type: 'sentence_length',
          original: sentence.trim(),
          suggestion: `${words.slice(0, 12).join(' ')}. ${words.slice(12).join(' ')}`,
          reason: 'Breaking long sentences improves readability.'
        });
        return `${words.slice(0, 12).join(' ')}. ${words.slice(12).join(' ')}`;
      }
      return sentence;
    });
    optimizedContent = modifiedSentences.join('. ');

    // 3. Add meta description if missing
    if (!content.toLowerCase().includes('meta description')) {
      const metaDescription = `<meta name="description" content="${title} - ${sentences[0].trim()}">`;
      optimizedContent = metaDescription + '\n' + optimizedContent;
      changes.push({
        type: 'meta_description',
        original: '',
        suggestion: metaDescription,
        reason: 'Adding meta description improves SEO visibility.'
      });
    }

    return NextResponse.json({
      success: true,
      optimization: {
        optimizedContent,
        changes
      }
    });
  } catch (error) {
    console.error('Error optimizing content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to optimize content' },
      { status: 500 }
    );
  }
} 