import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../api/firebase';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';

const profileImages = [
  'profile1.png',
  'profile2.png',
  'profile3.png',
  'profile4.png',
  'profile5.png',
  'profile6.png',
  'profile7.png',
  'profile8.png',
  'profile9.png',
  'profile10.png',
];

export default function Profile() {
  const { user, loading } = useAuth();
  const { setFilters } = useMoviesSeriesContext();
  const [displayName, setDisplayName] = useState('');
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [showAdultContent, setShowAdultContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user profile data from Firestore
  useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setDisplayName(data.displayName || user.displayName || '');
            setSelectedProfilePic(data.profilePic || null);
            setShowAdultContent(data.showAdultContent || false);
          } else {
            // Initialize with default values and create the document
            const defaultData = {
              displayName: user.displayName || '',
              profilePic: null,
              showAdultContent: false
            };
            setDisplayName(defaultData.displayName);
            setSelectedProfilePic(defaultData.profilePic);
            setShowAdultContent(defaultData.showAdultContent);
            
            // Create the user document
            await setDoc(userDocRef, defaultData);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          toast.error('Failed to load profile data');
        }
      };
      fetchProfileData();
    }
  }, [user]);

  // Update Firestore and auth profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { displayName });

      // Update Firestore user document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName,
        profilePic: selectedProfilePic,
        showAdultContent,
      });

      // Update global filters for adult content
      setFilters((prev) => ({
        ...prev,
        include_adult: showAdultContent,
      }));

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle profile picture selection
  const handleProfilePicSelect = (pic) => {
    setSelectedProfilePic(pic);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 backdrop-blur-sm bg-opacity-95 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Customize your account settings
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="block w-full pl-3 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your display name"
              />
            </div>

            {/* Profile Picture Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="grid grid-cols-5 gap-4">
                {profileImages.map((pic) => (
                  <button
                    key={pic}
                    type="button"
                    onClick={() => handleProfilePicSelect(pic)}
                    className={`relative rounded-full overflow-hidden border-2 transition-all duration-200 ${
                      selectedProfilePic === pic
                        ? 'border-blue-500 ring-2 ring-blue-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <img
                      src={`/profile-pics/${pic}`}
                      alt={pic}
                      className="w-16 h-16 object-cover"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAzMkMzNi40MTgzIDMyIDQwIDI4LjQxODMgNDAgMjRDNDAgMTkuNTgxNyAzNi40MTgzIDE2IDMyIDE2QzI3LjU4MTcgMTYgMjQgMTkuNTgxNyAyNCAyNEMyNCAyOC40MTgzIDI3LjU4MTcgMzIgMzIgMzJaIiBmaWxsPSIjOUI5Qjk0Ii8+CjxwYXRoIGQ9Ik0xNiA0OEMxNiA0MC4yNjggMjMuMjY4IDM0IDMyIDM0QzQwLjczMiAzNCA0OCA0MC4yNjggNDggNDhWNTJIMTZWNDhaIiBmaWxsPSIjOUI5Qjk0Ii8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Adult Content Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Adult Content
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Include adult movies and series in search results
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdultContent(!showAdultContent)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  showAdultContent ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    showAdultContent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}