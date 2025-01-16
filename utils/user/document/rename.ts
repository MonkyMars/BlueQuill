export async function renameUserDocument(documentId: string, newTitle: string, userId: string) {
  try {
    const response = await fetch(`/api/documents/${documentId}/rename`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle, userId }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to rename document');
    }

    return data;
  } catch (error) {
    console.error('Error renaming document:', error);
    throw error;
  }
} 