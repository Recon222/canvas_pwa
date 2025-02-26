import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Add the Permissions-Policy header to allow device sensors
  response.headers.set(
    'Permissions-Policy',
    'accelerometer=self, gyroscope=self, magnetometer=self'
  );

  return response;
}

// This will run the middleware on all routes
export const config = {
  matcher: '/:path*',
}; 