export type Entity = number;

// 同一类组件排成一列。删除时把末尾那一项换到空位再弹出，所以中间不留洞。
class Column {
    // 与 dense 下标对齐：dense[i] 属于哪个实体。
    entities: Entity[] = [];
    // dense：稠密数组。组件数据从下标 0 紧挨着排到末尾，query 顺着它扫，相邻元素在内存里是连续的。
    dense: any[] = [];
    // sparse：稀疏下标。用实体编号当数组下标，值是该实体在 dense 里的位置；-1 表示这个实体没有该组件。
    // 实体编号不连续（比如只有 0 和 7），中间空着的格子不放组件，所以叫稀疏。
    // 例：实体 7 的组件在 dense[2]，则 sparse[7] === 2。
    sparse: number[] = [];
}

// 文档 3.2：按组件类型分列。query 仍从最小列扫描，但返回顺序保持调用参数顺序。
export class World {
    private types: Function[] = [];
    private columns: Column[] = [];
    private nextId = 0;
    private freeIds: Entity[] = [];

    spawn(): Entity {
        const reused = this.freeIds.pop();
        if (reused !== undefined) return reused;
        return this.nextId++;
    }

    add(e: Entity, C: Function, data: any) {
        const column = this.column(C);
        const index = this.indexOf(column, e);
        if (index >= 0) {
            column.dense[index] = data;
            return;
        }
        column.sparse[e] = column.dense.length;
        column.dense.push(data);
        column.entities.push(e);
    }

    get(e: Entity, C: Function) {
        const column = this.column(C);
        const index = this.indexOf(column, e);
        return index >= 0 ? column.dense[index] : undefined;
    }

    remove(e: Entity, C: Function) {
        this.swapRemove(this.column(C), e);
    }

    destroy(e: Entity) {
        let removed = false;
        for (let i = 0; i < this.columns.length; i++) {
            if (this.swapRemove(this.columns[i], e)) removed = true;
        }
        if (removed) this.freeIds.push(e);
    }

    private column(C: Function) {
        const types = this.types;
        for (let i = 0; i < types.length; i++) {
            if (types[i] === C) return this.columns[i];
        }
        const column = new Column();
        types.push(C);
        this.columns.push(column);
        return column;
    }

    private indexOf(column: Column, e: Entity) {
        if (e < 0 || e >= column.sparse.length) return -1;
        const index = column.sparse[e];
        return index === undefined ? -1 : index;
    }

    private swapRemove(column: Column, e: Entity) {
        const index = this.indexOf(column, e);
        if (index < 0) return false;
        const last = column.dense.length - 1;
        if (index !== last) {
            const moved = column.entities[last];
            column.dense[index] = column.dense[last];
            column.entities[index] = moved;
            column.sparse[moved] = index;
        }
        column.dense.pop();
        column.entities.pop();
        column.sparse[e] = -1;
        return true;
    }

    *query(...Cs: Function[]): Generator<any[]> {
        if (Cs.length === 0) return;
        const order = Cs.slice();
        const cols = Cs.map(C => this.column(C));
        let scanAt = 0;
        for (let i = 1; i < cols.length; i++) {
            if (cols[i].dense.length < cols[scanAt].dense.length) scanAt = i;
        }
        const scan = cols[scanAt];
        const rest: Column[] = [];
        for (let i = 0; i < cols.length; i++) {
            if (i !== scanAt) rest.push(cols[i]);
        }
        const count = scan.entities.length;
        for (let i = 0; i < count; i++) {
            const e = scan.entities[i];
            let matched = true;
            for (let r = 0; r < rest.length; r++) {
                if (this.indexOf(rest[r], e) < 0) {
                    matched = false;
                    break;
                }
            }
            if (!matched) continue;
            const row: any[] = [e];
            for (let c = 0; c < order.length; c++) row.push(this.get(e, order[c]));
            yield row;
        }
    }
}

export type System = (w: World, dt: number) => void;

export function run(w: World, dt: number, systems: System[]) {
    for (const system of systems) system(w, dt);
}
