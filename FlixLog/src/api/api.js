const TVDB_API_KEY = import.meta.env.VITE_TVDB_API_KEY;
const TVDB_BASE_URL = "https://api4.thetvdb.com/v4/";
const TVDB_LOGIN_URL = "https://api4.thetvdb.com/v4/login";

async function getTVDBAccessToken{
    const response = await fetch(TVDB_LOGIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apikey: TVDB_API_KEY
        })
    });

    const data = await response.json();
    return data.data.token;
}

export const getTrendingSeries = async () => {

};

export const searchSeries = async (query) => {

};