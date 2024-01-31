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

      <body style={{backgroundColor:'#f8f9fa'}} className={`${inter.className} antialiased`}>       
      <div className='py-10'>
      <Navbar />
      </div>

      {children}
      </body>
      </html>
      </ThemeProvider>
  );
}
