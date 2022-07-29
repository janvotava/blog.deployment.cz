import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

import netlify from "@astrojs/netlify/functions";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), tailwind(), partytown(), svelte()],
  site: `http://astro.build`,
  adapter: netlify()
});