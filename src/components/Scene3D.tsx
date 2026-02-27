import { useEffect, useRef } from "react";
import * as THREE from "three";

type DeviceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
  };
};

const Scene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const nav = navigator as DeviceNavigator;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const hasSaveData = nav.connection?.saveData === true;
    const isLowEndDevice =
      (nav.deviceMemory ?? 8) <= 4 || nav.hardwareConcurrency <= 4;
    const isLiteMode = isMobile || hasSaveData || isLowEndDevice;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050509, isLiteMode ? 0.08 : 0.06);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: !isLiteMode,
      alpha: true,
      powerPreference: isLiteMode ? "low-power" : "high-performance",
    });

    const maxPixelRatio = isLiteMode ? 1.15 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // Main wireframe solids
    const solids: THREE.Mesh[] = [];
    const solidGeometry = new THREE.IcosahedronGeometry(
      1,
      isLiteMode ? 0 : 1
    );
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x0b1024,
      emissiveIntensity: isLiteMode ? 0.18 : 0.24,
      wireframe: true,
      transparent: true,
      opacity: isLiteMode ? 0.14 : 0.16,
    });

    const solidCount = isLiteMode ? 2 : 3;
    for (let i = 0; i < solidCount; i++) {
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
    const ringGeometry = new THREE.TorusGeometry(
      2.4,
      0.04,
      isLiteMode ? 12 : 24,
      isLiteMode ? 72 : 180
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: isLiteMode ? 0.1 : 0.12,
    });

    const ringCount = isLiteMode ? 1 : 2;
    for (let i = 0; i < ringCount; i++) {
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(0, i === 0 ? -0.7 : 0.8, -8.2 - i * 1.1);
      ring.rotation.x = Math.PI / 2.8 + i * 0.2;
      ring.rotation.y = i * 0.8;
      ring.scale.setScalar(1 + i * 0.28);
      rings.push(ring);
      root.add(ring);
    }

    // Particle field
    const particleCount = isLiteMode ? 80 : 260;
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
      size: isLiteMode ? 0.028 : 0.036,
      transparent: true,
      opacity: isLiteMode ? 0.24 : 0.32,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    root.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isLiteMode ? 0.24 : 0.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, isLiteMode ? 0.8 : 0.95, 24);
    cyanLight.position.set(-5, 2, -4);
    scene.add(cyanLight);

    const fuchsiaLight = new THREE.PointLight(0xc026d3, isLiteMode ? 0.65 : 0.9, 22);
    fuchsiaLight.position.set(5, -2, -7);
    scene.add(fuchsiaLight);

    if (!isLiteMode) {
      const indigoLight = new THREE.PointLight(0x6366f1, 0.75, 26);
      indigoLight.position.set(0, 3.5, -10);
      scene.add(indigoLight);
    }

    const softWhite = new THREE.DirectionalLight(0xffffff, isLiteMode ? 0.28 : 0.35);
    softWhite.position.set(1.5, 2, 1);
    scene.add(softWhite);

    camera.position.set(0, 0, 4.8);

    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);
    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    if (!isLiteMode && !prefersReducedMotion) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
    }

    // Animation loop
    const clock = new THREE.Clock();
    let rafId = 0;
    let isActive = true;
    let lastFrameTime = 0;
    const minFrameMs = isLiteMode ? 1000 / 30 : 1000 / 60;

    const updateActiveState = () => {
      isActive = !document.hidden && isInView;
    };

    let isInView = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry?.isIntersecting ?? true;
        updateActiveState();
      },
      { threshold: 0.02 }
    );
    observer.observe(containerRef.current);

    const handleVisibilityChange = () => {
      updateActiveState();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isActive) return;
      const now = performance.now();
      if (now - lastFrameTime < minFrameMs) return;
      lastFrameTime = now;
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        pointerCurrent.lerp(pointerTarget, isLiteMode ? 0.03 : 0.04);
        root.rotation.y = pointerCurrent.x * (isLiteMode ? 0.08 : 0.12);
        root.rotation.x = pointerCurrent.y * (isLiteMode ? 0.06 : 0.08);
      }

      solids.forEach((mesh, idx) => {
        if (prefersReducedMotion) return;
        const speed = 0.09 + idx * 0.03;
        mesh.rotation.x += (isLiteMode ? 0.0008 : 0.0012) + idx * 0.0004;
        mesh.rotation.y += (isLiteMode ? 0.0012 : 0.0018) + idx * 0.0005;
        mesh.position.y += Math.sin(t * speed + idx * 1.2) * (isLiteMode ? 0.0012 : 0.0018);
      });

      rings.forEach((ring, idx) => {
        if (prefersReducedMotion) return;
        const dir = idx % 2 === 0 ? 1 : -1;
        ring.rotation.z += (isLiteMode ? 0.0011 : 0.0018) * dir;
        ring.rotation.y += (isLiteMode ? 0.0008 : 0.0012) * dir;
      });

      if (!prefersReducedMotion) {
        particles.rotation.y += isLiteMode ? 0.00045 : 0.00065;
        particles.rotation.x = Math.sin(t * 0.11) * (isLiteMode ? 0.05 : 0.08);
        particles.position.y = Math.sin(t * 0.35) * (isLiteMode ? 0.08 : 0.12);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
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
