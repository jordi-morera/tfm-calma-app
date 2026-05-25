'use server'

import { createClient } from "@/utils/supabase/server";
import { contactTherapistSchema } from "@/lib/schemas";

export async function contactTherapist(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const parsed = contactTherapistSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { therapistId, name, email, message, date } = parsed.data

    const { error } = await supabase
        .from('contact_requests')
        .insert({
            therapist_id: therapistId,
            user_id: user?.id ?? null,
            name,
            email,
            message,
            preferred_date: date || null,
        })

    if (error) {
        console.error('Error guardando solicitud de contacto:', error.message)
        return { error: 'No se pudo enviar la solicitud. Inténtalo de nuevo.' }
    }

    return { success: true, message: 'Solicitud enviada correctamente. El terapeuta te contactará pronto.' }
}
