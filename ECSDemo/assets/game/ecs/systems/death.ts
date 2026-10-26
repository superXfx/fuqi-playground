import { Despawn, Enemy, Health, RespawnTimer } from '../components';
import { RESPAWN_DELAY } from '../playfield';
import { World } from '../world';

export function DeathSystem(w: World, _dt: number) {
    for (const [e, , hp] of w.query(Enemy, Health)) {
        if (hp.hp > 0 || w.get(e, Despawn)) continue;
        w.add(e, Despawn, new Despawn());
        const timer = w.spawn();
        w.add(timer, RespawnTimer, new RespawnTimer(RESPAWN_DELAY));
    }
}
