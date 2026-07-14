import type { Metadata } from 'next';

import { Footer } from '@/src/widgets/navigation/footer/footer';
import { Header } from '@/src/widgets/navigation/header';
import { CartDrawer } from '../features/cart/cart-drawer/ui/cart-drawer';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Where is pizza',
  description: 'Доставка пиццы, суши и других вкусностей',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
