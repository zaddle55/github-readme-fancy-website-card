import fs from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'css', 'card.css');

export default class Card {
    constructor({
        url,
        height,
        width,
        border_radius,
    }) {
        this.url = url;
        this.height = height;
        this.width = width;
        this.image_height = height;
        this.image_width = width;
        this.border_radius = border_radius;
        this.css = fs.readFileSync(filePath, 'utf8');
        this.margin_top = 0;
        this.margin_left = 0;
        this.title_offset_x = 40;
        this.title_offset_y = 31;
        this.desc_offset_x = 10;
        this.desc_offset_y = 65;
        this.link_offset_x = 10;
        this.link_offset_y = 95;
    }

    render({
        title,
        desc,
        image,
        icon
    }) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            height="${this.height+2*this.margin_top}"
            width="${this.width+2*this.margin_left}"
            fill="none"
            role="img"
            viewbox="0 0 ${this.width} ${this.height}"
        >
            <title>${title}</title>
            <desc>${desc}</desc>
            <defs>
                <clipPath id="round">
                    <rect
                        x="0"
                        y="0"
                        width="${this.width}"
                        height="${this.height}"
                        rx="${this.border_radius}"
                        ry="${this.border_radius}"
                    />
                </clipPath>
            </defs>
            <style>
            ${this.css}
            </style>
            <rect
                class="card-bg"
                x="0.5"
                y="0.5"
                rx="${this.border_radius}"
                ry="${this.border_radius}"
                height="${this.height+2*this.margin_top-1}"
                width="${this.width+2*this.margin_left-1}"
                stroke="#E4E2E2"
                fill="#FFF"
                stroke-opacity="1"
            />
            <g
                class="card"
                height="${this.height}"
                width="${this.width}"
                x="${this.margin_left}"
                y="${this.margin_top}"
            >
                <image
                    href="data:image/png;base64,${image.url}"
                    height="${image.height}"
                    width="${image.width}"
                    x="0"
                    y="0"
                    clip-path="url(#round)"
                />
                <image
                    href="data:image/png;base64,${icon.url}"
                    height="${icon.height}"
                    width="${icon.width}"
                    x="10"
                    y="${this.title_offset_y+image.height-icon.height*0.5+this.margin_top-5}"
                    />
                <text
                    class="title"
                    x="${this.title_offset_x}"
                    y="${this.title_offset_y+image.height+this.margin_top}"
                >
                ${title}
                </text>
                <text
                    class="desc"
                    x="${this.desc_offset_x}"
                    y="${this.desc_offset_y+image.height+this.margin_top}"
                    fill="#000"
                    font-size="14"
                    font-family="Arial"
                >
                ${desc}
                </text>
                <text
                    class="link"
                    x="${this.link_offset_x}"
                    y="${this.link_offset_y+image.height+this.margin_top}"
                >
                ${this.url}
                </text>
            </g>
        </svg>
        `;
    }
}