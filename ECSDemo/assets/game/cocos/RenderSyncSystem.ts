import { Position, Shooter, View } from '../ecs/components';
import { AIM_VX, BULLET_SPEED } from '../ecs/playfield';
import { World } from '../ecs/world';
import { resolveView } from './pools';


export function RenderSyncSystem(w: World, _dt: number) {
    for (const [, pos, view] of w.query(Position, View)) {
        resolveView(view.viewId).setPosition(pos.x, pos.y, 0);
    }
    
    for (const [, shooter, view] of w.query(Shooter, View)) {
        const degrees = -Math.atan2(shooter.aim * AIM_VX, BULLET_SPEED) * 180 / Math.PI;
        resolveView(view.viewId).angle = degrees;
    }
}
