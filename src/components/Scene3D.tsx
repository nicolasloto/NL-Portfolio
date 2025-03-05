import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const Scene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const spheresRef = useRef<THREE.Mesh[]>([]);

  const isPositionValid = (position: THREE.Vector3, spheres: THREE.Mesh[], minDistance: number) => {
    for (const sphere of spheres) {
      if (position.distanceTo(sphere.position) < minDistance) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create floating spheres
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0xea580c,
      transparent: true,
      opacity: 0.8,
    });

    const spheres: THREE.Mesh[] = [];
    const minDistance = 3;

    for (let i = 0; i < 5; i++) {
      let position: THREE.Vector3;
      let attempts = 0;

      do {
        position = new THREE.Vector3(
          Math.random() * 10 - 5,
          Math.random() * 10 - 5,
          Math.random() * 10 - 15
        );
        attempts++;
      } while (!isPositionValid(position, spheres, minDistance) && attempts < 100);

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(position);
      sphere.scale.setScalar(Math.random() * 0.5 + 0.5);
      scene.add(sphere);
      spheres.push(sphere);

      // Animate each sphere with GSAP
      gsap.to(sphere.position, {
        y: `+=${Math.random() * 2 - 1}`,
        duration: 2 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    spheresRef.current = spheres;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      spheresRef.current.forEach((sphere) => {
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.005;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.remove(...spheres);
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default Scene3D;