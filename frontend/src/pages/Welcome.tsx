import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, User, Mail, Shield } from 'lucide-react';
import NoteForm from '../components/Notes/NoteForm';
import NotesList from '../components/Notes/NotesList';
import { Note } from '../types';
import toast from 'react-hot-toast';

const Welcome: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notesCount, setNotesCount] = useState(0);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleNoteCreated = (_: Note) => {
    setNotesCount(prev => prev + 1);
  };

  const handleNoteDeleted = () => {
    setNotesCount(prev => prev - 1);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-secondary-900">
                Note Taking App
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNoteForm(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
              >
                <LogOut className="h-4 w-4 mr-2 bg-red-600" />
                <h5 className='text-black'>LOGOUT</h5>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                Welcome back, {user.name}! 👋
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Name</p>
                    <p className="text-sm text-secondary-600">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Email</p>
                    <p className="text-sm text-secondary-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Signup Method</p>
                    <p className="text-sm text-secondary-600 capitalize">
                      {user.signupMethod}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-secondary-900">
              Your Notes
            </h3>
            <div className="text-sm text-secondary-600">
              {notesCount} {notesCount === 1 ? 'note' : 'notes'}
            </div>
          </div>
          <NotesList onNoteDeleted={handleNoteDeleted} />
        </div>
      </main>

      {/* Note Form Modal */}
      {showNoteForm && (
        <NoteForm
          onNoteCreated={handleNoteCreated}
          onClose={() => setShowNoteForm(false)}
        />
      )}
    </div>
  );
};

export default Welcome;
