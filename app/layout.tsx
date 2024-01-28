import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

import Navbar from "@/app/ui/Navbar";

import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
          <html>

      <body className={`${inter.className} antialiased`}>       
      <Navbar />
      {children}
      </body>
      </html>
      </ThemeProvider>
  );
}
