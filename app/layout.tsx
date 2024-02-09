import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

import {Navbar} from "@/app/ui/Navbar";

import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';

import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
          <html>

      <body style={{backgroundColor:'#f8f9fa'}} className={`${inter.className} antialiased`}>       
      <div className="fixed top-0 left-0 right-0 z-50">    
         <Navbar />
      </div>


      <div className="pt-20"> {/* Add top padding to push content below the navbar */}
          {children}
        </div>
      
      <SpeedInsights />

      </body>
      </html>
      </ThemeProvider>
  );
}
