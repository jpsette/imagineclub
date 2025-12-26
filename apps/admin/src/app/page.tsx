export default function AdminPage() {
    const users = [
        { id: 1, name: "Alice Tech", role: "Editor", status: "Active" },
        { id: 2, name: "Bob Art", role: "Contributor", status: "Inactive" },
        { id: 3, name: "Charlie Manager", role: "Admin", status: "Active" },
    ];

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Overview</h1>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        background: user.status === 'Active' ? '#dcfce7' : '#f3f4f6',
                                        color: user.status === 'Active' ? '#166534' : '#374151',
                                        fontWeight: 600
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td><button style={{ border: 'none', background: 'transparent', color: '#6366f1', cursor: 'pointer' }}>Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
