import AccessSniff from "access-sniff";

export async function runAccessSniff(options) {
  try {
    await AccessSniff.default(["examples/*.html"], options);
  } catch (err) {
    // console.error(err);
  }
}
