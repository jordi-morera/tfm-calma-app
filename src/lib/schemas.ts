import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    fullName: z.string().min(1, 'El nombre es obligatorio').max(100),
})

export const resetPasswordSchema = z.object({
    email: z.string().email('Email inválido'),
})

export const updatePasswordSchema = z.object({
    'new-password': z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    'confirm-password': z.string().min(1, 'Confirma tu contraseña'),
})

export const journalEntrySchema = z.object({
    content: z.string().min(1, 'El contenido es obligatorio').max(5000),
    mood: z.enum(['Feliz', 'Calmado', 'Triste', 'Ansioso', 'Enfado', 'Cansado']),
})

export const updateProfileSchema = z.object({
    fullName: z.string().min(1, 'El nombre es obligatorio').max(100),
})

export const changePasswordSchema = z.object({
    'new-password': z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    'confirm-password': z.string().min(1, 'Confirma tu contraseña'),
})

export const contactTherapistSchema = z.object({
    therapistId: z.string().min(1),
    name: z.string().min(1, 'El nombre es obligatorio'),
    email: z.string().email('Email inválido'),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
    date: z.string().optional(),
})
