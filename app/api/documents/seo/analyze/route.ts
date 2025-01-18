import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface KeywordAnalysis {
  primary: {
    keyword: string;
    occurrences: number;
    density: number;
  };
  secondary: Array<{
    keyword: string;
    occurrences: number;
    density: number;
  }>;
}

interface SEOMetrics {
  wordCount: number;
  titleLength: number;
  hasMetaDescription: boolean;
  keywordDensity: KeywordAnalysis;
  readabilityScore: number;
}

export async function POST(request: Request) {
  try {
    const { content, title } = await request.json();
    const cookieStore = cookies();
    const database = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get user session
    const { data: { session } } = await database.auth.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Basic SEO analysis
    const wordCount = content.split(/\s+/).length;
    const titleLength = title.length;
    const hasMetaDescription = content.toLowerCase().includes('meta description');
    const keywordDensity = calculateKeywordDensity(content);
    const readabilityScore = calculateReadabilityScore(content);

    // Calculate overall score
    const score = calculateOverallScore({
      wordCount,
      titleLength,
      hasMetaDescription,
      keywordDensity,
      readabilityScore
    });

    // Generate recommendations
    const recommendations = generateRecommendations({
      wordCount,
      titleLength,
      hasMetaDescription,
      keywordDensity,
      readabilityScore
    });

    return NextResponse.json({
      success: true,
      analysis: {
        score,
        recommendations,
        keywordAnalysis: {
          primary: keywordDensity.primary,
          secondary: keywordDensity.secondary
        }
      }
    });
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to analyze SEO' },
      { status: 500 }
    );
  }
}

function calculateKeywordDensity(content: string) {
  const words = content.toLowerCase().split(/\s+/);
  const wordFreq: { [key: string]: number } = {};
  const totalWords = words.length;

  words.forEach(word => {
    if (word.length > 3) { // Only count words longer than 3 characters
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  // Sort by frequency
  const sortedWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .map(([word, count]) => ({
      keyword: word,
      occurrences: count,
      density: (count / totalWords) * 100
    }));

  return {
    primary: sortedWords[0] || { keyword: '', occurrences: 0, density: 0 },
    secondary: sortedWords.slice(1, 5)
  };
}

function calculateReadabilityScore(content: string) {
  const sentences = content.split(/[.!?]+/).length;
  const words = content.split(/\s+/).length;
  const avgWordsPerSentence = words / sentences;
  
  // Simple readability score (0-100)
  return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 5));
}

function calculateOverallScore(metrics: SEOMetrics) {
  let score = 0;

  // Word count (0-25 points)
  if (metrics.wordCount >= 300) score += 25;
  else score += (metrics.wordCount / 300) * 25;

  // Title length (0-15 points)
  if (metrics.titleLength >= 30 && metrics.titleLength <= 60) score += 15;
  else score += 15 - Math.abs(45 - metrics.titleLength) * 0.5;

  // Meta description (0-15 points)
  if (metrics.hasMetaDescription) score += 15;

  // Keyword density (0-20 points)
  const primaryDensity = metrics.keywordDensity.primary.density;
  if (primaryDensity >= 0.5 && primaryDensity <= 2.5) score += 20;
  else score += 20 - Math.abs(1.5 - primaryDensity) * 8;

  // Readability (0-25 points)
  score += metrics.readabilityScore * 0.25;

  return Math.round(score);
}

function generateRecommendations(metrics: SEOMetrics) {
  const recommendations = [];

  if (metrics.wordCount < 300) {
    recommendations.push({
      type: 'warning',
      message: 'Content length is below recommended minimum',
      details: `Current word count is ${metrics.wordCount}. Aim for at least 300 words for better SEO.`
    });
  } else {
    recommendations.push({
      type: 'success',
      message: 'Content length is good',
      details: `Current word count is ${metrics.wordCount}, which is good for SEO.`
    });
  }

  if (metrics.titleLength < 30 || metrics.titleLength > 60) {
    recommendations.push({
      type: 'warning',
      message: 'Title length needs optimization',
      details: 'Title should be between 30-60 characters for optimal SEO.'
    });
  }

  if (!metrics.hasMetaDescription) {
    recommendations.push({
      type: 'error',
      message: 'Missing meta description',
      details: 'Add a meta description to improve SEO and click-through rates.'
    });
  }

  const primaryDensity = metrics.keywordDensity.primary.density;
  if (primaryDensity < 0.5 || primaryDensity > 2.5) {
    recommendations.push({
      type: 'warning',
      message: 'Keyword density needs adjustment',
      details: 'Aim for a keyword density between 0.5% and 2.5%.'
    });
  }

  if (metrics.readabilityScore < 60) {
    recommendations.push({
      type: 'warning',
      message: 'Content readability needs improvement',
      details: 'Try using shorter sentences and simpler language.'
    });
  }

  return recommendations;
} 