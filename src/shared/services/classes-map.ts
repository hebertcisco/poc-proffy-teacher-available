import crypto from 'crypto';

class ClassesMap {
    private map: { [key: string]: string };

    create(id: string) {
        const value = crypto.randomUUID();
        this.map[id] = value;
        return value;
    }

    del(id: string) {
        if (!(id in this.map)) return this;

        delete this.map[id];
        return this;
    }

    getValue(id: string) {
        return id in this.map ? this.map[id] : null;
    }
}

export default new ClassesMap();
