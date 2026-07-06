'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Folder, Plus, ChevronRight, Terminal, Key, GitBranch } from 'lucide-react'
import { getProjects, createProject } from '@/app/actions/projects'

interface Project {
  id: string
  name: string
}

export default function Sidebar() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  
  const params = useParams()
  const router = useRouter()
  const activeProjectId = params.id as string

  useEffect(() => {
    async function loadProjects() {
      const data = await getProjects()
      setProjects(data)
    }
    loadProjects()
  }, [])

  useEffect(() => {
    const aside = document.querySelector('aside')
    const bodyStyles = window.getComputedStyle(document.body)
    const asideStyles = aside ? window.getComputedStyle(aside) : null
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    const newProject = await createProject(newProjectName, '')
    if (newProject) {
      setProjects([newProject, ...projects])
      setNewProjectName('')
      setIsAdding(false)
      router.push(`/dashboard/projects/${newProject.id}`)
    }
  }

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 text-zinc-400 flex flex-col justify-between p-4 font-sans">
      <div className="space-y-6">
        {/* Brand / Title */}
        <div className="flex items-center gap-2 px-2 text-zinc-100 font-semibold tracking-wide">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span>DevCommand</span>
        </div>

        {/* Global Utilities */}
        <nav className="space-y-1">
          <Link href="/dashboard/github" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
            <GitBranch className="w-4 h-4" />
            <span>GitHub Monitor</span>
          </Link>
          <Link href="/dashboard/vault" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
            <Key className="w-4 h-4" />
            <span>Credentials Vault</span>
          </Link>
          <Link href="/dashboard/snippets" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
            <Folder className="w-4 h-4" />
            <span>Snippet Vault</span>
          </Link>
        </nav>

        <hr className="border-zinc-800" />

        {/* Workspaces Selector Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <span>Workspaces</span>
            <button onClick={() => setIsAdding(!isAdding)} className="hover:text-zinc-200 p-0.5 rounded transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleCreateProject} className="mt-2 px-2">
              <input
                type="text"
                placeholder="Project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </form>
          )}

          <div className="space-y-0.5 max-h-[40vh] overflow-y-auto">
            {projects.map((project) => {
              const isActive = project.id === activeProjectId
              return (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm group transition-colors ${
                    isActive ? 'bg-zinc-900 text-emerald-400 font-medium' : 'hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                    <span className="truncate">{project.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}