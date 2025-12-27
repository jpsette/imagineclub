import { adminFetch } from '../../../../lib/api';
import EditPostForm from './form'; // Separating form to client component for best practice with state

// NOTE: Since we need to pass data to a client component for the form (state handling), 
// we'll implement the Page as a Server Component that fetches data and passes it to the Form.

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: { id: string } }) {
    let post;
    try {
        post = await adminFetch(`/admin/posts/${params.id}`);
    } catch (error) {
        return <div>Error loading post.</div>;
    }

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Edit Post</h1>
            <EditPostForm post={post} />
        </div>
    );
}
