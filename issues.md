# Issues

## Tailwind CSS v4 Build Failure
- The project has `tailwindcss` v4 installed but is missing `@tailwindcss/postcss`.
- This causes the build to fail with: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package...".
- Solution: Install `@tailwindcss/postcss` and update `postcss.config.js` to use it, or downgrade to v3.
- Since I cannot install packages, I left the code in a correct state for v4 assuming the dependency will be fixed.
