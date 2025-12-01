import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Maximize2, Minimize2, Info } from "lucide-react";

interface Hotspot {
  position: { x: number; y: number; z: number };
  title: string;
  description: string;
  feature_type: string;
}

interface PanoramaImage {
  url: string;
  title: string;
  hotspots: Hotspot[];
}

interface PanoramaViewerProps {
  panorama: PanoramaImage;
  onClose?: () => void;
}

export function PanoramaViewer({ panorama, onClose }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    sphere: THREE.Mesh;
    hotspotMeshes: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create sphere for panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert for inside view

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(panorama.url);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Create hotspots
    const hotspotMeshes: THREE.Mesh[] = [];
    panorama.hotspots.forEach((hotspot) => {
      const hotspotGeometry = new THREE.SphereGeometry(5, 16, 16);
      const hotspotMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b35,
        transparent: true,
        opacity: 0.8,
      });
      const hotspotMesh = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
      hotspotMesh.position.set(hotspot.position.x, hotspot.position.y, hotspot.position.z);
      hotspotMesh.userData = hotspot;
      scene.add(hotspotMesh);
      hotspotMeshes.push(hotspotMesh);

      // Add pulsing animation
      hotspotMesh.userData.originalScale = 1;
    });

    sceneRef.current = { scene, camera, renderer, sphere, hotspotMeshes };

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let lon = 0;
    let lat = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        lon -= deltaX * 0.1;
        lat += deltaY * 0.1;
        lat = Math.max(-85, Math.min(85, lat));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Click to select hotspot
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshes);

      if (intersects.length > 0) {
        const hotspot = intersects[0].object.userData as Hotspot;
        setSelectedHotspot(hotspot);
      }
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("click", onClick);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Update camera based on lon/lat
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);

      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
      camera.position.y = 100 * Math.cos(phi);
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 0, 0);

      // Animate hotspots (pulsing effect)
      const time = Date.now() * 0.001;
      hotspotMeshes.forEach((mesh) => {
        const scale = 1 + Math.sin(time * 2) * 0.2;
        mesh.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("click", onClick);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [panorama]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{panorama.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden cursor-move"
          >
            <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
              <p className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                Drag to explore • Click hotspots to learn more
              </p>
            </div>
            {panorama.hotspots.length > 0 && (
              <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <p className="text-sm font-medium">
                  {panorama.hotspots.length} Geological Features
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedHotspot && (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{selectedHotspot.title}</CardTitle>
                <Badge variant="secondary">{selectedHotspot.feature_type}</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedHotspot(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{selectedHotspot.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
