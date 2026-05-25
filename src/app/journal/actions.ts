'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { journalEntrySchema } from "@/lib/schemas";

export async function createJournalEntry(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const parsed = journalEntrySchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        redirect(`/journal/new?error=${encodeURIComponent(parsed.error.issues[0].message)}`)
    }

    const { content, mood } = parsed.data

    const { error } = await supabase
        .from('journal_entries')
        .insert({ user_id: user.id, content, mood });

    if (error) {
        console.error('Error al crear entrada:', error.message);
        redirect('/journal/new?error=Error al guardar la entrada');
    }

    revalidatePath('/journal');
    redirect('/journal');
}

export async function getJournalEntries() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching entries:', error.message);
        return [];
    }

    return data;
}
