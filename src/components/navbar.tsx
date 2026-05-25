import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { User, Sun } from "lucide-react";
import Link from "next/link";

export default async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="px-6 h-16 flex items-center justify-between border-b bg-background/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <Sun className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Calma</span>
                </Link>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                <Link href="/exercises" className="hover:text-foreground transition-colors">Herramientas</Link>
                <Link href="/therapists" className="hover:text-foreground transition-colors">Terapeutas</Link>
            </nav>
            <div className="flex gap-3">
                {user ? (
                    <Button size="sm" variant="secondary" asChild className="gap-2">
                        <Link href="/profile">
                            <User className="w-4 h-4" /> Mi Perfil
                        </Link>
                    </Button>
                ) : (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Entrar</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/register">Empezar ahora</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
