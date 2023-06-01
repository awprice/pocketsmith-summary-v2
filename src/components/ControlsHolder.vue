<template>
  <div class="controls-holder">
    <el-row>
      <el-col :span="12">
        <h3>Compare</h3>
        <el-select
          v-model="compareValue"
          placeholder="Select"
          class="comparison-input"
        >
          <el-option
            v-for="item in compareOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12" class="right-column-holder">
        <el-button v-on:click="exportToCSV">Export category totals to CSV</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TransactionAnalysis from '../helpers/TransactionAnalysis';
import mutationTypes from '../store/types';

export default {
  name: 'ControlsHolder',
  data() {
    const compareOptions = TransactionAnalysis.GetCompareOptions();
    return {
      compareOptions,
    };
  },
  computed: {
    compareValue: {
      get() {
        return this.$store.state.app.compareOption;
      },
      set(value) {
        this.$store.commit(`app/${mutationTypes.SET_COMPARE_OPTION}`, value);
      },
    },
  },
  methods: {
    exportToCSV() {
      this.$emit('export-to-csv');
    },
  },
};
</script>

<style scoped>
  .controls-holder {
    margin-bottom: 10px;
  }

  h3 {
    margin-top: 0;
    display: inline-block;
  }

  .comparison-input {
    display: inline-block;
    margin-left: 10px;
  }

  .right-column-holder {
    text-align: right;
  }
</style>
