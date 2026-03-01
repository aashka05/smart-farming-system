// @desc    Get tutorials by category
// @route   GET /api/tutorials
// @access  Public
const getTutorials = async (req, res) => {
  try {
    const { category } = req.query;
    let tutorials = getMockTutorials();

    if (category && category !== 'all') {
      tutorials = tutorials.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({ tutorials, source: 'mock' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tutorials', error: error.message });
  }
};

// @desc    Get tutorial by ID
// @route   GET /api/tutorials/:id
// @access  Public
const getTutorialById = async (req, res) => {
  try {
    const tutorials = getMockTutorials();
    const tutorial = tutorials.find((t) => t.id === req.params.id);

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    res.json(tutorial);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tutorial', error: error.message });
  }
};

function getMockTutorials() {
  return [
    { id: '1', title: 'Introduction to Organic Farming', category: 'Organic Farming', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '12:34', description: 'Learn the basics of organic farming and sustainable agricultural practices.' },
    { id: '2', title: 'Setting Up Drip Irrigation System', category: 'Drip Irrigation', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '18:22', description: 'Step-by-step guide to installing a drip irrigation system on your farm.' },
    { id: '3', title: 'Natural Pest Control Methods', category: 'Pest Control', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '15:45', description: 'Effective organic and natural pest control techniques for common crops.' },
    { id: '4', title: 'Seasonal Crop Planning Guide', category: 'Seasonal Crop Planning', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '20:10', description: 'Plan your crops according to seasons for maximum yield and profit.' },
    { id: '5', title: 'Soil Health Management', category: 'Soil Health', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '14:55', description: 'Understanding soil health and how to improve soil fertility naturally.' },
    { id: '6', title: 'Advanced Composting Techniques', category: 'Organic Farming', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '16:30', description: 'Learn how to make high-quality compost for your organic farm.' },
    { id: '7', title: 'Water-Efficient Farming Practices', category: 'Drip Irrigation', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '11:40', description: 'Techniques to reduce water usage while maintaining crop productivity.' },
    { id: '8', title: 'Integrated Pest Management (IPM)', category: 'Pest Control', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '22:15', description: 'Comprehensive approach to pest management combining multiple strategies.' },
    { id: '9', title: 'Kharif Season Crop Selection', category: 'Seasonal Crop Planning', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '13:20', description: 'Best crops to grow during the kharif season and their requirements.' },
    { id: '10', title: 'Soil Testing at Home', category: 'Soil Health', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', videoUrl: '#', duration: '9:50', description: 'Simple methods to test your soil quality at home without expensive equipment.' },
  ];
}

module.exports = { getTutorials, getTutorialById };
