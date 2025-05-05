// Import required modules
const express = require('express');
const youtube = require('youtube-sr').default;
const cors = require('cors');
const youtubesearchapi = require("youtube-search-api");

// Initialize the Express app
const app = express();
const PORT = 8000;

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());


app.get('/getnext', async (req, res) => {
    const { url } = req.query;
    console.log(url)

    if (!url) {
        return res.status(400).json({ error: 'Video URL is required' });
    }

    try {
        data = await youtubesearchapi.GetVideoDetails(url)
        var nexts = []
        data.suggestion.map((elm)=>{
            nexts.push(`https://www.youtube.com/watch?v=${elm.id}`)
        })
        res.json(nexts);
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
        const videos1 = await youtube.search("trending song", { limit: 40 });
        const videos2 = await youtube.search("Recent Hit song", { limit: 10 });
        const formattedVideos = videos1.map(video => ({
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
        const formattedVideos1 = videos2.map(video => ({
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

        const songs = formattedVideos1.concat(formattedVideos);

        res.json({ videos: songs });
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
