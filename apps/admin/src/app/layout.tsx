import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imagine Admin",
  description: "CMS for Imagine.club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <aside>
          <div style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "32px" }}>
            Imagine Admin
          </div>

          <nav>
            <ul style={{ listStyle: "none" }}>
              <li style={{ marginBottom: "8px" }}>
                <a
                  href="/"
                  style={{
                    display: "block",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    background: "#eef2ff",
                    color: "#6366f1",
                    fontWeight: 500,
                  }}
                >
                  Overview
                </a>
              </li>

              <li style={{ marginBottom: "8px" }}>
                <a href="/posts" style={{ display: "block", padding: "8px 12px", borderRadius: "4px", color: "#666" }}>
                  Posts
                </a>
              </li>

              <li style={{ marginBottom: "8px" }}>
                <a
                  href="/posts/new"
                  style={{ display: "block", padding: "8px 12px", borderRadius: "4px", color: "#666" }}
                >
                  + New Post
                </a>
              </li>

              <li style={{ marginBottom: "8px" }}>
                <a href="/media" style={{ display: "block", padding: "8px 12px", borderRadius: "4px", color: "#666" }}>
                  Media Library
                </a>
              </li>

              <li style={{ marginBottom: "8px" }}>
                <a href="/docs" style={{ display: "block", padding: "8px 12px", borderRadius: "4px", color: "#666" }}>
                  Documentation
                </a>
              </li>

              <li style={{ marginBottom: "8px" }}>
                <a href="#" style={{ display: "block", padding: "8px 12px", borderRadius: "4px", color: "#666" }}>
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main>{children}</main>
      </body>
    </html>
  );
}
