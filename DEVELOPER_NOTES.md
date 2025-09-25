# Developer Notes

## Architecture Decisions

### State Management
- Using React's built-in state management (useState, useContext) for simplicity
- SWR for server state management and caching
- Local storage for user preferences (accessibility settings)

### Animation Strategy
- Framer Motion for complex animations with reduced motion support
- CSS transitions for simple hover effects
- Motion preferences respected throughout the application

### Data Flow
- Server components for initial data loading
- Client components for interactive features
- API routes for data mutations and external integrations

### Performance Considerations
- Lazy loading implemented for heavy components (maps, charts)
- React.memo used for expensive components
- useMemo/useCallback for expensive calculations
- Image optimization with Next.js Image component

## Key Constraints

### Haldia Sequential Discharge
The scheduler enforces that Haldia port must always be the second discharge port:
- Implemented in `components/scheduler/schedule-constraints.tsx`
- Validation occurs on drag-and-drop operations
- Visual feedback provided for constraint violations

### Motion Accessibility
All animations respect `prefers-reduced-motion`:
- Custom hook `useReducedMotion` checks system preference
- Framer Motion variants include reduced motion alternatives
- CSS animations use `motion-reduce:` prefixes

### API Design
Mock APIs simulate realistic delays and data structures:
- Vessel data includes real-time positions and status
- Port data includes congestion levels and capacity
- Optimization API returns step-by-step traces
- Prediction API includes confidence intervals

## Testing Strategy

### Unit Tests
- Focus on business logic and user interactions
- Mock external dependencies (APIs, animations)
- Test accessibility features and keyboard navigation
- Achieve 70%+ code coverage

### E2E Tests
- Test critical user journeys
- Verify responsive design across devices
- Test accessibility with screen readers
- Performance testing for large datasets

### Visual Testing
- Storybook for component documentation
- Visual regression testing with Chromatic (optional)
- Cross-browser testing with Playwright

## Deployment Notes

### Environment Variables
Required for production:
- `NEXT_PUBLIC_MAPBOX_TOKEN` - For map functionality
- `DATABASE_URL` - If using external database
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` - For analytics

### Performance Monitoring
- Vercel Analytics for Core Web Vitals
- Error tracking with Sentry (optional)
- Custom performance metrics for optimization engine

### Security Considerations
- API routes include basic validation
- CORS headers configured for API endpoints
- No sensitive data in client-side code
- Environment variables properly scoped

## Future Enhancements

### Planned Features
- Real-time WebSocket connections for live updates
- Advanced map features with Deck.gl integration
- Machine learning model integration for predictions
- Multi-tenant support for different organizations

### Technical Debt
- Consider migrating to a more robust state management solution (Zustand/Redux)
- Implement proper error boundaries for better error handling
- Add more comprehensive logging and monitoring
- Consider server-side rendering for better SEO

### Performance Optimizations
- Implement virtual scrolling for large datasets
- Add service worker for offline functionality
- Optimize bundle size with tree shaking
- Implement progressive loading for charts and maps

## Troubleshooting

### Common Issues

**Animation Performance**
- Check if `prefers-reduced-motion` is enabled
- Verify GPU acceleration is available
- Consider reducing animation complexity

**Chart Rendering**
- Ensure data is properly formatted
- Check for memory leaks with large datasets
- Verify responsive container dimensions

**Map Integration**
- Verify Mapbox token is valid
- Check network connectivity for tile loading
- Ensure proper cleanup of map instances

**Test Failures**
- Clear Jest cache: `npx jest --clearCache`
- Update snapshots: `npm run test -- -u`
- Check for async/await issues in tests

### Debug Mode
Enable debug logging by setting:
\`\`\`env
NODE_ENV=development
DEBUG=ai-logistics:*
\`\`\`

### Performance Profiling
Use React DevTools Profiler to identify:
- Unnecessary re-renders
- Expensive component updates
- Memory leaks in useEffect hooks
