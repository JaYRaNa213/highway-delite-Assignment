import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { notesAPI } from '../../services/api';
import { Note } from '../../types';
import toast from 'react-hot-toast';

interface NoteFormData {
  title: string;
  content: string;
}

interface NoteFormProps {
  onNoteCreated: (note: Note) => void;
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onNoteCreated, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<NoteFormData>();

  const handleSubmit = async (data: NoteFormData) => {
    setIsLoading(true);
    try {
      const response = await notesAPI.createNote(data.title, data.content);
      if (response.success && response.data) {
        onNoteCreated(response.data.note);
        form.reset();
        onClose();
        toast.success('Note created successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create note');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Create New Note</h2>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Title
              </label>
              <input
                {...form.register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 200, message: 'Title must be less than 200 characters' }
                })}
                type="text"
                className="input text-black"
                placeholder="Enter note title"
                maxLength={200}
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Content
              </label>
              <textarea
                {...form.register('content', { 
                  required: 'Content is required',
                  maxLength: { value: 10000, message: 'Content must be less than 10000 characters' }
                })}
                className="input min-h-[200px] resize-none text-black"
                placeholder="Write your note content here..."
                maxLength={10000}
              />
              {form.formState.errors.content && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-md"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Note
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
