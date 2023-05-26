<template>
  <div>
    <el-table
      class="category-summary-table"
      :data="categorySummaries"
      :default-sort="{prop: 'amount', order: 'descending'}"
      v-loading="loading"
      :element-loading-text="loadingText"
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
      <el-table-column
        label="Budget"
        prop="budget"
        width="150"
        sortable
      >
        <template slot-scope="props">
          <div v-if="props.row.budget">
            <budget-amount
              v-if="props.row.budget.expense"
              :budget="props.row.budget.expense"
            />
            <budget-amount
              v-if="props.row.budget.income"
              :budget="props.row.budget.income"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import CategoryTransactionTable from './CategoryTransactionsTable.vue';
import Amount from './AmountText.vue';
import BudgetAmount from './BudgetAmount.vue';

export default {
  name: 'TransactionsTable',
  props: {
    loadingText: {
      type: String,
      required: true,
    },
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
    BudgetAmount,
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
