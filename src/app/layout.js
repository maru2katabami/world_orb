import "./globals.css"

export const metadata = {
  title: "World Orb",
  description: "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js"></script>
        <script>eruda.init()</script>
      </head>
      <body>
        { children }
      </body>
    </html>
  )
}