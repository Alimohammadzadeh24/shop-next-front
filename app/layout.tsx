import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Vazirmatn } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';
import '@/styles/globals.css';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
});

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            {children}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'fa' }];
}