import { Position, Velocity } from '../components';
import { World } from '../world';

export function MovementSystem(w: World, dt: number) {
    for (const [, pos, vel] of w.query(Position, Velocity)) {
        pos.x += vel.vx * dt;
        pos.y += vel.vy * dt;
    }
}
