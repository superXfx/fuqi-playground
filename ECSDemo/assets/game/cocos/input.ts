import { EventKeyboard, Input, input, KeyCode } from 'cc';
import { FireIntent } from '../ecs/components';
import { Entity, World } from '../ecs/world';

let onKey: ((event: EventKeyboard) => void) | null = null;

export function bindFireInput(w: World, player: Entity) {
    unbindFireInput();
    onKey = (event: EventKeyboard) => {
        if (event.keyCode !== KeyCode.SPACE) return;
        w.add(player, FireIntent, new FireIntent());
    };
    input.on(Input.EventType.KEY_DOWN, onKey);
}

export function unbindFireInput() {
    if (!onKey) return;
    input.off(Input.EventType.KEY_DOWN, onKey);
    onKey = null;
}
