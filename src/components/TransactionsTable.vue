<template>
  <div>
    <el-table
      class="category-summary-table"
      :data="categorySummaries"
      :default-sort="{prop: 'amount', order: 'descending'}"
      v-loading="loading"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <category-transaction-table :transactions="props.row.transactions"/>
        </template>
      </el-table-column>
      <el-table-column
        label="Category"
        prop="title"
        sortable
      />
      <el-table-column
        label="Amount"
        prop="amount"
        width="150"
        sortable
      >
        <template slot-scope="props">
          <strong><amount :amount="props.row.amount"/></strong>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import CategoryTransactionTable from './CategoryTransactionsTable';
import Amount from './AmountText';

export default {
  name: 'TransactionsTable',
  props: {
    categorySummaries: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    queryEndDateMoment: {
      required: true,
    },
    queryStartDateMoment: {
      required: true,
    },
  },
  components: {
    Amount,
    CategoryTransactionTable,
  },
};
</script>

<style>
  .category-summary-table > .el-table__body-wrapper > .el-table__expanded-cell {
    padding: 0;
  }
</style>
