import { Response } from 'express';
import Note from '../models/Note';
import { AuthRequest } from '../middlewares/auth.middleware';
import Joi from 'joi';

// Validation schemas
const createNoteSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().min(1).max(10000).required(),
});

// Create a new note
export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createNoteSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { title, content } = value;
    const userId = req.user!._id;

    const note = new Note({
      title,
      content,
      userId,
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: {
        note: {
          _id: note._id,
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all notes for the authenticated user
export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .select('_id title content createdAt updatedAt');

    res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      data: {
        notes,
      },
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete a note
export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      res.status(404).json({
        success: false,
        message: 'Note not found or you do not have permission to delete it',
      });
      return;
    }

    await Note.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get a single note
export const getNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const note = await Note.findOne({ _id: id, userId })
      .select('_id title content createdAt updatedAt');

    if (!note) {
      res.status(404).json({
        success: false,
        message: 'Note not found or you do not have permission to view it',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Note retrieved successfully',
      data: {
        note,
      },
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
