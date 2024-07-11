import parseMeta from "../lib/parseMeta.js";
import Card from "../lib/card.js";
import sizeOf from "image-size";
import axios from "axios";

const CARD_WIDTH_UPPER_LIMIT = 580;
const ICON_SIZE = 25;

async function getImageSize(url) {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });
        const dimensions = sizeOf(response.data);
        return dimensions;
    } catch (error) {
        throw new Error("Image Not Found");
    }
}

async function imageBase64(url) {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });
        const base64 = Buffer.from(response.data, "binary").toString("base64");
        return base64;
    } catch (error) {
        throw new Error("Image Not Found");
    }
}

function resizeImage({ height: pre_height, width: pre_width }, ref_value) {
    const aspectRatio =pre_width / pre_height;
    let width = ref_value ? ref_value : CARD_WIDTH_UPPER_LIMIT;
    let height = ref_value / aspectRatio;
    return { width, height };
}

export default async (req, res) => {
  const { url, preview } = req.query;
  // handle the exception where url is failed to fetch
  if (!url) {
    res.status(400).send("URL is required");
    return;
  }
  try {
    var { title, description, image_url, icon } = await parseMeta(url);
    // if title or description is not provided, return an error
    if (!title || !description) {
      res.status(400).send("Title and Description are required");
      return;
    }

    // if icon is not provided, use the default icon
    icon = icon
      ? icon
      : "https://raw.githubusercontent.com/zaddle55/Picgo/main/images/icon_default.png";
    // if preview is provided, use it as the image
    image_url = preview ? preview : image_url;
    // if image is not provided, use the default image
    image_url = image_url
      ? image_url
      : "https://raw.githubusercontent.com/zaddle55/Picgo/main/images/preview_default.png";
    // calculate the size of the image
    let { height: image_height, width: image_width } = resizeImage(
      await getImageSize(image_url),
      CARD_WIDTH_UPPER_LIMIT
    );
    let { height: icon_height, width: icon_width } = resizeImage(
      await getImageSize(icon),
      ICON_SIZE
    );
    // if the image size is not found, return an error
    const card = new Card({
      url: url,
      height: image_height + 115,
      width: image_width,
      border_radius: 10,
    });
    const svg = card.render({
      title: title,
      desc: description,
      image: { url: await imageBase64(image_url), height: image_height, width: image_width },
      icon: { url: await imageBase64(icon), height: icon_height, width: icon_width },
    });
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.status(200).send(svg);
    // res.status(200).send(svg);
    // res.send(JSON.stringify({ title, description, image_url, icon , image_height, image_width, icon_height, icon_width }));
  } catch (error) {
    console.log(error);
    res.status(500).send("Parsing Error!");
  }
};