'use client';

import { useFormState } from 'react-dom';
import { updatePost } from '../../actions';
import { useState } from 'react';

const initialState = { error: '' };

interface PostData {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    status: string;
    featured: boolean;
}

export default function EditPostForm({ post }: { post: PostData }) {
    const updatePostWithId = updatePost.bind(null, post.id);
    // @ts-expect-error - useFormState types can be strict with server actions
    const [state, formAction] = useFormState(updatePostWithId, initialState);
    const [slug, setSlug] = useState(post.slug);
    const [title, setTitle] = useState(post.title);

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        // Optional: Auto-update slug only if it matches the generated version of previous title? 
        // For simplicity in Edit, we might usually NOT auto-update slug to avoid breaking URLs accidentally, 
        // but let's keep it manual or user-driven. I won't auto-update slug here on edit unless user touches slug.
    };

    return (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {state?.error && (
                <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px' }}>
                    {state.error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Excerpt</label>
                <textarea
                    name="excerpt"
                    defaultValue={post.excerpt}
                    rows={3}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Content</label>
                <textarea
                    name="content"
                    defaultValue={post.content}
                    rows={12}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Status</label>
                    <select
                        name="status"
                        defaultValue={post.status}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '150px' }}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                    <input
                        type="checkbox"
                        name="featured"
                        id="featured"
                        defaultChecked={post.featured}
                        style={{ width: '18px', height: '18px' }}
                    />
                    <label htmlFor="featured" style={{ cursor: 'pointer' }}>Featured Post</label>
                </div>
            </div>

            <div style={{ marginTop: '16px' }}>
                <button
                    type="submit"
                    style={{
                        background: '#6366f1',
                        color: '#fff',
                        padding: '12px 32px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 500,
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}
