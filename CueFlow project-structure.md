# CueFlow Project Structure (Next.js 15)

```
cueflow/
├── README.md                 # Project documentation
├── package.json             # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.js         # Next.js configuration
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
│
├── src/
│   ├── app/              # Next.js 15 app directory
│   │   ├── layout.tsx    # Root layout with providers
│   │   ├── page.tsx      # Landing page
│   │   ├── error.tsx     # Error boundary
│   │   ├── loading.tsx   # Loading state
│   │   │
│   │   ├── api/         # Server API routes
│   │   │   └── realtime/ # Real-time endpoints
│   │   │
│   │   ├── auth/        # Authentication routes (server components)
│   │   │   ├── login/   # Login page
│   │   │   └── signup/  # Sign up page
│   │   │
│   │   ├── dashboard/   # Main dashboard (server component)
│   │   │   ├── page.tsx # Shows listing
│   │   │   └── loading.tsx
│   │   │
│   │   └── shows/       # Show management
│   │       ├── [id]/    # Dynamic show routes
│   │       │   ├── page.tsx
│   │       │   ├── cues/ # Cue management
│   │       │   └── settings/ # Show settings
│   │       └── new/     # New show creation
│   │
│   ├── components/      # Shared components
│   │   ├── ui/         # Base UI components (client)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── modal.tsx
│   │   │
│   │   ├── shows/      # Show-specific components
│   │   │   ├── cue-list/
│   │   │   │   ├── cue-list.tsx      # Server component
│   │   │   │   └── cue-row.tsx       # Client component
│   │   │   ├── cue-form.tsx
│   │   │   └── show-header.tsx
│   │   │
│   │   └── layout/     # Layout components
│   │       ├── header.tsx
│   │       └── sidebar.tsx
│   │
│   ├── lib/            # Shared utilities
│   │   ├── supabase/   # Supabase integration
│   │   │   ├── client.ts     # Client-side client
│   │   │   ├── server.ts     # Server-side client
│   │   │   └── types.ts      # Supabase types
│   │   │
│   │   ├── utils/      # Utility functions
│   │   │   ├── time.ts
│   │   │   └── cues.ts
│   │   │
│   │   └── hooks/      # Custom React hooks (client)
│   │       ├── use-cues.ts
│   │       └── use-show.ts
│   │
│   ├── types/          # TypeScript type definitions
│   │   ├── show.ts
│   │   ├── cue.ts
│   │   └── user.ts
│   │
│   └── styles/         # Global styles
│       └── globals.css
│
├── public/            # Static assets
│   ├── images/
│   └── icons/
│
└── tests/            # Test files
    ├── components/
    └── utils/
```

## Key Updates for Next.js 15

### Server vs Client Components
- Clear separation between server and client components
- Server components are the default, marked with 'use server'
- Client components marked with 'use client' when needed

### Enhanced Data Fetching
- Improved server-side data fetching with streaming
- Parallel data loading capabilities
- Better cache control and revalidation

### Security and Authentication
- Enhanced middleware support
- Built-in auth patterns
- Improved route protection

### Database Schema (Supabase)

```sql
-- Core tables
shows
  id uuid primary key
  name text not null
  created_at timestamp
  updated_at timestamp
  owner_id uuid references auth.users
  
cue_lists
  id uuid primary key
  show_id uuid references shows
  date date not null
  version int not null
  
cues
  id uuid primary key
  cue_list_id uuid references cue_lists
  cue_number text not null
  start_time time
  run_time interval
  end_time time
  activity text
  graphics text
  video text
  audio text
  lighting text
  notes text
  status text
  
users
  id uuid primary key references auth.users
  email text unique
  name text
  role text
  
permissions
  id uuid primary key
  user_id uuid references users
  show_id uuid references shows
  role text
```

## Key Differences from Next.js 14
1. Enhanced server components model
2. Improved data streaming capabilities
3. Better type safety with server actions
4. More efficient client/server component splitting
5. Enhanced middleware capabilities
6. Better cache management
7. Improved build performance