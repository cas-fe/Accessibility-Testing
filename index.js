import { parseArgs } from "node:util";
import { runAccessSniff } from "./lib/access-sniff.js";
import { runAxe } from "./lib/axe.js";

// Detect `--access-sniff` and `--axe` flags
const args = parseArgs({
  options: {
    "access-sniff": {
      type: "boolean",
    },
    axe: {
      type: "boolean",
    },
  },
  args: process.argv.slice(2),
});

// Validate flags
if (!args.values["access-sniff"] && !args.values["axe"]) {
  console.error(
    "Please pass `--access-sniff` or `--axe` or both. Example: `npm run test -- --axe`"
  );

  process.exit(1);
}

// Run AccessSniff
if (args.values["access-sniff"]) {
  await runAccessSniff({
    // https://github.com/yargalot/AccessSniff#options
    accessibilityLevel: "WCAG2AA",
    ignore: ["WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.BgImage"],
  });
}

// Run Axe
if (args.values["axe"]) {
  await runAxe({
    // https://github.com/dequelabs/axe-core/blob/master/doc/API.md#axe-core-tags
    checks: { region: { enabled: false } },
  });
}
