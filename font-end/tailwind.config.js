// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind sẽ quét tất cả file .html, .js, .ts, .jsx, .tsx trong src/ để sinh CSS
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},     // bạn có thể mở rộng theme tại đây
  },
  plugins: [],      // nếu cần plugin (ví dụ forms, typography), thêm vào đây
};
