<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['0']">
        <el-submenu
          v-for="(namespace, index) in Object.keys(namespaces)"
          :key="namespace.id"
          :index="index.toString()">
          <template slot="title">
            <i class="el-icon-chat-dot-square"></i>
            {{ namespace }}
          </template>
          <el-menu-item
            v-for="(user, index) in namespaces[namespace]"
            @click="handleClick(user)"
            :key="user.id"
            :index="index.toString()">
            <i class="el-icon-user"></i>
            {{ user }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <span>Dashboard</span>
      </el-header>

      <el-main>
        <ul v-for="msg in messages[activeUser]" :key="msg.id">
          <li>{{ msg.message }}</li>
        </ul>
      </el-main>

      <el-footer>
        <el-row>
          <el-col :span="20">
            <el-input
              type="text"
              v-model="inputMessage"
              @keyup.enter.native="sendMessageHandler"
              placeholder="Please input">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              plain
              @click="sendMessageHandler"
              icon="el-icon-s-promotion">
            </el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      messages: {},
      namespaces: {
        vitamin2: []
      },
      activeUser: 'default',
      unreadMessages: {},
      inputMessage: null,
    };
  },
  created() {
    this.socket = io('http://localhost:3000/admin', {
      query: 'token=123',
    });

    this.requestData();
    this.handleData();

    this.messages[this.activeUser] = [];
  },
  methods: {
    requestData() {
      this.socket.emit('GET_NAMESPACES', null, (namespaces) => {
        console.log('REQ: ', namespaces);
        this.namespaces = namespaces;
      });
    },
    handleData() {
      this.socket.on('message', (message) => {
        console.log('MESSAGE: ', message);
        this.messages.default.push(message);

        if (message.type === 'new_user') {
          this.messages.default.push(message);
          this.namespaces['vitamin2'].push(message.user);
          this.$set(this.messages, message.user, []);
        } else if (message.type === 'chat_message') {
          this.messages[message.user].push(message);
        }
      });

      this.socket.on('error', (reason) => {
        console.log(reason);
      });

      this.socket.on('new-message', (namespace, message) => {
        this.messages[message.user].push(message);
      });

      this.socket.on('user-left', (namespace, message) => {
        const activeUsers = this.namespaces[namespace];
        activeUsers.splice(activeUsers.indexOf(message.user), 1);

        this.messages.default.push(message);
        // if current user left
        // set active to default
        if (this.activeUser === message.user) {
          this.activeUser = 'default';
        }
      });
    },
    handleClick(user) {
      this.socket.emit('GET_MESSAGES', user, (messages) => {
        if (this.activeUser !== user) {
          this.activeUser = user;
          this.messages[user] = messages;
        }
      });
    },
    sendMessageHandler() {
      const activeNamespace = Object.keys(this.namespaces)[0];
      const message = { message: this.inputMessage, type: 2, user: 'admin' };

      this.socket.emit('SEND_MESSAGE', activeNamespace, message);
      this.inputMessage = null;

      this.messages[this.activeUser].push(message);
    },
  },
};
</script>
