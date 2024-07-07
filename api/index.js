import parseMeta from "../lib/parseMeta";
import { Card } from "../lib/card";
import vercel from "@vercel/node";
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
        return { height: 0, width: 0 };
    }
}

export default vercel.json(async (req, res) => {
    const { url } = req.query; // Get the URL from the query string
    const { preview_image_url } = req.query; // Get the preview_image from the query string, optional
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
    icon = icon ? icon : "https://cdn.jsdelivr.net/gh/rahuldkjain/gh-profile-readme-generator/assets/icon.png";
    // if preview_image is provided, use it as the image
    image = preview_image ? preview_image : image;
    // if image is not provided, use the default image
    image = image ? image : "https://cdn.jsdelivr.net/gh/rahuldkjain/gh-profile-readme-generator/assets/default.jpg";
    // calculate the size of the image
    const { image_height, image_width } = getImageSize(image);
    const { icon_height, icon_width } = getImageSize(icon);
    // if the image size is not found, return an error
    if (!image_height || !image_width || !icon_height || !icon_width) {
        res.status(400).send("Image not found");
        return;
    }
    const card = new Card({
        height: height + 200,
        width: width,
        border_radius: 10,
    });
    const svg = card.render({ title: title, desc: description, image: {url: image_url, height: image_height, width: image_width}, icon: {url: icon, height: icon_height, width: icon_width} });
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
    });