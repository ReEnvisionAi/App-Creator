import { useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../auth/AuthProvider';

export default function LoginMenu() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user.email}</span>
        <button 
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => setIsOpen(true)}
      >
        Sign In
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-[425px] w-full">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Authentication</h2>
              <p className="text-sm text-gray-600">
                Sign in to your account or create a new one.
              </p>
            </div>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              onlyThirdPartyProviders={false}
              redirectTo={window.location.origin}
            />
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}