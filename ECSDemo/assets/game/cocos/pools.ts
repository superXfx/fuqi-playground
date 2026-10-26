import { Color, Graphics, Layers, Node, UITransform } from 'cc';
import { BULLET_R, ENEMY_HH, ENEMY_HW, PLAYER_HH, PLAYER_HW } from '../ecs/playfield';

const enemyColor = new Color(220, 72, 72, 255);
const bulletColor = new Color(245, 210, 70, 255);
const playerColor = new Color(80, 160, 240, 255);

class NodePool {
    private free: Node[] = [];

    constructor(private make: () => Node) {}

    obtain(): Node {
        const node = this.free.pop() ?? this.make();
        node.active = true;
        return node;
    }

    recycle(node: Node) {
        node.active = false;
        this.free.push(node);
    }
}

const nodes = new Map<number, Node>();
let nextViewId = 1;
let enemyPool: NodePool | null = null;
let bulletPool: NodePool | null = null;
let playerPool: NodePool | null = null;

export function bind(node: Node): number {
    const viewId = nextViewId++;
    nodes.set(viewId, node);
    return viewId;
}

export function resolveView(viewId: number): Node {
    return nodes.get(viewId)!;
}

export function unbind(viewId: number) {
    nodes.delete(viewId);
}

function paintedNode(parent: Node, name: string, paint: (g: Graphics) => void) {
    const node = new Node(name);
    node.layer = Layers.Enum.UI_2D;
    node.setParent(parent);
    node.addComponent(UITransform);
    const g = node.addComponent(Graphics);
    paint(g);
    node.active = false;
    return node;
}

export function initPools(parent: Node) {
    enemyPool = new NodePool(() => paintedNode(parent, 'enemy', (g) => {
        g.fillColor = enemyColor;
        g.rect(-ENEMY_HW, -ENEMY_HH, ENEMY_HW * 2, ENEMY_HH * 2);
        g.fill();
    }));
    bulletPool = new NodePool(() => paintedNode(parent, 'bullet', (g) => {
        g.fillColor = bulletColor;
        g.circle(0, 0, BULLET_R);
        g.fill();
    }));
    playerPool = new NodePool(() => paintedNode(parent, 'player', (g) => {
        g.fillColor = playerColor;
        g.rect(-PLAYER_HW, -PLAYER_HH, PLAYER_HW * 2, PLAYER_HH * 2);
        g.fill();
        g.rect(-4, 0, 8, 26);
        g.fill();
    }));
}

export function obtainEnemy() {
    return enemyPool!.obtain();
}

export function obtainBullet() {
    return bulletPool!.obtain();
}

export function obtainPlayer() {
    return playerPool!.obtain();
}

export function recycleEnemy(node: Node) {
    enemyPool!.recycle(node);
}

export function recycleBullet(node: Node) {
    bulletPool!.recycle(node);
}

export function recyclePlayer(node: Node) {
    playerPool!.recycle(node);
}
