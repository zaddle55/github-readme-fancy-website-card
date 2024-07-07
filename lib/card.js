import fs from 'fs';

export default class Card {
    constructor({
        height,
        width,
        border_radius,
    }) {
        this.height = height;
        this.width = width;
        this.image_height = height;
        this.image_width = width;
        this.border_radius = border_radius;
        this.css = fs.readFileSync('./css/card.css', 'utf8');
        this.margin_top = 10;
        this.margin_left = 10;
        this.title_offset_x = 10;
        this.title_offset_y = 10;
        this.desc_offset_x = 10;
        this.desc_offset_y = 80;
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
        height=${this.height+2*this.margin_top}
        width=${this.width+2*this.margin_left}>
            <style>
                ${this.css}
            </style>
            <rect class="card"
            height=${this.height}
            width=${this.width}
            rx=${this.border_radius}
            ry=${this.border_radius}
            x=${this.margin_left}
            y=${this.margin_top}
            >
                <image href="${image}" height=${image.height} width=${image.width} />
                <image href="${icon}" height=${icon.height} width=${icon.width} />
                <Text class="title" x=${this.title_offset_x} y=${this.title_offset_y}>${title}</Text>
                <Text class="desc" x=${this.desc_offset_x} y=${this.desc_offset_y}>${desc}</Text>
            </rect>
        </svg>'
        `;
    }
}