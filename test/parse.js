import parseMeta from "../lib/parseMeta.js";
import { expect } from "chai";
import { describe, it } from "mocha";
import fs from "fs";
import axios from "axios";

describe("parseMeta", () => {
    it("should parse meta tags from a webpage", async () => {
        const url = "https://www.zaddle.top";
        const meta = await parseMeta(url);
        expect(meta).to.have.property("title");
        expect(meta).to.have.property("description");
        expect(meta).to.have.property("image");
        expect(meta).to.have.property("icon");
        // assert title is 'Example Domain'
        expect(meta.title).to.equal("南十字星站");
        // assert image is 'https://www.example.com/image.jpg'
        expect(meta.description).to.equal("愿你今后的人生一直有幸福的“魔法”相伴");
        console.log(meta.icon);
        console.log(meta.image);
        // download the icon
        const { data } = await axios.get(meta.icon, { responseType: "arraybuffer" })
                                    .then(res => {
                                        fs.writeFileSync("icon.png", Buffer.from(res.data));
                                    })
                                    .catch(err => {
                                        console.error(err);
                                    });
    });
});