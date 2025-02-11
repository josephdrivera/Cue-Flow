# CueFlow - Technical Show Management System
## Project Overview
CueFlow is a modern, web-based application designed for managing and coordinating technical cues in live productions, events, and shows. The system provides real-time collaboration features and comprehensive cue management capabilities for technical directors, stage managers, and production teams.

## Target Audience
- Show Callers/Stage Managers
- Technical Directors
- Production Team Members (Graphics, Video, Audio, Lighting operators)
- Event Production Companies

## Core Features

### 1. Show Management
- Multiple show creation and management
- Per-day cue list versions
- Comprehensive show statistics and timing information
- Show search and filtering capabilities

### 2. Cue Management
- Detailed cue creation and editing
  - Unique Cue ID system
  - Start time, run time, and end time tracking
  - Department-specific technical details (Graphics, Video, Audio, Lighting)
  - Activity descriptions and notes
- Drag-and-drop cue reordering
- Automatic timing calculations and updates

### 3. Real-time Show Execution
- Live cue status tracking with color coding:
  - Completed cues (red)
  - Active cue (green)
  - Standby cue (yellow)
  - Upcoming cues (default)
- Keyboard shortcuts for show operation:
  - Space bar for cue advancement
  - Arrow keys for navigation
  - Custom hotkeys for common actions
- Prominent current/next cue display
- "Go" button for cue execution

### 4. Collaboration Features
- Multi-user real-time access
- Role-based permissions system:
  - Show Caller/Producer (full access)
  - Department Operators (limited to their section)
  - View-only access for other team members
- Live updates across all connected devices
- Conflict resolution for simultaneous edits

### 5. User Interface
- Dark/Light theme options
- Adjustable font sizes
- Configurable display options:
  - Table borders
  - Search bar visibility
  - Statistics display
- Responsive design for various screen sizes

## Technical Architecture

### Frontend
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Radix UI for accessible components
- Real-time updates using Supabase subscriptions

### Backend
- Supabase for:
  - Real-time database
  - Authentication
  - Row Level Security (RLS) for permissions
  - Real-time subscriptions

### Data Model
- Shows
  - ID, name, dates, metadata
- Cue Lists
  - Show ID, date, version
- Cues
  - Cue ID, timings, department details
- Users
  - Authentication and role information
- Permissions
  - Role-based access controls

## Development Phases

### Phase 1: Core Functionality
- Basic show and cue management
- User authentication
- Essential UI components
- Basic real-time updates

### Phase 2: Collaboration Features
- Role-based permissions
- Real-time conflict resolution
- Department-specific views
- Advanced cue management

### Phase 3: Show Execution
- Live cue status tracking
- Keyboard shortcuts
- Show timing features
- Statistics and monitoring

### Phase 4: Polish and Optimization
- UI/UX improvements
- Performance optimization
- Additional customization options
- Error handling and recovery

## Technical Considerations

### Security
- Role-based access control (RBAC)
- Secure authentication
- Data encryption
- Regular backups

### Scalability
- Efficient real-time updates
- Performance optimization for large cue lists
- Handling multiple simultaneous shows
- Database optimization

### Reliability
- Offline capabilities
- Error recovery
- Backup systems
- Data validation

## Future Expansion Possibilities
- Mobile companion app
- Additional department integrations
- Advanced statistics and reporting
- Show templates and presets
- Multi-language support
- Custom theme creation

## Development Guidelines
- TypeScript for type safety
- Component-based architecture
- Comprehensive testing
- Performance monitoring
- Regular security audits
