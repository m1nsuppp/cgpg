import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type MatEditableMesh =
  | THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial>
  | THREE.InstancedMesh<
      THREE.BufferGeometry,
      THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
    >;
const isMatEditableMesh = (obj: THREE.Object3D): obj is MatEditableMesh =>
  obj instanceof THREE.Mesh ||
  (obj instanceof THREE.InstancedMesh &&
    (obj.material instanceof THREE.MeshStandardMaterial ||
      obj.material instanceof THREE.MeshPhysicalMaterial));

const meshNames = [
  'Plate',
  'Legs01Right',
  'Legs01Left',
  'Legs02Right',
  'Legs02Left',
  'Legs03Right',
  'Legs03Left',
] as const;
type MeshName = (typeof meshNames)[number];
const isAvailableMeshName = (name: string): name is MeshName => meshNames.some((n) => n === name);

interface PanelDeps {
  meshNames: readonly MeshName[];
  getVisible: (name: MeshName) => boolean;
  setVisible: (name: MeshName, visible: boolean) => void;
}

const PANEL_TAG = 'table-config-panel' as const;
class TableConfigPanel extends HTMLElement {
  private readonly root: ShadowRoot;
  private deps: PanelDeps | undefined;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
  }

  setDeps(deps: PanelDeps): void {
    this.deps = deps;
    this.render();
  }

  private readonly onChange = (e: Event): void => {
    if (e.target === null) {
      return;
    }
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      const name = e.target.getAttribute('data-name');
      if (name === null) {
        return;
      }
      if (!isAvailableMeshName(name)) {
        return;
      }

      if (this.deps !== undefined) {
        this.deps.setVisible(name, e.target.checked);
      }
    }
  };

  private render(): void {
    if (this.deps === undefined) {
      this.root.innerHTML = '';
      return;
    }

    const items = this.deps.meshNames
      .map((meshName) => {
        const checked = (this.deps?.getVisible(meshName) ?? false) ? 'checked' : '';

        return `<label class="row"><input type="checkbox" data-name="${meshName}" ${checked}><span>${meshName}</span></label>`;
      })
      .join('');
    this.root.innerHTML = `
      <style>
        :host { position: fixed; top: 16px; left: 16px; font-family: ui-sans-serif, system-ui, -apple-system; z-index: 10 }
        .panel { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; box-shadow: 0 6px 20px rgba(0,0,0,.08); min-width: 200px }
        .header { font-weight: 600; margin-bottom: 8px; font-size: 14px }
        .list { display: grid; gap: 6px }
        .row { display: flex; gap: 8px; align-items: center; font-size: 13px }
        input[type="checkbox"] { width: 14px; height: 14px }
      </style>
      <div class="panel">
        <div class="header">Table Config</div>
        <div class="list">${items}</div>
      </div>
    `;
    const panel = this.root.querySelector('.panel');
    if (panel !== null) {
      panel.removeEventListener('change', this.onChange);
      panel.addEventListener('change', this.onChange);
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    [PANEL_TAG]: TableConfigPanel;
  }
}
if (customElements.get(PANEL_TAG) === undefined) {
  customElements.define(PANEL_TAG, TableConfigPanel);
}

interface TableConfigurator {
  run: () => Promise<void>;
}

export function createTableConfigurator(): TableConfigurator {
  const legsMap = new Map<MeshName, MatEditableMesh>();

  return {
    run: async () => {
      const root = document.getElementById('root');
      if (root === null) {
        throw new Error('root element not found');
      }

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('white');

      const loader = new GLTFLoader();
      const loadTablePromise = loader.loadAsync('./table.gltf');

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.set(0, 1, 5);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      root.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      const { scene: table } = await loadTablePromise;
      table.position.set(0, 1, 0);
      scene.add(table);

      const meshVisibilities: Record<MeshName, boolean> = {
        Plate: true,
        Legs01Right: true,
        Legs01Left: true,
        Legs02Right: false,
        Legs02Left: false,
        Legs03Right: false,
        Legs03Left: false,
      };
      table.traverse((child) => {
        if (isMatEditableMesh(child) && isAvailableMeshName(child.name)) {
          child.visible = meshVisibilities[child.name];
          legsMap.set(child.name, child);
        }
      });

      const panel = document.createElement(PANEL_TAG);
      panel.setDeps({
        meshNames,
        getVisible: (name) => meshVisibilities[name],
        setVisible: (name, visible) => {
          meshVisibilities[name] = visible;
          const mesh = legsMap.get(name);
          if (mesh !== undefined) {
            mesh.visible = visible;
          }
        },
      });
      document.body.appendChild(panel);

      const animate = (): void => {
        requestAnimationFrame(animate);
        table.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();
    },
  };
}
