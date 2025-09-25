# AI Logistics Flow

A production-ready, motion-heavy React application for AI-powered logistics optimization and vessel scheduling.

## Features

- **Interactive Dashboard** - Real-time KPI monitoring with animated charts
- **Vessel Tracking** - Live vessel maps with congestion heatmaps and shipping lanes
- **AI Predictions** - Pre-berthing delay prediction with confidence intervals
- **Optimization Engine** - Multi-objective optimization (cost, time, risk)
- **Interactive Scheduler** - Gantt charts with drag-and-drop and constraint enforcement
- **Scenario Planning** - Side-by-side scenario comparison and what-if analysis
- **Accessibility** - Full keyboard support, reduced motion, high contrast modes
- **Responsive Design** - Mobile-first design with progressive enhancement

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS + shadcn/ui components
- **Animation**: Framer Motion with reduced motion support
- **Charts**: Recharts for data visualization
- **Maps**: Mapbox/Deck.gl integration ready
- **Testing**: Jest + React Testing Library + Playwright
- **Documentation**: Storybook
- **Deployment**: Docker + Vercel + GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Docker (optional)

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ai-logistics-flow

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# Database (if using external DB)
DATABASE_URL=your_database_url_here

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id_here
\`\`\`

**Note**: Replace `your_mapbox_token_here` with your actual Mapbox token from [Mapbox Dashboard](https://account.mapbox.com/access-tokens/).

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook

### Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── optimize/          # Optimization engine
│   ├── scheduler/         # Interactive scheduler
│   ├── port-plant/        # Vessel maps & flows
│   └── operations/        # Operations console
├── components/            # React components
│   ├── ai/               # AI prediction components
│   ├── charts/           # Chart components
│   ├── maps/             # Map components
│   ├── optimization/     # Optimization components
│   ├── scheduler/        # Scheduler components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── __tests__/            # Unit tests
├── e2e/                  # E2E tests
└── .storybook/           # Storybook configuration
\`\`\`

## Key Features

### AI Delay Prediction

The AI prediction system provides:
- Point estimates with 90% confidence intervals
- Feature importance analysis
- Override capabilities with feedback
- Integration with cost calculations

### Optimization Engine

Multi-objective optimization supporting:
- Least-cost routing
- Fastest delivery
- Risk-averse planning
- Balanced optimization
- Live optimization trace visualization

### Interactive Scheduler

Gantt chart features:
- Drag-and-drop scheduling
- Sequential discharge constraints (Haldia always second)
- Real-time constraint validation
- Vessel timeline views
- Schedule conflict detection

### Accessibility

Full accessibility support including:
- Keyboard navigation
- Screen reader compatibility
- Reduced motion preferences
- High contrast mode
- Customizable font sizes
- ARIA labels and roles

## Testing

### Unit Tests

\`\`\`bash
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- components/ui/button.test.tsx
\`\`\`

### E2E Tests

\`\`\`bash
# Run E2E tests
npm run test:e2e

# Run specific test
npx playwright test e2e/dashboard.spec.ts

# Run with UI mode
npx playwright test --ui
\`\`\`

### Storybook

\`\`\`bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
\`\`\`

## Deployment

### Docker

\`\`\`bash
# Build Docker image
docker build -t ai-logistics-flow .

# Run container
docker run -p 3000:3000 ai-logistics-flow
\`\`\`

### Vercel

The application is configured for automatic deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

\`\`\`bash
# Build for production
npm run build

# Start production server
npm run start
\`\`\`

## API Endpoints

- `GET /api/mock/vessels` - Get vessel data
- `GET /api/mock/ports` - Get port information
- `POST /api/optimize` - Run optimization
- `POST /api/predict-delay` - AI delay prediction

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Update Storybook stories for UI components
- Ensure accessibility compliance

## Performance

The application includes several performance optimizations:

- Lazy loading of heavy libraries (Mapbox, Deck.gl)
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- Reduced motion fallbacks for animations
- Efficient re-rendering with React.memo and useMemo

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the Storybook documentation
- Review the test files for usage examples
