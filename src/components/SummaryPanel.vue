<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <h3>Summary</h3>
          <p class="subtitle">
            {{ queryStartDateMoment.format('L') }} to {{ queryEndDateMoment.format('L') }}
          </p>
        </div>
      </el-col>
      <el-col :span="6">
        <h3 class="incoming"><amount :amount="totals.incoming"/></h3>
        <p class="subtitle">Incoming</p>
      </el-col>
      <el-col :span="6">
        <h3 class="outgoing"><amount :amount="totals.outgoing"/></h3>
        <p class="subtitle">Outgoing</p>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </el-card>
</template>

<script>
import Amount from './AmountText.vue';

export default {
  name: 'SummaryPanel',
  props: {
    categorySummaries: {
      type: Array,
      required: true,
    },
    queryEndDateMoment: {
      required: true,
    },
    queryStartDateMoment: {
      required: true,
    },
  },
  computed: {
    totals() {
      let outgoing = 0;
      let incoming = 0;
      this.categorySummaries.forEach((summary) => {
        if (summary.amount <= 0) {
          outgoing += summary.amount;
        } else {
          incoming += summary.amount;
        }
      });
      return { incoming, outgoing };
    },
  },
  components: {
    Amount,
  },
};
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
  }

  h3 {
    margin: 0;
  }

  .subtitle {
    color: #888;
    font-size: 14px;
    margin: 5px 0 0;
  }

  .incoming {
    color: #00e676;
  }

  .outgoing {
    color: #ff1744;
  }
</style>
