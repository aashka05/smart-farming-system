const axios = require('axios');

const CHANNEL_ID = 'UC9OoW-ceIDeJLBVX37gBCww';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Simple XML tag extractor (works for YouTube Atom feeds)
function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}
function extractAttr(xml, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i');
  const m = xml.match(re);
  return m ? m[1] : '';
}

// @desc    Get real videos from the YouTube channel RSS feed
// @route   GET /api/tutorials/playlist
// @access  Public
const getPlaylistVideos = async (req, res) => {
  try {
    const { data: xml } = await axios.get(FEED_URL, { timeout: 10000 });

    // Split into <entry> blocks
    const entries = xml.split('<entry>').slice(1); // first item is <feed> header

    const videos = entries.map((entry) => {
      const videoId = extractTag(entry, 'yt:videoId');
      const title = extractTag(entry, 'title')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      const published = extractTag(entry, 'published');
      const thumbnail = extractAttr(entry, 'media:thumbnail', 'url')
        || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      const views = extractAttr(entry, 'media:statistics', 'views') || '0';
      const rating = extractAttr(entry, 'media:starRating', 'average') || '0';

      // Get first ~200 chars of description, strip boilerplate
      let description = extractTag(entry, 'media:description') || '';
      // Strip common boilerplate footer that starts with "गो-कृपा" or phone numbers
      const boilerplateIdx = description.indexOf('"गो-कृपा अमृतम्"');
      if (boilerplateIdx > 0) description = description.substring(0, boilerplateIdx).trim();
      if (description.length > 200) description = description.substring(0, 197) + '...';
      description = description
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\n/g, ' ')
        .trim();

      return { videoId, title, published, thumbnail, views: parseInt(views, 10), rating: parseFloat(rating), description };
    }).filter((v) => v.videoId);

    res.json({ videos, channelId: CHANNEL_ID, source: 'youtube-rss' });
  } catch (error) {
    console.error('Playlist fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch playlist', error: error.message });
  }
};

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

module.exports = { getTutorials, getTutorialById, getPlaylistVideos };
