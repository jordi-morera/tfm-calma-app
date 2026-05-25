'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validatePassword } from "@/utils/password";
import { updateProfileSchema, changePasswordSchema } from "@/lib/schemas";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const parsed = updateProfileSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: parsed.data.fullName,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        return { error: 'No se pudo actualizar el perfil' }
    }

    revalidatePath('/profile')
    return { message: 'Perfil actualizado correctamente' }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function changePassword(formData: FormData) {
    const supabase = await createClient()

    const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const password = parsed.data['new-password']
    const confirmPassword = parsed.data['confirm-password']

    if (password !== confirmPassword) {
        return { error: 'Las contraseñas no coinciden' }
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return { error: passwordError }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        console.error('Change password error:', error.message)
        return { error: 'No se pudo actualizar la contraseña' }
    }

    revalidatePath('/profile')
    return { message: 'Contraseña actualizada correctamente' }
}
