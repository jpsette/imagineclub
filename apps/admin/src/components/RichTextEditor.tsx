"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { useCallback, useRef, useState } from 'react';

// Use NEXT_PUBLIC_API_URL for upload
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.imagine.club";

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function RichTextEditor({ content = '', onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] p-4 border rounded-md',
        style: 'min-height: 300px;',
      },
    },
  });

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/cms/assets/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      if (data.url) {
        editor?.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!editor) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Editor Container */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
        <div
          style={{
            background: '#f3f4f6',
            padding: '8px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            style={{
              fontWeight: editor.isActive('bold') ? 'bold' : 'normal',
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive('bold') ? '#e5e7eb' : 'transparent',
            }}
          >
            B
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            style={{
              fontStyle: editor.isActive('italic') ? 'italic' : 'normal',
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive('italic') ? '#e5e7eb' : 'transparent',
            }}
          >
            I
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            style={{
              textDecoration: editor.isActive('underline') ? 'underline' : 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive('underline') ? '#e5e7eb' : 'transparent',
            }}
          >
            U
          </button>

          <div style={{ width: '1px', height: '24px', background: '#d1d5db', margin: '0 4px' }} />

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            style={{
              fontWeight: editor.isActive('heading', { level: 2 }) ? 'bold' : 'normal',
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive('heading', { level: 2 }) ? '#e5e7eb' : 'transparent',
            }}
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            style={{
              fontWeight: editor.isActive('heading', { level: 3 }) ? 'bold' : 'normal',
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive('heading', { level: 3 }) ? '#e5e7eb' : 'transparent',
            }}
          >
            H3
          </button>

          <div style={{ width: '1px', height: '24px', background: '#d1d5db', margin: '0 4px' }} />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive({ textAlign: 'left' }) ? '#e5e7eb' : 'transparent',
            }}
          >
            Left
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive({ textAlign: 'center' }) ? '#e5e7eb' : 'transparent',
            }}
          >
            Center
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive({ textAlign: 'right' }) ? '#e5e7eb' : 'transparent',
            }}
          >
            Right
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive({ textAlign: 'justify' }) ? '#e5e7eb' : 'transparent',
            }}
          >
            Justify
          </button>

          <div style={{ width: '1px', height: '24px', background: '#d1d5db', margin: '0 4px' }} />

          {/* Colors */}
          <input
            type="color"
            onInput={(event) =>
              editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()
            }
            value={editor.getAttributes('textStyle').color || '#000000'}
            style={{
              width: '30px',
              height: '30px',
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            title="Text Color"
          />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffc107' }).run()}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive('highlight') ? '#ffc107' : 'transparent',
            }}
          >
            Highlight
          </button>

          <div style={{ width: '1px', height: '24px', background: '#d1d5db', margin: '0 4px' }} />

          {/* List & Image */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={{
              fontWeight: editor.isActive('bulletList') ? 'bold' : 'normal',
              padding: '4px 8px',
              borderRadius: '4px',
              background: editor.isActive('bulletList') ? '#e5e7eb' : 'transparent',
            }}
          >
            UL
          </button>

          <button
            type="button"
            onClick={addImage}
            disabled={uploading}
            style={{ padding: '4px 8px', background: uploading ? '#e5e7eb' : 'transparent' }}
          >
            {uploading ? '...' : 'Image'}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div style={{ padding: '8px', minHeight: '300px' }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Live Preview */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: '#fff' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '12px',
            borderBottom: '1px solid #eee',
            paddingBottom: '8px',
          }}
        >
          Preview
        </h3>

        <div
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      </div>
    </div>
  );
}
