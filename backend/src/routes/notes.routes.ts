import { Router } from 'express';
import { createNote, getNotes, deleteNote, getNote } from '../controllers/notes.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All note routes require authentication
router.use(authenticateToken);

// POST /notes - Create a new note
router.post('/', createNote);

// GET /notes - Get all notes for the authenticated user
router.get('/', getNotes);

// GET /notes/:id - Get a specific note
router.get('/:id', getNote);

// DELETE /notes/:id - Delete a note
router.delete('/:id', deleteNote);

export default router;
