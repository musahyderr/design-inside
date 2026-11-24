# Security

design-inside is a local development tool. It is designed to be used only by the person running it, on their own computer:

- it listens on `127.0.0.1` and refuses requests whose `Host` isn't localhost (DNS rebinding);
- it refuses writes from other websites (checked through `Origin`, `Sec-Fetch-Site` and JSON-only requests);
- `--proxy` only wraps a dev server on the same computer;
- it never serves or writes dotfiles (`.env`, …), `.git` or `node_modules`, and it validates every edited value;
- imported images must be real PNG, JPEG, WebP, GIF or AVIF files (checked by content), at most 5 MB and 8000×8000 pixels, with no code hidden inside. SVG is refused, and the server chooses every file name.

These rules are covered by `test/security.test.js` and `test/image.test.js`.

## Reporting a vulnerability

Please report it privately through GitHub: **Security → Report a vulnerability** on this repository. Don't open a public issue. Include the steps to reproduce it and what an attacker could do. You'll get a reply as soon as possible.
