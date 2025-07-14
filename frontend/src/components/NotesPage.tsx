import { useState, useEffect } from 'react';
import NoteForm from './NoteForm';
import { useAuth } from '../AuthContext';
import { useToast } from './Toast';
import { FaRegStar, FaStar } from 'react-icons/fa';
// Remove react-icons import due to missing module

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
}

const NotesPage = () => {
  const { token, logout } = useAuth();
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://dev-innovation-task.vercel.app';

  // Fetch notes from backend
  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = [];
      if (search) params.push(`q=${encodeURIComponent(search)}`);
      if (tag) params.push(`tags=${encodeURIComponent(tag)}`);
      const res = await fetch(`${API_URL}/api/notes${params.length ? '?' + params.join('&') : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { logout(); return; }
        throw new Error(data.error || 'Failed to fetch notes');
      }
      setNotes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, [search, tag]);

  const handleAdd = () => {
    setEditNote(null);
    setShowForm(true);
  };

  const handleEdit = (note: Note) => {
    setEditNote(note);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this note?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) { logout(); return; }
        throw new Error('Failed to delete note');
      }
      setNotes(notes => notes.filter(n => n._id !== id));
      showToast('Note deleted', 'success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (note: { title: string; content: string; tags: string[] }) => {
    setLoading(true);
    setError('');
    try {
      if (editNote) {
        // Edit
        const res = await fetch(`${API_URL}/api/notes/${editNote._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(note),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) { logout(); return; }
          throw new Error(data.error || 'Failed to update note');
        }
        setNotes(notes => notes.map(n => n._id === editNote._id ? data : n));
        showToast('Note updated', 'success');
      } else {
        // Add
        const res = await fetch(`${API_URL}/api/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(note),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) { logout(); return; }
          throw new Error(data.error || 'Failed to add note');
        }
        setNotes(notes => [data, ...notes]);
        showToast('Note added', 'success');
      }
      setShowForm(false);
      setEditNote(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}/favorite`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { logout(); return; }
        throw new Error(data.error || 'Failed to toggle favorite');
      }
      setNotes(notes => notes.map(n => n._id === id ? data : n));
      showToast(data.favorite ? 'Marked as favorite' : 'Removed from favorites', 'success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          className="w-40 px-3 py-2 border rounded"
          placeholder="Filter by tag..."
          value={tag}
          onChange={e => setTag(e.target.value)}
        />
        <button
          className={`px-4 py-2 rounded border ${showFavorites ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-white border-gray-300 text-gray-700'}`}
          onClick={() => setShowFavorites(f => !f)}
        >
          {showFavorites ? '★ Favorites' : '☆ Favorites'}
        </button>
        <button
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          onClick={handleAdd}
        >
          + Add Note
        </button>
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {loading && <div className="text-gray-500 text-center">Loading...</div>}
      {/* Note list */}
      <div className="space-y-4">
        {!loading && notes.length === 0 && <div className="text-gray-500 text-center">No notes found.</div>}
        {notes
          .filter(note => !showFavorites || note.favorite)
          .map(note => (
            <div key={note._id} className="border rounded p-4 bg-white shadow">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-lg">{note.title}</div>
                <button
                  className="ml-2 text-yellow-500 hover:text-yellow-600"
                  aria-label={note.favorite ? 'Unmark as favorite' : 'Mark as favorite'}
                  onClick={() => handleToggleFavorite(note._id)}
                  title={note.favorite ? 'Unmark as favorite' : 'Mark as favorite'}
                >
                  {note.favorite ? <FaStar /> : <FaRegStar />}
                </button>
              </div>
              <div className="text-gray-700 mb-2">{note.content}</div>
              <div className="flex gap-2 text-xs text-gray-500 mb-2">
                {note.tags.map(t => (
                  <span key={t} className="bg-gray-100 px-2 py-0.5 rounded">#{t}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-300"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
      {/* Add/Edit Note Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <NoteForm
              initial={editNote ? { title: editNote.title, content: editNote.content, tags: editNote.tags } : undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditNote(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage; 