import * as THREE from "three";
import { portfolio } from "./portfolio";

const clamp = THREE.MathUtils.clamp;
const smooth = (start: number, end: number, value: number) =>
  THREE.MathUtils.smoothstep(value, start, end);

/** A 3D clay diorama with a reference-based character cutout; no video playback. */
export async function createClayScene(host: HTMLElement) {
  // Load before allocating GPU resources so failed assets use the normal fallback.
  const characterTexture = await new THREE.TextureLoader().loadAsync(
    "/media/developer-motion-atlas.png",
  );
  characterTexture.colorSpace = THREE.SRGBColorSpace;
  // Twelve square cells, four columns by three rows. Inset UVs by half a pixel
  // and disable mipmaps so neighboring poses never bleed into the current frame.
  characterTexture.generateMipmaps = false;
  characterTexture.minFilter = THREE.LinearFilter;
  characterTexture.magFilter = THREE.LinearFilter;
  characterTexture.repeat.set(1 / 4 - 1 / 1448, 1 / 3 - 1 / 1086);
  characterTexture.offset.set(0.5 / 1448, 2 / 3 + 0.5 / 1086);
  let currentCharacterFrame = -1;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e8d8bd");
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const textures: THREE.Texture[] = [characterTexture];
  function clay(color: string) {
    if (!materials.has(color))
      materials.set(
        color,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.91,
          metalness: 0,
        }),
      );
    return materials.get(color)!;
  }
  function mesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  const sphereGeometry = new THREE.SphereGeometry(1, 24, 16);
  function ball(
    parent: THREE.Object3D,
    color: string,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy = sx,
    sz = sx,
  ) {
    const object = mesh(sphereGeometry, clay(color), parent, x, y, z);
    object.scale.set(sx, sy, sz);
    return object;
  }
  function pill(
    parent: THREE.Object3D,
    color: string,
    from: number[],
    to: number[],
    radius: number,
  ) {
    const a = new THREE.Vector3(from[0], from[1], from[2]),
      b = new THREE.Vector3(to[0], to[1], to[2]),
      direction = b.clone().sub(a);
    const object = mesh(
      new THREE.CapsuleGeometry(radius, direction.length(), 5, 12),
      clay(color),
      parent,
    );
    object.position.copy(a.add(b).multiplyScalar(0.5));
    object.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    return object;
  }
  function roundBox(
    parent: THREE.Object3D,
    color: string,
    width: number,
    height: number,
    depth: number,
    radius: number,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const shape = new THREE.Shape();
    const left = -width / 2,
      bottom = -height / 2,
      r = Math.min(radius, width / 2, height / 2);
    shape.moveTo(left + r, bottom);
    shape.lineTo(left + width - r, bottom);
    shape.quadraticCurveTo(left + width, bottom, left + width, bottom + r);
    shape.lineTo(left + width, bottom + height - r);
    shape.quadraticCurveTo(
      left + width,
      bottom + height,
      left + width - r,
      bottom + height,
    );
    shape.lineTo(left + r, bottom + height);
    shape.quadraticCurveTo(left, bottom + height, left, bottom + height - r);
    shape.lineTo(left, bottom + r);
    shape.quadraticCurveTo(left, bottom, left + r, bottom);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 10,
    });
    geometry.translate(0, 0, -depth / 2);
    return mesh(geometry, clay(color), parent, x, y, z);
  }
  function label(
    parent: THREE.Object3D,
    width: number,
    height: number,
    draw: (ctx: CanvasRenderingContext2D) => void,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = Math.round((1024 * height) / width);
    const ctx = canvas.getContext("2d")!;
    draw(ctx);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    return mesh(
      new THREE.PlaneGeometry(width, height),
      material,
      parent,
      0,
      0,
      0.125,
    );
  }
  function textBoard(
    text: string[],
    width: number,
    height: number,
    color: string,
    fontSize = 155,
  ) {
    const group = new THREE.Group();
    roundBox(group, color, width, height, 0.16, 0.15);
    label(group, width - 0.12, height - 0.12, (ctx) => {
      ctx.fillStyle = "#514737";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${fontSize}px Fredoka`;
      text.forEach((line, i) =>
        ctx.fillText(
          line,
          65,
          (ctx.canvas.height - (text.length - 1) * fontSize * 1.02) / 2 +
            i * fontSize * 1.02,
          900,
        ),
      );
    });
    return group;
  }
  scene.add(new THREE.HemisphereLight("#fff5e2", "#847256", 2.1));
  const light = new THREE.DirectionalLight("#fff0d7", 3.1);
  light.position.set(-4, 9, 7);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -9;
  light.shadow.camera.right = 9;
  light.shadow.camera.top = 9;
  light.shadow.camera.bottom = -6;
  light.shadow.normalBias = 0.03;
  light.shadow.bias = -0.0002;
  light.shadow.radius = 4;
  light.shadow.blurSamples = 8;
  scene.add(light);
  const fill = new THREE.DirectionalLight("#f0ead7", 1.3);
  fill.position.set(5, 4, -2);
  scene.add(fill);

  const room = new THREE.Group();
  scene.add(room);
  const floor = mesh(new THREE.PlaneGeometry(200, 200), clay("#e8d8bd"), room);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.1;
  roundBox(room, "#bd8665", 13, 8, 0.4, 2.2, 0, 3.9, -2.4);
  const platform = mesh(
    new THREE.CylinderGeometry(1, 1, 0.22, 80),
    clay("#a3af8b"),
    room,
    0,
    0.08,
    0.1,
  );
  platform.scale.set(6.2, 1, 3.1);
  const rug = mesh(
    new THREE.CylinderGeometry(1, 1, 0.04, 64),
    clay("#dbc2a0"),
    room,
    0,
    0.23,
    0.8,
  );
  rug.scale.set(2.7, 1, 1.7);
  // Organic clay blobs and a little cloud soften the architectural backdrop.
  ball(room, "#e3caa6", -5.8, 5.5, -2.02, 2.3, 1.65, 0.3);
  ball(room, "#d2a380", 5.9, 1.8, -2.03, 1.9, 2.4, 0.3);
  [
    [-0.38, 0.03, 0.25],
    [0, 0.13, 0.34],
    [0.38, 0, 0.26],
  ].forEach(([x, y, r]) =>
    ball(room, "#f2e7d2", -3 + x, 5.05 + y, -1.85, r, 0.21, 0.2),
  );

  function plant(x: number, z: number, size: number) {
    const group = new THREE.Group();
    group.position.set(x, 0.23, z);
    group.scale.setScalar(size);
    room.add(group);
    mesh(
      new THREE.CylinderGeometry(0.39, 0.3, 0.65, 32),
      clay("#c29b72"),
      group,
      0,
      0.33,
      0,
    );
    mesh(
      new THREE.TorusGeometry(0.36, 0.05, 8, 32),
      clay("#d9b88c"),
      group,
      0,
      0.65,
      0,
    ).rotation.x = Math.PI / 2;
    mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.04, 24),
      clay("#716c4d"),
      group,
      0,
      0.65,
      0,
    );
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.4;
      const height = 1.05 + (i % 3) * 0.35;
      pill(
        group,
        "#70835d",
        [0, 0.6, 0],
        [Math.sin(angle) * 0.42, height, Math.cos(angle) * 0.25],
        0.028,
      );
      const leaf = ball(
        group,
        i % 2 ? "#8d9e71" : "#a1af80",
        Math.sin(angle) * 0.55,
        height + 0.19,
        Math.cos(angle) * 0.35,
        0.23,
        0.52,
        0.065,
      );
      leaf.rotation.set(0.1, angle, -Math.sin(angle) * 0.65);
      pill(
        group,
        "#788a60",
        [Math.sin(angle) * 0.55, height - 0.15, Math.cos(angle) * 0.35 + 0.06],
        [Math.sin(angle) * 0.55, height + 0.45, Math.cos(angle) * 0.35 + 0.06],
        0.008,
      );
    }
  }
  plant(0.15, -1.55, 1.75);
  plant(4.65, 0.2, 0.53);
  plant(-4.8, 0.55, 0.4);

  const name = textBoard(portfolio.name.split(" "), 3.65, 1.95, "#eee0c4", 185);
  name.position.set(-3.05, 3.22, -0.35);
  name.rotation.set(-0.035, 0.15, 0.06);
  room.add(name);
  const role = textBoard([portfolio.role], 2.5, 0.48, "#e9d6b5", 100);
  role.position.set(-3.15, 1.82, 0.1);
  role.rotation.set(0, 0.1, 0.05);
  room.add(role);

  // Keep the legs and chair in 3D; the visible face and torso use the reference cutout.
  const character = new THREE.Group();
  character.position.set(0, 0.2, 0);
  room.add(character);
  ball(character, "#746b48", 0, 1.59, -0.3, 0.63, 0.8, 0.35);
  pill(character, "#81885f", [-0.3, 1.2, 0], [-0.3, 0.55, 0.5], 0.19);
  pill(character, "#81885f", [0.3, 1.2, 0], [0.3, 0.55, 0.5], 0.19);
  ball(character, "#554638", -0.3, 0.4, 0.57, 0.22, 0.13, 0.35);
  ball(character, "#554638", 0.3, 0.4, 0.57, 0.22, 0.13, 0.35);
  const characterMaterial = new THREE.MeshBasicMaterial({
    map: characterTexture,
    transparent: true,
    alphaTest: 0.025,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const characterSprite = mesh(
    new THREE.PlaneGeometry(2.55, 2.55),
    characterMaterial,
    room,
    0.12,
    2.9,
    0.2,
  );
  characterSprite.receiveShadow = false;
  characterSprite.customDepthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    map: characterTexture,
    alphaTest: 0.25,
  });
  const facing = new THREE.Quaternion();

  // Oval wooden desk, keyboard, mouse, and an off-white monitor.
  const desk = new THREE.Group();
  room.add(desk);
  const top = mesh(
    new THREE.CylinderGeometry(1, 1, 0.17, 64),
    clay("#ba8967"),
    desk,
    0,
    1.65,
    0.7,
  );
  top.scale.set(1.98, 1, 1.03);
  for (const x of [-1.45, 1.45])
    for (const z of [0.12, 1.25])
      pill(desk, "#a67956", [x, 0.28, z], [x, 1.57, z], 0.085);
  const keyboard = roundBox(
    desk,
    "#eee1c7",
    0.96,
    0.31,
    0.075,
    0.035,
    -0.25,
    1.78,
    1,
  );
  keyboard.rotation.x = -Math.PI / 2;
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 10; col++) {
      const key = roundBox(
        desk,
        "#f7ecd7",
        0.067,
        0.055,
        0.027,
        0.009,
        -0.65 + col * 0.08,
        1.83,
        0.9 + row * 0.075,
      );
      key.rotation.x = -Math.PI / 2;
    }
  ball(desk, "#ede0c7", -0.95, 1.79, 1.06, 0.12, 0.055, 0.18);
  const monitor = new THREE.Group();
  monitor.position.set(1.02, 2.3, 0.81);
  monitor.rotation.y = -0.25;
  desk.add(monitor);
  roundBox(monitor, "#ede0c8", 1.17, 0.91, 0.14, 0.11);
  roundBox(monitor, "#d9c8a9", 0.95, 0.68, 0.01, 0.035, 0, 0, 0.115);
  roundBox(
    monitor,
    "#ead072",
    0.18,
    0.18,
    0.025,
    0.02,
    0.3,
    0.28,
    0.15,
  ).rotation.z = -0.1;
  pill(monitor, "#e3d3b7", [0, -0.36, 0], [0, -0.62, 0.14], 0.065);
  const base = roundBox(
    monitor,
    "#ecdfc5",
    0.52,
    0.28,
    0.065,
    0.05,
    0,
    -0.61,
    0.15,
  );
  base.rotation.x = -Math.PI / 2;

  function projectBoard(
    title: string,
    type: "plant" | "landscape",
    color: string,
  ) {
    const group = new THREE.Group();
    roundBox(group, "#eddfc6", 2.15, 1.55, 0.14, 0.12);
    label(group, 2.05, 1.43, (ctx) => {
      const w = ctx.canvas.width,
        h = ctx.canvas.height;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 45);
      ctx.fill();
      ctx.fillStyle = "#dac7a5";
      ctx.beginPath();
      ctx.roundRect(0, 0, w, 90, 35);
      ctx.fill();
      ["#c58669", "#dac079", "#95a275"].forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(36 + i * 40, 45, 13, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#5e604a";
      ctx.font = "600 75px Fredoka";
      ctx.fillText(title, 65, 220);
      ctx.fillStyle = "#81906a";
      ctx.beginPath();
      ctx.roundRect(65, 255, 330, 20, 10);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(65, 294, 245, 20, 10);
      ctx.fill();
      ctx.fillStyle = "#bf8d6e";
      ctx.beginPath();
      ctx.roundRect(65, 360, 200, 70, 25);
      ctx.fill();
      ctx.fillStyle = "#f8eedb";
      ctx.font = "600 28px Nunito Sans";
      ctx.fillText("Explore ↗", 96, 405);
      if (type === "plant") {
        ctx.fillStyle = "#a5b58b";
        ctx.beginPath();
        ctx.ellipse(740, 350, 190, 210, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#76875c";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(740, 510);
        ctx.lineTo(740, 280);
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = i % 2 ? "#829967" : "#96aa75";
          ctx.beginPath();
          ctx.ellipse(
            740 + (i % 2 ? 45 : -45),
            310 + i * 45,
            35,
            78,
            i % 2 ? 0.65 : -0.65,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.fillStyle = "#c49c79";
        ctx.beginPath();
        ctx.roundRect(680, 465, 125, 110, [12, 12, 35, 35]);
        ctx.fill();
      } else {
        ctx.fillStyle = "#e3c08d";
        ctx.beginPath();
        ctx.arc(815, 225, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#bb946c";
        ctx.beginPath();
        ctx.moveTo(530, 560);
        ctx.lineTo(740, 330);
        ctx.lineTo(945, 560);
        ctx.fill();
        ctx.fillStyle = "#d2ab7c";
        ctx.beginPath();
        ctx.moveTo(680, 560);
        ctx.lineTo(890, 360);
        ctx.lineTo(1040, 560);
        ctx.fill();
      }
      ctx.fillStyle = "#f3ead5";
      ctx.beginPath();
      ctx.roundRect(60, h - 65, w - 120, 23, 9);
      ctx.fill();
    });
    return group;
  }
  const cardOne = projectBoard("Room to grow.", "plant", "#dae2cb");
  cardOne.position.set(3.13, 2.98, -0.45);
  cardOne.rotation.set(-0.06, -0.18, -0.04);
  room.add(cardOne);
  const cardTwo = projectBoard("Find your daylight.", "landscape", "#e9d5b6");
  cardTwo.position.set(4.2, 2.7, -0.8);
  cardTwo.rotation.y = -0.16;
  room.add(cardTwo);
  cardTwo.visible = false;
  const code = textBoard(["< / >"], 1.15, 0.48, "#c4d0ac", 130);
  code.position.set(3.12, 1.75, 0.1);
  room.add(code);
  code.visible = false;

  const target = new THREE.Vector3();
  let width = 0,
    height = 0;
  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  }
  function update(progress: number, reduced = false) {
    const p = clamp(progress, 0, 1),
      greeting = smooth(0.09, 0.33, p) * (1 - smooth(0.5, 0.69, p)),
      reveal = smooth(0.46, 0.76, p),
      ending = smooth(0.8, 1, p);
    const mobile = width < 760;
    const zoom = greeting * (mobile ? 1.8 : 3.65);
    camera.position.set(
      reveal * (mobile ? 0.45 : 1.9),
      5.15 - zoom * 0.3,
      (mobile ? 16.8 : 12.3) - zoom + ending * 1.3,
    );
    target.set(reveal * (mobile ? 0.2 : 0.75), 2.35 + greeting * 0.55, 0);
    camera.lookAt(target);
    room.rotation.y = -reveal * 0.095;
    // Scroll scrubs the pose atlas directly. No timer or autonomous playback.
    const characterFrame = reduced ? 1 : Math.min(11, Math.floor(p * 12));
    if (characterFrame !== currentCharacterFrame) {
      const column = characterFrame % 4;
      const row = Math.floor(characterFrame / 4);
      characterTexture.offset.set(
        column / 4 + 0.5 / 1448,
        (2 - row) / 3 + 0.5 / 1086,
      );
      currentCharacterFrame = characterFrame;
      host.dataset.characterFrame = String(characterFrame);
    }
    // Face the camera without distorting the reference face. A slight lean follows the greeting.
    facing.copy(room.quaternion).invert().multiply(camera.quaternion);
    characterSprite.quaternion.copy(facing);
    characterSprite.rotateZ(-greeting * 0.028);
    characterSprite.position.y = 2.9 + greeting * 0.035;
    name.scale.setScalar((mobile ? 0.7 : 1) * (1 - greeting * 0.07));
    name.position.set(mobile ? -1.05 : -3.05, mobile ? 4.85 : 3.22, -0.35);
    role.scale.setScalar(mobile ? 0.68 : 1);
    role.position.set(
      mobile ? -1.4 : -3.15,
      (mobile ? 3.95 : 1.82) - greeting * 0.16,
      0.1,
    );
    cardOne.scale.setScalar(mobile ? 0.65 : 1);
    cardOne.position.set(
      (mobile ? 1.8 : 3.13) - reveal * 0.4,
      (mobile ? 3.9 : 2.98) + reveal * 0.28,
      -0.45 + reveal * 1.35,
    );
    cardOne.rotation.y = -0.18 + reveal * 0.08;
    cardTwo.visible = reveal > 0.01 || reduced;
    cardTwo.scale.setScalar(
      Math.max(0.001, (mobile ? 0.65 : 1) * (reduced ? 1 : reveal)),
    );
    cardTwo.position.set(
      mobile ? 1.8 : 4.05,
      mobile ? 2.65 : 2.88,
      -0.8 + reveal * 1.9,
    );
    cardTwo.rotation.z = reveal * 0.09;
    code.visible = reveal > 0.01 || reduced;
    code.scale.setScalar(
      Math.max(0.001, (mobile ? 0.6 : 1) * (reduced ? 1 : reveal)),
    );
    code.position.set(mobile ? 1.6 : 3.12, 1.75 + reveal * 0.05, 0.1);
    renderer.render(scene, camera);
    host.dataset.progress = p.toFixed(3);
  }
  function dispose() {
    const geometries = new Set<THREE.BufferGeometry>();
    const usedMaterials = new Set<THREE.Material>();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        geometries.add(object.geometry);
        (Array.isArray(object.material)
          ? object.material
          : [object.material]
        ).forEach((material) => usedMaterials.add(material));
        if (object.customDepthMaterial)
          usedMaterials.add(object.customDepthMaterial);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    usedMaterials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  }
  resize();
  update(0);
  return { resize, update, dispose };
}
