import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

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

        console.log("--- Transformation Successful ---");
        console.log(result.toString());

        const output = result.toString();
        if (output.includes('math-inline') || output.includes('katex-mathml') || output.includes('katex-html')) {
            console.log("\n[VERIFIED] Math plugins are correctly transforming LaTeX to KaTeX HTML/MathML.");
        } else {
            console.log("\n[FAILED] Output does not contain expected KaTeX classes.");
        }
    } catch (err) {
        console.error("--- Transformation Failed ---");
        console.error(err);
    }
}

test();
