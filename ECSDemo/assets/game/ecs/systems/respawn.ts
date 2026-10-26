import { RespawnTimer, SpawnEnemy } from '../components';
import { ENEMY_HP, randomEnemyPosition } from '../playfield';
import { Entity, World } from '../world';

export function RespawnSystem(w: World, dt: number) {
    const done: Entity[] = [];
    for (const [e, timer] of w.query(RespawnTimer)) {
        timer.left -= dt;
        if (timer.left > 0) continue;
        const pos = randomEnemyPosition();
        const req = w.spawn();
        w.add(req, SpawnEnemy, new SpawnEnemy(pos.x, pos.y, ENEMY_HP));
        done.push(e);
    }
    for (const e of done) w.destroy(e);
}
