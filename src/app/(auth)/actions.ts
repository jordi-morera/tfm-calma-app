'use server'

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { validatePassword } from "@/utils/password";
import { getURL } from "@/utils/url";
import { loginSchema, registerSchema, resetPasswordSchema, updatePasswordSchema } from "@/lib/schemas";

export async function login(formData: FormData) {
    const supabase = await createClient()

    const parsed = loginSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0].message)}`)
    }

    const { email, password } = parsed.data

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        console.error('Login error:', error.message)
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const parsed = loginSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0].message)}`)
    }

    const { email, password } = parsed.data

    const passwordError = validatePassword(password);
    if (passwordError) {
        redirect(`/login?error=${encodeURIComponent(passwordError)}`)
    }

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
        redirect('/login?message=No se pudo registrar el usuario')
    }

    redirect('/login?message=Revisa tu email para continuar con el proceso de registro')
}

export async function register(formData: FormData) {
    const supabase = await createClient()

    const parsed = registerSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        redirect(`/register?error=${encodeURIComponent(parsed.error.issues[0].message)}`)
    }

    const { email, password, fullName } = parsed.data

    const passwordError = validatePassword(password);
    if (passwordError) {
        redirect(`/register?error=${encodeURIComponent(passwordError)}`)
    }

    const origin = getURL()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
            emailRedirectTo: `${origin}auth/callback`,
        },
    })

    if (error) {
        console.error('Register error:', error.message)
        redirect(`/register?error=${encodeURIComponent('Error al registrarse: ' + error.message)}`)
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
        redirect('/login?message=El usuario ya existe. Intenta iniciar sesión.')
    }

    redirect('/login?message=Revisa tu email para completar el registro')
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()

    const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        redirect(`/forgot-password?error=${encodeURIComponent(parsed.error.issues[0].message)}`)
    }

    const { email } = parsed.data
    const origin = getURL()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}auth/callback?next=/update-password`,
    })

    if (error) {
        console.error('Reset password error:', error.message)
        redirect('/forgot-password?error=No se pudo enviar el correo de recuperación')
    }

    redirect('/login?message=Revisa tu email para restablecer tu contraseña')
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const parsed = updatePasswordSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        redirect(`/update-password?error=${encodeURIComponent(parsed.error.issues[0].message)}`)
    }

    const password = parsed.data['new-password']
    const confirmPassword = parsed.data['confirm-password']

    const passwordError = validatePassword(password);
    if (passwordError) {
        redirect(`/update-password?error=${encodeURIComponent(passwordError)}`)
    }

    if (password !== confirmPassword) {
        redirect('/update-password?error=Las contraseñas no coinciden')
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        console.error('Update password error:', error.message)
        redirect('/update-password?error=No se pudo actualizar la contraseña')
    }

    redirect('/profile?message=Contraseña actualizada correctamente')
}
