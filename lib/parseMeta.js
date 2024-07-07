import axios from "axios";
import cheerio from "cheerio";

async function parseMeta(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const image = $('meta[property="og:image"]').attr("content");
    const icon = (typeof url === "string") ? url + $('link[rel="icon"]').attr("href") : null;
    return { title, description, image , icon };
}

export default parseMeta;