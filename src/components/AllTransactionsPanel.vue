<template>
  <div>
    <h3>All Transactions</h3>
    <el-collapse>
      <el-collapse-item>
        <transactions-table
          :show-category-column="true"
          :transactions="transactions"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

import TransactionsTable from '@/components/TransactionsTable.vue';

export default {
  name: 'AllTransactionsPanel',
  components: { TransactionsTable },
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
};
</script>
