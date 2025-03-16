import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    test: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        },
        environment: "jsdom"
    },
    plugins: [vue()]
})
