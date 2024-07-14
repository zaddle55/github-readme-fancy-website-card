import axios from "axios";
import cheerio from "cheerio";

async function parseMeta(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const image_url = $('meta[property="og:image"]').attr("content");
    const icon_href = $('link[rel="icon"]').attr("href");
    const regex = /http/g;
    const icon = (regex.test(icon_href)) ? icon_href : url + icon_href;
    return { title, description, image_url , icon };
}

export default parseMeta;