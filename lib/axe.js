import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AxePuppeteer } from "@axe-core/puppeteer";
import puppeteer from "puppeteer";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runAxe(options) {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  const dir = path.resolve(__dirname, "../examples");
  const examples = await readdir(dir);

  for (const example of examples) {
    const filePath = path.join("file:", dir, example);

    await page.goto(filePath);

    // Mimic the output formatting of `npm run test -- --access-sniff`
    console.log(`\n${chalk.underline(`Testing examples/${example}`)}\n`);

    try {
      const { violations } = await new AxePuppeteer(page)
        .options(options)
        .analyze();

      for (const violation of violations) {
        const level = violation.impact === "serious" ? chalk.red : chalk.yellow;

        console.log(level(violation.impact.toUpperCase()), violation.help);

        for (const node of violation.nodes) {
          console.log(chalk.gray(node.failureSummary));
          console.log(chalk.gray(`--------------------`));
          console.log(chalk.gray(node.html));
          console.log(`\n`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  await browser.close();
}
