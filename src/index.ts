import markdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import imageSize from "image-size";

const html = String.raw;

export function markdownItImageSize(md: markdownIt) {
  md.renderer.rules.image = function (tokens, index, options, env, self) {
    const token = tokens[index];
    const srcIndex = token.attrIndex("src");
    const url = token.attrs[srcIndex][1];
    const caption = md.utils.escapeHtml(token.content);

    const otherAttributes = generateAttributes(md, token);

    const { width, height } = getImageDimensions(url);

    return html`<img
      src="${url}"
      alt="${caption}"
      width="${width}"
      height="${height}"
      ${otherAttributes}
    />`;
  };
}

function generateAttributes(md: markdownIt, token: Token) {
  const ignore = ["src", "alt"];
  const escape = ["title"];

  return token.attrs
    .map(entry => {
      const [key, value] = entry;

      const ignoreAttribute = ignore.includes(key);
      if (ignoreAttribute) {
        return;
      }

      let finalValue = value;

      const escapeAttributeValue = escape.includes(key);
      if (escapeAttributeValue) {
        finalValue = md.utils.escapeHtml(value);
      }

      return `${key}="${finalValue}"`;
    })
    .join(" ");
}

function getImageDimensions(
  imageUrl: string,
): { width: number; height: number } {
  const { width, height } = imageSize(imageUrl);

  return { width, height };
}
