import { exercises } from "@/data/exercises";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, CheckCircle2, Circle } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import { createClient } from "@/utils/supabase/server";
import { toggleExerciseCompletion } from "./actions";

interface ExercisesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;

    // Filter exercises
    const filteredExercises = category
        ? exercises.filter(ex => ex.category === category)
        : exercises;

    // Get user progress
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let completedIds = new Set<string>();

    if (user) {
        const { data: progress } = await supabase
            .from('user_progress')
            .select('exercise_id')
            .eq('user_id', user.id);

        completedIds = new Set(progress?.map(p => p.exercise_id) || []);
    }

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Catálogo de Ejercicios</h1>
                    <p className="text-muted-foreground">Explora herramientas diseñadas para tu bienestar emocional.</p>
                </div>
                {category && (
                    <Button variant="ghost" asChild>
                        <Link href="/exercises">
                            Ver todos
                        </Link>
                    </Button>
                )}
            </div>

            {/* Filter Tags */}
            {!category && (
                <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(exercises.map(e => e.category))).map(cat => (
                        <CategoryBadge key={cat} category={cat} />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => {
                    const isCompleted = completedIds.has(exercise.id);

                    return (
                        <div key={exercise.id} className="group relative flex flex-col justify-between rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <CategoryBadge category={exercise.category} className="text-xs" />
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {exercise.duration}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-semibold tracking-tight text-xl group-hover:text-primary transition-colors">
                                            {exercise.title}
                                        </h3>
                                        {user && (
                                            <form action={toggleExerciseCompletion.bind(null, exercise.id)}>
                                                <button type="submit" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" title={isCompleted ? "Marcar como pendiente" : "Marcar como completado"}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
                                                    ) : (
                                                        <Circle className="w-6 h-6 hover:fill-primary/10" />
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {exercise.description}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 pt-0 mt-auto">
                                <Button asChild className="w-full rounded-full" variant="outline">
                                    <Link href={`/exercises/${exercise.id}`}>
                                        Comenzar
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
