# Reference-based character cutout

- Asset: `public/media/developer-cutout.png`
- Edit target: `public/media/developer.webp`, a still frame extracted from the user's supplied reference video.
- Tool: built-in `image_gen.imagegen`, edit mode, `transparent_background: true`.
- The cutout is AI-assisted, based on the frame; it is not a pixel-for-pixel deterministic crop.
- Alpha verified: RGBA, alpha range 0–255. The original generated PNG is retained unchanged. Runtime texture UVs omit the empty margins.
- The 3D desk, plants, cards, and scroll-controlled camera remain. The cutout has a waving pose and a small scroll-controlled greeting lean.

## Exact prompt

Use case: background-extraction. Edit target: attached frame of a clay-style developer from the user's reference video. Create a clean high-resolution transparent PNG cutout of ONLY this exact developer, from his spiky sculpted dark hair down to the visible bottom of his olive-green sweater, including his right raised waving hand and his left resting hand. Preserve his exact face, large friendly brown eyes, arched brows, nose, defined beard and moustache, warm tan skin, sculpted textured spiky hair, smile, proportions, olive sweater and sleeves, and warm soft clay lighting. Do not redesign, simplify into primitives, change his identity, or make a different character. Remove ALL background: plants, chair, text signs, computer, keyboard, desk and floor. Complete the very small portions of his left hand and sweater bottom obscured by the table or frame boundary cleanly, but do not add legs or feet. Center this waist-up character in a tightly framed portrait composition with small transparent margin. No scene, no props, no text, no background color, no checkerboard painted into the image, no ground shadow. Actual alpha transparency outside the character silhouette. This is a website character sprite to be composited behind a separate 3D desk.
