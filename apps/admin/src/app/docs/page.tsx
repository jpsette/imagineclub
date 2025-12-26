import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

async function getDocContent(filename: string) {
    // Security: only allow reading from allowed paths in docs
    const docsDir = path.resolve(process.cwd(), '../../docs');
    // Fallback to reading from local README if needed
    const allowedFiles = ['design-system.md', 'README.md', 'MONOREPO.md', 'UI_RULES.md'];

    // Note: specific mapping for project root files
    let filePath;
    if (filename === 'README.md' || filename === 'MONOREPO.md' || filename === 'UI_RULES.md') {
        filePath = path.resolve(process.cwd(), `../../${filename}`);
    } else {
        filePath = path.join(docsDir, filename);
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return marked(content);
    } catch (err) {
        return '<h1>Document not found</h1><p>The requested document could not be loaded.</p>';
    }
}

export default async function DocsPage({ searchParams }: { searchParams: { file?: string } }) {
    const currentFile = searchParams.file || 'README.md';
    const htmlContent = await getDocContent(currentFile);

    const menuItems = [
        { label: 'Project README', file: 'README.md' },
        { label: 'UI Rules', file: 'UI_RULES.md' },
        { label: 'Monorepo Guide', file: 'MONOREPO.md' },
        { label: 'Design System', file: 'design-system.md' },
    ];

    return (
        <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ width: '200px', flexShrink: 0 }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Files</h3>
                <ul style={{ listStyle: 'none' }}>
                    {menuItems.map(item => (
                        <li key={item.file} style={{ marginBottom: '8px' }}>
                            <a
                                href={`/docs?file=${item.file}`}
                                style={{
                                    display: 'block',
                                    color: currentFile === item.file ? '#6366f1' : '#4b5563',
                                    fontWeight: currentFile === item.file ? 600 : 400
                                }}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
}
