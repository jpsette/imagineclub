import { adminFetch } from '../../../../lib/api';
import EditPostForm from './form';

export const dynamic = 'force-dynamic';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: 'draft' | 'published';
  featured: boolean;
};

export default async function EditPostPage({ params }: { params: { id: string } }) {
  try {
    const post = (await adminFetch(`/admin/posts/${params.id}`)) as Post;

    return (
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Edit Post</h1>
        <EditPostForm post={post} />
      </div>
    );
  } catch {
    return <div>Error loading post.</div>;
  }
}
