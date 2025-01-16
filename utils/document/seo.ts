interface SEOAnalysis {
  score: number;
  recommendations: Array<{
    type: 'success' | 'warning' | 'error';
    message: string;
    details?: string;
  }>;
  keywordAnalysis: {
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
  };
}

export async function analyzeSEO(content: string, title: string): Promise<SEOAnalysis> {
  try {
    const response = await fetch('/api/documents/seo/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, title }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to analyze SEO');
    }

    return data.analysis;
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    throw error;
  }
}

export async function optimizeContent(content: string, title: string): Promise<{ 
  optimizedContent: string;
  changes: Array<{
    type: string;
    original: string;
    suggestion: string;
    reason: string;
  }>;
}> {
  try {
    const response = await fetch('/api/documents/seo/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, title }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to optimize content');
    }

    return data.optimization;
  } catch (error) {
    console.error('Error optimizing content:', error);
    throw error;
  }
}

export async function extractKeywords(content: string): Promise<{
  primary: string;
  secondary: string[];
}> {
  try {
    const response = await fetch('/api/documents/seo/keywords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to extract keywords');
    }

    return data.keywords;
  } catch (error) {
    console.error('Error extracting keywords:', error);
    throw error;
  }
} 