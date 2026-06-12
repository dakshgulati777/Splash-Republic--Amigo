import * as THREE from 'three';

// Helper to draw vertical capsules (pill shapes) for mascot eyes using standard arcs (highly compatible)
function drawCapsule(ctx, cx, cy, width, height) {
  ctx.beginPath();
  ctx.fillStyle = '#111111';
  const radius = width / 2;
  const x = cx - width / 2;
  const y = cy - height / 2;
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// Generates MGO mascot texture
function createGhostTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  // Capsule Eyes
  drawCapsule(ctx, 185, 220, 16, 44);
  drawCapsule(ctx, 327, 220, 16, 44);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 3D Object Generator: Pool Tube (Torus)
function createPoolTube(colorHex) {
  const geom = new THREE.TorusGeometry(0.7, 0.22, 16, 64);
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.12,
    metalness: 0.05,
  });
  const mesh = new THREE.Mesh(geom, mat);
  
  // Angle it slightly for dynamic floating rotation
  mesh.rotation.x = Math.PI / 4;
  return mesh;
}

// 3D Object Generator: Clay Duck Group
function createClayDuck() {
  const group = new THREE.Group();
  
  const clayMat = new THREE.MeshStandardMaterial({
    color: 0xffea00, // Yellow
    roughness: 0.55,
    metalness: 0.05
  });
  const beakMat = new THREE.MeshStandardMaterial({
    color: 0xff5500, // Beak Orange
    roughness: 0.55
  });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), clayMat);
  body.scale.set(1.0, 0.75, 1.2);
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), clayMat);
  head.position.set(0, 0.5, 0.45);
  group.add(head);

  // Beak
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.28, 12), beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.48, 0.8);
  group.add(beak);

  // Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
  eyeL.position.set(-0.15, 0.6, 0.68);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.15;
  group.add(eyeL);
  group.add(eyeR);

  return group;
}

// 3D Object Generator: Clay Pink Flamingo Group
function createClayFlamingo() {
  const group = new THREE.Group();
  
  const pinkMat = new THREE.MeshStandardMaterial({
    color: 0xff77bb, // Flamingo Pink
    roughness: 0.50,
    metalness: 0.05
  });
  const beakMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.5
  });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), pinkMat);
  body.scale.set(1.2, 0.78, 0.78);
  group.add(body);

  // Curved Neck segments (S-shape clay layout)
  const neckCount = 7;
  for (let i = 0; i < neckCount; i++) {
    const segment = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), pinkMat);
    const t = i / (neckCount - 1);
    segment.position.x = 0.35 + Math.sin(t * Math.PI) * 0.18;
    segment.position.y = 0.15 + t * 0.75;
    segment.position.z = 0;
    group.add(segment);
  }

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), pinkMat);
  head.position.set(0.35, 1.0, 0);
  group.add(head);

  // Beak
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 8), beakMat);
  beak.rotation.z = -Math.PI / 3;
  beak.position.set(0.5, 0.92, 0);
  group.add(beak);

  return group;
}

// 3D Object Generator: Clay Cocktail/Drink
function createClayDrink() {
  const group = new THREE.Group();
  
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.65
  });
  
  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0xff5ee0, // Pink Pool Drink
    roughness: 0.15,
    metalness: 0.05
  });

  const strawMat = new THREE.MeshStandardMaterial({
    color: 0xbcff00, // Lime Green Straw
    roughness: 0.3
  });

  // Cup Cone
  const cup = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.75, 16), glassMat);
  cup.rotation.x = Math.PI;
  cup.position.y = 0.38;
  group.add(cup);

  // Liquid
  const liquid = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.58, 16), liquidMat);
  liquid.rotation.x = Math.PI;
  liquid.position.y = 0.42;
  group.add(liquid);

  // Stem & Foot
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), glassMat);
  stem.position.y = -0.15;
  group.add(stem);

  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 16), glassMat);
  foot.position.y = -0.42;
  group.add(foot);

  // Straw
  const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9, 8), strawMat);
  straw.rotation.z = -0.28;
  straw.position.set(0.12, 0.66, 0);
  group.add(straw);

  return group;
}

export function initWebGL() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 15;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Clean studio lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
  dirLight1.position.set(6, 12, 8);
  scene.add(dirLight1);

  // Soft sky-blue highlights tracking cursor
  const mouseLight = new THREE.PointLight(0x3c5aec, 12, 20);
  mouseLight.position.set(0, 0, 5);
  scene.add(mouseLight);

  // Lilac light orbiting
  const colorLight = new THREE.PointLight(0x8c52ff, 15, 25);
  colorLight.position.set(0, 0, 4);
  scene.add(colorLight);

  // Instantiate various clay elements
  const characters = [];
  const characterCount = window.innerWidth < 768 ? 6 : 15;
  const sphereGeom = new THREE.SphereGeometry(1, 32, 32);

  for (let i = 0; i < characterCount; i++) {
    let obj;
    const type = i % 5;

    if (type === 0) {
      // White clay mascot ghost
      const texture = createGhostTexture();
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.55,
        metalness: 0.02,
      });
      obj = new THREE.Mesh(sphereGeom, material);
      obj.rotation.y = Math.PI; // Face forward
    } else if (type === 1) {
      // Pink or lime green pool tube
      const tubeColor = i % 2 === 0 ? 0xff5ee0 : 0xbcff00;
      obj = createPoolTube(tubeColor);
    } else if (type === 2) {
      // Yellow clay duck
      obj = createClayDuck();
    } else if (type === 3) {
      // Pink pool cocktail
      obj = createClayDrink();
    } else {
      // Pink flamingo
      obj = createClayFlamingo();
    }

    // Randomize scaling
    const scale = 0.55 + Math.random() * 0.65;
    obj.scale.set(scale, scale, scale);

    // Distribution coordinates
    obj.position.x = (Math.random() - 0.5) * 16;
    obj.position.y = (Math.random() - 0.5) * 10;
    obj.position.z = (Math.random() - 0.5) * 5;

    obj.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.007,
        (Math.random() - 0.5) * 0.007,
        (Math.random() - 0.5) * 0.007
      ),
      originalScale: scale,
      floatSeed: Math.random() * 1000,
      floatSpeed: 0.25 + Math.random() * 0.5,
    };

    scene.add(obj);
    characters.push(obj);
  }

  // Mouse variables
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  });

  window.addEventListener('click', (e) => {
    // Convert click coordinates to WebGL scene space
    const clickX = (e.clientX / window.innerWidth) * 2 - 1;
    const clickY = -(e.clientY / window.innerHeight) * 2 + 1;
    const clickPos = new THREE.Vector3(clickX * 10, clickY * 6, 0);

    characters.forEach((char) => {
      const dist = char.position.distanceTo(clickPos);
      if (dist < 7.0) {
        const dir = new THREE.Vector3().subVectors(char.position, clickPos).normalize();
        // Calculate outward impulse force
        const force = (7.0 - dist) * 0.09;
        char.userData.velocity.addScaledVector(dir, force);

        // Instantly squish/deform the element (animate loop will automatically spring it back)
        const stretch = 1.4;
        char.scale.set(
          char.userData.originalScale * stretch,
          char.userData.originalScale * (1.0 / stretch),
          char.userData.originalScale
        );
      }
    });
  });

  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Clock
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Smooth cursor coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.07;
    mouse.y += (mouse.targetY - mouse.y) * 0.07;

    // Shift light paths
    mouseLight.position.x = mouse.x * 12;
    mouseLight.position.y = mouse.y * 8;

    colorLight.position.x = Math.sin(time * 0.4) * 8;
    colorLight.position.y = Math.cos(time * 0.4) * 5;
    colorLight.position.z = Math.sin(time * 0.2) * 2 + 3;

    // Scroll vertical parallax
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
    camera.position.y = -scrollPercent * 8;
    camera.position.x = mouse.x * 0.5;

    // Move character groups
    characters.forEach((char) => {
      const uData = char.userData;

      // Drift motion
      char.position.x += uData.velocity.x;
      char.position.y += uData.velocity.y;
      char.position.z += uData.velocity.z;

      // Float offset
      const sinOffset = Math.sin(time * uData.floatSpeed + uData.floatSeed) * 0.003;
      const cosOffset = Math.cos(time * uData.floatSpeed + uData.floatSeed) * 0.003;
      char.position.x += sinOffset;
      char.position.y += cosOffset;

      // Rotation updates (groups wobble slightly, tubes spin)
      if (char.geometry && char.geometry.type === 'TorusGeometry') {
        char.rotation.x += 0.003;
        char.rotation.y += 0.005;
      } else {
        char.rotation.y = Math.PI + Math.sin(time * 0.4 + uData.floatSeed) * 0.15;
        char.rotation.x = Math.sin(time * 0.25 + uData.floatSeed) * 0.1;
        char.rotation.z = Math.cos(time * 0.3 + uData.floatSeed) * 0.1;
      }

      // Bounds wraps
      if (Math.abs(char.position.x) > 10) {
        char.position.x = -Math.sign(char.position.x) * 9.5;
      }
      if (Math.abs(char.position.y) > 7) {
        char.position.y = -Math.sign(char.position.y) * 6.5;
      }
      if (Math.abs(char.position.z) > 5) {
        char.position.z = -Math.sign(char.position.z) * 4.5;
      }

      // Proximity squash
      const distToMouse = char.position.distanceTo(mouseLight.position);
      if (distToMouse < 3.5) {
        const dir = new THREE.Vector3().subVectors(char.position, mouseLight.position).normalize();
        const force = (3.5 - distToMouse) * 0.025;
        char.position.addScaledVector(dir, force);
        
        const stretch = 1.0 + (3.5 - distToMouse) * 0.07;
        char.scale.set(
          uData.originalScale * stretch,
          uData.originalScale * (1.0 / stretch),
          uData.originalScale
        );
      } else {
        // Return to normal
        char.scale.x += (uData.originalScale - char.scale.x) * 0.1;
        char.scale.y += (uData.originalScale - char.scale.y) * 0.1;
        char.scale.z += (uData.originalScale - char.scale.z) * 0.1;
      }
    });

    renderer.render(scene, camera);
  }

  animate();
}
