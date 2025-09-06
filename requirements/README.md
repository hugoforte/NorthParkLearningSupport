# NorthPark Learning Support - Requirements

This folder contains the complete requirements and specifications for the NorthPark Learning Support application - a teacher note-taking system for tracking student progress and observations.

## Documentation Structure

- **[Project Overview](./01-project-overview.md)** - Application purpose, goals, and scope
- **[User Stories](./02-user-stories.md)** - Detailed user stories and acceptance criteria
- **[Data Model](./03-data-model.md)** - Database schema and entity relationships
- **[API Requirements](./04-api-requirements.md)** - Backend API specifications
- **[UI/UX Requirements](./05-ui-ux-requirements.md)** - User interface and experience requirements
- **[Authentication & Authorization](./06-authentication.md)** - User management and security
- **[Technical Requirements](./07-technical-requirements.md)** - Technology stack and implementation details

## Quick Start

1. Review the [Project Overview](./01-project-overview.md) to understand the application purpose
2. Check [User Stories](./02-user-stories.md) for detailed functionality requirements
3. Examine the [Data Model](./03-data-model.md) for database design
4. Follow the [Technical Requirements](./07-technical-requirements.md) for implementation

## Application Overview

**NorthPark Learning Support** is a web application designed for teachers to:
- Log in securely to their account
- Select students from their classes
- Add and manage notes about student progress, behavior, and observations
- Organize students by grades (K-9) and classes
- Track student information efficiently

## Key Features

- **Teacher Authentication** - Secure login system for teachers
- **Student Management** - Organize students by grade and class
- **Note Creation** - Add detailed notes about student progress
- **Class Organization** - Manage classes within grade levels
- **Data Security** - Protect sensitive student information

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: tRPC for type-safe APIs
- **Database**: Prisma with PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (recommended)

## Getting Started

```bash
# Review requirements
cat requirements/01-project-overview.md

# Start development
pnpm dev
```

## Resources

- [T3 Stack Documentation](https://create.t3.gg/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
