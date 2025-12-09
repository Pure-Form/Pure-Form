-- Create workout_logs table for tracking completed workouts
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    focus TEXT NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exercises JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS workout_logs_user_id_idx ON public.workout_logs(user_id);
CREATE INDEX IF NOT EXISTS workout_logs_day_idx ON public.workout_logs(day);
CREATE INDEX IF NOT EXISTS workout_logs_completed_at_idx ON public.workout_logs(completed_at DESC);

-- Enable Row Level Security
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own workout logs
CREATE POLICY "Users can view own workout logs"
    ON public.workout_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own workout logs
CREATE POLICY "Users can insert own workout logs"
    ON public.workout_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own workout logs
CREATE POLICY "Users can update own workout logs"
    ON public.workout_logs
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own workout logs
CREATE POLICY "Users can delete own workout logs"
    ON public.workout_logs
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workout_logs_updated_at
    BEFORE UPDATE ON public.workout_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.workout_logs TO authenticated;
GRANT ALL ON public.workout_logs TO service_role;

COMMENT ON TABLE public.workout_logs IS 'Stores completed workout sessions for users';
COMMENT ON COLUMN public.workout_logs.user_id IS 'Reference to the user who completed the workout';
COMMENT ON COLUMN public.workout_logs.day IS 'Day of the week (e.g., MON, TUE, WED)';
COMMENT ON COLUMN public.workout_logs.focus IS 'Workout focus area (e.g., Chest & Triceps, Back & Biceps)';
COMMENT ON COLUMN public.workout_logs.completed_at IS 'Timestamp when the workout was completed';
COMMENT ON COLUMN public.workout_logs.exercises IS 'Optional JSON array of exercises with sets, reps, and weight';
