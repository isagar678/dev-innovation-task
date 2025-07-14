import React, { useState } from 'react';

interface BookmarkFormProps {
  initial?: { url: string; title: string; description: string; tags: string[] };
  onSave: (bookmark: { url: string; title: string; description: string; tags: string[] }) => void;
  onCancel: () => void;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const BookmarkForm: React.FC<BookmarkFormProps> = ({ initial, onSave, onCancel }) => {
  const [url, setUrl] = useState(initial?.url || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [tags, setTags] = useState(initial?.tags.join(', ') || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('URL is required.');
      return;
    }
    if (!isValidUrl(url.trim())) {
      setError('Please enter a valid URL.');
      return;
    }
    setError('');
    onSave({
      url: url.trim(),
      title: title.trim(),
      description: description.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="Title (leave blank to autofetch)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          className="w-full px-3 py-2 border rounded min-h-[60px]"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div>
        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 justify-end">
        <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
          Save
        </button>
      </div>
    </form>
  );
};

export default BookmarkForm; 