import parseMeta from "../lib/parseMeta.js";
import Card from "../lib/card.js";
import sizeOf from "image-size";
import axios from "axios";

async function getImageSize(url) {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });
        const dimensions = sizeOf(response.data);
        return dimensions;
    } catch (error) {
        console.log(error);
        return { height: -1, width: -1 };
    }
}

export default async (req, res) => {
    const { url , preview_image } = req.query;
    // handle the exception where url is failed to fetch
    if (!url) {
        res.status(400).send("URL is required");
        return;
    }
    var { title, description, image_url, icon } = await parseMeta(url);
    // if title or description is not provided, return an error
    if (!title || !description) {
        res.status(400).send("Title and Description are required");
        return;
    }
    // if icon is not provided, use the default icon
    icon = icon ? icon : "https://zaddle.top/img/favicon.ico";
    // if preview_image is provided, use it as the image
    image_url = preview_image ? preview_image : image_url;
    // if image is not provided, use the default image
    image_url = image_url ? image_url : "https://cdn.jsdelivr.net/gh/rahuldkjain/gh-profile-readme-generator/assets/default.jpg";
    // calculate the size of the image
    const { height: image_height, width: image_width } = await getImageSize(image_url);
    const { height: icon_height, width: icon_width } = await getImageSize(icon);
    // if the image size is not found, return an error
    const card = new Card({
        height: image_height + 200,
        width: image_width,
        border_radius: 10,
    });
    const svg = card.render({ title: title, desc: description, image: {url: image_url, height: image_height, width: image_width}, icon: {url: icon, height: icon_height, width: icon_width} });
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
    // res.send(JSON.stringify({ title, description, image_url, icon , image_height, image_width, icon_height, icon_width }));
    };