export class Position {
    constructor(public x = 0, public y = 0) {}
}

export class Velocity {
    constructor(public vx = 0, public vy = 0) {}
}

export class Health {
    constructor(public hp = 100) {}
}

export class View {
    constructor(public viewId = 0) {}
}

export class FireIntent {}

export class Player {}

export class Enemy {}

export class Sway {
    constructor(
        public origin = 0,
        public amplitude = 50,
        public speed = 1.4,
        public phase = 0,
    ) {}
}

export class Bullet {
    constructor(public damage = 1) {}
}

export class Aabb {
    constructor(public hw = 0, public hh = 0) {}
}

export class Circle {
    constructor(public r = 0) {}
}

export class Shooter {
    constructor(
        public interval = 0.04,
        public cooldown = 0,
        public aim = -1,
        public dir = 1,
    ) {}
}

export class SpawnBullet {
    constructor(
        public x = 0,
        public y = 0,
        public vx = 0,
        public vy = 0,
        public damage = 1,
        public r = 8,
    ) {}
}

export class SpawnEnemy {
    constructor(public x = 0, public y = 0, public hp = 3) {}
}

export class Despawn {}

export class RespawnTimer {
    constructor(public left = 5) {}
}
