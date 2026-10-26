import { _decorator, Component, Layers, Node, UITransform } from 'cc';
import { ENEMY_COUNT, ENEMY_HP, randomEnemyPosition } from '../ecs/playfield';
import { CollisionSystem } from '../ecs/systems/collision';
import { DeathSystem } from '../ecs/systems/death';
import { FireSystem } from '../ecs/systems/fire';
import { MovementSystem } from '../ecs/systems/movement';
import { SwaySystem } from '../ecs/systems/sway';
import { RespawnSystem } from '../ecs/systems/respawn';
import { run, World } from '../ecs/world';
import { DespawnBridge } from './despawn-bridge';
import { bindFireInput, unbindFireInput } from './input';

import { RenderSyncSystem } from './RenderSyncSystem';
import { materializeEnemy, materializePlayer, SpawnBridge } from './spawn-bridge';
import { initPools } from './pools';

const { ccclass } = _decorator;

@ccclass('EcsRoot')
export class EcsRoot extends Component {
    private w = new World();
    private origin: Node | null = null;

    onLoad() {
        this.origin = this.mountOrigin();
        this.syncOrigin();
        initPools(this.origin);
        const player = materializePlayer(this.w);
        bindFireInput(this.w, player);
        for (let i = 0; i < ENEMY_COUNT; i++) {
            const pos = randomEnemyPosition();
            materializeEnemy(this.w, pos.x, pos.y, ENEMY_HP);
        }
    }

    update(dt: number) {
        this.syncOrigin();
        run(this.w, dt, [
            FireSystem,
            SwaySystem,
            MovementSystem,
            CollisionSystem,
            DeathSystem,
            RespawnSystem,
            SpawnBridge,
            DespawnBridge,
            RenderSyncSystem,
        ]);
    }

    onDestroy() {
        unbindFireInput();
    }

    private mountOrigin(): Node {
        const canvas = this.node.scene.getChildByName('Canvas');
        const origin = new Node('EcsWorld');
        origin.layer = Layers.Enum.UI_2D;
        const ui = origin.addComponent(UITransform);
        ui.setAnchorPoint(0, 0);
        origin.setParent(canvas ?? this.node.scene);
        return origin;
    }

    // Canvas 会随预览分辨率挪动。把表现根节点抵消回世界原点，逻辑坐标才能对上摄像机。
    private syncOrigin() {
        const origin = this.origin;
        const parent = origin?.parent;
        if (!origin || !parent) return;
        origin.setPosition(-parent.position.x, -parent.position.y, 0);
    }
}
