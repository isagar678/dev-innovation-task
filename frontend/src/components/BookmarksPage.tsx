import  { useState, useEffect } from 'react';
import BookmarkForm from './BookmarkForm';
import { useAuth } from '../AuthContext';
import { useToast } from './Toast';
import { FaRegStar, FaStar } from 'react-icons/fa';

interface Bookmark {
  _id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  favorite: boolean;
}

const BookmarksPage = () => {
  const { token, logout } = useAuth();
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editBookmark, setEditBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://dev-innovation-task.vercel.app';

  // Fetch bookmarks from backend
  const fetchBookmarks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = [];
      if (search) params.push(`q=${encodeURIComponent(search)}`);
      if (tag) params.push(`tags=${encodeURIComponent(tag)}`);
      const res = await fetch(`${API_URL}/api/bookmarks${params.length ? '?' + params.join('&') : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { logout(); return; }
        throw new Error(data.error || 'Failed to fetch bookmarks');
      }
      setBookmarks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line
  }, [search, tag]);

  const handleAdd = () => {
    setEditBookmark(null);
    setShowForm(true);
  };

  const handleEdit = (bm: Bookmark) => {
    setEditBookmark(bm);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this bookmark?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) { logout(); return; }
        throw new Error('Failed to delete bookmark');
      }
      setBookmarks(bms => bms.filter(b => b._id !== id));
      showToast('Bookmark deleted', 'success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (bm: { url: string; title: string; description: string; tags: string[] }) => {
    setLoading(true);
    setError('');
    try {
      if (editBookmark) {
        // Edit
        const res = await fetch(`${API_URL}/api/bookmarks/${editBookmark._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bm),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) { logout(); return; }
          throw new Error(data.error || 'Failed to update bookmark');
        }
        setBookmarks(bms => bms.map(b => b._id === editBookmark._id ? data : b));
        showToast('Bookmark updated', 'success');
      } else {
        // Add
        const res = await fetch(`${API_URL}/api/bookmarks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bm),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) { logout(); return; }
          throw new Error(data.error || 'Failed to add bookmark');
        }
        setBookmarks(bms => [data, ...bms]);
        showToast('Bookmark added', 'success');
      }
      setShowForm(false);
      setEditBookmark(null);
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
      const res = await fetch(`${API_URL}/api/bookmarks/${id}/favorite`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { logout(); return; }
        throw new Error(data.error || 'Failed to toggle favorite');
      }
      setBookmarks(bms => bms.map(b => b._id === id ? data : b));
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
          placeholder="Search bookmarks..."
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
          + Add Bookmark
        </button>
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {loading && <div className="text-gray-500 text-center">Loading...</div>}
      {/* Bookmark list */}
      <div className="space-y-4">
        {!loading && bookmarks.length === 0 && <div className="text-gray-500 text-center">No bookmarks found.</div>}
        {bookmarks
          .filter(bm => !showFavorites || bm.favorite)
          .map(bm => (
          <div key={bm._id} className="border rounded p-4 bg-white shadow">
            <div className="flex items-center justify-between mb-1">
              <div className="font-semibold text-lg">
                <a href={bm.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{bm.title}</a>
              </div>
              <button
                className="ml-2 text-yellow-500 hover:text-yellow-600"
                aria-label={bm.favorite ? 'Unmark as favorite' : 'Mark as favorite'}
                onClick={() => handleToggleFavorite(bm._id)}
                title={bm.favorite ? 'Unmark as favorite' : 'Mark as favorite'}
              >
                {bm.favorite ? <FaStar /> : <FaRegStar />}
              </button>
            </div>
            <div className="text-gray-700 mb-1">{bm.description}</div>
            <div className="text-xs text-gray-500 mb-2">{bm.url}</div>
            <div className="flex gap-2 text-xs text-gray-500 mb-2">
              {bm.tags.map(t => (
                <span key={t} className="bg-gray-100 px-2 py-0.5 rounded">#{t}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleEdit(bm)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-300"
                onClick={() => handleDelete(bm._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Add/Edit Bookmark Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <BookmarkForm
              initial={editBookmark ? { url: editBookmark.url, title: editBookmark.title, description: editBookmark.description, tags: editBookmark.tags } : undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditBookmark(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage; 