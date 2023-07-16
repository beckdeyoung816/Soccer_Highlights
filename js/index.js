// JS for index.html

const video_container = document.querySelector('.video-container');
const league_selector = document.querySelector('.league-select');
const league_select_button = document.querySelector('.select-submit-button');

const get_data = async () => {
    // Get data from the server
    const url = 'https://free-football-soccer-videos.p.rapidapi.com/';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': config.API_KEY,
            'X-RapidAPI-Host': 'free-football-soccer-videos.p.rapidapi.com'
        }
    };
    
    // Fetch and await the response
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
}

const get_unique_leagues = async () => {
    // Get unique leagues from videos on the server
    const videos = await get_data();
    // Get all leagues
    const leagues = videos.map(video => video.competition.name);
    // Get unique leagues
    const unique_leagues = [...new Set(leagues)];
    // Sort leagues alphabetically
    unique_leagues.sort();
    return unique_leagues;
}

const display_leagues = async (leagues) => {
    // Display leagues in the league selector
    leagues = await leagues;
    leagues.forEach(league => {
        // Create an option for each league
        const option = document.createElement('option');
        option.value = league;
        option.textContent = league;
        league_selector.appendChild(option);
});
}

const display_videos = async (league) => {
    // Get videos from the server
    const videos = await get_data();
    // Filter videos by league
    const league_videos = videos.filter(video => video.competition.name === league);

    let row_container;    
    league_videos.forEach((video, index) => {
        // Create a new row container for every second video
        if (index % 2 === 0) {
            row_container = document.createElement('div');
            row_container.classList.add('row-container');
            video_container.appendChild(row_container);
        }
        // Create a video div for each video
        const video_div = document.createElement('div');
        video_div.classList.add('video');
        // Get the video title
        const video_title = document.createElement('h3');
        video_title.textContent = video.title;
        // Get the html for the video
        video_div.innerHTML = video.videos[0].embed;
        // Append the video to the row container
        video_div.appendChild(video_title);
        row_container.appendChild(video_div);
    });
}

// When the page loads, get the data from the API
window.addEventListener('DOMContentLoaded', () => {
    // Get the unique leagues from the server and display them in the league selector
    const unique_leagues_promise = get_unique_leagues();
    display_leagues(unique_leagues_promise);
});


// When the user selects a league, display the videos for that league
league_select_button.addEventListener('click', (e) => {
    // Default is page refresh
    e.preventDefault();
    video_container.innerHTML = ''; // Clear the video container
    display_videos(league_selector.value); // Display the videos for the selected league
});