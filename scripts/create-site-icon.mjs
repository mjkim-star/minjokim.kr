import sharp from "sharp"

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#faf8f3"/>
  <circle cx="256" cy="256" r="132" fill="none" stroke="#151515" stroke-width="34"/>
  <circle cx="256" cy="256" r="26" fill="#151515"/>
  <path d="M256 104v74" stroke="#151515" stroke-width="28" stroke-linecap="round"/>
</svg>`

await sharp(Buffer.from(svg)).png().toFile("quartz/static/icon.png")
