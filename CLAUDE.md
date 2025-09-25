# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a ClaudeCode Usage Dashboard - a React TypeScript application that visualizes AI model usage and cost data from `ccusage` JSON files. The dashboard provides interactive charts and tables for analyzing daily usage trends, model cost distribution, and detailed usage statistics.

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Dependencies

- **React 19.1.1** - UI framework with modern features
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Recharts 3.2.1** - Chart library for data visualization
- **Tailwind CSS** - Utility-first CSS framework (used via CDN in index.html)

## Project Architecture

### Core Data Flow
1. **File Upload** (`App.tsx` → `FileUpload.tsx`) - Handles JSON file upload and validation
2. **Data Processing** - Parses `ccusage` JSON format with `daily` and `totals` structure
3. **State Management** - React hooks manage usage data, errors, and file names
4. **Dashboard Rendering** (`Dashboard.tsx`) - Coordinates all visualization components

### Component Structure
- **App.tsx** - Root component with file upload state management
- **Dashboard.tsx** - Main dashboard layout and model filtering logic
- **FileUpload.tsx** - Drag-and-drop file upload interface
- **StatCard.tsx** - Statistics display cards (total cost, tokens, etc.)
- **DailyUsageChart.tsx** - Line chart for daily usage trends
- **ModelDistributionPieChart.tsx** - Interactive pie chart with drill-down functionality
- **DataTable.tsx** - Sortable table with detailed usage data

### Data Types (`types.ts`)
- **UsageData** - Root structure containing `daily` array and `totals`
- **DailyUsage** - Individual day data with tokens, costs, and model breakdowns
- **ModelBreakdown** - Per-model usage statistics
- **Totals** - Aggregated statistics across all time periods

## Key Features

### File Upload System
- Drag-and-drop interface
- JSON validation for `ccusage` format
- Error handling for malformed files
- File name tracking and reset functionality

### Interactive Visualizations
- **Line Chart**: Shows daily cost and token usage trends over time
- **Pie Chart**: Model cost distribution with click-to-filter functionality
- **Data Table**: Sortable columns for detailed analysis
- **Stat Cards**: Key metrics summary (total cost, tokens, etc.)

### Model Filtering
- Click on pie chart segments to filter dashboard by specific model
- Reset filter to view all data
- Updates all components when filter is applied

## Configuration

### TypeScript Config
- Target: ES2022
- Module: ESNext with bundler resolution
- JSX: React-jsx transform
- Path aliases: `@/*` points to project root

### Vite Config
- Development server: port 3000, host 0.0.0.0
- React plugin for JSX transformation
- Path alias resolution for `@/*`
- Environment variable handling for API keys

## Expected Data Format

The application expects JSON files with this structure:
```json
{
  "daily": [
    {
      "date": "2024-01-01",
      "inputTokens": 1000,
      "outputTokens": 500,
      "cacheCreationTokens": 0,
      "cacheReadTokens": 0,
      "totalTokens": 1500,
      "totalCost": 0.015,
      "modelsUsed": ["claude-3-sonnet"],
      "modelBreakdowns": [...]
    }
  ],
  "totals": {
    "inputTokens": 10000,
    "outputTokens": 5000,
    "cacheCreationTokens": 0,
    "cacheReadTokens": 0,
    "totalCost": 0.15,
    "totalTokens": 15000
  }
}
```

## Development Notes

- All components are TypeScript React functional components
- State management uses React hooks (useState, useCallback)
- Error handling is built into the file upload process
- Responsive design works across mobile, tablet, and desktop
- Korean language UI with proper text encoding
- No external API calls - all processing happens client-side