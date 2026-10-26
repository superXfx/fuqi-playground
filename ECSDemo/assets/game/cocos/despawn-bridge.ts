import { Bullet, Despawn, Enemy, Player, View } from '../ecs/components';
import { Entity, World } from '../ecs/world';
import { recycleBullet, recycleEnemy, recyclePlayer, resolveView, unbind } from './pools';

export function DespawnBridge(w: World, _dt: number) {
    const dead: Entity[] = [];
    for (const [e, , view] of w.query(Despawn, View)) {
        const node = resolveView(view.viewId);
        if (w.get(e, Enemy)) recycleEnemy(node);
        else if (w.get(e, Bullet)) recycleBullet(node);
        else if (w.get(e, Player)) recyclePlayer(node);
        unbind(view.viewId);
        dead.push(e);
    }
    for (const e of dead) w.destroy(e);
}
