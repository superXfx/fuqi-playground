import { Position, Sway } from '../components';
import { World } from '../world';

export function SwaySystem(w: World, dt: number) {
    for (const [, pos, sway] of w.query(Position, Sway)) {
        sway.phase += sway.speed * dt;
        pos.x = sway.origin + Math.sin(sway.phase) * sway.amplitude;
    }
}
