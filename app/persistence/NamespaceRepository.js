module.exports = class NamespaceRepository {
    constructor() {
        this.namespaces = [];
        this.currentId = 1;
    }

    async all() {
        return this.namespaces;
    }

    async add(namespace) {
        try {
            namespace.id = this.currentId;
            this.namespaces.push(namespace);
            this.currentId++;
        } catch (e) {
            throw new Error('Error Occurred when adding namespace');
        }

        return namespace;
    }

    async remove(namespaceId) {
        try {
            const namespaceIndex = this.namespaces.findIndex(n => n.id === namespaceId);
            if (namespaceIndex !== -1) {
                this.namespaces.splice(namespaceIndex, 1);
            }
        } catch(e) {
            throw new Error('Error Occurred when removing namespace');
        }

        return true;
    }

    async getById(namespaceId) {
        let namespace;
        try {
            namespace = this.namespaces.find(n => n.id === namespaceId);
        } catch (e) {
            throw new Error('Error Occurred when finding namespace by ID');
        }
        return namespace;
    }

    async getByName(namespaceName) {
        let namespace;
        try {
            namespace = this.namespaces.find(n => n.name === namespaceName);
        } catch (e) {
            throw new Error('Error Occurred when finding namespace by NAME');
        }
        return namespace;
    }
}
