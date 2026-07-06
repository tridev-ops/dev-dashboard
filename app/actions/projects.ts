'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// Fetch all projects belonging to the logged-in user
export async function getProjects() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error.message)
    return []
  }

  return data
}

// Create a new project workspace
export async function createProject(name: string, description: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('projects')
    .insert([{ name, description, user_id: user.id }])
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error.message)
    return null
  }

  return data
}
