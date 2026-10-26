import { FireIntent, Position, Shooter, SpawnBullet } from '../components';
import { AIM_VX, BULLET_DAMAGE, BULLET_R, BULLET_SPEED, SWEEP_SPEED } from '../playfield';
import { Entity, World } from '../world';

export function FireSystem(w: World, dt: number) {
    for (const [e, shooter] of w.query(Shooter)) {
        shooter.aim += shooter.dir * SWEEP_SPEED * dt;
        if (shooter.aim >= 1) {
            shooter.aim = 1;
            shooter.dir = -1;
        } else if (shooter.aim <= -1) {
            shooter.aim = -1;
            shooter.dir = 1;
        }
        shooter.cooldown -= dt;
        if (shooter.cooldown <= 0) {
            w.add(e, FireIntent, new FireIntent());
            shooter.cooldown += shooter.interval;
        }
    }

    const fired: Entity[] = [];
    for (const [e, , pos, shooter] of w.query(FireIntent, Position, Shooter)) {
        const req = w.spawn();
        const vx = shooter.aim * AIM_VX;
        w.add(req, SpawnBullet, new SpawnBullet(pos.x, pos.y, vx, BULLET_SPEED, BULLET_DAMAGE, BULLET_R));
        fired.push(e);
    }
    for (const e of fired) w.remove(e, FireIntent);
}
