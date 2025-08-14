# File Browser System

A simple Next.js file browsing system.

## Features

- **Directory Tree Display**: Browse project files and folders
- **File Viewing**: Click files to view contents
- **Smart Filtering**: Automatically hides build folders (.next, node_modules, etc.)
- **Gitignore Support**: Respects .gitignore patterns

## Usage

1. `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Open File Browser"

## API Endpoints

- `GET /api/dirdisp` - Returns directory tree
- `GET /api/read?path=<filepath>` - Returns file content

## Components

- **FileExplorer**: Tree view sidebar
- **FileViewer**: File content display
