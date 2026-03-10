# 🚀 SQL Editor

<div align="center">

<!-- TODO: Add project logo (e.g., an icon representing SQL or an editor) -->

[![GitHub stars](https://img.shields.io/github/stars/sahil0989/SQL-Editor?style=for-the-badge)](https://github.com/sahil0989/SQL-Editor/stargazers)

[![GitHub forks](https://img.shields.io/github/forks/sahil0989/SQL-Editor?style=for-the-badge)](https://github.com/sahil0989/SQL-Editor/network)

[![GitHub issues](https://img.shields.io/github/issues/sahil0989/SQL-Editor?style=for-the-badge)](https://github.com/sahil0989/SQL-Editor/issues)

[![GitHub license](https://img.shields.io/badge/license-Pending-lightgrey?style=for-the-badge)](LICENSE) <!-- TODO: Add actual license file and name if available -->

**An interactive and modern in-browser SQL editor powered by React, CodeMirror, and Supabase.**

[Live Demo](https://sql-editor-blush.vercel.app)

</div>

## 📖 Overview

This project is a sophisticated web-based SQL Editor designed for developers and database administrators to write, execute, and manage SQL queries directly within their browser. Leveraging the power of React for a dynamic user interface and CodeMirror 6 for advanced code editing capabilities, it provides a seamless and efficient environment for interacting with SQL databases. Backend operations, including query execution and potentially schema browsing, are handled through integration with Supabase, a robust open-source Firebase alternative providing PostgreSQL databases, authentication, and more.

## ✨ Features

-   **Interactive SQL Code Editor**: Powered by CodeMirror 6 with full SQL language support, syntax highlighting, and code assistance.
-   **Query Execution**: Execute SQL queries directly from the editor against a connected Supabase PostgreSQL database.
-   **Dynamic Result Display**: View query results in a clear, tabular format.
-   **Database Schema Interaction**: Integration with Supabase suggests possibilities for browsing tables, columns, and other database objects.
-   **Responsive Design**: A modern, adaptable UI built with Radix UI and styled with Tailwind CSS, ensuring a great experience on various screen sizes.
-   **Drag-and-Drop Functionality**: Enhances user interaction, potentially for reordering elements or customizing layouts.
-   **Global State Management**: Efficient application state handling using Zustand for a smooth user experience.
-   **Real-time Notifications**: Provides user feedback for operations using Sonner toasts.

## 🛠️ Tech Stack

**Frontend:**
-   **React** [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
-   **Tailwind CSS** [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
-   **Radix UI** [![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
-   **CodeMirror 6** [![CodeMirror](https://img.shields.io/badge/CodeMirror-C3C3C3?style=for-the-badge&logo=codemirror&logoColor=black)](https://codemirror.net/)
-   **React Router DOM** [![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
-   **Tanstack React Table** [![Tanstack Table](https://img.shields.io/badge/Tanstack_Table-FF4785?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/table)

**Backend:**
-   **Supabase (BaaS)** [![Supabase](https://img.shields.io/badge/Supabase-16a34a?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**Database:**
-   **PostgreSQL** (via Supabase) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**DevOps:**
-   **Vercel** (Deployment) [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

## 🚀 Quick Start

Follow these steps to get the SQL Editor up and running on your local machine.

### Prerequisites
-   **Node.js**: [LTS version recommended](https://nodejs.org/en/download/)
-   **npm**: Comes with Node.js
-   **Supabase Project**: You'll need an existing Supabase project (or create a new one) to connect the editor to a PostgreSQL database.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sahil0989/SQL-Editor.git
    cd SQL-Editor
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment setup**
    Create a `.env` file in the root of the project based on the following example:
    ```bash
    cp .env.example .env # (If .env.example exists, otherwise create it manually)
    ```
    Then, open `.env` and configure your Supabase environment variables:
    ```dotenv
    REACT_APP_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    REACT_APP_SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
    ```
    You can find these credentials in your Supabase project settings under "API".

4.  **Supabase Database Setup**
    Ensure your Supabase project has the necessary tables and data you wish to query. The `supabase` directory in this project might contain local setup or migration scripts if you are running Supabase locally or configuring a new project.

5.  **Start development server**
    ```bash
    npm run dev
    ```

6.  **Open your browser**
    Visit `http://localhost:5173` (or the port specified in your terminal) to access the SQL Editor.

## 📁 Project Structure

```
SQL-Editor/
├── public/                  # Static assets (index.html, favicon.ico)
├── src/                     # Main application source code
│   ├── components/          # Reusable UI components (Radix UI wrappers, custom components)
│   ├── layouts/             # Application layout components
│   ├── lib/                 # Utility functions, Supabase client initialization, helpers
│   ├── pages/               # Main views/routes of the application (e.g., EditorPage)
│   ├── store/               # Zustand store definitions for global state management
│   ├── styles/              # Global CSS files (including Tailwind directives)
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Entry point for the React application
├── supabase/                # Supabase local development configurations, migrations, or edge functions
├── .gitignore               # Specifies intentionally untracked files to ignore
├── package.json             # Project metadata and dependency definitions
├── package-lock.json        # Exact dependency versions
├── tailwind.config.js       # Tailwind CSS configuration file
└── vite.config.js           # Vite build tool configuration
```

## ⚙️ Configuration

### Environment Variables
The application relies on environment variables for connecting to Supabase. These should be defined in a `.env` file in the project root.

| Variable             | Description                                   | Default | Required |

|----------------------|-----------------------------------------------|---------|----------|

| `REACT_APP_SUPABASE_URL`  | The URL of your Supabase project.             | `N/A`   | Yes      |

| `REACT_APP_SUPABASE_KEY` | The `anon` public key for your Supabase project. | `N/A`   | Yes      |

### Configuration Files
-   `tailwind.config.js`: For customizing Tailwind CSS theme, plugins, and utility classes.
-   `vite.config.js`: For configuring Vite build options, development server, and plugins.

## 🔧 Development

### Available Scripts
In the project directory, you can run:

| Command           | Description                                                        |

|-------------------|--------------------------------------------------------------------|

| `npm run dev`     | Starts the development server.                                     |

| `npm run build`   | Builds the app for production to the `dist` folder.               |

| `npm run lint`    | Runs ESLint to identify and report on patterns found in JavaScript/JSX code. |

| `npm run preview` | Serves the production build locally for a preview.                 |

### Development Workflow
-   The project uses Vite for a fast development experience with Hot Module Replacement (HMR).
-   ESLint is configured for code quality and consistency.

## 🚀 Deployment

This project is configured for easy deployment to platforms like Vercel.

### Production Build
To create a production-optimized build:
```bash
npm run build
```
This command bundles React in production mode and optimizes the build for the best performance. The build artifacts will be placed in the `dist/` directory.

### Deployment Options
-   **Vercel**: Given the `homepage` URL, this project is well-suited for deployment on Vercel. Simply connect your GitHub repository to Vercel, and it will automatically detect the Vite setup and deploy your application.

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup for Contributors
Ensure you have the prerequisites installed and follow the "Quick Start" guide to get the development environment running.

## 📄 License

This project is currently unlicensed. Please refer to the repository owner for licensing information.

## 🙏 Acknowledgments

-   **React**: For building interactive user interfaces.
-   **Vite**: For a lightning-fast development experience.
-   **Supabase**: For providing a powerful open-source backend-as-a-service.
-   **CodeMirror 6**: For the advanced and customizable code editor.
-   **Tailwind CSS**: For simplifying responsive and modern styling.
-   **Radix UI**: For providing unstyled, accessible UI components.
-   **Zustand**: For intuitive and performant state management.
-   **@dnd-kit**: For drag-and-drop functionalities.

## 📞 Support & Contact

-   🐛 Issues: [GitHub Issues](https://github.com/sahil0989/SQL-Editor/issues)
-   👤 Author: [sahil0989](https://github.com/sahil0989)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Sahil

</div>

