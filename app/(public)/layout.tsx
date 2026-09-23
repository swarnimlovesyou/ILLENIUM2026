export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // Wall home page is full-screen — no nav, no footer
  // Individual public pages can add their own chrome if needed
  return <>{children}</>;
}
