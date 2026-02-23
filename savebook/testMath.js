const { unified } = require('unified');
const remarkParse = require('remark-parse');
const remarkMath = require('remark-math');
const remarkRehype = require('remark-rehype');
const rehypeKatex = require('rehype-katex');
const rehypeStringify = require('rehype-stringify');

const markdown = `
# Math Test
Inline math: $E=mc^2$

Block math:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
`;

async function test() {
    try {
        const result = await unified()
            .use(remarkParse)
            .use(remarkMath)
            .use(remarkRehype)
            .use(rehypeKatex)
            .use(rehypeStringify)
            .process(markdown);

        console.log(result.toString());
    } catch (err) {
        console.error(err);
    }
}

test();
