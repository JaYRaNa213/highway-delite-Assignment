import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, User } from 'lucide-react';
import { notesAPI } from '../../services/api';
import { Note } from '../../types';
import toast from 'react-hot-toast';

interface NotesListProps {
  onNoteDeleted: () => void;
}

const NotesList: React.FC<NotesListProps> = ({ onNoteDeleted }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      if (response.success && response.data) {
        setNotes(response.data.notes);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setDeletingId(noteId);
    try {
      const response = await notesAPI.deleteNote(noteId);
      if (response.success) {
        setNotes(notes.filter(note => note._id !== noteId));
        onNoteDeleted();
        toast.success('Note deleted successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-secondary-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-secondary-900 mb-2">No notes yet</h3>
        <p className="text-secondary-600">Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note._id} className="card hover:shadow-md transition-shadow">
          <div className="card-content">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {note.title}
                </h3>
                <p className="text-secondary-600 mb-4 whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="flex items-center text-sm text-secondary-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(note.createdAt)}
                  </div>
                  {note.updatedAt !== note.createdAt && (
                    <div className="flex items-center">
                      <span className="text-xs bg-secondary-100 px-2 py-1 rounded">
                        Updated {formatDate(note.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteNote(note._id)}
                disabled={deletingId === note._id}
                className="ml-4 text-secondary-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {deletingId === note._id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
