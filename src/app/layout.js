import "./globals.css"

export const metadata = {
  title: "World Orb",
  description: "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        { children }
      </body>
    </html>
  )
}