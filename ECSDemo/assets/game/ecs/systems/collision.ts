import { Aabb, Bullet, Circle, Despawn, Enemy, Health, Position } from '../components';
import { PLAY_H, PLAY_W } from '../playfield';
import { Entity, World } from '../world';

function circleHitsAabb(bx: number, by: number, r: number, ex: number, ey: number, hw: number, hh: number) {
    const cx = Math.max(ex - hw, Math.min(bx, ex + hw));
    const cy = Math.max(ey - hh, Math.min(by, ey + hh));
    const dx = bx - cx;
    const dy = by - cy;
    return dx * dx + dy * dy <= r * r;
}

export function CollisionSystem(w: World, _dt: number) {
    const gone: Entity[] = [];
    for (const [bullet, bulletData, bpos, circle] of w.query(Bullet, Position, Circle)) {
        if (bpos.x < -40 || bpos.x > PLAY_W + 40 || bpos.y < -40 || bpos.y > PLAY_H + 40) {
            gone.push(bullet);
            continue;
        }
        for (const [, , epos, aabb, hp] of w.query(Enemy, Position, Aabb, Health)) {
            if (hp.hp <= 0) continue;
            if (!circleHitsAabb(bpos.x, bpos.y, circle.r, epos.x, epos.y, aabb.hw, aabb.hh)) continue;
            hp.hp -= bulletData.damage;
            gone.push(bullet);
            break;
        }
    }
    for (const e of gone) {
        if (!w.get(e, Despawn)) w.add(e, Despawn, new Despawn());
    }
}
