---
"libexif-wasm": patch
---

chore: update compile.sh script

- Optimize for code size (`-Oz`) instead of speed (`-O3`)
- Remove `-pthread` for somewhat smaller glue code
