# ⚡ Typi - Modern Typing Speed Test

A beautiful, modern typing speed test application built with React Router, TypeScript, and Tailwind CSS. Inspired by monkeytype.com, Typi offers a clean interface for improving your typing speed and accuracy.

## 🚀 Features

### ✅ Implemented
- **Real-time Typing Test**: Live WPM, accuracy, and error tracking
- **Multiple Text Types**: 
  - Common English words
  - Programming keywords and terms
  - Inspirational quotes
  - Numbers and digits
  - Punctuation practice
  - Mixed case text
- **Results Tracking**: Local storage with comprehensive statistics
- **Responsive Design**: Mobile-first approach, works on all devices
- **Statistics Dashboard**: Track your progress over time
- **Sortable History**: View and analyze your past results
- **Clean UI**: Modern, distraction-free interface

### 🔄 Coming Soon
- User accounts with cloud sync
- Leaderboards and competitions
- Custom text upload
- Typing lessons and tutorials
- Dark/light themes
- Sound effects
- Progressive Web App (PWA)
- Multiplayer typing races

## 🛠️ Tech Stack

- **Frontend**: React 19 + React Router 7
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Storage**: localStorage (cloud sync planned)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd typi

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run start
```

## 📱 Usage

1. **Choose Text Type**: Select from various text categories (common words, programming, quotes, etc.)
2. **Start Typing**: Click in the input field and start typing the displayed text
3. **Real-time Feedback**: See your WPM, accuracy, and errors update in real-time
4. **View Results**: Check your performance statistics and history
5. **Track Progress**: Monitor your improvement over time

## 🎯 Performance Metrics

- **WPM (Words Per Minute)**: Standard typing speed measurement
- **Accuracy**: Percentage of correctly typed characters
- **Error Count**: Number of incorrect keystrokes
- **Time**: Duration of the typing test
- **Progress Tracking**: Historical data and trends

## 🧪 Testing

```bash
# Run type checking
npm run typecheck

# Run tests (when implemented)
npm test
```

## 📊 Project Management

This project uses a comprehensive task management system. See:
- [`PROJECT_MANAGEMENT.md`](./PROJECT_MANAGEMENT.md) - Detailed project overview and roadmap
- [`notion-tasks.csv`](./notion-tasks.csv) - Import this into Notion for project tracking

### Notion Setup
1. Create a new database in Notion
2. Import the `notion-tasks.csv` file
3. Configure the following properties:
   - Task (Title)
   - Status (Select: Not Started, In Progress, Review, Done, Blocked)
   - Priority (Select: Low, Medium, High, Critical)
   - Category (Select: Frontend, Backend, UI/UX, Testing, Documentation, DevOps)
   - Assignee (Person)
   - Due Date (Date)
   - Description (Text)
   - Effort (Hours) (Number)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write clean, self-documenting code
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by [monkeytype.com](https://monkeytype.com)
- Built with [React Router](https://reactrouter.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from various emoji sets

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Typing! ⚡**

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
