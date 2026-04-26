import * as THREE from 'three';

export function initScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );

  // 🔥 camera agak miring biar gak garis lurus
  camera.position.set(5, 5, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // 🌌 STARS
  function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const positions = [];

    for (let i = 0; i < starsCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  }

  createStars();

  // 💡 LIGHT
  const light = new THREE.PointLight(0xffffff, 2);
  light.position.set(10, 10, 10);
  scene.add(light);

  // 🌍 PLANET
  const planetGeo = new THREE.SphereGeometry(2, 32, 32);
  const planetMat = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    emissive: 0x004444,
    roughness: 0.5
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  scene.add(planet);

  // ☄️ ASTEROID GROUP
  const asteroidGroup = new THREE.Group();
  scene.add(asteroidGroup);

  // 🚀 FETCH DATA
  fetch('http://localhost:3000/asteroids')
    .then(res => res.json())
    .then(data => {
      data.data.forEach(() => {
        const geo = new THREE.SphereGeometry(0.1, 8, 8);
        const mat = new THREE.MeshBasicMaterial({
          color: 0xff5555,
          transparent: true,
          opacity: 0.8
        });

        const mesh = new THREE.Mesh(geo, mat);

        // 🔥 ORBIT + RANDOM HEIGHT
        const radius = 5 + Math.random() * 3;
        const angle = Math.random() * Math.PI * 2;
        const yOffset = (Math.random() - 0.5) * 2;

        mesh.userData = { angle, radius, yOffset };

        mesh.position.set(
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius
        );

        asteroidGroup.add(mesh);
      });
    });

  // 🎥 RESIZE
  function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', handleResize);

  // 🎬 ANIMATE
  function animate() {
    requestAnimationFrame(animate);

    planet.rotation.y += 0.005;

    asteroidGroup.children.forEach((obj) => {
      obj.userData.angle += 0.01;

      obj.position.x =
        Math.cos(obj.userData.angle) * obj.userData.radius;

      obj.position.z =
        Math.sin(obj.userData.angle) * obj.userData.radius;

      obj.position.y = obj.userData.yOffset;
    });

    renderer.render(scene, camera);
  }

  animate();

  // 🧹 CLEANUP
  return () => {
    window.removeEventListener('resize', handleResize);
    container.removeChild(renderer.domElement);
  };
}

function createOrbit(radius) {
  const curve = new THREE.EllipseCurve(
    0, 0,
    radius, radius,
    0, 2 * Math.PI,
    false,
    0
  );

  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map(p => new THREE.Vector3(p.x, 0, p.y))
  );

  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3
  });

  const line = new THREE.Line(geometry, material);
  scene.add(line);
}