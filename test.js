const youtube = require('youtube-sr').default;


async function fun(params) {
    const videos = await youtube.search("trending songs india", { limit: 20 });
    console.log(videos)
}

fun()