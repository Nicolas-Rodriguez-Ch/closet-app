# LookBook - Your Personal Digital Wardrobe

LookBook is an elegant, intuitive digital wardrobe application that revolutionizes how you organize and style your clothing. Transform your fashion experience by digitizing your wardrobe, creating stunning outfit combinations, and accessing your entire collection from anywhere.

## ✨ Features

- **Smart Apparel Management**: Effortlessly upload, categorize, and browse your clothing items with our intuitive interface
- **Creative Outfit Builder**: Mix and match tops, bottoms, shoes, and coats to visualize perfect outfit combinations before you wear them
- **Responsive Design**: Experience seamless functionality across all your devices - mobile, tablet, or desktop
- **Interactive Browsing**: Discover new outfit possibilities with our engaging carousel navigation
- **Elegant UI**: Enjoy a visually pleasing experience with our thoughtfully designed color palette and smooth animations

## 🛠️ Tech Stack

- **Framework**: Built on Next.js 15 with the modern App Router architecture for optimal performance
- **Frontend**: Powered by React 19, with Redux Toolkit for state management and Tailwind CSS for pixel-perfect styling
- **Backend**: Leverages Next.js API Routes for seamless full-stack functionality
- **Database**: MongoDB with Mongoose for flexible, scalable data storage
- **Media Storage**: Cloudinary integration for lightning-fast image uploads and optimized delivery
- **Testing**: Comprehensive test suite using Jest and React Testing Library with 90%+ coverage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database (local or Atlas)
- Cloudinary account for media storage

### Installation

1. Clone the repository
```bash
git clone https://github.com/Nicolas-Rodriguez-Ch/closet-app.git
cd lookbook
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```
DATABSE_URI=mongodb://localhost:27017/
HTML_HEADER=LookBook
HTML_DESCRIPTION=Your personal digital wardrobe
NEXT_PUBLIC_API_URL=http://localhost:3000/api/
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=your_folder_name
```

4. Launch the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to explore your new digital wardrobe

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate detailed coverage report
npm run test:coverage
```

## 📂 Application Architecture

- `app/`: Next.js app router pages and feature-rich components
- `lib/`: Redux store configuration, feature slices, and TypeScript types
- `services/`: API service functions with robust error handling
- `database/`: MongoDB connection manager and data models
- `public/`: Static assets and environment constants

## 💫 Key Features Explored

### Sophisticated Apparel Management

LookBook provides a complete solution for managing your clothing items:

- Upload high-quality images with detailed information
- Browse your collection with intuitive filtering by category
- View comprehensive details for each item
- Maintain your digital wardrobe with easy removal options

### Creative Outfit Creation

Express your style by combining clothing items into cohesive outfits:

- Build perfectly coordinated outfits with visual previews
- Organize outfits with custom titles, descriptions, and searchable tags
- View your outfit collection in an aesthetically pleasing grid layout
- Access detailed outfit information and individual components

## 🌐 Deployment

Deploy your LookBook instance on Vercel or your preferred hosting platform:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are warmly welcomed! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Connect With Me

I'd love to hear your feedback or answer any questions about LookBook!

- **GitHub**: [Nicolas-Rodriguez-Ch](https://github.com/Nicolas-Rodriguez-Ch)
- **LinkedIn**: [nicolas-rodriguezc](https://www.linkedin.com/in/nicolas-rodriguezc/)
- **Email**: [nicolasrodriguezch@hotmail.com](mailto:nicolasrodriguezch@hotmail.com)
- **WhatsApp**: [Contact me](https://wa.me/573002643270)