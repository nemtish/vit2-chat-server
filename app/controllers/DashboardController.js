module.exports = class DashboardController {
    constructor(deps) {
        const { DatabaseService } = deps;
        this.namespaceRepository = DatabaseService.namespaceRepository;
        this.userRepository = DatabaseService.userRepository;
        this.Socket = deps.Socket;
    }

    async listen(namespaceName) {
        const namespace = await this.namespaceRepository.getByName(namespaceName)
        const nsp = this.Socket.io.of(namespace.admin_url);
        nsp.on('connection', socket => {
            socket.on('GET_NAMESPACES', async (_, cb) => {
                const namespaces = await this.namespaceRepository.all();
                const users = await this.userRepository.getByNamespaceId(namespaces[0].id);
                cb(namespaces, users);
            });

            socket.on('GET_MESSAGES', (username, cb) => {
                this.userRepository.getByName(username)
                    .then(user => {
                        cb(user.messages);
                    });
            });
        });
    }
}
