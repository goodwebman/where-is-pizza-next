import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

import { Footer } from '@/src/widgets/navigation/footer/footer';
import { Header } from '@/src/widgets/navigation/header';
import { CartDrawer } from '../features/cart/cart-drawer/ui/cart-drawer';
import './globals.css';
import { Providers } from './providers';

/**
 * Display face for headings. Self-hosted by next/font at build time — no
 * request to Google at runtime, and no layout shift.
 */
const display = Nunito({
  subsets: ['cyrillic', 'latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Куда пицца — доставка пиццы и суши',
  description: 'Доставка пиццы, суши и других вкусностей',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={display.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.body.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.body.setAttribute('data-theme','dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Providers>
          <div className="layout">
            <header className="headerWrapper">
              <div className="container">
                <Header />
              </div>
            </header>

            <main className="main">
              <div className="container">{children}</div>
            </main>

            <div className="footer-wrapper">
              <div className="container">
                <Footer />
              </div>
            </div>
            <CartDrawer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
