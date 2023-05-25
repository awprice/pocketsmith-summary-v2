<template>
  <div class="container">
    <div class="page-card">
      <el-card>
        <div slot="header">
          <div>
            <h2 class="title">Pocketsmith Summary</h2>
            <div class="refresh-button-holder">
            </div>
          </div>
          <el-input
            class="developer-api-key-input"
            placeholder="Developer API Key"
            size="small"
            v-model="developerKey"
          ></el-input>
        </div>
        <slot></slot>
      </el-card>
    </div>
  </div>
</template>

<script>
import mutationTypes from '../store/types';

export default {
  name: 'PageContainer',
  computed: {
    developerKey: {
      get() {
        return this.$store.state.app.developerKey;
      },
      set(value) {
        this.$store.commit(`app/${mutationTypes.SET_DEVELOPER_KEY}`, value);
      },
    },
  },
};
</script>

<style scoped>
  .container {
    width: 1000px;
    padding-left: 15px;
    padding-right: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  .title {
    margin: 0 0 10px;
    display: inline-block;
  }

  .refresh-button-holder {
    float: right;
  }

  .developer-api-key-input {
    width: 350px;
  }
</style>
