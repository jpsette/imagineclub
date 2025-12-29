"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
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
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] p-4 border rounded-md',
                style: 'min-height: 300px;'
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

            // Upload to API
            const res = await fetch(`${API_BASE}/cms/assets/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();

            // Insert image into editor
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

    if (!editor) {
        return null;
    }

    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
                background: '#f3f4f6',
                padding: '8px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
            }}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    style={{ fontWeight: editor.isActive('bold') ? 'bold' : 'normal', padding: '4px 8px' }}
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    style={{ fontStyle: editor.isActive('italic') ? 'italic' : 'normal', padding: '4px 8px' }}
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    style={{ fontWeight: editor.isActive('heading', { level: 2 }) ? 'bold' : 'normal', padding: '4px 8px' }}
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    style={{ fontWeight: editor.isActive('heading', { level: 3 }) ? 'bold' : 'normal', padding: '4px 8px' }}
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    style={{ fontWeight: editor.isActive('bulletList') ? 'bold' : 'normal', padding: '4px 8px' }}
                >
                    UL
                </button>
                <div style={{ width: '1px', background: '#d1d5db', margin: '0 4px' }}></div>
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
    );
}
