'use server'

import { contactTherapistSchema } from "@/lib/schemas";

export async function contactTherapist(formData: FormData) {
    const parsed = contactTherapistSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, message: 'Solicitud enviada correctamente. El terapeuta te contactará pronto.' }
}
