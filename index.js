// Import required modules
const express = require('express');
const youtube = require('youtube-sr').default;
const cors = require('cors');

// Initialize the Express app
const app = express();
const PORT = 8000;

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

/**
 * GET /video
 * Fetch video details by URL
 * Query parameter: url (string)
 */
app.get('/video', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Video URL is required' });
    }

    try {
        // Extract video ID from the URL and fetch video details
        const video = await youtube.getVideo(url);
        res.json({
            id: video.id,
            title: video.title,
            duration: video.durationFormatted,
            views: video.views,
            url: video.url,
            thumbnail: video.thumbnail.url,
            channel: {
                name: video.channel.name,
                url: video.channel.url,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch video details. Please check the URL.' });
    }
});

/**
 * GET /homepage
 * Fetch trending videos (homepage-like content)
 */
app.get('/homepage', async (req, res) => {
    try {
        // Fetch trending videos based on search query
        const videos = await youtube.search("trending song", { limit: 18 });
        const formattedVideos = videos.map(video => ({
            id: video.id,
            title: video.title,
            duration: video.durationFormatted,
            views: video.views,
            url: video.url,
            thumbnail: video.thumbnail.url,
            channel: {
                name: video.channel.name,
                url: video.channel.url,
            },
        }));

        res.json({ videos: formattedVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch homepage videos.' });
    }
});


app.get('/autocomplete', async (req, res) => {
    const { txt } = req.query;

    if (!txt) {
        return res.status(400).json({ error: 'text is required' });
    }

    try {
        // Extract video ID from the txt and fetch video details
        const autocomplete = await youtube.getSuggestions(txt)
        res.json(autocomplete);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch video details. Please check the URL.' });
    }
});


app.get('/search', async (req, res) => {
    const { txt } = req.query;

    if (!txt) {
        return res.status(400).json({ error: 'text is required' });
    }

    try {
        // Extract video ID from the txt and fetch video details
        const autocomplete = await youtube.search(txt, { limit: 18 })
        res.json(autocomplete);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch video details. Please check the URL.' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
