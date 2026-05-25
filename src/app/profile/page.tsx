import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "./actions";
import { User, LogOut, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProfileForm from "./profile-form";
import PasswordForm from "./password-form";
import { exercises } from "@/data/exercises";
import { Progress } from "@/components/ui/progress";
import { CategoryBadge } from "@/components/category-badge";
import { toggleExerciseCompletion } from "@/app/exercises/actions";

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch user progress
    const { data: userProgress } = await supabase
        .from("user_progress")
        .select("exercise_id")
        .eq("user_id", user.id);

    const completedIds = new Set(userProgress?.map((p) => p.exercise_id) || []);

    // Calculate stats
    const progressStats: Record<string, { total: number; completed: number }> = {};
    const completedExercisesList: typeof exercises = [];

    exercises.forEach(ex => {
        if (!progressStats[ex.category]) {
            progressStats[ex.category] = { total: 0, completed: 0 };
        }
        progressStats[ex.category].total++;

        if (completedIds.has(ex.id)) {
            progressStats[ex.category].completed++;
            completedExercisesList.push(ex);
        }
    });

    return (
        <div className="container max-w-2xl px-4 py-8 mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Volver al inicio
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
                    <p className="text-muted-foreground">Gestiona tu información personal.</p>
                </div>
                <form action={signOut}>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                        <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                    </Button>
                </form>
            </div>

            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {/* Header with Avatar Placeholder */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{profile?.full_name || 'Usuario'}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Tu Progreso</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {Object.entries(progressStats).map(([category, stats]: [string, { total: number; completed: number }]) => (
                                <div key={category} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{category}</span>
                                        <span className="text-muted-foreground">{stats.completed}/{stats.total}</span>
                                    </div>
                                    <Progress value={(stats.completed / stats.total) * 100} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t"></div>

                    {/* Completed Exercises List */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Ejercicios Completados</h3>
                        {completedExercisesList.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aún no has completado ningún ejercicio.</p>
                        ) : (
                            <div className="space-y-4">
                                {completedExercisesList.map((exercise) => (
                                    <div key={exercise.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                                        <div className="space-y-1">
                                            <Link href={`/exercises/${exercise.id}`} className="font-medium hover:underline">
                                                {exercise.title}
                                            </Link>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <CategoryBadge category={exercise.category} />
                                                <span>• {exercise.duration}</span>
                                            </div>
                                        </div>
                                        <form action={toggleExerciseCompletion.bind(null, exercise.id)}>
                                            <Button variant="ghost" size="sm" title="Desmarcar como completado">
                                                <CheckCircle2 className="w-5 h-5 text-primary fill-primary/20" />
                                                <span className="sr-only">Desmarcar</span>
                                            </Button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t"></div>

                    {/* Edit Form */}
                    <ProfileForm
                        userEmail={user.email!}
                        initialFullName={profile?.full_name || ''}
                    />

                    <div className="border-t"></div>

                    {/* Password Form */}
                    <PasswordForm />
                </div>
            </div>
        </div>
    );
}
