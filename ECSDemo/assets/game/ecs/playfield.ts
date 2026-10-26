export const PLAY_W = 1280;
export const PLAY_H = 720;

export const ENEMY_HP = 3;
export const ENEMY_HW = 28;
export const ENEMY_HH = 20;
export const ENEMY_COUNT = 14;
export const ENEMY_SWAY = 100;
export const ENEMY_SWAY_SPEED = 1.4;

export const BULLET_R = 8;
export const BULLET_DAMAGE = 1;
export const BULLET_SPEED = 520;
export const AIM_VX = 900;
export const SWEEP_SPEED = 2.6;

export const FIRE_INTERVAL = 0.04;
export const RESPAWN_DELAY = 5;

export const PLAYER_X = 640;
export const PLAYER_Y = 80;
export const PLAYER_HW = 16;
export const PLAYER_HH = 16;

export function randomEnemyPosition() {
    const centerX = PLAY_W / 2;
    const spread = 400;
    const x = centerX - spread + ENEMY_HW + Math.random() * (spread * 2 - ENEMY_HW * 2);
    const y = 500 + Math.random() * 150;
    return { x, y };
}
