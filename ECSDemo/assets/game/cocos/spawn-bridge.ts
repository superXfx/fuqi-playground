import { Aabb, Bullet, Circle, Enemy, Health, Player, Position, Shooter, SpawnBullet, SpawnEnemy, Sway, Velocity, View } from '../ecs/components';
import { BULLET_DAMAGE, BULLET_R, ENEMY_HH, ENEMY_HP, ENEMY_HW, ENEMY_SWAY, ENEMY_SWAY_SPEED, FIRE_INTERVAL, PLAYER_X, PLAYER_Y } from '../ecs/playfield';
import { Entity, World } from '../ecs/world';
import { bind, obtainBullet, obtainEnemy, obtainPlayer } from './pools';

export function materializePlayer(w: World): Entity {
    const e = w.spawn();
    const node = obtainPlayer();
    node.setPosition(PLAYER_X, PLAYER_Y, 0);
    w.add(e, Position, new Position(PLAYER_X, PLAYER_Y));
    w.add(e, Shooter, new Shooter(FIRE_INTERVAL, 0));
    w.add(e, Player, new Player());
    w.add(e, View, new View(bind(node)));
    return e;
}

export function materializeEnemy(w: World, x: number, y: number, hp = ENEMY_HP) {
    const e = w.spawn();
    const node = obtainEnemy();
    node.setPosition(x, y, 0);
    w.add(e, Position, new Position(x, y));
    w.add(e, Sway, new Sway(x, ENEMY_SWAY / 2, ENEMY_SWAY_SPEED, Math.random() * Math.PI * 2));
    w.add(e, Health, new Health(hp));
    w.add(e, Aabb, new Aabb(ENEMY_HW, ENEMY_HH));
    w.add(e, Enemy, new Enemy());
    w.add(e, View, new View(bind(node)));
}

function materializeBullet(w: World, x: number, y: number, vx: number, vy: number, damage: number, r: number) {
    const e = w.spawn();
    const node = obtainBullet();
    node.setPosition(x, y, 0);
    w.add(e, Position, new Position(x, y));
    w.add(e, Velocity, new Velocity(vx, vy));
    w.add(e, Circle, new Circle(r));
    w.add(e, Bullet, new Bullet(damage));
    w.add(e, View, new View(bind(node)));
}

export function SpawnBridge(w: World, _dt: number) {
    const bulletHosts: Entity[] = [];
    for (const [e, req] of w.query(SpawnBullet)) {
        materializeBullet(w, req.x, req.y, req.vx, req.vy, req.damage || BULLET_DAMAGE, req.r || BULLET_R);
        bulletHosts.push(e);
    }
    for (const e of bulletHosts) w.destroy(e);

    const enemyReqs: Entity[] = [];
    for (const [e, req] of w.query(SpawnEnemy)) {
        materializeEnemy(w, req.x, req.y, req.hp || ENEMY_HP);
        enemyReqs.push(e);
    }
    for (const e of enemyReqs) w.destroy(e);
}
