'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CalebOwl from '@/components/CalebOwl';

interface Draft {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'reviewing' | 'approved' | 'published';
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
  wordCount: number;
  estimatedReadTime: number;
}

// Mock drafts for demonstration - in production, these would come from Medium API or local storage
const mockDrafts: Draft[] = [
  {
    id: '1',
    title: 'Building AI Agents That Actually Work',
    content: `# Building AI Agents That Actually Work

After months of experimenting with different approaches to AI agents, I've learned some hard lessons about what makes them actually useful versus just cool demos.

## The Problem with Most AI Agents

Most agent frameworks I've tried fall into one of two traps:

1. **Too rigid** - They follow a strict workflow that breaks as soon as the task deviates slightly
2. **Too loose** - They have unlimited tool access and wander aimlessly, burning through tokens

## What Actually Works

### 1. Clear Boundaries

Agents need guardrails. Not the kind that prevent all mistakes, but the kind that prevent expensive mistakes.

- Set token limits per operation
- Define clear success/failure criteria
- Have a human-in-the-loop for high-stakes decisions

### 2. Specialized Minions

Instead of one general-purpose agent, I use specialized "minions":

- **Research minions** - Find and summarize information
- **Code minions** - Handle implementation
- **Review minions** - Check work for errors

Each has a narrow scope and specific tools.

### 3. Persistent Memory

Agents need to remember what they've learned. I use a combination of:

- Session memory for the current task
- Daily logs for context across sessions
- Curated long-term memory for important lessons

## The Results

Since switching to this approach, I've seen:

- 70% reduction in token usage
- Much higher success rates on complex tasks
- Better ability to resume interrupted work

The key insight: AI agents work best when they're designed like competent employees - given clear objectives, proper tools, and accountability - not like magical oracles that can do everything.

---

*What's your experience with AI agents? I'd love to hear what's worked (and what hasn't) in your projects.*`,
    status: 'reviewing',
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 3600000),
    author: 'Caleb',
    tags: ['AI', 'Agents', 'Engineering', 'Best Practices'],
    wordCount: 342,
    estimatedReadTime: 4,
  },
  {
    id: '2',
    title: 'The Build Council: Lessons from 12 Months of Side Projects',
    content: `# The Build Council: Lessons from 12 Months of Side Projects

A year ago, I started treating my side projects like a real business. I created the "Build Council" - a virtual team of AI agents that help me execute on ideas faster.

## What Changed

Before, my side projects would die in the "idea graveyard" - that folder of unfinished work we all have.

Now, I have a system:

1. **Ideas go into a backlog** - Every idea gets captured, no matter how rough
2. **Weekly prioritization** - The Council helps me pick what to work on
3. **Daily execution** - Focused sprints with clear deliverables
4. **Continuous review** - Regular retrospectives on what's working

## The Tools

My setup is surprisingly simple:

- **Notion** for the backlog and documentation
- **Discord** for async communication with my AI team
- **GitHub** for code and project management
- **A custom dashboard** for visibility into everything

## Key Learnings

### Ship Small, Ship Often

The biggest change was moving from "launch when it's perfect" to "launch when it's useful." My first versions are embarrassing, but they get real feedback.

### AI as Multiplier, Not Replacement

I don't ask AI to do my thinking. I use it to:
- Speed up research
- Generate first drafts
- Catch errors I'd miss
- Handle repetitive tasks

The strategy and decisions are still mine.

### Build in Public (Even If It's Scary)

Sharing work-in-progress has led to:
- Unexpected collaboration opportunities
- Better feedback than I'd get privately
- Accountability to actually finish things

## The Numbers

In 12 months:
- 6 projects launched (vs 1-2 in previous years)
- 2 generating revenue
- Countless lessons learned

Most importantly: I'm having more fun building than I have in years.

---

*Are you working on side projects? What's your biggest challenge?*`,
    status: 'draft',
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000),
    author: 'Caleb',
    tags: ['Side Projects', 'Entrepreneurship', 'Productivity', 'AI'],
    wordCount: 425,
    estimatedReadTime: 5,
  },
  {
    id: '3',
    title: 'Why I Stopped Using Complex AI Frameworks',
    content: `# Why I Stopped Using Complex AI Frameworks

I've tried them all - LangChain, LlamaIndex, AutoGPT, and dozens of others. They all promise to make AI development easier. Most made it harder.

## The Complexity Trap

Here's what typically happens:

1. Start with a simple problem
2. Pick a framework that can handle "enterprise scale" (even though you're not there yet)
3. Spend weeks learning the framework's abstractions
4. Realize the framework is fighting you on simple tasks
5. End up writing custom code anyway

## What I Do Instead

### Direct API Calls

For most tasks, direct calls to OpenAI/Anthropic are enough:

\`\`\`python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
)
\`\`\`

### Simple Functions as Tools

Instead of complex tool frameworks:

\`\`\`python
tools = {
    "search": search_web,
    "calculate": safe_calculate,
    "save": save_to_file
}

if tool_call in tools:
    result = tools[tool_call](**args)
\`\`\`

### JSON for Structure

Need structured output? Just ask:

\`\`\`
"Respond in this JSON format:
{
  \"summary\": \"...\",
  \"action_items\": [...],
  \"confidence\": 0.0-1.0
}"
\`\`\`

## When Frameworks Make Sense

I'm not saying frameworks are always bad. They're useful when:

- You need specific integrations (vector DBs, document loaders)
- You're building something truly complex (multi-agent orchestration)
- Your team already knows the framework

But for most applications? Start simple. Add complexity only when you need it.

## Results

My current codebase:
- 70% fewer dependencies
- Much faster iteration
- Easier to debug
- Actually enjoyable to work on

Sometimes the best tool is no tool at all.

---

*What's your take on AI frameworks? Essential or overkill?*`,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    author: 'Caleb',
    tags: ['AI', 'Development', 'Frameworks', 'Simplicity'],
    wordCount: 380,
    estimatedReadTime: 4,
  },
];

const statusColors = {
  draft: { bg: 'bg-gray-500/10', border: 'border-gray-500', text: 'text-gray-400', label: 'DRAFT' },
  reviewing: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-400', label: 'IN REVIEW' },
  approved: { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-400', label: 'APPROVED' },
  published: { bg: 'bg-cyan-500/10', border: 'border-cyan-500', text: 'text-cyan-400', label: 'PUBLISHED' },
};

export default function ReviewPage() {
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [calebTyping, setCalebTyping] = useState(false);

  // Simulate Caleb analyzing when a draft is selected
  useEffect(() => {
    if (selectedDraft) {
      setCalebTyping(true);
      const timer = setTimeout(() => setCalebTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedDraft?.id]);

  const updateDraftStatus = (id: string, status: Draft['status']) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status, updatedAt: new Date() } : d));
    if (selectedDraft?.id === id) {
      setSelectedDraft(prev => prev ? { ...prev, status, updatedAt: new Date() } : null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown renderer
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-pixel text-cyan-400 mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-pixel text-purple-400 mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-pixel text-yellow-400 mt-4 mb-2">$1</h3>')
      .replace(/^\*\*(.*)\*\*/gim, '<strong class="text-white">$1</strong>')
      .replace(/^\*(.*$)/gim, '<li class="ml-4 text-gray-300">$1</li>')
      .replace(/^\d\.\s(.*$)/gim, '<li class="ml-4 text-gray-300"><span class="text-cyan-400 mr-2">$&</span></li>')
      .replace(/^---$/gim, '<hr class="border-gray-700 my-6" />')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-cyan-400 pl-4 italic text-gray-400 my-4">$1</blockquote>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-800 px-1 py-0.5 rounded text-cyan-400 font-mono text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-900 border border-gray-800 p-4 rounded my-4 overflow-x-auto"><code class="text-sm font-mono text-gray-300">$1</code></pre>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
                <CalebOwl isTyping={calebTyping} mood="focused" />
              </div>
            </Link>
            <div>
              <h1 className="font-pixel text-2xl md:text-3xl text-cyan-400 tracking-wider">
                CONTENT REVIEW
              </h1>
              <p className="font-terminal text-gray-500">
                <span className="text-purple-400">CALEB</span> — EDITORIAL REVIEW BOARD
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 bg-gray-900/50 border border-gray-800 px-4 py-2">
            <div className="text-center">
              <div className="font-terminal text-xs text-gray-500">DRAFTS</div>
              <div className="font-pixel text-sm text-gray-400">
                {drafts.filter(d => d.status === 'draft').length}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="font-terminal text-xs text-gray-500">REVIEWING</div>
              <div className="font-pixel text-sm text-yellow-400">
                {drafts.filter(d => d.status === 'reviewing').length}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="font-terminal text-xs text-gray-500">READY</div>
              <div className="font-pixel text-sm text-green-400">
                {drafts.filter(d => d.status === 'approved').length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Draft List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-pixel text-sm text-purple-400 mb-4">DRAFTS</h2>
          {drafts.map((draft) => {
            const colors = statusColors[draft.status];
            return (
              <div
                key={draft.id}
                onClick={() => setSelectedDraft(draft)}
                className={`
                  p-4 border-2 cursor-pointer transition-all
                  ${selectedDraft?.id === draft.id
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-terminal text-sm text-gray-200 line-clamp-2">
                    {draft.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-[10px] font-pixel border ${colors.border} ${colors.bg} ${colors.text} whitespace-nowrap`}>
                    {colors.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-terminal text-gray-500">
                  <span>{draft.wordCount} words</span>
                  <span>{draft.estimatedReadTime} min read</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {draft.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 font-terminal">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs font-terminal text-gray-600">
                  Updated {formatDate(draft.updatedAt)}
                </div>
              </div>
            );
          })}

          {/* New Draft Button */}
          <button className="w-full p-4 border-2 border-dashed border-gray-700 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all text-center group">
            <span className="font-pixel text-sm text-gray-500 group-hover:text-cyan-400">+ NEW DRAFT</span>
          </button>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          {selectedDraft ? (
            <div className="bg-gray-900/50 border-2 border-gray-800 h-full flex flex-col">
              {/* Preview Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="font-pixel text-lg text-cyan-400 mb-1">{selectedDraft.title}</h2>
                  <div className="flex items-center gap-4 text-sm font-terminal text-gray-500">
                    <span>By {selectedDraft.author}</span>
                    <span>•</span>
                    <span>{selectedDraft.wordCount} words</span>
                    <span>•</span>
                    <span>{selectedDraft.estimatedReadTime} min read</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedDraft.status !== 'published' && (
                    <>
                      {selectedDraft.status !== 'draft' && (
                        <button
                          onClick={() => updateDraftStatus(selectedDraft.id, 'draft')}
                          className="px-3 py-2 bg-gray-800 border border-gray-600 font-terminal text-xs text-gray-400 hover:bg-gray-700 transition-colors"
                        >
                          MARK DRAFT
                        </button>
                      )}
                      {selectedDraft.status !== 'reviewing' && (
                        <button
                          onClick={() => updateDraftStatus(selectedDraft.id, 'reviewing')}
                          className="px-3 py-2 bg-yellow-400/10 border border-yellow-400 font-terminal text-xs text-yellow-400 hover:bg-yellow-400/20 transition-colors"
                        >
                          REVIEW
                        </button>
                      )}
                      {selectedDraft.status !== 'approved' && (
                        <button
                          onClick={() => updateDraftStatus(selectedDraft.id, 'approved')}
                          className="px-3 py-2 bg-green-400/10 border border-green-400 font-terminal text-xs text-green-400 hover:bg-green-400/20 transition-colors"
                        >
                          APPROVE
                        </button>
                      )}
                      <button
                        onClick={() => updateDraftStatus(selectedDraft.id, 'published')}
                        className="px-3 py-2 bg-cyan-400/10 border border-cyan-400 font-terminal text-xs text-cyan-400 hover:bg-cyan-400/20 transition-colors"
                      >
                        PUBLISH
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <article
                  className="prose prose-invert max-w-none font-terminal"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedDraft.content) }}
                />
              </div>

              {/* Preview Footer */}
              <div className="p-4 border-t border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-terminal text-xs text-gray-500">Tags:</span>
                  {selectedDraft.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-800 text-cyan-400 font-terminal">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="font-terminal text-xs text-gray-500">
                  Last updated: {formatDate(selectedDraft.updatedAt)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/50 border-2 border-gray-800 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <p className="font-pixel text-gray-500">SELECT A DRAFT TO REVIEW</p>
                <p className="font-terminal text-gray-600 text-sm mt-2">Choose from the list on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 border-t-2 border-gray-800 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 font-terminal text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              ← BACK TO MISSION CONTROL
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span>MEDIUM INTEGRATION:</span>
            <span className="text-yellow-400">COMING SOON</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
