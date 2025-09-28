import { Router, RequestHandler } from 'express';
import { createNote, getNotes, deleteNote, getNote } from '../controllers/notes.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All note routes require authentication
router.use(authenticateToken as unknown as RequestHandler);

// POST /notes - Create a new note
router.post('/', createNote as unknown as RequestHandler);

// GET /notes - Get all notes for the authenticated user
router.get('/', getNotes as unknown as RequestHandler);

// GET /notes/:id - Get a specific note
router.get('/:id', getNote as unknown as RequestHandler);

// DELETE /notes/:id - Delete a note
router.delete('/:id', deleteNote as unknown as RequestHandler);

export default router;
