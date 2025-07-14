import React, { useState } from 'react';

interface NoteFormProps {
  initial?: { title: string; content: string; tags: string[] };
  onSave: (note: { title: string; content: string; tags: string[] }) => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ initial, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [tags, setTags] = useState(initial?.tags.join(', ') || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setError('');
    onSave({
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <textarea
          className="w-full px-3 py-2 border rounded min-h-[80px]"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
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

export default NoteForm; 