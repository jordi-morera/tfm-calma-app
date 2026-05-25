-- Fix missing DELETE policy on user_progress
-- Without this, the unmark (delete) path in toggleExerciseCompletion fails silently under RLS

create policy "Usuarios pueden eliminar su propio progreso."
  on user_progress for delete
  using ( auth.uid() = user_id );
