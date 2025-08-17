import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fa'],
  defaultLocale: 'fa'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};