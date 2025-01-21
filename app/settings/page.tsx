"use client";
import { useAuth } from "@/utils/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/utils/user/auth/profile";

export default function Settings() {
  const { user, updateUserProfile, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    displayName: user?.user_metadata?.display_name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then((data) => {
      setFormData({
        displayName: data?.full_name || '',
        email: user.email || '',
      })
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
            
            {message.text && (
              <div className={`mb-4 p-4 rounded ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  disabled
                />
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Danger Zone</h2>
              <button
                onClick={() => {/* TODO: Implement account deletion */}}
                className="block w-full px-4 py-2 text-red-600 font-medium border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300"
              >
                Delete Account
              </button>
                <button 
                className="block w-full mt-4 px-4 py-2 text-red-600 font-medium border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300" 
                onClick={handleSignOut}
                >
                Log out
                </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 