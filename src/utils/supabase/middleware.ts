import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const protectedPaths = ['/profile', '/journal']
    const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))

    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const authPaths = ['/login', '/register']
    const isAuthPath = authPaths.some(p => request.nextUrl.pathname.startsWith(p))

    if (isAuthPath && user) {
        return NextResponse.redirect(new URL('/profile', request.url))
    }

    return response
}
