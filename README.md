# IndiaDataHub-Assignment

A comprehensive React/Next.js application for browsing and managing data catalogues with advanced search, pagination, and dataset switching capabilities.

## Features

### 🔐 Authentication
- **Login System**: Mock authentication with sample credentials
- **Session Management**: Persistent authentication state using localStorage
- **Route Protection**: Automatic redirection based on authentication status

### 📊 Data Management
- **Dataset Switching**: Toggle between Default and IMF datasets
- **Dynamic Loading**: Efficient data fetching and caching
- **Error Handling**: Comprehensive error states and fallbacks

### 🔍 Search & Filtering
- **Real-time Search**: Instant filtering across multiple fields (title, category, source, region)
- **Debounced Input**: Performance-optimized search with 300ms delay
- **Search Caching**: Intelligent result caching for faster subsequent searches

### 📋 Data Display
- **Responsive Table**: Clean, organized data presentation
- **Pagination**: 10 records per page with advanced pagination controls
- **Column Optimization**: Dynamic column display based on data availability

### ⚡ Performance Optimizations
- **Virtualization**: Efficient handling of large datasets
- **Memory Management**: Optimized data chunking and garbage collection
- **Performance Monitoring**: Built-in performance measurement tools
- **React Optimization**: Memoized components and hooks

### 🎨 UI/UX
- **Responsive Design**: Works seamlessly on all device sizes
- **Loading States**: Smooth loading indicators and transitions
- **Error States**: User-friendly error messages and recovery options
- **Accessibility**: ARIA labels and keyboard navigation support

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Performance**: Custom hooks for virtualization and debouncing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-catalogue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Ensure data files are in place**
   The following files should be in the `public/` directory:
   - `response1.json` (Default dataset)
   - `response2.json` (IMF dataset)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to `http://localhost:3000` in your browser

## Usage

### Login Credentials
Use any of these sample credentials to access the application:

- **Username**: admin, **Password**: admin123
- **Username**: user, **Password**: user123  
- **Username**: test, **Password**: test123

### Navigation Flow
1. **Login Page** (`/`) - Enter credentials to authenticate
2. **Data Catalogue** (`/catalogue`) - Main application interface

### Key Features Usage

#### Dataset Switching
- Use the dropdown in the header to switch between "Default" and "IMF" datasets
- The interface automatically updates categories and records
- Loading indicators show progress during data transitions

#### Search Functionality
- Type in the search box to filter results across all fields
- Search is debounced for optimal performance
- Clear search with the 'X' button

#### Pagination
- Navigate through pages using the pagination controls
- Jump to specific pages or use Previous/Next buttons
- View current page info and total record counts

#### Sidebar Categories
- Expandable category tree structure
- Click to expand/collapse category groups
- Responsive design - collapsible on smaller screens

## Data Structure

### Default Dataset (response1.json)
Contains Indian financial and economic data with:
- **Categories**: Hierarchical structure covering Agriculture, Banking, Energy, etc.
- **Frequent Data**: Array of 18 records with detailed metadata

### IMF Dataset (response2.json)
Contains International Monetary Fund data with:
- **Categories**: Geographic and economic classification
- **Frequent Data**: Large dataset with international economic indicators

### Data Fields
Each record contains:
- `id`: Unique identifier
- `title`: Descriptive name
- `cat`: Main category
- `subCat`: Sub-category
- `freq`: Frequency (Annual, Monthly, etc.)
- `unit`: Measurement unit
- `src`: Data source
- `region`: Geographic region (IMF dataset)

## Performance Optimizations

### 1. Data Filtering
- **Debounced Search**: 300ms delay prevents excessive filtering
- **Result Caching**: Stores search results for faster retrieval
- **Memory Management**: Automatic cache cleanup when size exceeds limits

### 2. Virtualization
- **Pagination**: Only renders visible records (10 per page)
- **Component Memoization**: Prevents unnecessary re-renders
- **Efficient State Updates**: Optimized React state management

### 3. Large Dataset Handling
- **Chunked Processing**: Processes large datasets in manageable chunks
- **Progressive Loading**: Loads data as needed
- **Performance Monitoring**: Real-time performance measurement

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home/Login page
│   └── catalogue/
│       └── page.tsx        # Catalogue page
├── components/
│   ├── LoginPage.tsx       # Authentication component
│   ├── CataloguePage.tsx   # Main catalogue layout
│   ├── Header.tsx          # Navigation and search
│   ├── Sidebar.tsx         # Category navigation
│   └── DataTable.tsx       # Data display and pagination
├── context/
│   ├── AuthContext.tsx     # Authentication state
│   └── DataContext.tsx     # Data management state
├── hooks/
│   └── usePerformance.ts   # Performance optimization hooks
├── types/
│   └── index.ts            # TypeScript type definitions
└── utils/
    └── auth.ts             # Authentication utilities
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency rules
- **Prettier**: Code formatting (if configured)

### Environment Variables
No environment variables required for basic functionality.

## Deployment

### Build and Deploy
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Static Export (Optional)
The application can be configured for static export if needed.

## Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Responsive Design**: Mobile, tablet, and desktop support
- **Accessibility**: WCAG guidelines compliance

## License
This project is part of an assignment demonstration.

## Support
For questions or issues, please refer to the project documentation or contact the development team.
