# synced.lat - Premium Link-in-Bio

A high-end, glossy "guns.lol" style bio site designed for maximum aesthetic appeal. Built with React, Framer Motion, and Tailwind CSS. Fully compatible with GitHub Pages.

## ✨ Features

- **Modern Black Glossy Aesthetic**: Deep blacks, glassmorphism, and subtle mesh gradients.
- **Interactive Entry Splash**: Custom splash screen to unlock background audio.
- **Audio Background**: Integrated music player with a custom visualizer button.
- **Custom Cursor**: Reacting mouse follower for a premium feel.
- **Responsive Design**: Looks pixel-perfect on both desktop and mobile.
- **Data-Driven**: Easily customizable via a single JSON config file.

## 🛠 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**:
    git clone https://github.com/your-username/synced-lat.git
    cd synced-lat

2. **Install dependencies**:
    npm install

3. **Start development server**:
    npm run dev

4. **Build for production**:
    npm run build

## ⚙️ Configuration

To change the site content, edit `src/data/config.json`:

    {
      "profile": {
        "username": "YourName",
        "tagline": "your.brand",
        "bio": "Your short bio here...",
        "avatar": "URL to image",
        "audioUrl": "URL to mp3 file"
      },
      "socials": [
        {
          "label": "Discord",
          "url": "https://...",
          "icon": "MessageSquare"
        }
      ]
    }

*Note: Icons are supported from the Lucide icon set. Use the PascalCase name (e.g., `Github`, `MessageSquare`, `Instagram`, `Twitter`).*

## 🌐 Deployment to GitHub Pages

1. Build the project: `npm run build`
2. Ensure `vite.config.js` has `base: './'`.
3. Create a new repository on GitHub.
4. Push the contents of the `dist` folder to your GitHub repository (or use the `gh-pages` branch).
5. In GitHub Settings -> Pages, select the source branch where your build exists.

## 📝 Project Structure

- `src/components/`: UI components (ProfileCard, CustomCursor, etc.)
- `src/data/config.json`: All your profile data and links.
- `src/App.jsx`: Main entry point and layout logic.
- `tailwind.config.js`: Custom theme and color configurations.

## 🧪 Troubleshooting

- **Audio not playing**: Browsers block audio until a user interaction (click) occurs. This is why the "Entry Screen" is required.
- **Icons not showing**: Ensure you are using the correct icon name from Lucide (e.g., `MessageSquare` instead of `discord`).
- **Images not loading**: Check that the URLs in `config.json` are valid and accessible.
