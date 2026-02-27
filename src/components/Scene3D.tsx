import { useEffect, useRef } from "react";
import * as THREE from "three";

const Scene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050509, 0.045);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // Main wireframe solids
    const solids: THREE.Mesh[] = [];
    const solidGeometry = new THREE.IcosahedronGeometry(1, 1);
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x0b1024,
      emissiveIntensity: 0.35,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(solidGeometry, solidMaterial);
      mesh.position.set(
        (i - 1) * 2.4,
        (Math.random() - 0.5) * 1.8,
        -6 - i * 1.8
      );
      const scale = 0.95 + i * 0.35;
      mesh.scale.setScalar(scale);
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, 0);
      solids.push(mesh);
      root.add(mesh);
    }

    // Accent rings for a stronger holographic look
    const rings: THREE.Mesh[] = [];
    const ringGeometry = new THREE.TorusGeometry(2.4, 0.04, 24, 180);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.22,
    });

    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(0, i === 0 ? -0.7 : 0.8, -8.2 - i * 1.1);
      ring.rotation.x = Math.PI / 2.8 + i * 0.2;
      ring.rotation.y = i * 0.8;
      ring.scale.setScalar(1 + i * 0.28);
      rings.push(ring);
      root.add(ring);
    }

    // Particle field
    const particleCount = 320;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = -3 - Math.random() * 16;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.042,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    root.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 1.55, 34);
    cyanLight.position.set(-5, 2, -4);
    scene.add(cyanLight);

    const fuchsiaLight = new THREE.PointLight(0xc026d3, 1.35, 30);
    fuchsiaLight.position.set(5, -2, -7);
    scene.add(fuchsiaLight);

    const indigoLight = new THREE.PointLight(0x6366f1, 1.1, 30);
    indigoLight.position.set(0, 3.5, -10);
    scene.add(indigoLight);

    const softWhite = new THREE.DirectionalLight(0xffffff, 0.35);
    softWhite.position.set(1.5, 2, 1);
    scene.add(softWhite);

    camera.position.set(0, 0, 4.8);

    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);
    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      pointerCurrent.lerp(pointerTarget, 0.04);
      root.rotation.y = pointerCurrent.x * 0.12;
      root.rotation.x = pointerCurrent.y * 0.08;

      solids.forEach((mesh, idx) => {
        const speed = 0.09 + idx * 0.03;
        mesh.rotation.x += 0.0012 + idx * 0.0004;
        mesh.rotation.y += 0.0018 + idx * 0.0005;
        mesh.position.y += Math.sin(t * speed + idx * 1.2) * 0.0018;
      });

      rings.forEach((ring, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        ring.rotation.z += 0.0018 * dir;
        ring.rotation.y += 0.0012 * dir;
      });

      particles.rotation.y += 0.00065;
      particles.rotation.x = Math.sin(t * 0.11) * 0.08;
      particles.position.y = Math.sin(t * 0.35) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      solidGeometry.dispose();
      solidMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default Scene3D;
